package com.school.sms.repository;

import com.school.sms.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserId(Long userId);
    
    @org.springframework.data.jpa.repository.Query("SELECT ur.role.name FROM UserRole ur WHERE ur.user.id = :userId")
    java.util.Set<String> findRoleNamesByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
    
    java.util.Optional<UserRole> findByUserIdAndRoleId(Long userId, Long roleId);
    boolean existsByUserAndRole(com.school.sms.model.User user, com.school.sms.model.Role role);
}
