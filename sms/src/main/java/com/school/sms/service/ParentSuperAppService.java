// src/main/java/com/school/sms/service/ParentSuperAppService.java
package com.school.sms.service;

import com.school.sms.dto.response.ParentSuperAppDto.*;
import com.school.sms.exception.ResourceNotFoundException;
import com.school.sms.model.*;
import com.school.sms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParentSuperAppService {

    private final ParentRepository parentRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeePaymentRepository feeRepository;
    private final HomeworkRepository homeworkRepository;
    private final LeaveRequestRepository leaveRepository;
    private final StudentRepository studentRepository;
    
    // Advanced Modules Repositories
    private final AnnouncementRepository announcementRepository;
    private final CircularReadRepository circularReadRepository;
    private final ComplaintRepository complaintRepository;
    private final PtmSlotRepository ptmSlotRepository;
    private final PtmBookingRepository ptmBookingRepository;
    private final DownloadableDocumentRepository downloadRepository;
    private final ConsentFormRepository consentFormRepository;
    private final ConsentResponseRepository consentResponseRepository;
    private final MarkRepository markRepository;
    private final ClassDiaryRepository classDiaryRepository;

    private void verifyParentAccess(String parentMobile, Long studentId) {
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(parentMobile)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", 0L));
        
        boolean hasAccess = parent.getStudentLinks().stream()
                .anyMatch(link -> link.getStudent().getId().equals(studentId));
        
        if (!hasAccess) {
            throw new SecurityException("Unauthorized access to student data.");
        }
    }

    @Transactional(readOnly = true)
    public AttendanceSummary getAttendance(String parentMobile, Long studentId, LocalDate start, LocalDate end) {
        verifyParentAccess(parentMobile, studentId);

        List<Attendance> records = attendanceRepository.findByStudentIdAndDateBetween(studentId, start, end);
        
        long present = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long absent = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
        long late = records.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
        long leave = records.stream().filter(a -> a.getStatus() == AttendanceStatus.EXCUSED).count();

        return AttendanceSummary.builder()
                .presentDays(present)
                .absentDays(absent)
                .lateDays(late)
                .leaveDays(leave)
                .records(records.stream().map(a -> AttendanceRecord.builder()
                        .date(a.getDate())
                        .status(a.getStatus().name())
                        .remarks(a.getRemarks())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    @Transactional(readOnly = true)
    public FeeSummary getFees(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);

        List<FeePayment> allFees = feeRepository.findByStudentId(studentId);
        
        List<FeePayment> pending = allFees.stream()
                .filter(f -> f.getStatus() == PaymentStatus.PENDING || f.getStatus() == PaymentStatus.OVERDUE)
                .collect(Collectors.toList());
        
        List<FeePayment> paid = allFees.stream()
                .filter(f -> f.getStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());

        Double totalPending = pending.stream().mapToDouble(f -> f.getAmount() != null ? f.getAmount() : 0.0).sum();
        LocalDate nextDue = pending.isEmpty() ? null : LocalDate.now().plusDays(15); // Simulated due date since model lacks it

        return FeeSummary.builder()
                .totalPending(totalPending)
                .nextDueDate(nextDue)
                .pendingInvoices(pending.stream().map(f -> FeeInvoice.builder()
                        .id(f.getId())
                        .title(f.getFeeStructure() != null ? f.getFeeStructure().getFeeName() + " - " + f.getFeeStructure().getFrequency() : "Fee")
                        .invoiceNumber("INV-" + f.getId())
                        .amount(f.getAmount())
                        .dueDate(LocalDate.now().plusDays(15))
                        .build()).collect(Collectors.toList()))
                .recentReceipts(paid.stream().map(f -> FeeReceipt.builder()
                        .id(f.getId())
                        .title(f.getFeeStructure() != null ? f.getFeeStructure().getFeeName() + " - " + f.getFeeStructure().getFrequency() : "Fee")
                        .receiptNumber(f.getReceiptNumber())
                        .amountPaid(f.getAmount())
                        .paymentDate(f.getPaymentDate())
                        .paymentMethod(f.getPaymentMethod())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    @Transactional(readOnly = true)
    public HomeworkSummary getHomework(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        Student student = studentRepository.findById(studentId).orElseThrow();
        
        if (student.getClassRoom() == null) return HomeworkSummary.builder().pendingCount(0).tasks(List.of()).build();

        List<Homework> allHw = homeworkRepository.findByClassRoomIdOrderByDueDateAsc(student.getClassRoom().getId());
        
        // Mock submission status since we don't have submissions fully wired yet
        List<HomeworkItem> items = allHw.stream().map(hw -> HomeworkItem.builder()
                .id(hw.getId())
                .subjectName(hw.getSubject() != null ? hw.getSubject().getName() : "General")
                .title(hw.getTitle())
                .description(hw.getDescription())
                .assignedDate(hw.getAssignedDate())
                .dueDate(hw.getDueDate())
                .attachmentUrl(hw.getAttachmentUrl())
                .status(hw.getDueDate().isBefore(LocalDate.now()) ? "LATE" : "PENDING")
                .build()).collect(Collectors.toList());

        return HomeworkSummary.builder()
                .pendingCount((int) items.stream().filter(i -> "PENDING".equals(i.getStatus()) || "LATE".equals(i.getStatus())).count())
                .tasks(items)
                .build();
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestItem> getLeaveRequests(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        return leaveRepository.findByStudentIdOrderByStartDateDesc(studentId).stream()
                .map(l -> LeaveRequestItem.builder()
                        .id(l.getId())
                        .reason(l.getReason())
                        .startDate(l.getStartDate())
                        .endDate(l.getEndDate())
                        .status(l.getStatus())
                        .teacherRemarks(l.getTeacherRemarks())
                        .attachmentUrl(l.getAttachmentUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void submitLeaveRequest(String parentMobile, Long studentId, LeaveRequest request) {
        verifyParentAccess(parentMobile, studentId);
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(parentMobile).orElseThrow();
        Student student = studentRepository.findById(studentId).orElseThrow();

        request.setParent(parent);
        request.setStudent(student);
        request.setStatus("PENDING");
        leaveRepository.save(request);
    }

    // ==========================================
    // ADVANCED MODULES
    // ==========================================

    @Transactional(readOnly = true)
    public List<CircularItem> getCirculars(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(parentMobile).orElseThrow();
        
        List<Announcement> announcements = announcementRepository.findByAudienceInOrderByCreatedAtDesc(List.of("ALL", "PARENTS"));
        List<CircularRead> readStatus = circularReadRepository.findByParentId(parent.getId());
        
        return announcements.stream().map(a -> {
            boolean isRead = readStatus.stream().anyMatch(r -> r.getAnnouncement().getId().equals(a.getId()));
            return CircularItem.builder()
                    .id(a.getId())
                    .title(a.getTitle())
                    .content(a.getContent())
                    .date(a.getCreatedAt().toLocalDate())
                    .attachmentUrl(null)
                    .isRead(isRead)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintItem> getComplaints(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(c -> ComplaintItem.builder()
                        .id(c.getId())
                        .ticketId(c.getTicketId())
                        .category(c.getCategory())
                        .description(c.getDescription())
                        .status(c.getStatus())
                        .resolutionRemarks(c.getResolutionRemarks())
                        .createdAt(c.getCreatedAt().toLocalDate())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void submitComplaint(String parentMobile, Long studentId, Complaint request) {
        verifyParentAccess(parentMobile, studentId);
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(parentMobile).orElseThrow();
        Student student = studentRepository.findById(studentId).orElseThrow();

        request.setParent(parent);
        request.setStudent(student);
        request.setStatus("OPEN");
        request.setTicketId("TKT-" + System.currentTimeMillis());
        complaintRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<PtmSlotItem> getPtmSlots(String parentMobile, Long studentId, Long teacherId) {
        verifyParentAccess(parentMobile, studentId);
        List<PtmSlot> slots = ptmSlotRepository.findByTeacherIdOrderBySlotDateAscStartTimeAsc(teacherId);
        List<PtmBooking> myBookings = ptmBookingRepository.findByStudentIdOrderBySlotSlotDateAsc(studentId);
        
        return slots.stream().map(s -> {
            PtmBooking myBooking = myBookings.stream().filter(b -> b.getSlot().getId().equals(s.getId())).findFirst().orElse(null);
            return PtmSlotItem.builder()
                    .id(s.getId())
                    .teacherName(s.getTeacher().getUser().getFirstName() + " " + s.getTeacher().getUser().getLastName())
                    .subjectName(s.getTeacher().getSubjects() != null && !s.getTeacher().getSubjects().isEmpty() ? s.getTeacher().getSubjects().get(0).getName() : "General")
                    .slotDate(s.getSlotDate())
                    .startTime(s.getStartTime().toString())
                    .endTime(s.getEndTime().toString())
                    .isBooked(s.isBooked())
                    .bookingStatus(myBooking != null ? myBooking.getStatus() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void bookPtmSlot(String parentMobile, Long studentId, Long slotId) {
        verifyParentAccess(parentMobile, studentId);
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(parentMobile).orElseThrow();
        Student student = studentRepository.findById(studentId).orElseThrow();
        PtmSlot slot = ptmSlotRepository.findById(slotId).orElseThrow();

        if (slot.isBooked()) throw new IllegalStateException("Slot is already booked.");
        
        slot.setBooked(true);
        ptmSlotRepository.save(slot);

        PtmBooking booking = PtmBooking.builder()
                .slot(slot)
                .parent(parent)
                .student(student)
                .status("BOOKED")
                .build();
        ptmBookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<ResultItem> getResults(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        List<Mark> marks = markRepository.findByStudentId(studentId);
        return marks.stream().map(m -> ResultItem.builder()
                .id(m.getId())
                .examName(m.getExam().getName())
                .term(m.getExam().getExamType())
                .totalMarks(m.getExam().getTotalMarks() != null ? String.valueOf(m.getExam().getTotalMarks()) : "100")
                .obtainedMarks(String.valueOf(m.getMarksObtained()))
                .grade(m.getGrade())
                .remarks(m.getRemarks())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DownloadItem> getDownloads(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        return downloadRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(d -> DownloadItem.builder()
                        .id(d.getId())
                        .title(d.getTitle())
                        .documentType(d.getDocumentType())
                        .fileUrl(d.getFileUrl())
                        .date(d.getCreatedAt().toLocalDate())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConsentItem> getConsentForms(String parentMobile, Long studentId) {
        verifyParentAccess(parentMobile, studentId);
        Student student = studentRepository.findById(studentId).orElseThrow();
        
        Long classId = student.getClassRoom() != null ? student.getClassRoom().getId() : null;
        List<ConsentForm> forms = consentFormRepository.findByTargetAudienceOrClassRoomIdOrderByDueDateAsc("GLOBAL", classId);
        List<ConsentResponse> responses = consentResponseRepository.findByStudentId(studentId);

        return forms.stream().map(f -> {
            ConsentResponse resp = responses.stream().filter(r -> r.getConsentForm().getId().equals(f.getId())).findFirst().orElse(null);
            return ConsentItem.builder()
                    .id(f.getId())
                    .title(f.getTitle())
                    .description(f.getDescription())
                    .dueDate(f.getDueDate())
                    .attachmentUrl(f.getAttachmentUrl())
                    .responseStatus(resp != null ? resp.getStatus() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void submitConsentResponse(String parentMobile, Long studentId, Long formId, ConsentResponse response) {
        verifyParentAccess(parentMobile, studentId);
        Parent parent = parentRepository.findByPhoneAndDeletedAtIsNull(parentMobile).orElseThrow();
        Student student = studentRepository.findById(studentId).orElseThrow();
        ConsentForm form = consentFormRepository.findById(formId).orElseThrow();

        response.setConsentForm(form);
        response.setParent(parent);
        response.setStudent(student);
        consentResponseRepository.save(response);
    }

    @Transactional(readOnly = true)
    public java.util.List<java.util.Map<String, Object>> getClassDiaryForParent(
            String parentMobile, Long studentId, LocalDate from, LocalDate to) {
        verifyParentAccess(parentMobile, studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));
        if (student.getClassRoom() == null) return java.util.Collections.emptyList();
        return classDiaryRepository
                .findByClassRoomIdAndEntryDateBetweenOrderByEntryDateDesc(
                        student.getClassRoom().getId(), from, to)
                .stream().map(d -> {
                    java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", d.getId());
                    m.put("entryDate", d.getEntryDate());
                    m.put("subject", d.getSubject().getName());
                    m.put("topicsCovered", d.getTopicsCovered());
                    m.put("homeworkAssigned", d.getHomeworkAssigned());
                    m.put("announcements", d.getAnnouncements());
                    m.put("behaviorNote", d.getBehaviorNote());
                    m.put("teacherName", d.getTeacher().getFirstName() + " " + d.getTeacher().getLastName());
                    return m;
                }).collect(Collectors.toList());
    }
}
