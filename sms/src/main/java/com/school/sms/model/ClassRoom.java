// src/main/java/com/school/sms/model/ClassRoom.java

package com.school.sms.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "classrooms")
public class ClassRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;       // "Class 10"
    private String section;    // "A", "B", "C"
    private String academicYear; // "2024-25"
    
    // Class teacher
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher classTeacher;
    
    // All students in this class
    @OneToMany(mappedBy = "classRoom")
    private List<Student> students;
    
    // Subjects taught in this class
    @ManyToMany
    @JoinTable(
        name = "class_subjects",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Subject> subjects;
    
    private Integer maxCapacity;
    private Double classFee;
    private Double admissionFee;
}