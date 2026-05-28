package com.school.sms.repository.transport;

import com.school.sms.model.transport.BusAttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusAttendanceLogRepository extends JpaRepository<BusAttendanceLog, Long> {

    List<BusAttendanceLog> findByStudentIdOrderByScannedAtDesc(Long studentId);

    List<BusAttendanceLog> findByVehicleIdAndScannedAtBetween(Long vehicleId, LocalDateTime from, LocalDateTime to);

    @Query("SELECT b FROM BusAttendanceLog b WHERE b.vehicle.id = :vehicleId AND b.route.id = :routeId " +
           "AND b.scannedAt >= :since ORDER BY b.scannedAt DESC")
    List<BusAttendanceLog> findTodayLogsByVehicleAndRoute(@Param("vehicleId") Long vehicleId,
                                                          @Param("routeId") Long routeId,
                                                          @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(DISTINCT b.student.id) FROM BusAttendanceLog b WHERE b.vehicle.id = :vehicleId " +
           "AND b.attendanceType = 'BOARDED' AND b.scannedAt >= :since")
    long countBoardedStudents(@Param("vehicleId") Long vehicleId, @Param("since") LocalDateTime since);

    List<BusAttendanceLog> findBySyncedToMainAttendanceFalse();
}
