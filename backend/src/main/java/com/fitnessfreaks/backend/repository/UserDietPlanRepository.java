package com.fitnessfreaks.backend.repository;

import com.fitnessfreaks.backend.entity.UserDietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDietPlanRepository extends JpaRepository<UserDietPlan, Long> {
    Optional<UserDietPlan> findByUserId(Long userId);
} 