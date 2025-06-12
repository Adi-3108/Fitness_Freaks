package com.fitnessfreaks.backend.repository;

import com.fitnessfreaks.backend.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
}
