package org.example.backend.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.backend.service.NewsletterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscribeRequest request) {
        newsletterService.subscribe(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Zapisano do newslettera pomyślnie. Sprawdź swoją skrzynkę e-mail!"));
    }

    @Data
    public static class SubscribeRequest {
        @NotBlank(message = "E-mail jest wymagany")
        @Email(message = "Podaj poprawny adres e-mail")
        private String email;
    }
}
