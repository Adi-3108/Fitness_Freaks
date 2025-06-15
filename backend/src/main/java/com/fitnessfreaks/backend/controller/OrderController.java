package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.Order;
import com.fitnessfreaks.backend.service.OrderService;
import com.fitnessfreaks.backend.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(originPatterns = "http://localhost:[*]")
public class OrderController {

    private final OrderService service;
    private final OrderRepository orderRepository;

    public OrderController(OrderService service, OrderRepository orderRepository) {
        this.service = service;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return service.placeOrder(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        try {
            List<Order> orders = orderRepository.findByUser_Id(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error fetching orders: " + e.getMessage());  // Add logging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
