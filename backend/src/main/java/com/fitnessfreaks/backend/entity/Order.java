package com.fitnessfreaks.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime placedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    // ─── Constructors ────────────────────────────────

    public Order() {}

    public Order(Long id, LocalDateTime placedAt, User user, List<OrderItem> items) {
        this.id = id;
        this.placedAt = placedAt;
        this.user = user;
        this.items = items;
    }


    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public LocalDateTime getPlacedAt() { return placedAt; }

    public void setPlacedAt(LocalDateTime placedAt) { this.placedAt = placedAt; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public List<OrderItem> getItems() { return items; }

    public void setItems(List<OrderItem> items) { this.items = items; }
}
