package com.fitnessfreaks.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "footer_analytics")
public class FooterAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action; // "social_click", "newsletter_subscribe", "contact_form", etc.

    @Column(nullable = false)
    private String target; // "facebook", "instagram", "linkedin", etc.

    @Column(name = "user_ip")
    private String userIp;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;

    @Column(name = "page_url")
    private String pageUrl;

    public FooterAnalytics() {}

    public FooterAnalytics(String action, String target, String userIp, String userAgent, String pageUrl) {
        this.action = action;
        this.target = target;
        this.userIp = userIp;
        this.userAgent = userAgent;
        this.pageUrl = pageUrl;
        this.clickedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getUserIp() { return userIp; }
    public void setUserIp(String userIp) { this.userIp = userIp; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getClickedAt() { return clickedAt; }
    public void setClickedAt(LocalDateTime clickedAt) { this.clickedAt = clickedAt; }

    public String getPageUrl() { return pageUrl; }
    public void setPageUrl(String pageUrl) { this.pageUrl = pageUrl; }
} 