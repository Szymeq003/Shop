package org.example.backend.controller;
import org.example.backend.entity.DeliveryMethod;
import org.example.backend.repository.DeliveryMethodRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/delivery-methods")
@RequiredArgsConstructor
public class DeliveryMethodAdminController {
    private final DeliveryMethodRepository repository;
    @GetMapping public List<DeliveryMethod> getAll() { return repository.findAll(); }
    @PostMapping public DeliveryMethod create(@RequestBody DeliveryMethod entity) { return repository.save(entity); }
    @PutMapping("/{id}") public ResponseEntity<DeliveryMethod> update(@PathVariable Long id, @RequestBody DeliveryMethod entity) { return repository.findById(id).map(existing -> { entity.setId(id); return ResponseEntity.ok(repository.save(entity)); }).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
