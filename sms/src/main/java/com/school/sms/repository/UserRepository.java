// src/main/java/com/school/sms/repository/UserRepository.java

package com.school.sms.repository;

import com.school.sms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);
    
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
// Spring Data JPA automatically implements these methods!
// No need to write SQL queries!