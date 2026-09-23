package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marketing_campaigns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketingCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public enum Status { PLANNED, ACTIVE, COMPLETED, CANCELLED }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
}
