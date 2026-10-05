package org.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "delivery_methods")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DeliveryMethod {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    private String description;
    @Column(nullable = false) private BigDecimal price;
    @Column(nullable = false) private Boolean active = true;
}
