package com.fitnessfreaks.backend.repository;

import com.fitnessfreaks.backend.entity.FooterAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FooterAnalyticsRepository extends JpaRepository<FooterAnalytics, Long> {
    List<FooterAnalytics> findByActionOrderByClickedAtDesc(String action);
    List<FooterAnalytics> findByTargetOrderByClickedAtDesc(String target);
    
    @Query("SELECT fa.target, COUNT(fa) as count FROM FooterAnalytics fa GROUP BY fa.target ORDER BY count DESC")
    List<Object[]> getClickCountsByTarget();
    
    @Query("SELECT fa.action, COUNT(fa) as count FROM FooterAnalytics fa GROUP BY fa.action ORDER BY count DESC")
    List<Object[]> getActionCounts();
    
    long countByAction(String action);
    long countByTarget(String target);
} 