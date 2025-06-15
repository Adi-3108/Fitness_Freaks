package com.fitnessfreaks.backend.service;

import com.fitnessfreaks.backend.entity.Order;
import com.fitnessfreaks.backend.repository.OrderRepository;
import com.fitnessfreaks.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List; 

@Service
public class OrderService {

    private final OrderRepository repo;
    private final UserRepository userRepo;
    private final EmailService emailService;

    public OrderService(OrderRepository repo, UserRepository userRepo, EmailService emailService) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    public Order placeOrder(Order order) {
        order.setPlacedAt(LocalDateTime.now());
        Order savedOrder = repo.save(order);

        userRepo.findById(order.getUser().getId()).ifPresent(user -> {
            List<String> itemNames = order.getItems().stream()
                    .map(item -> item.getName() + " - ₹" + item.getPrice())
                    .toList();

            String arrivalDate = LocalDateTime.now().plusDays(4).toLocalDate().toString();

            emailService.sendOrderConfirmationEmail(
                    user.getEmail(),
                    user.getUsername(),
                    user.getPhoneNumber(),
                    user.getAddress(),
                    itemNames,
                    order.getItems().stream().mapToDouble(i -> i.getPrice()).sum(),
                    arrivalDate);
        });

        return savedOrder;
    }

}
