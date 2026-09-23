package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "discount_codes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    public enum DiscountType { PERCENTAGE, FIXED }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType type;

    @Column(nullable = false)
    private BigDecimal value;

    private BigDecimal minPurchaseAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxUses;
    private Integer currentUses = 0;
    
    @Column(nullable = false)
    private Boolean active = true;
}
