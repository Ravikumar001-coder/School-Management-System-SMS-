// src/main/java/com/school/sms/dto/response/ParentSuperAppDto.java
package com.school.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ParentSuperAppDto {

    @Data
    @Builder
    public static class AttendanceSummary {
        private Long presentDays;
        private Long absentDays;
        private Long lateDays;
        private Long leaveDays;
        private List<AttendanceRecord> records;
    }

    @Data
    @Builder
    public static class AttendanceRecord {
        private LocalDate date;
        private String status;
        private String remarks;
    }

    @Data
    @Builder
    public static class FeeSummary {
        private Double totalPending;
        private LocalDate nextDueDate;
        private List<FeeInvoice> pendingInvoices;
        private List<FeeReceipt> recentReceipts;
    }

    @Data
    @Builder
    public static class FeeInvoice {
        private Long id;
        private String title;
        private String invoiceNumber;
        private Double amount;
        private LocalDate dueDate;
    }

    @Data
    @Builder
    public static class FeeReceipt {
        private Long id;
        private String title;
        private String receiptNumber;
        private Double amountPaid;
        private LocalDate paymentDate;
        private String paymentMethod;
    }

    @Data
    @Builder
    public static class HomeworkSummary {
        private Integer pendingCount;
        private List<HomeworkItem> tasks;
    }

    @Data
    @Builder
    public static class HomeworkItem {
        private Long id;
        private String subjectName;
        private String title;
        private String description;
        private LocalDate assignedDate;
        private LocalDate dueDate;
        private String attachmentUrl;
        private String status; // PENDING, SUBMITTED, LATE
    }

    @Data
    @Builder
    public static class LeaveRequestItem {
        private Long id;
        private String reason;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String teacherRemarks;
        private String attachmentUrl;
    }

    @Data
    @Builder
    public static class CircularItem {
        private Long id;
        private String title;
        private String content;
        private LocalDate date;
        private String attachmentUrl;
        private boolean isRead;
    }

    @Data
    @Builder
    public static class ComplaintItem {
        private Long id;
        private String ticketId;
        private String category;
        private String description;
        private String status;
        private String resolutionRemarks;
        private LocalDate createdAt;
    }

    @Data
    @Builder
    public static class PtmSlotItem {
        private Long id;
        private String teacherName;
        private String subjectName;
        private LocalDate slotDate;
        private String startTime;
        private String endTime;
        private boolean isBooked;
        private String bookingStatus; // null if not booked, "BOOKED" if parent booked it
    }

    @Data
    @Builder
    public static class ResultItem {
        private Long id;
        private String examName;
        private String term;
        private String totalMarks;
        private String obtainedMarks;
        private String grade;
        private String percentage;
        private String remarks;
        private String reportCardUrl; // Usually generated PDF
    }

    @Data
    @Builder
    public static class DownloadItem {
        private Long id;
        private String title;
        private String documentType;
        private String fileUrl;
        private LocalDate date;
    }

    @Data
    @Builder
    public static class ConsentItem {
        private Long id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private String attachmentUrl;
        private String responseStatus; // null if not responded, "APPROVED" or "REJECTED"
    }
}
