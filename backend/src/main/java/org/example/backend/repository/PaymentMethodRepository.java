package org.example.backend.repository;
import org.example.backend.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {}
