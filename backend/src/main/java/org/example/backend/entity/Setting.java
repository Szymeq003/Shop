package org.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settings")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Setting {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="setting_key", nullable = false, unique = true) private String key;
    @Column(name="setting_value") private String value;
}
