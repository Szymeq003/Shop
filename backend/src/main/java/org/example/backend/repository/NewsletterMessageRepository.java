package org.example.backend.repository;
import org.example.backend.entity.NewsletterMessage;
import org.springframework.data.jpa.repository.JpaRepository;
public interface NewsletterMessageRepository extends JpaRepository<NewsletterMessage, Long> {}
