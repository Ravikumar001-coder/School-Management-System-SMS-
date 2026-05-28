package com.school.sms.service.hrms;

import com.school.sms.model.User;
import com.school.sms.model.hrms.LeaveBalance;
import com.school.sms.model.hrms.LeaveRequest;
import com.school.sms.repository.UserRepository;
import com.school.sms.repository.hrms.LeaveBalanceRepository;
import com.school.sms.repository.hrms.StaffLeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaveManagementService {

    private final StaffLeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    @Transactional
    public LeaveRequest approveLeave(Long leaveRequestId, Long approverId) {
        log.info("Approving leave request {} by user {}", leaveRequestId, approverId);
        
        LeaveRequest request = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
                
        if (request.getStatus() != LeaveRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Leave request is not in PENDING state");
        }
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));
                
        request.setStatus(LeaveRequest.RequestStatus.APPROVED);
        request.setApprovedBy(approver);
        
        // Deduct balance
        int year = request.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository.findByStaffIdAndLeaveTypeIdAndYear(
                request.getStaff().getId(), request.getLeaveType().getId(), year)
                .orElseThrow(() -> new RuntimeException("Leave balance record not found"));
                
        balance.setUsed(balance.getUsed().add(request.getTotalDays()));
        balance.setRemaining(balance.getAllocated().subtract(balance.getUsed()));
        leaveBalanceRepository.save(balance);
        
        request = leaveRequestRepository.save(request);
        
        log.info("Leave request {} successfully APPROVED.", leaveRequestId);
        return request;
    }
    
    @Transactional
    public LeaveRequest rejectLeave(Long leaveRequestId, Long approverId, String reason) {
        LeaveRequest request = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
                
        if (request.getStatus() != LeaveRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Leave request is not in PENDING state");
        }
                
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));
                
        request.setStatus(LeaveRequest.RequestStatus.REJECTED);
        request.setApprovedBy(approver);
        // We could add a rejection_reason column but since it's not present in this entity class mapping (though it is in V23), we just use reason or add the field if needed.
        
        return leaveRequestRepository.save(request);
    }
    
    public java.util.List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus(LeaveRequest.RequestStatus.PENDING);
    }
}
