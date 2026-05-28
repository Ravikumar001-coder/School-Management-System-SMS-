package com.school.sms.model.hrms;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leave_types")
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "leave_code", unique = true, nullable = false, length = 10)
    private String leaveCode;

    @Column(name = "leave_name", nullable = false, length = 100)
    private String leaveName;

    @Column(name = "yearly_quota")
    @Builder.Default
    private Integer yearlyQuota = 0;

    @Column(name = "paid_leave")
    @Builder.Default
    private boolean paidLeave = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
