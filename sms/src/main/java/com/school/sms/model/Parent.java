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
@EqualsAndHashCode(callSuper = true)
public class Parent extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String parentUuid;

    @Column(nullable = false)
    private String firstName;
    
    private String lastName;

    @Column(nullable = false, unique = true)
    private String phone; // Changed from mobileNumber to match migration

    private String alternatePhone;
    
    @Column(unique = true)
    private String email;
    
    private String occupation;
    
    @Column(columnDefinition = "TEXT")
    private String address;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user; // For portal login

    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private boolean isMobileVerified = false;

    private String pinHash;
    private LocalDateTime lastLoginAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ParentStudentLink> studentLinks = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (parentUuid == null) {
            parentUuid = "PAR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    // Legacy Bridge for Auth / Security
    public String getFullName() {
        return (firstName + " " + (lastName != null ? lastName : "")).trim();
    }

    public String getMobileNumber() {
        return phone;
    }
}
