package com.school.sms.service.finance;

import com.school.sms.model.finance.LedgerEntry;
import com.school.sms.model.finance.StudentLedger;
import com.school.sms.repository.finance.LedgerEntryRepository;
import com.school.sms.repository.finance.StudentLedgerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentLedgerService {

    private final StudentLedgerRepository studentLedgerRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    @Transactional
    public void postDebit(Long ledgerId, BigDecimal amount, LedgerEntry.EntryType type, String description, Long referenceId) {
        StudentLedger ledger = studentLedgerRepository.findById(ledgerId)
                .orElseThrow(() -> new IllegalArgumentException("Ledger not found"));

        LedgerEntry entry = LedgerEntry.builder()
                .studentLedger(ledger)
                .transactionDate(LocalDate.now())
                .entryType(type)
                .amount(amount)
                .debitCredit(LedgerEntry.DebitCredit.DEBIT)
                .referenceId(referenceId)
                .description(description)
                .build();

        ledgerEntryRepository.save(entry);

        ledger.setTotalDue(ledger.getTotalDue().add(amount));
        studentLedgerRepository.save(ledger);
        log.info("Posted DEBIT of {} to ledger {} for {}", amount, ledgerId, description);
    }

    @Transactional
    public void postCredit(Long ledgerId, BigDecimal amount, LedgerEntry.EntryType type, String description, Long referenceId) {
        StudentLedger ledger = studentLedgerRepository.findById(ledgerId)
                .orElseThrow(() -> new IllegalArgumentException("Ledger not found"));

        LedgerEntry entry = LedgerEntry.builder()
                .studentLedger(ledger)
                .transactionDate(LocalDate.now())
                .entryType(type)
                .amount(amount)
                .debitCredit(LedgerEntry.DebitCredit.CREDIT)
                .referenceId(referenceId)
                .description(description)
                .build();

        ledgerEntryRepository.save(entry);

        if (type == LedgerEntry.EntryType.DISCOUNT) {
            ledger.setTotalConcession(ledger.getTotalConcession().add(amount));
        } else {
            ledger.setTotalPaid(ledger.getTotalPaid().add(amount));
        }
        
        studentLedgerRepository.save(ledger);
        log.info("Posted CREDIT of {} to ledger {} for {}", amount, ledgerId, description);
    }
}
