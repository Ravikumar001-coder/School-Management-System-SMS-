package com.school.sms.repository;

import com.school.sms.model.Todo;
import com.school.sms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserAndDeletedAtIsNullOrderByCreatedAtDesc(User user);
}
