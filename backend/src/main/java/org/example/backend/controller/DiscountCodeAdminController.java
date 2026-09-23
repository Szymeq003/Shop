package org.example.backend.controller;
import org.example.backend.entity.DiscountCode;
import org.example.backend.repository.DiscountCodeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/discount-codes")
@RequiredArgsConstructor
public class DiscountCodeAdminController {
    private final DiscountCodeRepository repository;

    @GetMapping
    public List<DiscountCode> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public DiscountCode create(@RequestBody DiscountCode entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscountCode> update(@PathVariable Long id, @RequestBody DiscountCode entity) {
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
