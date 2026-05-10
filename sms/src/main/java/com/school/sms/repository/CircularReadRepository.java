package com.school.sms.repository;

import com.school.sms.model.CircularRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircularReadRepository extends JpaRepository<CircularRead, Long> {
    Optional<CircularRead> findByAnnouncementIdAndParentId(Long announcementId, Long parentId);
    List<CircularRead> findByParentId(Long parentId);
}
