package org.example.backend.repository;
import org.example.backend.entity.Tax;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TaxRepository extends JpaRepository<Tax, Long> {}
