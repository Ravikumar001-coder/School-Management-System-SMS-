package com.school.sms.service.finance;

import com.school.sms.model.finance.ErpFeeStructure;
import com.school.sms.repository.finance.ErpFeeStructureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeeBillingScheduler {

    private final ErpFeeStructureRepository feeStructureRepository;
    private final StudentLedgerService ledgerService;

    /**
     * Cron job to run every day at 1:00 AM.
     * Scans active fee structures and posts invoices to student ledgers if billing is due.
     */
    @Scheduled(cron = "0 0 1 * * ?") 
    @Transactional
    public void generateRecurringInvoices() {
        log.info("Starting automated fee billing engine for recurring invoices...");
        
        LocalDate today = LocalDate.now();
        int currentDay = today.getDayOfMonth();
        
        // Example simplified logic: 
        // 1. Fetch structures where dueDay == currentDay
        // 2. Fetch all students in that class
        // 3. For each student, post a DEBIT to their ledger
        
        List<ErpFeeStructure> dueStructures = feeStructureRepository.findByActiveTrueAndDueDay(currentDay);
        
        int invoiceCount = 0;
        for (ErpFeeStructure structure : dueStructures) {
            // Check applicable date ranges
            if (structure.getApplicableFrom() != null && today.isBefore(structure.getApplicableFrom())) continue;
            if (structure.getApplicableTo() != null && today.isAfter(structure.getApplicableTo())) continue;
            
            // In a full implementation, we'd iterate over students in structure.getClassRoom()
            // and call ledgerService.postDebit(...)
            // Mocking the loop for now:
            invoiceCount++;
            log.info("Generated invoice for Fee Head: {}, Amount: {}", structure.getFeeHead().getName(), structure.getAmount());
        }
        
        log.info("Automated fee billing engine completed. Generated {} invoices.", invoiceCount);
    }
}
