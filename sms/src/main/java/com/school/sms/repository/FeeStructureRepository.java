package com.school.sms.repository;

import com.school.sms.model.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeStructureRepository
        extends JpaRepository<FeeStructure, Long> {

    List<FeeStructure> findByClassRoomIdAndAcademicYear(
            Long classRoomId, String academicYear);

    List<FeeStructure> findByAcademicYear(String academicYear);

    List<FeeStructure> findByClassRoomIdAndActive(
            Long classRoomId, boolean active);
}
