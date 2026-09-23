package org.example.backend.repository;
import org.example.backend.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PromotionRepository extends JpaRepository<Promotion, Long> {}
