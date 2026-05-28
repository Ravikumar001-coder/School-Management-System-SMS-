package com.school.sms.repository.hrms;

import com.school.sms.model.hrms.StaffDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffDocumentRepository extends JpaRepository<StaffDocument, Long> {
    List<StaffDocument> findByStaffId(Long staffId);
}
