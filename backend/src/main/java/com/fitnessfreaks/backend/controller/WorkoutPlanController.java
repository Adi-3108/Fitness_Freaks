package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.WorkoutPlan;
import com.fitnessfreaks.backend.entity.User;
import com.fitnessfreaks.backend.repository.WorkoutPlanRepository;
import com.fitnessfreaks.backend.repository.UserRepository;
import com.fitnessfreaks.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.time.DayOfWeek;

@RestController
@RequestMapping("/api/workout-plans")

public class WorkoutPlanController {
    private static final Logger logger = LoggerFactory.getLogger(WorkoutPlanController.class);

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

  

    @GetMapping
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanRepository.findAll();
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendWorkoutPlan(@RequestBody Map<String, Object> payload) {
        logger.info("Received send-workout-plan request: {}", payload);
        
        String category = (String) payload.get("category");
        String userEmail = (String) payload.get("email");
        List<String> exercises = (List<String>) payload.get("exercises");

        if (category == null) {
            logger.warn("Invalid input: category missing");
            return ResponseEntity.badRequest().body(Map.of("message", "Category is required."));
        }
        if (userEmail == null || userEmail.isEmpty()) {
            logger.warn("Invalid input: user email missing");
            return ResponseEntity.badRequest().body(Map.of("message", "User email is required."));
        }

        try {
            // Get today's workout plan
            DayOfWeek today = LocalDate.now().getDayOfWeek();
            List<String> dailyExercises = emailService.getDailyWorkout(category, today);
            
            if (dailyExercises == null) {
                logger.warn("No workout plan found for category: {} on day: {}", category, today);
                return ResponseEntity.badRequest().body(Map.of("message", "No workout plan available for this category today."));
            }

            // Send email with today's workout to the user's email address
            emailService.sendWorkoutPlanEmail(userEmail, "User", category, dailyExercises);
            
            logger.info("Workout plan sent successfully to: {}", userEmail);
            return ResponseEntity.ok(Map.of(
                "message", "Workout plan sent successfully.",
                "day", today.toString(),
                "exercises", dailyExercises.toString()
            ));
        } catch (Exception e) {
            logger.error("Failed to send workout plan to {}: {}", userEmail, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to send workout plan: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutPlan>> getUserWorkoutPlans(@PathVariable Long userId) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserId(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<WorkoutPlan>> getUserWorkoutPlansByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserIdAndCategory(userId, category);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/daily/{category}")
    public ResponseEntity<Map<String, Object>> getDailyWorkout(@PathVariable String category) {
        try {
            DayOfWeek today = LocalDate.now().getDayOfWeek();
            List<String> dailyExercises = emailService.getDailyWorkout(category, today);
            
            if (dailyExercises == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "No workout plan available for this category today."
                ));
            }

            return ResponseEntity.ok(Map.of(
                "category", category,
                "day", today.toString(),
                "exercises", dailyExercises
            ));
        } catch (Exception e) {
            logger.error("Failed to get daily workout for category {}: {}", category, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to get daily workout: " + e.getMessage()
            ));
        }
    }
} 