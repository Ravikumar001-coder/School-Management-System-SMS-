package com.school.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.util.List;

@Data
public class ParentRequest {
    @NotBlank(message = "Parent name is required")
    private String fullName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    private String alternateMobile;
    private String email;
    private String gender;
    private String relationshipDefault;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String occupation;
    private String photoUrl;

    // Linking logic
    private List<StudentLinkRequest> studentLinks;

    @Data
    public static class StudentLinkRequest {
        private Long studentId;
        private String relationshipType;
        private boolean isPrimaryContact;
        private boolean pickupAuthorized;
        private boolean feeResponsible;
    }
}
