package com.school.sms.model.admin;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.Branch;
import com.school.sms.model.ClassRoom;
import com.school.sms.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "promotion_logs")
public class PromotionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_academic_year_id", nullable = false)
    private AcademicYear sourceAcademicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_academic_year_id", nullable = false)
    private AcademicYear targetAcademicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_class_id", nullable = false)
    private ClassRoom sourceClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_class_id", nullable = false)
    private ClassRoom targetClass;

    @Column(name = "total_students", nullable = false)
    private Integer totalStudents;

    @Column(name = "promoted_count", nullable = false)
    private Integer promotedCount;

    @Column(name = "failed_count", nullable = false)
    private Integer failedCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executed_by")
    private User executedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "executed_at", updatable = false)
    private LocalDateTime executedAt;

    @PrePersist
    protected void onCreate() {
        executedAt = LocalDateTime.now();
    }
}
