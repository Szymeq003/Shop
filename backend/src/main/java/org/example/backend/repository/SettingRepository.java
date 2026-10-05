package org.example.backend.repository;
import org.example.backend.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SettingRepository extends JpaRepository<Setting, Long> {}
