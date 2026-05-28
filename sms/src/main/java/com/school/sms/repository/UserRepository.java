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
    @org.springframework.data.jpa.repository.Query(value = 
        "SELECT MAX(CAST(SUBSTRING(username, :prefixLength + 1) AS UNSIGNED)) " +
        "FROM users WHERE username LIKE CONCAT(:prefix, '%')", nativeQuery = true)
    Long findMaxSequenceByPrefix(String prefix, int prefixLength);
}
// Spring Data JPA automatically implements these methods!
// No need to write SQL queries!