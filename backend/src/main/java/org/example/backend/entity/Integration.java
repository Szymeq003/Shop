package org.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "integrations")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Integration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String provider;
    private String apiKey;
    @Column(nullable = false) private Boolean active = true;
}
