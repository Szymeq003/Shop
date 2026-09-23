package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private LocalDateTime sentAt;
    
    public enum Status { DRAFT, SENT }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
}
