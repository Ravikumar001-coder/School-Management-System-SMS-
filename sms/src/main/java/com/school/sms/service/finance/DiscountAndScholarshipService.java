package com.school.sms.service.finance;

import com.school.sms.model.finance.LedgerEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountAndScholarshipService {

    private final StudentLedgerService ledgerService;

    /**
     * Applies a discount to a student's ledger (posts a CREDIT).
     */
    @Transactional
    public void applyDiscount(Long ledgerId, BigDecimal amount, String reason, Long approvedById) {
        log.info("Applying discount of {} to ledger {} for reason: {}", amount, ledgerId, reason);
        ledgerService.postCredit(ledgerId, amount, LedgerEntry.EntryType.DISCOUNT, reason, approvedById);
    }

    /**
     * Background job to detect siblings and auto-apply discounts.
     * Could run daily or on new student admission.
     */
    public void detectAndApplySiblingDiscounts() {
        log.info("Running sibling detection engine...");
        // 1. Group students by parent_phone or guardian_name in family_groups
        // 2. Identify families with > 1 active student
        // 3. For the 2nd child onwards, calculate Sibling Discount (e.g. 50% off tuition)
        // 4. Apply discount using applyDiscount()
        log.info("Sibling detection engine completed.");
    }
}
