package com.school.sms.controller.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.JournalEntry;
import com.school.sms.service.finance.JournalEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/journal")
@RequiredArgsConstructor
public class JournalEntryController {

    private final JournalEntryService journalEntryService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<ApiResponse<List<JournalEntry>>> getEntries(@PathVariable Long branchId) {
        return ResponseEntity.ok(journalEntryService.getEntries(branchId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JournalEntry>> createEntry(@RequestBody JournalEntry entry) {
        return ResponseEntity.ok(journalEntryService.createEntry(entry));
    }
}
