package com.school.sms.repository;

import com.school.sms.model.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findByClassRoomIdAndDeletedAtIsNull(Long classRoomId);
    List<StudyMaterial> findByTeacherIdAndDeletedAtIsNull(Long teacherId);
    List<StudyMaterial> findBySubjectIdAndDeletedAtIsNull(Long subjectId);
    List<StudyMaterial> findByBranchIdAndDeletedAtIsNull(Long branchId);
}
