package org.example.backend.repository;
import org.example.backend.entity.Integration;
import org.springframework.data.jpa.repository.JpaRepository;
public interface IntegrationRepository extends JpaRepository<Integration, Long> {}
