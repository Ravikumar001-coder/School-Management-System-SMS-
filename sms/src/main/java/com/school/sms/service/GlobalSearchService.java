package com.school.sms.service;

import com.school.sms.model.Student;
import com.school.sms.model.FeePayment;
import com.school.sms.model.hrms.Staff;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class GlobalSearchService {

    @PersistenceContext
    private EntityManager entityManager;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GlobalSearchResponse {
        private List<StudentResult> students;
        private List<StaffResult> staff;
        private List<TransactionResult> transactions;
        private List<PageResult> pages;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentResult {
        private Long id;
        private String studentId;
        private String name;
        private String email;
        private String phone;
        private String classroom;
        private String branchName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffResult {
        private Long id;
        private String employeeCode;
        private String name;
        private String email;
        private String phone;
        private String designation;
        private String department;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionResult {
        private Long id;
        private String receiptNumber;
        private String transactionId;
        private String studentName;
        private Double amount;
        private String paymentDate;
        private String paymentMethod;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageResult {
        private String title;
        private String route;
        private String category;
    }

    public GlobalSearchResponse search(String query, Long branchId) {
        log.info("[GlobalSearch] Searching across modules with query: {} and branchId: {}", query, branchId);
        if (query == null || query.trim().length() < 2) {
            return new GlobalSearchResponse(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        String searchKeyword = "%" + query.trim().toLowerCase() + "%";

        // 1. Query Students
        String studentHql = "select s from Student s where s.status = com.school.sms.model.StudentStatus.ACTIVE and (" +
                "lower(s.firstName) like :keyword or lower(s.lastName) like :keyword or lower(s.studentId) like :keyword or " +
                "lower(s.email) like :keyword or lower(s.phone) like :keyword or lower(s.parentName) like :keyword)";
        if (branchId != null) {
            studentHql += " and s.branch.id = :branchId";
        }
        var qStudent = entityManager.createQuery(studentHql, Student.class)
                .setParameter("keyword", searchKeyword)
                .setMaxResults(10);
        if (branchId != null) {
            qStudent.setParameter("branchId", branchId);
        }
        List<StudentResult> studentResults = qStudent.getResultList().stream().map(s -> StudentResult.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .name(s.getFirstName() + " " + s.getLastName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .classroom(s.getClassRoom() != null ? s.getClassRoom().getName() : "Unassigned")
                .branchName(s.getBranch() != null ? s.getBranch().getName() : "Main Branch")
                .build()).collect(Collectors.toList());

        // 2. Query Staff
        String staffHql = "select s from Staff s where s.status = com.school.sms.model.hrms.Staff.StaffStatus.ACTIVE and (" +
                "lower(s.firstName) like :keyword or lower(s.lastName) like :keyword or lower(s.employeeCode) like :keyword or " +
                "lower(s.email) like :keyword or lower(s.phone) like :keyword)";
        if (branchId != null) {
            staffHql += " and s.branch.id = :branchId";
        }
        var qStaff = entityManager.createQuery(staffHql, Staff.class)
                .setParameter("keyword", searchKeyword)
                .setMaxResults(10);
        if (branchId != null) {
            qStaff.setParameter("branchId", branchId);
        }
        List<StaffResult> staffResults = qStaff.getResultList().stream().map(s -> StaffResult.builder()
                .id(s.getId())
                .employeeCode(s.getEmployeeCode())
                .name(s.getFirstName() + " " + s.getLastName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .designation(s.getDesignation() != null ? s.getDesignation().getTitle() : "Staff Member")
                .department(s.getDepartment() != null ? s.getDepartment().getName() : "General")
                .build()).collect(Collectors.toList());

        // 3. Query Transactions (Fees)
        String feesHql = "select f from FeePayment f where f.status = com.school.sms.model.PaymentStatus.PAID and (" +
                "lower(f.receiptNumber) like :keyword or lower(f.transactionId) like :keyword or lower(f.remarks) like :keyword or " +
                "lower(f.student.firstName) like :keyword or lower(f.student.lastName) like :keyword)";
        if (branchId != null) {
            feesHql += " and f.branch.id = :branchId";
        }
        var qFees = entityManager.createQuery(feesHql, FeePayment.class)
                .setParameter("keyword", searchKeyword)
                .setMaxResults(10);
        if (branchId != null) {
            qFees.setParameter("branchId", branchId);
        }
        List<TransactionResult> transactionResults = qFees.getResultList().stream().map(f -> TransactionResult.builder()
                .id(f.getId())
                .receiptNumber(f.getReceiptNumber())
                .transactionId(f.getTransactionId() != null ? f.getTransactionId() : "N/A")
                .studentName(f.getStudent() != null ? f.getStudent().getFirstName() + " " + f.getStudent().getLastName() : "Unknown")
                .amount(f.getAmount())
                .paymentDate(f.getPaymentDate() != null ? f.getPaymentDate().toString() : "N/A")
                .paymentMethod(f.getPaymentMethod())
                .status(f.getStatus() != null ? f.getStatus().name() : "PAID")
                .build()).collect(Collectors.toList());

        // 4. Query Pages (Filtered by permissions & fuzzy search matching title/category)
        List<PageResult> pageResults = getMatchedPages(query.trim().toLowerCase());

        return new GlobalSearchResponse(studentResults, staffResults, transactionResults, pageResults);
    }

    private List<PageResult> getMatchedPages(String query) {
        List<PageResult> allPages = new ArrayList<>();
        allPages.add(new PageResult("Students Directory", "/admin/students", "Academics"));
        allPages.add(new PageResult("Admit New Student", "/admin/students/new", "Academics"));
        allPages.add(new PageResult("Daily Attendance Registry", "/admin/attendance", "Academics"));
        allPages.add(new PageResult("Teachers List Directory", "/admin/teachers", "HRMS"));
        allPages.add(new PageResult("Hire New Teacher", "/admin/teachers/new", "HRMS"));
        allPages.add(new PageResult("Classes and Sections", "/admin/classes", "Academics"));
        allPages.add(new PageResult("Exams and Results", "/admin/exams", "Academics"));
        allPages.add(new PageResult("Collect Fee Dues", "/admin/fees/collect", "Finance"));
        allPages.add(new PageResult("Fees Dashboard", "/admin/fees", "Finance"));
        allPages.add(new PageResult("Chart of Accounts", "/admin/finance/coa", "Finance"));
        allPages.add(new PageResult("Journal Entries", "/admin/finance/journal", "Finance"));
        allPages.add(new PageResult("Expenses and Invoices", "/admin/finance/expenses", "Finance"));
        allPages.add(new PageResult("Financial Reports", "/admin/finance/reports", "Finance"));
        allPages.add(new PageResult("Fleet Transport Dashboard", "/admin/transport/dashboard", "Operations"));
        allPages.add(new PageResult("Warden Hostel Dashboard", "/admin/hostel/dashboard", "Operations"));
        allPages.add(new PageResult("Staff Onboarding Wizard", "/admin/hrms/onboarding", "HRMS"));
        allPages.add(new PageResult("Payroll Processing Engine", "/admin/hrms/payroll", "HRMS"));
        allPages.add(new PageResult("Leave Approval Center", "/admin/hrms/leave", "HRMS"));
        allPages.add(new PageResult("Active User Sessions", "/admin/sessions", "System"));
        allPages.add(new PageResult("Audit Trail Log", "/admin/audit-logs", "System"));
        allPages.add(new PageResult("Roles and Permissions", "/admin/roles", "System"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> 
                a.getAuthority().equals("ROLE_ADMIN") || 
                a.getAuthority().equals("ROLE_SUPERADMIN") || 
                a.getAuthority().equals("ROLE_SUPER_ADMIN") || 
                a.getAuthority().equals("ROLE_ROOT_ADMIN"));

        if (!isAdmin) {
            // Keep only non-admin pages if not admin (standard role filtering)
            allPages.removeIf(p -> p.getRoute().startsWith("/admin"));
        }

        return allPages.stream()
                .filter(p -> p.getTitle().toLowerCase().contains(query) || p.getCategory().toLowerCase().contains(query))
                .collect(Collectors.toList());
    }
}
