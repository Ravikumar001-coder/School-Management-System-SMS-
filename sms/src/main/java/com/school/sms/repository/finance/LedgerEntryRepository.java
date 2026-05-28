package com.school.sms.repository.finance;

import com.school.sms.model.finance.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {
    List<LedgerEntry> findByStudentLedgerIdOrderByTransactionDateDesc(Long studentLedgerId);
}
