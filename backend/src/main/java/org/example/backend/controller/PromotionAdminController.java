package org.example.backend.controller;
import org.example.backend.entity.Promotion;
import org.example.backend.repository.PromotionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@RequiredArgsConstructor
public class PromotionAdminController {
    private final PromotionRepository repository;

    @GetMapping
    public List<Promotion> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Promotion create(@RequestBody Promotion entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotion> update(@PathVariable Long id, @RequestBody Promotion entity) {
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
