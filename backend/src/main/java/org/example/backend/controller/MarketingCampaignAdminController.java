package org.example.backend.controller;
import org.example.backend.entity.MarketingCampaign;
import org.example.backend.repository.MarketingCampaignRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/admin/marketing-campaigns")
@RequiredArgsConstructor
public class MarketingCampaignAdminController {
    private final MarketingCampaignRepository repository;

    @GetMapping
    public List<MarketingCampaign> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public MarketingCampaign create(@RequestBody MarketingCampaign entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketingCampaign> update(@PathVariable Long id, @RequestBody MarketingCampaign entity) {
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
