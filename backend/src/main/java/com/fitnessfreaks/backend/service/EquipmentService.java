package com.fitnessfreaks.backend.service;

import com.fitnessfreaks.backend.entity.Equipment;
import com.fitnessfreaks.backend.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository repo;

    public EquipmentService(EquipmentRepository repo) {
        this.repo = repo;
    }

    public List<Equipment> findAll() {
        return repo.findAll();
    }
}
