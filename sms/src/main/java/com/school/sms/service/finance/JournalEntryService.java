package com.school.sms.service.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.JournalEntry;
import com.school.sms.repository.finance.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JournalEntryService {
    private final JournalEntryRepository journalEntryRepository;

    public ApiResponse<List<JournalEntry>> getEntries(Long branchId) {
        return ApiResponse.success("Fetched entries", journalEntryRepository.findByBranchId(branchId));
    }

    @Transactional
    public ApiResponse<JournalEntry> createEntry(JournalEntry entry) {
        BigDecimal totalDebit = entry.getLines().stream()
                .map(l -> l.getDebitAmount() != null ? l.getDebitAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalCredit = entry.getLines().stream()
                .map(l -> l.getCreditAmount() != null ? l.getCreditAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new RuntimeException("Journal Entry must balance. Total Debit: " + totalDebit + ", Total Credit: " + totalCredit);
        }

        entry.setTotalDebit(totalDebit);
        entry.setTotalCredit(totalCredit);
        entry.getLines().forEach(l -> l.setJournalEntry(entry));

        return ApiResponse.success("Created entry", journalEntryRepository.save(entry));
    }
}
