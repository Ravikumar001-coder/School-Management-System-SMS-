package com.school.sms.service.finance;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class HostelBillingService {

    private final StudentLedgerService ledgerService;

    public void generateMonthlyHostelInvoices() {
        log.info("Starting Hostel Billing Engine...");
        // 1. Fetch active hostel_assignments
        // 2. Fetch room fee from hostel_room_types
        // 3. Fetch active_days from mess_charges and calculate mess bill
        // 4. Post DEBIT to student ledgers
        log.info("Hostel Billing Engine completed.");
    }
}
