package com.school.sms.repository.transport;

import com.school.sms.model.transport.StudentTransportAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentTransportAssignmentRepository extends JpaRepository<StudentTransportAssignment, Long> {

    Optional<StudentTransportAssignment> findByStudentIdAndStatus(Long studentId,
            StudentTransportAssignment.AssignmentStatus status);

    List<StudentTransportAssignment> findByRouteIdAndStatus(Long routeId,
            StudentTransportAssignment.AssignmentStatus status);

    List<StudentTransportAssignment> findByPickupStopIdAndStatus(Long stopId,
            StudentTransportAssignment.AssignmentStatus status);

    @Query("SELECT COUNT(s) FROM StudentTransportAssignment s WHERE s.route.id = :routeId AND s.status = 'ACTIVE'")
    long countActiveStudentsOnRoute(@Param("routeId") Long routeId);
}
