package com.fitnessfreaks.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // class, session, reminder
    private String workoutType; // instead of title
    private String diet; // instead of description

    // REMOVED @JsonFormat to allow default ISO 8601 parsing
    private LocalDateTime scheduledAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getWorkoutType() { return workoutType; }
    public void setWorkoutType(String workoutType) { this.workoutType = workoutType; }
    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
