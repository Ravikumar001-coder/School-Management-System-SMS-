package com.school.sms.repository.transport;

import com.school.sms.model.transport.TransportRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransportRouteRepository extends JpaRepository<TransportRoute, Long> {

    List<TransportRoute> findByBranchIdAndStatusAndDeletedAtIsNull(Long branchId, TransportRoute.RouteStatus status);

    List<TransportRoute> findByBranchIdAndDeletedAtIsNull(Long branchId);

    Optional<TransportRoute> findByRouteCodeAndDeletedAtIsNull(String routeCode);

    @Query("SELECT r FROM TransportRoute r WHERE r.branch.id = :branchId AND r.deletedAt IS NULL " +
           "ORDER BY r.routeName ASC")
    List<TransportRoute> findActiveByBranch(@Param("branchId") Long branchId);

    boolean existsByRouteCodeAndDeletedAtIsNull(String routeCode);
}
