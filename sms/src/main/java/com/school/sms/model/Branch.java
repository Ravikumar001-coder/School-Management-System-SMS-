package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Branch entity — single-branch groundwork for Phase 4 multi-tenancy.
 *
 * Every domain object gets a branch_id column defaulting to branch 1.
 * When multi-branch is activated, branch_id becomes a true tenant discriminator
 * and all queries get an implicit WHERE branch_id = :currentBranch filter.
 *
 * Adding it now prevents a painful schema migration later.
 */
@Entity
@Table(name = "branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;       // Short code: "MAIN", "NORTH", "B02"

    @Column(nullable = false)
    private String name;       // "Main Campus", "North Branch"

    private String address;
    private String phone;
    private String email;

    @Builder.Default
    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
