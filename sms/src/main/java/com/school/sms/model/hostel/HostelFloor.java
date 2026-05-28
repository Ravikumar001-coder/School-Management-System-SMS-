package com.school.sms.model.hostel;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hostel_floors", indexes = {
    @Index(name = "idx_hostel_floors_block", columnList = "block_id")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HostelFloor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "block_id", nullable = false)
    private HostelBlock block;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Column(name = "floor_name", length = 50)
    private String floorName;
}
