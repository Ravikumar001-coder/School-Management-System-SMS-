package com.school.sms.repository;

import com.school.sms.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByMobileNumberAndDeletedAtIsNull(String mobileNumber);
    Optional<Parent> findByParentUuidAndDeletedAtIsNull(String uuid);
    boolean existsByMobileNumberAndDeletedAtIsNull(String mobileNumber);
}
