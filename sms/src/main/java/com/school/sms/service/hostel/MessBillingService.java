package com.school.sms.service.hostel;

import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.Branch;
import com.school.sms.model.hostel.*;
import com.school.sms.repository.BranchRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.hostel.*;
import com.school.sms.service.hostel.event.MessBillGeneratedEvent;
import com.school.sms.model.Student;
import com.school.sms.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MessBillingService {

    private final MessPlanRepository planRepository;
    private final MessBillingRepository billingRepository;
    private final MessPaymentRepository paymentRepository;
    private final HostelAllocationRepository allocationRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MessPlan createMessPlan(Long branchId, MessPlan plan) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        plan.setBranch(branch);
        return planRepository.save(plan);
    }

    @Transactional(readOnly = true)
    public List<MessPlan> getPlansByBranch(Long branchId) {
        return planRepository.findByBranchId(branchId);
    }

    @Transactional(readOnly = true)
    public List<MessBilling> getAllBills() {
        return billingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<MessPayment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public MessBilling previewMonthlyBill(Long allocationId, Long planId, Integer month, Integer year, 
                                        Integer totalDays, Integer absentDays, Double extraCharges, 
                                        Double fines, Double holidayDeductions) {
        HostelAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found"));
        MessPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Mess plan not found"));

        int billableDays = totalDays - absentDays;
        double baseAmount = (plan.getDailyRate() * billableDays);
        double calculatedAmount = baseAmount + extraCharges + fines - holidayDeductions;
        if(calculatedAmount < 0) calculatedAmount = 0;

        return MessBilling.builder()
                .allocation(allocation)
                .plan(plan)
                .billingMonth(month)
                .billingYear(year)
                .totalDays(totalDays)
                .absentDays(absentDays)
                .extraCharges(extraCharges)
                .fines(fines)
                .holidayDeductions(holidayDeductions)
                .totalAmount(calculatedAmount)
                .amountPaid(0.0)
                .dueDate(LocalDate.of(year, month, 1).plusMonths(1).withDayOfMonth(5)) // Default 5th of next month
                .status(MessBilling.BillingStatus.PENDING)
                .build();
    }

    public MessBilling generateMonthlyBill(Long allocationId, Long planId, Integer month, Integer year, 
                                        Integer totalDays, Integer absentDays, Double extraCharges, 
                                        Double fines, Double holidayDeductions, LocalDate dueDate, Long generatedById) {
        
        List<MessBilling> existing = billingRepository.findByAllocationIdAndBillingMonthAndBillingYear(allocationId, month, year);
        if (!existing.isEmpty()) {
            throw new IllegalStateException("Bill already generated for this month");
        }

        MessBilling bill = previewMonthlyBill(allocationId, planId, month, year, totalDays, absentDays, extraCharges, fines, holidayDeductions);
        
        if (dueDate != null) bill.setDueDate(dueDate);
        
        if (generatedById != null) {
            User generator = userRepository.findById(generatedById).orElse(null);
            bill.setGeneratedBy(generator);
        }

        MessBilling savedBill = billingRepository.save(bill);

        Student student = savedBill.getAllocation().getStudent();
        eventPublisher.publishEvent(new MessBillGeneratedEvent(student.getId(), savedBill.getTotalAmount(), month, year));

        return savedBill;
    }
    
    public MessPayment recordPayment(Long billId, Double amount, MessPayment.PaymentMode mode, String receiptNumber, Long recordedById) {
        MessBilling bill = billingRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
                
        User recordedBy = userRepository.findById(recordedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MessPayment payment = MessPayment.builder()
                .bill(bill)
                .amountPaid(amount)
                .paymentDate(java.time.LocalDateTime.now())
                .paymentMode(mode)
                .receiptNumber(receiptNumber)
                .recordedBy(recordedBy)
                .build();
                
        MessPayment savedPayment = paymentRepository.save(payment);
        
        // Update bill status
        double newTotalPaid = bill.getAmountPaid() + amount;
        bill.setAmountPaid(newTotalPaid);
        
        if (newTotalPaid >= bill.getTotalAmount()) {
            bill.setStatus(MessBilling.BillingStatus.PAID);
        } else if (newTotalPaid > 0) {
            bill.setStatus(MessBilling.BillingStatus.PARTIAL);
        }
        
        billingRepository.save(bill);
        
        return savedPayment;
    }

    public MessBilling markBillAsPaid(Long billId) {
        MessBilling bill = billingRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
        bill.setStatus(MessBilling.BillingStatus.PAID);
        bill.setAmountPaid(bill.getTotalAmount());
        return billingRepository.save(bill);
    }
}
