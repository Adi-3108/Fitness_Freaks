package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.FooterAnalytics;
import com.fitnessfreaks.backend.repository.FooterAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/footer-analytics")
public class FooterAnalyticsController {
    
    @Autowired
    private FooterAnalyticsRepository analyticsRepository;

    @PostMapping("/track")
    public ResponseEntity<Map<String, String>> trackAction(@RequestBody Map<String, String> payload) {
        String action = payload.get("action");
        String target = payload.get("target");
        String userIp = payload.get("userIp");
        String userAgent = payload.get("userAgent");
        String pageUrl = payload.get("pageUrl");

        if (action == null || target == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Action and target are required"));
        }

        FooterAnalytics analytics = new FooterAnalytics(action, target, userIp, userAgent, pageUrl);
        analyticsRepository.save(analytics);

        return ResponseEntity.ok(Map.of("message", "Action tracked successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get click counts by target
        List<Object[]> targetCounts = analyticsRepository.getClickCountsByTarget();
        Map<String, Long> targetStats = new HashMap<>();
        for (Object[] result : targetCounts) {
            targetStats.put((String) result[0], (Long) result[1]);
        }
        stats.put("targetStats", targetStats);

        // Get action counts
        List<Object[]> actionCounts = analyticsRepository.getActionCounts();
        Map<String, Long> actionStats = new HashMap<>();
        for (Object[] result : actionCounts) {
            actionStats.put((String) result[0], (Long) result[1]);
        }
        stats.put("actionStats", actionStats);

        // Total clicks
        long totalClicks = analyticsRepository.count();
        stats.put("totalClicks", totalClicks);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/clicks/social")
    public ResponseEntity<Map<String, Long>> getSocialClicks() {
        Map<String, Long> socialClicks = new HashMap<>();
        socialClicks.put("facebook", analyticsRepository.countByTarget("facebook"));
        socialClicks.put("instagram", analyticsRepository.countByTarget("instagram"));
        socialClicks.put("linkedin", analyticsRepository.countByTarget("linkedin"));
        return ResponseEntity.ok(socialClicks);
    }

    @GetMapping("/clicks/newsletter")
    public ResponseEntity<Map<String, Long>> getNewsletterClicks() {
        long newsletterClicks = analyticsRepository.countByAction("newsletter_subscribe");
        return ResponseEntity.ok(Map.of("newsletter_subscribes", newsletterClicks));
    }

    @GetMapping("/clicks/contact")
    public ResponseEntity<Map<String, Long>> getContactClicks() {
        long contactClicks = analyticsRepository.countByAction("contact_form");
        return ResponseEntity.ok(Map.of("contact_forms", contactClicks));
    }
} 