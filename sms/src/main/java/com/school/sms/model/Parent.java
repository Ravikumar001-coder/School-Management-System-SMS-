package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String parentUuid;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String mobileNumber;

    private String alternateMobile;
    private String email;
    private String gender;
    private String relationshipDefault; // father, mother, guardian
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String occupation;

    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private boolean isMobileVerified = false;

    private String pinHash;
    private LocalDateTime lastLoginAt;

    private Long createdByAdminId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ParentStudentLink> studentLinks = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (parentUuid == null) {
            parentUuid = UUID.randomUUID().toString();
        }
        if (branch == null) {
            // Logic to set default branch could go here or in service
        }
    }
}
