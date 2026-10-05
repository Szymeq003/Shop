package org.example.backend.repository;
import org.example.backend.entity.DeliveryMethod;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DeliveryMethodRepository extends JpaRepository<DeliveryMethod, Long> {}
