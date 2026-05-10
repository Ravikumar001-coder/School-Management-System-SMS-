package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ParentResponse {
    private Long id;
    private String parentUuid;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String relationshipDefault;
    private boolean active;
    
    private List<StudentLinkResponse> children;

    @Data
    @Builder
    public static class StudentLinkResponse {
        private Long studentId;
        private String firstName;
        private String lastName;
        private String studentCode;
        private String className;
        private String photoUrl;
        private String relationshipType;
        private boolean isPrimaryContact;
    }
}
