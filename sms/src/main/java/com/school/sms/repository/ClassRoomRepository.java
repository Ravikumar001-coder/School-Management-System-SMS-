// repository/ClassRoomRepository.java
package com.school.sms.repository;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRoomRepository 
        extends JpaRepository<ClassRoom, Long> {

    Optional<ClassRoom> findByNameAndSectionAndAcademicYear(
        String name, String section, AcademicYear academicYear);

    List<ClassRoom> findByAcademicYear(AcademicYear academicYear);

    List<ClassRoom> findByAcademicYearIsNull();

    boolean existsByNameAndSectionAndAcademicYear(
        String name, String section, AcademicYear academicYear);

    Optional<ClassRoom> findByIdAndAcademicYearId(Long id, Long academicYearId);

    @Query("SELECT DISTINCT c.section FROM ClassRoom c WHERE c.name = :className AND c.deletedAt IS NULL")
    List<String> findDistinctSectionsByClassName(String className);

    @Query("SELECT c FROM ClassRoom c " +
           "WHERE c.classTeacher.id = :teacherId")
    List<ClassRoom> findByClassTeacherId(Long teacherId);
}
