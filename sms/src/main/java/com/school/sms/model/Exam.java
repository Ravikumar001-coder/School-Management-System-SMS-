// src/main/java/com/school/sms/model/Exam.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // "Mid-Term Exam 2024"
    private String examType;      // "MIDTERM", "FINAL", "UNIT_TEST"
    
    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;
    
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private LocalDate examDate;
    private String startTime;
    private String endTime;
    private Integer totalMarks;
    private Integer passingMarks;
    private String venue;
    private String academicYear;
    private String status;        // SCHEDULED, ONGOING, COMPLETED
}