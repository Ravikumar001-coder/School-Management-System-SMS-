package com.school.sms.repository;

import com.school.sms.model.DownloadableDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DownloadableDocumentRepository extends JpaRepository<DownloadableDocument, Long> {
    List<DownloadableDocument> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
