package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.User;
import com.fitnessfreaks.backend.service.UserService;
import com.fitnessfreaks.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        String msg = userService.registerUser(user);
        return Map.of("message", msg);
    }
    @PostMapping("/verify-otp")
    public Map<String, String> verifyOtp(@RequestBody Map<String, String> payload) {
        String emailOrPhone = payload.get("username");
        String otp = payload.get("otp");
        String msg = userService.verifyOtp(emailOrPhone, otp);
        return Map.of("message", msg);
    }
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> payload) {
        String emailOrPhone = payload.get("username");
        String password = payload.get("password");
        String msg = userService.loginAndSendOtp(emailOrPhone, password);
        return Map.of("message", msg);
    }
    @PostMapping("/resend-otp")
    public Map<String, String> resendOtp(@RequestBody Map<String, String> payload) {
        String emailOrPhone = payload.get("username");
        String msg = userService.resendOtp(emailOrPhone);
        return Map.of("message", msg);
    }
    @PostMapping("/details")
    public User getUserDetails(@RequestBody Map<String, String> payload) {
        String emailOrPhone = payload.get("username");
        return emailOrPhone.contains("@")
                ? userService.getUserByEmail(emailOrPhone)
                : userService.getUserByPhone(emailOrPhone);
    }
    @PostMapping("/send-cancel-code")
    public Map<String, Object> sendCancelCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);
        emailService.sendEmail(email, "Your OTP for Cancelling Fitness Freaks Subscription", "Your OTP for cancelling Fitness Freaks subscription is: " + code);
        return Map.of("message", "Code sent", "code", code);
    }
    @PostMapping("/cancel-subscription")
    public Map<String, String> cancelSubscription(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        userService.deleteByEmail(email);
        return Map.of("message", "User deleted");
    }
} 