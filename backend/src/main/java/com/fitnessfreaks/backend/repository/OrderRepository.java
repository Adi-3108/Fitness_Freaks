package com.fitnessfreaks.backend.repository;

import com.fitnessfreaks.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}