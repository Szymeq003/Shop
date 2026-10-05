package org.example.backend.controller;
import org.example.backend.entity.Tax;
import org.example.backend.repository.TaxRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/taxes")
@RequiredArgsConstructor
public class TaxAdminController {
    private final TaxRepository repository;
    @GetMapping public List<Tax> getAll() { return repository.findAll(); }
    @PostMapping public Tax create(@RequestBody Tax entity) { return repository.save(entity); }
    @PutMapping("/{id}") public ResponseEntity<Tax> update(@PathVariable Long id, @RequestBody Tax entity) { return repository.findById(id).map(existing -> { entity.setId(id); return ResponseEntity.ok(repository.save(entity)); }).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
