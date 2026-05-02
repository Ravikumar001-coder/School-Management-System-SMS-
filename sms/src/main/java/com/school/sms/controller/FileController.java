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
    private final com.school.sms.service.AuthService authService;

    public FileController(com.school.sms.repository.UploadedFileRepository fileRepository,
                          com.school.sms.repository.UserRepository userRepository,
                          com.school.sms.service.AuthService authService) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) throws IOException {

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body("Only image files are allowed!");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("File size exceeds 5MB limit!");
        }

        // Generate unique filename
        String originalFilename = Objects.requireNonNullElse(file.getOriginalFilename(), "upload.jpg");
        String extension = originalFilename
                .substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + extension;

        // Save file
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        // Record in DB
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.school.sms.model.User owner = userRepository.findByUsernameOrEmail(currentUsername, currentUsername).orElse(null);

        com.school.sms.model.UploadedFile fileEntity = com.school.sms.model.UploadedFile.builder()
                .filename(newFilename)
                .originalFilename(originalFilename)
                .contentType(contentType)
                .size(file.getSize())
                .owner(owner)
                .uploadedAt(java.time.Instant.now())
                .build();
        fileRepository.save(fileEntity);

        // Return file URL
        return ResponseEntity.ok("/api/v1/files/" + newFilename);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String filename) throws IOException {

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(filename).normalize();

        if (!filePath.startsWith(uploadPath) || !Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        // Security Check
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.school.sms.model.User currentUser = userRepository.findByUsernameOrEmail(currentUsername, currentUsername).orElse(null);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        com.school.sms.model.UploadedFile fileEntity = fileRepository.findByFilename(filename).orElse(null);
        
        // If file is recorded in DB, check ownership
        if (fileEntity != null) {
            boolean isOwner = fileEntity.getOwner() != null && fileEntity.getOwner().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == com.school.sms.model.Role.ADMIN;
            boolean isTeacher = currentUser.getRole() == com.school.sms.model.Role.TEACHER;

            if (!isOwner && !isAdmin && !isTeacher) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        // If file is NOT in DB (legacy or seeded), allow only ADMIN/TEACHER for now to be safe
        else {
            if (currentUser.getRole() != com.school.sms.model.Role.ADMIN && currentUser.getRole() != com.school.sms.model.Role.TEACHER) {
                 // Check if it's the student's own photo from the student record
                 // This is a fallback for seeded data
                 boolean isOwnPhoto = checkLegacyOwnership(currentUser, "/api/v1/files/" + filename);
                 if (!isOwnPhoto) {
                     return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                 }
            }
        }

        Resource resource = new UrlResource(filePath.toUri());
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    private boolean checkLegacyOwnership(com.school.sms.model.User user, String fileUrl) {
        if (user.getRole() == com.school.sms.model.Role.STUDENT) {
            return userRepository.findById(user.getId())
                    .map(u -> {
                        // This logic depends on StudentRepository which we don't have here easily
                        // We can just assume legacy files are public or restricted to Staff
                        return false; 
                    }).orElse(false);
        }
        return false;
    }
}
