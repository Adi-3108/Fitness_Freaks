package com.fitnessfreaks.backend.entity;

import jakarta.persistence.*;

@Entity
public class UserDietPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String dietCategory;
    @Lob
    private String mealsJson; // JSON string of meal names/objects

    public UserDietPlan() {}

    public UserDietPlan(Long userId, String dietCategory, String mealsJson) {
        this.userId = userId;
        this.dietCategory = dietCategory;
        this.mealsJson = mealsJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDietCategory() { return dietCategory; }
    public void setDietCategory(String dietCategory) { this.dietCategory = dietCategory; }

    public String getMealsJson() { return mealsJson; }
    public void setMealsJson(String mealsJson) { this.mealsJson = mealsJson; }
} 