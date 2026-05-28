package com.school.sms.model.hrms;

import com.school.sms.model.Department;
import com.school.sms.model.Role;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leave_approval_workflows")
public class LeaveApprovalWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "level")
    @Builder.Default
    private Integer level = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_role_id", nullable = false)
    private Role approverRole;
}
