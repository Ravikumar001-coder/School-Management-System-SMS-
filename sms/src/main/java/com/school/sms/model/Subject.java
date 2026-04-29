// src/main/java/com/school/sms/model/Subject.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;  // "Mathematics", "Physics"

    private String code;  // "MATH101"
    
    private String description;

    private String department;

    @ManyToOne
    @JoinColumn(name = "class_room_id")
    private ClassRoom classRoom;

    @ManyToOne
    @JoinColumn(name = "assigned_teacher_id")
    private Teacher assignedTeacher;
    
    private Integer passingMarks;
    private Integer totalMarks;
    
    private String subjectType; // THEORY, PRACTICAL
}