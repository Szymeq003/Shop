package org.example.backend.controller;
import org.example.backend.entity.PaymentMethod;
import org.example.backend.repository.PaymentMethodRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodAdminController {
    private final PaymentMethodRepository repository;
    @GetMapping public List<PaymentMethod> getAll() { return repository.findAll(); }
    @PostMapping public PaymentMethod create(@RequestBody PaymentMethod entity) { return repository.save(entity); }
    @PutMapping("/{id}") public ResponseEntity<PaymentMethod> update(@PathVariable Long id, @RequestBody PaymentMethod entity) { return repository.findById(id).map(existing -> { entity.setId(id); return ResponseEntity.ok(repository.save(entity)); }).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
