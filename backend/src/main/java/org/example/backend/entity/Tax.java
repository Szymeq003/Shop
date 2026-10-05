package org.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "taxes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Tax {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private BigDecimal rate;
}
