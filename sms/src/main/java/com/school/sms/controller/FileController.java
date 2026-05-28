package com.school.sms.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private final com.school.sms.repository.UploadedFileRepository fileRepository;
    private final com.school.sms.repository.UserRepository userRepository;
    private final com.school.sms.repository.StudentRepository studentRepository;
    private final com.school.sms.repository.TeacherRepository teacherRepository;
    private final com.school.sms.service.AuthService authService;
    private final com.school.sms.repository.ExamPaperRepository examPaperRepository;

    public FileController(com.school.sms.repository.UploadedFileRepository fileRepository,
                          com.school.sms.repository.UserRepository userRepository,
                          com.school.sms.repository.StudentRepository studentRepository,
                          com.school.sms.repository.TeacherRepository teacherRepository,
                          com.school.sms.service.AuthService authService,
                          com.school.sms.repository.ExamPaperRepository examPaperRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.authService = authService;
        this.examPaperRepository = examPaperRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) throws IOException {

        // Validate file type: images, PDF, DOC/DOCX
        String contentType = file.getContentType();
        boolean isValidType = contentType != null && (
                contentType.startsWith("image/") ||
                contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        );
        if (!isValidType) {
            return ResponseEntity.badRequest()
                    .body("Only images, PDF, and DOC/DOCX files are allowed!");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("File size exceeds 5MB limit!");
        }

        // Generate unique filename preserving extension
        String originalFilename = Objects.requireNonNullElse(file.getOriginalFilename(), "upload.bin");
        String extension = originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".bin";
        String newFilename = UUID.randomUUID().toString() + extension;

        // Save file to disk
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        // Record in DB
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        com.school.sms.model.User owner = userRepository
                .findByUsernameOrEmail(currentUsername, currentUsername).orElse(null);

        com.school.sms.model.UploadedFile fileEntity = com.school.sms.model.UploadedFile.builder()
                .filename(newFilename)
                .originalFilename(originalFilename)
                .globalFilename(originalFilename)
                .contentType(contentType)
                .size(file.getSize())
                .owner(owner)
                .uploadedAt(java.time.Instant.now())
                .build();
        fileRepository.save(fileEntity);

        return ResponseEntity.ok("/api/v1/files/" + newFilename);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String filename) throws IOException {

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(filename).normalize();

        // Path traversal guard
        if (!filePath.startsWith(uploadPath) || !Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        // Auth check
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        com.school.sms.model.User currentUser = userRepository
                .findByUsernameOrEmail(currentUsername, currentUsername).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Secure Exam Paper lock check – only admins/teachers can download locked papers
        String fileUrl = "/api/v1/files/" + filename;
        java.util.Optional<com.school.sms.model.ExamPaper> examOpt =
                examPaperRepository.findByFileUrlAndDeletedAtIsNull(fileUrl);
        if (examOpt.isPresent()) {
            com.school.sms.model.ExamPaper exam = examOpt.get();
            boolean stillLocked = Boolean.TRUE.equals(exam.getIsLocked())
                    || (exam.getUnlockAt() != null
                        && exam.getUnlockAt().isAfter(java.time.LocalDateTime.now()));
            if (stillLocked && !currentUser.isAdmin() && !currentUser.isTeacher()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        com.school.sms.model.UploadedFile fileEntity = fileRepository.findByFilename(filename).orElse(null);

        // If file is recorded in DB, check ownership or admin/teacher role
        if (fileEntity != null) {
            boolean isOwner = fileEntity.getOwner() != null
                    && fileEntity.getOwner().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.isAdmin();
            boolean isTeacher = currentUser.isTeacher();
            boolean isOwnProfilePhoto = checkProfilePhotoAccess(currentUser, fileUrl);

            if (!isOwner && !isAdmin && !isTeacher && !isOwnProfilePhoto) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            // Legacy / seeded files: restrict to admin or teacher, or profile photo owner
            if (!currentUser.isAdmin() && !currentUser.isTeacher()) {
                boolean isOwnPhoto = checkProfilePhotoAccess(currentUser, fileUrl);
                if (!isOwnPhoto) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }
        }

        Resource resource = new UrlResource(filePath.toUri());
        String detectedContentType = Files.probeContentType(filePath);
        if (detectedContentType == null) {
            detectedContentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentType(MediaType.parseMediaType(detectedContentType))
                .body(resource);
    }

    private boolean checkProfilePhotoAccess(com.school.sms.model.User user, String fileUrl) {
        if (user == null || fileUrl == null) {
            return false;
        }

        boolean studentOwnsPhoto = studentRepository.findByUser_Id(user.getId())
                .map(student -> fileUrl.equals(student.getProfilePhoto()))
                .orElse(false);
        if (studentOwnsPhoto) {
            return true;
        }

        return teacherRepository.findByUserId(user.getId())
                .map(teacher -> fileUrl.equals(teacher.getProfilePhoto()))
                .orElse(false);
    }
}
