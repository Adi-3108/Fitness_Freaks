package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.Order;
import com.fitnessfreaks.backend.entity.OrderItem;
import com.fitnessfreaks.backend.entity.User;
import com.fitnessfreaks.backend.service.OrderService;
import com.fitnessfreaks.backend.service.PaymentService;
import com.fitnessfreaks.backend.service.UserService;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, UserService userService, OrderService orderService) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.orderService = orderService;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            Integer amount = (Integer) request.get("amount");
            String email = (String) request.get("email");

            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount, email);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // Handle Stripe webhook events here
            // For now, we'll just return a success response
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook Error: " + e.getMessage());
        }
    }

    @PostMapping("/confirm-and-register")
    public ResponseEntity<Map<String, String>> confirmPaymentAndRegister(@RequestBody Map<String, Object> payload) {
        try {
            String paymentIntentId = (String) payload.get("paymentIntentId");
            Map<String, String> registrationData = (Map<String, String>) payload.get("registrationData");

            if (paymentIntentId == null || registrationData == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing paymentIntentId or registrationData"));
            }

            // 1. Handle successful payment in PaymentService
            paymentService.handleSuccessfulPayment(paymentIntentId);

            // 2. Register the user
            User user = new User();
            user.setUsername(registrationData.get("name"));
            user.setPhoneNumber(registrationData.get("phone"));
            user.setAddress(registrationData.get("address"));
            user.setPassword(registrationData.get("password"));
            user.setEmail(registrationData.get("email"));
            user.setPlan(registrationData.get("plan"));

            String registrationMessage = userService.registerUser(user);

            if ("OTP sent to your email!".equals(registrationMessage)) {
                return ResponseEntity.ok(Map.of("message", "OTP sent for verification"));
            } else if ("User Registered Successfully".equals(registrationMessage)) {
                return ResponseEntity.ok(Map.of("message", "Payment confirmed and user registered successfully!"));
            } else {
                return ResponseEntity.status(500).body(Map.of("error", "Payment confirmed but user registration failed: " + registrationMessage));
            }
        } catch (Exception e) {
            System.err.println("Error confirming payment or registering user: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/confirm-equipment-order")
    public ResponseEntity<Map<String, String>> confirmEquipmentOrder(@RequestBody Map<String, Object> payload) {
        try {
            String paymentIntentId = (String) payload.get("paymentIntentId");
            String userEmail = (String) payload.get("userEmail");
            Long userId = ((Number) payload.get("userId")).longValue();
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) payload.get("cartItems");

            if (paymentIntentId == null || userEmail == null || userId == null || cartItems == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required order data"));
            }

            // 1. Handle successful payment in PaymentService
            paymentService.handleSuccessfulPayment(paymentIntentId);

            // 2. Retrieve the existing user
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found for order placement."));
            }

            // 3. Create OrderItems from cartItems
            List<OrderItem> orderItems = cartItems.stream()
                    .map(item -> new OrderItem(null, (String) item.get("name"), (Integer) item.get("price")))
                    .collect(Collectors.toList());

            // 4. Create and place the Order
            Order newOrder = new Order();
            newOrder.setUser(user);
            newOrder.setItems(orderItems);

            orderService.placeOrder(newOrder);

            return ResponseEntity.ok(Map.of("message", "Equipment order placed successfully!"));
        } catch (Exception e) {
            System.err.println("Error confirming equipment order: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }
}