package com.school.sms.repository;

import com.school.sms.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByPhoneAndDeletedAtIsNull(String phone);
    Optional<Parent> findByParentUuidAndDeletedAtIsNull(String uuid);
    boolean existsByPhoneAndDeletedAtIsNull(String phone);

    // Legacy Aliases for Auth/Security stability
    default Optional<Parent> findByMobileNumberAndDeletedAtIsNull(String mobile) {
        return findByPhoneAndDeletedAtIsNull(mobile);
    }
    default boolean existsByMobileNumberAndDeletedAtIsNull(String mobile) {
        return existsByPhoneAndDeletedAtIsNull(mobile);
    }
}
