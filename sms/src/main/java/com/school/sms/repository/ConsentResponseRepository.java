package com.school.sms.repository;

import com.school.sms.model.ConsentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsentResponseRepository extends JpaRepository<ConsentResponse, Long> {
    List<ConsentResponse> findByStudentId(Long studentId);
}
