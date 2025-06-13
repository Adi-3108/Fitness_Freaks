package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.UserDietPlan;
import com.fitnessfreaks.backend.repository.UserDietPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user-diet-plan")
public class UserDietPlanController {
    @Autowired
    private UserDietPlanRepository userDietPlanRepository;

    @PostMapping
    public ResponseEntity<UserDietPlan> saveOrUpdateDietPlan(@RequestBody UserDietPlan plan) {
        // If a plan exists for this user, update it
        Optional<UserDietPlan> existing = userDietPlanRepository.findByUserId(plan.getUserId());
        if (existing.isPresent()) {
            UserDietPlan upd = existing.get();
            upd.setDietCategory(plan.getDietCategory());
            upd.setMealsJson(plan.getMealsJson());
            return ResponseEntity.ok(userDietPlanRepository.save(upd));
        }
        return ResponseEntity.ok(userDietPlanRepository.save(plan));
    }

    @GetMapping
    public ResponseEntity<UserDietPlan> getDietPlan(@RequestParam Long userId) {
        Optional<UserDietPlan> plan = userDietPlanRepository.findByUserId(userId);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
} 