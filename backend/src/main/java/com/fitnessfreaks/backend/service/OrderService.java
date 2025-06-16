package com.fitnessfreaks.backend.service;

import com.fitnessfreaks.backend.entity.Order;
import com.fitnessfreaks.backend.entity.User;
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
        try {
            // Fetch the User entity from the database to ensure it's a managed entity
            User existingUser = userRepo.findById(order.getUser().getId())
                                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + order.getUser().getId()));

            order.setUser(existingUser); // Set the managed User entity on the order
            order.setPlacedAt(LocalDateTime.now());
            Order savedOrder = repo.save(order);

            List<String> itemNames = order.getItems().stream()
                    .map(item -> item.getName() + " - ₹" + item.getPrice())
                    .toList();

            String arrivalDate = LocalDateTime.now().plusDays(4).toLocalDate().toString();

            emailService.sendOrderConfirmationEmail(
                    existingUser.getEmail(),
                    existingUser.getUsername(),
                    existingUser.getPhoneNumber(),
                    existingUser.getAddress(),
                    itemNames,
                    order.getItems().stream().mapToDouble(i -> i.getPrice()).sum(),
                    arrivalDate);

            return savedOrder;
        } catch (Exception e) {
            System.err.println("Error placing order: " + e.getMessage());
            throw new RuntimeException("Failed to place order: " + e.getMessage(), e);
        }
    }

}
