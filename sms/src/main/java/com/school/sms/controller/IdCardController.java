package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Student;
import com.school.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ID Card Controller
 * Provides endpoints to:
 *  - Fetch students for a given class for ID card generation
 */
@RestController
@RequestMapping("/api/v1/admin/id-cards")
@RequiredArgsConstructor
public class IdCardController {

    private final StudentRepository studentRepository;
    private final com.school.sms.service.DocumentGenerationService documentGenerationService;

    /**
     * GET /api/v1/admin/id-cards/students?classId={id}
     * Fetch students from a class for ID card generation.
     */
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<Student>>> getStudentsForIdCards(
            @RequestParam Long classId) {
        List<Student> students = studentRepository.findByClassRoom_Id(classId);
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }

    /**
     * POST /api/v1/admin/id-cards/generate
     * Generate bulk ID cards as PDF
     */
    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public ResponseEntity<byte[]> generateIdCards(@RequestBody java.util.Map<String, Object> requestBody) {
        try {
            List<Integer> idInts = (List<Integer>) requestBody.get("studentIds");
            List<Long> studentIds = idInts.stream().map(Integer::longValue).collect(java.util.stream.Collectors.toList());
            List<Student> students = studentRepository.findAllById(studentIds);
            
            // Build simple HTML layout for ID cards
            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.append("<html><head><style>")
                .append("body { font-family: sans-serif; }")
                .append(".card { border: 1px solid #000; width: 300px; height: 450px; margin: 10px; display: inline-block; padding: 20px; text-align: center; }")
                .append(".photo { width: 100px; height: 100px; background: #eee; border-radius: 50%; margin: 0 auto; }")
                .append("</style></head><body>");
                
            for (Student s : students) {
                htmlBuilder.append("<div class='card'>")
                    .append("<div class='photo'></div>")
                    .append("<h2>").append(s.getFirstName()).append(" ").append(s.getLastName()).append("</h2>")
                    .append("<p>ID: ").append(s.getStudentId()).append("</p>")
                    .append("<p>Class: ").append(s.getClassRoom() != null ? s.getClassRoom().getName() : "").append("</p>")
                    .append("<p>Blood Group: ").append(s.getBloodGroup() != null ? s.getBloodGroup() : "N/A").append("</p>")
                    .append("</div>");
            }
            htmlBuilder.append("</body></html>");
            
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            org.xhtmlrenderer.pdf.ITextRenderer renderer = new org.xhtmlrenderer.pdf.ITextRenderer();
            renderer.setDocumentFromString(htmlBuilder.toString());
            renderer.layout();
            renderer.createPDF(out);
            
            org.springframework.http.HttpHeaders headers_http = new org.springframework.http.HttpHeaders();
            headers_http.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers_http.setContentDisposition(org.springframework.http.ContentDisposition.attachment().filename("id_cards.pdf").build());
            
            return new ResponseEntity<>(out.toByteArray(), headers_http, org.springframework.http.HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
