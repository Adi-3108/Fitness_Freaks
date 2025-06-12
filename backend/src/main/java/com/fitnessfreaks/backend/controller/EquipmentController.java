package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.Equipment;
import com.fitnessfreaks.backend.service.EquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipmentController {

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Equipment> getAllEquipment() {
        return service.findAll();
    }
}
