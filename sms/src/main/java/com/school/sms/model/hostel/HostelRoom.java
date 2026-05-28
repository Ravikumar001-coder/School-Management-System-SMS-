package com.school.sms.model.hostel;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hostel_rooms", indexes = {
    @Index(name = "idx_hostel_rooms_floor", columnList = "floor_id")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HostelRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private HostelFloor floor;

    @Column(name = "room_number", nullable = false, length = 50)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds;

    @Column(name = "has_attached_bath")
    @Builder.Default
    private Boolean hasAttachedBath = false;

    @Column(name = "has_wifi")
    @Builder.Default
    private Boolean hasWifi = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RoomStatus status = RoomStatus.AVAILABLE;

    public enum RoomType {
        AC, NON_AC
    }

    public enum RoomStatus {
        AVAILABLE, FULL, MAINTENANCE, RESERVED, CLOSED
    }
}
