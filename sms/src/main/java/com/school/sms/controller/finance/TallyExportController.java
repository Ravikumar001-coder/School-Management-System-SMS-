package com.school.sms.controller.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.service.finance.TallyExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/finance/tally")
@RequiredArgsConstructor
public class TallyExportController {

    private final TallyExportService tallyService;

    @GetMapping("/export/{branchId}")
    public ResponseEntity<ApiResponse<String>> export(
            @PathVariable Long branchId, 
            @RequestParam(required = false) String fromDate, 
            @RequestParam(required = false) String toDate) {
        return ResponseEntity.ok(tallyService.generateTallyXml(branchId, fromDate, toDate));
    }
}
