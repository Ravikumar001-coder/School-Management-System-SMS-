package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fee_structures")
public class FeeStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;

    private String feeName;      // "Tuition Fee", "Transport Fee"
    private Double amount;
    private String frequency;    // "MONTHLY", "QUARTERLY", "ANNUAL"
    private String academicYear;
    @Builder.Default
    private boolean active = true;
}
