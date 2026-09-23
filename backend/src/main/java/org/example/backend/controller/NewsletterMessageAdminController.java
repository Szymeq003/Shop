package org.example.backend.controller;
import org.example.backend.entity.NewsletterMessage;
import org.example.backend.repository.NewsletterMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/newsletter-messages")
@RequiredArgsConstructor
public class NewsletterMessageAdminController {
    private final NewsletterMessageRepository repository;

    @GetMapping
    public List<NewsletterMessage> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public NewsletterMessage create(@RequestBody NewsletterMessage entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsletterMessage> update(@PathVariable Long id, @RequestBody NewsletterMessage entity) {
        return repository.findById(id).map(existing -> {
            entity.setId(id);
            return ResponseEntity.ok(repository.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
