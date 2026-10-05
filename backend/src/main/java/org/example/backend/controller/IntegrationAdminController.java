package org.example.backend.controller;
import org.example.backend.entity.Integration;
import org.example.backend.repository.IntegrationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/integrations")
@RequiredArgsConstructor
public class IntegrationAdminController {
    private final IntegrationRepository repository;
    @GetMapping public List<Integration> getAll() { return repository.findAll(); }
    @PostMapping public Integration create(@RequestBody Integration entity) { return repository.save(entity); }
    @PutMapping("/{id}") public ResponseEntity<Integration> update(@PathVariable Long id, @RequestBody Integration entity) { return repository.findById(id).map(existing -> { entity.setId(id); return ResponseEntity.ok(repository.save(entity)); }).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
