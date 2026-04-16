package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.NewsletterSubscriber;
import org.example.backend.repository.NewsletterSubscriberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository repository;
    private final EmailService emailService;

    @Transactional
    public void subscribe(String email) {
        if (repository.existsByEmail(email)) {
            throw new RuntimeException("Ten adres e-mail jest już zapisany do newslettera.");
        }

        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(email)
                .build();
        repository.save(subscriber);

        emailService.sendNewsletterWelcomeEmail(email);
    }
}
