package com.school.sms.repository;

import com.school.sms.model.TeacherSyncQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeacherSyncQueueRepository extends JpaRepository<TeacherSyncQueue, Long> {
    List<TeacherSyncQueue> findByUserIdAndStatus(Long userId, String status);
    List<TeacherSyncQueue> findByStatus(String status);
}
