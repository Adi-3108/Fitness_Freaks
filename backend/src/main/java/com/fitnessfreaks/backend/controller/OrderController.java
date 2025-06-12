package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.Order;
import com.fitnessfreaks.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(originPatterns = "http://localhost:[*]")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return service.placeOrder(order);
    }
}
