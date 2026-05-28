package com.school.sms.controller;

import com.school.sms.dto.response.ApiResponse;
import com.school.sms.model.Teacher;
import com.school.sms.model.Timetable;
import com.school.sms.model.User;
import com.school.sms.repository.TeacherRepository;
import com.school.sms.repository.TimetableRepository;
import com.school.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher/timetables")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherTimetableController {

    private final TimetableRepository timetableRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Timetable>>> getMyTimetable(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher profile not found for user: " + user.getUsername()));

        List<Timetable> timetable = timetableRepository.findByTeacherId(teacher.getId());
        return ResponseEntity.ok(ApiResponse.success("Teacher timetable fetched successfully", timetable));
    }
}
