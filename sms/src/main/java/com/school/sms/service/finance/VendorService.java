package com.school.sms.service.finance;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.finance.Vendor;
import com.school.sms.repository.finance.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {
    private final VendorRepository vendorRepository;

    public ApiResponse<List<Vendor>> getVendors(Long branchId) {
        return ApiResponse.success("Fetched vendors", vendorRepository.findByBranchId(branchId));
    }

    public ApiResponse<Vendor> createVendor(Vendor vendor) {
        return ApiResponse.success("Created vendor", vendorRepository.save(vendor));
    }
}
