package com.school.sms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentRequest {
    
    private Long id; // For linking existing

    @NotBlank(message = "Parent first name is required")
    private String firstName;
    
    private String lastName;
    
    @NotBlank(message = "Parent phone is required")
    private String phone;
    
    @Email(message = "Invalid parent email format")
    private String email;
    
    private String occupation;
    private String address;
    private String alternatePhone;
    private String gender;
    private String relationshipDefault;
    private String photoUrl;
    private String city;
    private String state;
    private String pincode;

    // Legacy field support for Service layer (if needed during transition)
    public String getFullName() {
        return (firstName + " " + (lastName != null ? lastName : "")).trim();
    }

    public String getMobileNumber() {
        return phone;
    }

    // New Linkage Support
    private List<StudentLinkRequest> studentLinks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentLinkRequest {
        private Long studentId;
        private String relationshipType;
        private boolean isPrimaryContact;
        private boolean isFeeResponsible;
        private boolean isPickupAuthorized;
    }
}
