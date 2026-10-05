package org.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "payment_methods")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentMethod {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    private String description;
    private BigDecimal fee;
    @Column(nullable = false) private Boolean active = true;
}
