package com.school.sms.repository.transport;

import com.school.sms.model.transport.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    List<RouteStop> findByRouteIdOrderByStopSequenceAsc(Long routeId);

    List<RouteStop> findByRouteIdAndStatus(Long routeId, RouteStop.StopStatus status);

    @Query("SELECT COUNT(s) FROM StudentTransportAssignment s WHERE s.pickupStop.id = :stopId AND s.status = 'ACTIVE'")
    long countStudentsAtStop(@Param("stopId") Long stopId);

    void deleteByRouteId(Long routeId);
}
