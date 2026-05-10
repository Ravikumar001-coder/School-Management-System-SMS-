// src/main/java/com/school/sms/repository/HomeworkRepository.java
package com.school.sms.repository;

import com.school.sms.model.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByClassRoomIdOrderByDueDateAsc(Long classRoomId);
}
