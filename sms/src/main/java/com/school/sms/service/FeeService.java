// service/FeeService.java
package com.school.sms.service;

import com.school.sms.dto.request.FeePaymentRequest;
import com.school.sms.dto.response.FeePaymentResponse;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeePaymentRepository   feePaymentRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final StudentRepository      studentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ReceiptNumberService   receiptNumberService;

    // Collect fee payment
    @Transactional
    public FeePaymentResponse collectPayment(FeePaymentRequest request) {

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() -> 
                    new ResourceNotFoundException(
                        "Student", request.getStudentId()));

        FeeStructure feeStructure = null;
        if (request.getFeeStructureId() != null) {
            feeStructure = feeStructureRepository
                    .findById(request.getFeeStructureId())
                    .orElse(null);
        }

        AcademicYear currentYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Active Academic Year", "status", "active"));

        String receiptNo = receiptNumberService.nextReceiptNumber(currentYear);

        FeePayment payment = FeePayment.builder()
                .student(student)
                .feeStructure(feeStructure)
                .receiptNumber(receiptNo)
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate() != null
                             ? request.getPaymentDate()
                             : LocalDate.now())
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .month(request.getMonth())
                .status(PaymentStatus.PAID)
                .remarks(request.getRemarks())
                .academicYear(currentYear)
                .branch(student.getBranch())
                .build();

        return mapToResponse(feePaymentRepository.save(payment));
    }

    // All payments for a student
    public List<FeePaymentResponse> getStudentPayments(Long studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Student", studentId));

        return feePaymentRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FeePaymentResponse getPaymentById(Long paymentId) {
        FeePayment payment = feePaymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                    new ResourceNotFoundException("FeePayment", paymentId));

        return mapToResponse(payment);
    }

    // All pending fees
    public List<FeePaymentResponse> getPendingFees() {
        return feePaymentRepository.findByStatus(PaymentStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // All fee payments (admin overview)
    public List<FeePaymentResponse> getAllPayments() {
        return feePaymentRepository.findAll()
                .stream()
                .sorted(Comparator
                    .comparing(FeePayment::getPaymentDate,
                        Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(FeePayment::getId,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fee summary for a student
    public Map<String, Object> getStudentFeeSummary(Long studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Student", studentId));

        Double totalPaid = feePaymentRepository
                .getTotalPaidByStudent(studentId);

        List<FeePaymentResponse> payments = feePaymentRepository
                .findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        long pendingCount = payments.stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .count();

        return Map.of(
            "studentId",    studentId,
            "totalPaid",    totalPaid != null ? totalPaid : 0.0,
            "pendingCount", pendingCount,
            "payments",     payments
        );
    }

    // This month's collection summary
    public Map<String, Object> getMonthlyReport(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        Double collection = feePaymentRepository
                .getMonthlyCollection(startDate, endDate);
        Double pending    = feePaymentRepository.getTotalPendingFees();

        return Map.of(
            "month",           month,
            "year",            year,
            "totalCollection", collection != null ? collection : 0.0,
            "totalPending",    pending    != null ? pending    : 0.0
        );
    }

    // ── Helpers ──────────────────────────────────────

    private FeePaymentResponse mapToResponse(FeePayment f) {
        return FeePaymentResponse.builder()
                .id(f.getId())
                .receiptNumber(f.getReceiptNumber())
                .studentName(f.getStudent().getFirstName() 
                             + " " + f.getStudent().getLastName())
                .studentCode(f.getStudent().getStudentId())
                .className(f.getStudent().getClassRoom() != null
                    ? f.getStudent().getClassRoom().getName()
                      + " - " + f.getStudent().getClassRoom().getSection()
                    : null)
                .amount(f.getAmount())
                .paymentDate(f.getPaymentDate())
                .paymentMethod(f.getPaymentMethod())
                .transactionId(f.getTransactionId())
                .month(f.getMonth())
                .remarks(f.getRemarks())
                .status(f.getStatus() != null 
                        ? f.getStatus().name() : "PAID")
                .build();
    }
}