package org.example.backend.controller;
import org.example.backend.entity.Setting;
import org.example.backend.repository.SettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class SettingAdminController {
    private final SettingRepository repository;
    @GetMapping public List<Setting> getAll() { return repository.findAll(); }
    @PostMapping public Setting create(@RequestBody Setting entity) { return repository.save(entity); }
    @PutMapping("/{id}") public ResponseEntity<Setting> update(@PathVariable Long id, @RequestBody Setting entity) { return repository.findById(id).map(existing -> { entity.setId(id); return ResponseEntity.ok(repository.save(entity)); }).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
