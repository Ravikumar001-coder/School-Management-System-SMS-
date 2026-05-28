package com.school.sms.controller.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.Vendor;
import com.school.sms.service.finance.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<ApiResponse<List<Vendor>>> getVendors(@PathVariable Long branchId) {
        return ResponseEntity.ok(vendorService.getVendors(branchId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Vendor>> create(@RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.createVendor(vendor));
    }
}
