package com.school.sms.service.hrms;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.hrms.StaffAttendance;
import com.school.sms.model.hrms.Staff;
import com.school.sms.repository.hrms.StaffAttendanceRepository;
import com.school.sms.repository.hrms.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BiometricAttendanceService {

    private final StaffAttendanceRepository staffAttendanceRepository;
    private final StaffRepository staffRepository;

    @Transactional
    public ApiResponse<StaffAttendance> syncBiometricPunch(Long staffId, LocalDate date, LocalTime checkIn, LocalTime checkOut) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        StaffAttendance attendance = new StaffAttendance();
        attendance.setStaff(staff);
        attendance.setAttendanceDate(date);
        attendance.setCheckIn(checkIn);
        attendance.setCheckOut(checkOut);

        if (checkIn != null && checkOut != null) {
            long minutes = Duration.between(checkIn, checkOut).toMinutes();
            attendance.setTotalHours(BigDecimal.valueOf(minutes / 60.0));
            
            if (minutes >= 480) { // 8 hours
                attendance.setAttendanceStatus(StaffAttendance.AttendanceStatus.PRESENT);
            } else if (minutes >= 240) { // 4 hours
                attendance.setAttendanceStatus(StaffAttendance.AttendanceStatus.HALF_DAY);
            } else {
                attendance.setAttendanceStatus(StaffAttendance.AttendanceStatus.ABSENT);
            }
            
            // Assume 9 AM start time for late calculation
            LocalTime expectedIn = LocalTime.of(9, 0);
            if (checkIn.isAfter(expectedIn)) {
                attendance.setLateMinutes((int) Duration.between(expectedIn, checkIn).toMinutes());
            }
        }

        return ApiResponse.success("Attendance synced successfully", staffAttendanceRepository.save(attendance));
    }

    public ApiResponse<List<StaffAttendance>> getAttendanceLogs(LocalDate date) {
        return ApiResponse.success("Fetched attendance logs", staffAttendanceRepository.findByAttendanceDate(date));
    }
}
