package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.User;
import com.fitnessfreaks.backend.service.UserService;
import com.fitnessfreaks.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/users")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
     
     @Value("${frontend.url}")
    private String frontendUrl;


    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JavaMailSender mailSender;

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
        try {
            userService.deleteByEmail(email);
            return Map.of("message", "User deleted");
        } catch (Exception e) {
            // Log the exception for debugging purposes (e.g., using a logger like SLF4J/Logback)
            System.err.println("Error deleting user: " + e.getMessage());
            // You might want to return a more specific error message based on the exception type
            return Map.of("message", "Failed to delete user: " + e.getMessage());
        }
    }

    @PostMapping("/send-cart")
    public Map<String, String> sendCart(@RequestBody Map<String, Object> payload) {
        logger.info("Received send-cart request: {}", payload);
        String email = (String) payload.get("email");
        List<Map<String, Object>> cart = (List<Map<String, Object>>) payload.get("cart");

        if (email == null || cart == null) {
            logger.warn("Invalid input: email or cart missing");
            return Map.of("message", "Email and cart are required.");
        }

        User user = userService.getUserByEmail(email);
        if (user == null) {
            logger.warn("User not found for email: {}", email);
            return Map.of("message", "User not found.");
        }

        // Build plain text for fallback
        StringBuilder plainText = new StringBuilder();
        double totalCalories = 0;
        for (Map<String, Object> item : cart) {
            String itemName = (String) item.get("item");
            Number calories = (Number) item.get("calories");
            if (itemName == null || calories == null) {
                logger.warn("Invalid cart item: {}", item);
                return Map.of("message", "Invalid cart item format.");
            }
            plainText.append(itemName).append(": ").append(calories).append(" kcal\n");
            totalCalories += calories.doubleValue();
        }
        plainText.append("\nTotal Calories: ").append(totalCalories).append(" kcal");

        // Build HTML email
        StringBuilder htmlContent = new StringBuilder();
        htmlContent.append("<!DOCTYPE html>")
                .append("<html><head>")
                .append("<meta charset='UTF-8'>")
                .append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
                .append("<style>")
                .append("body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }")
                .append(".container { max-width: 600px; margin: 20px auto; background-color: #111; color: #fff; border-radius: 8px; overflow: hidden; }")
                .append(".header { background-color: #ebeb4b; color: #111; padding: 20px; text-align: center; }")
                .append(".header h1 { margin: 0; font-size: 24px; }")
                .append(".content { padding: 20px; }")
                .append("h2 { color: #ebeb4b; font-size: 20px; margin-top: 0; }")
                .append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }")
                .append("th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ebeb4b; }")
                .append("th { background-color: #222; color: #ebeb4b; }")
                .append("td { color: #ddd; }")
                .append(".total { font-weight: bold; color: #ebeb4b; }")
                .append(".footer { text-align: center; padding: 20px; font-size: 14px; color: #aaa; }")
                .append("@media (max-width: 600px) { .container { margin: 10px; } th, td { font-size: 14px; padding: 8px; } }")
                .append("</style>")
                .append("</head><body>")
                .append("<div class='container'>")
                .append("<div class='header'><h1>Fitness Freaks</h1></div>")
                .append("<div class='content'>")
                .append("<h2>Hello ").append(user.getUsername()).append(",</h2>")
                .append("<p>Here is your selected diet plan:</p>")
                .append("<table>")
                .append("<tr><th>Item</th><th>Calories</th></tr>");

        for (Map<String, Object> item : cart) {
            String itemName = (String) item.get("item");
            Number calories = (Number) item.get("calories");
            htmlContent.append("<tr><td>").append(itemName).append("</td><td>").append(calories).append(" kcal</td></tr>");
        }

        htmlContent.append("</table>")
                .append("<p class='total'>Total Calories: ").append(totalCalories).append(" kcal</p>")
                .append("<p>Stay healthy!</p>")
                .append("</div>")
               .append("<div class='footer'>Fitness Freaks Team | " +
        "<a href='" + frontendUrl + "' style='color: #ebeb4b;'>Visit Us</a></div>")

                .append("</div></body></html>");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Your Fitness Freaks Daily Diet Plan");
            helper.setText(String.format("Hello %s,\n\nHere is your selected diet plan:\n\n%s\n\nStay healthy!\nFitness Freaks Team", user.getUsername(), plainText.toString()), htmlContent.toString());
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", email);
            return Map.of("message", "Diet plan sent to your email successfully.");
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", email, e.getMessage());
            return Map.of("message", "Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        User user = userService.getUserByEmail(email);
        
        if (user == null) {
            return Map.of("message", "If an account exists with this email, you will receive a password reset link.");
        }

        // Generate a unique token
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userService.saveUser(user);

        // Create reset link
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        // Send email with reset link
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Reset Your Fitness Freaks Password");
            
            String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                "<h2 style='color: #ebeb4b;'>Reset Your Password</h2>" +
                "<p>Hello %s,</p>" +
                "<p>We received a request to reset your password. Click the button below to reset it:</p>" +
                "<a href='%s' style='display: inline-block; background-color: #ebeb4b; color: #111; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;'>Reset Password</a>" +
                "<p>If you didn't request this, you can safely ignore this email.</p>" +
                "<p>This link will expire in 1 hour.</p>" +
                "<p>Best regards,<br>Fitness Freaks Team</p>" +
                "</div>",
                user.getUsername(),
                resetLink
            );

            helper.setText(
                String.format(
                    "Hello %s,\n\n" +
                    "We received a request to reset your password. Click the link below to reset it:\n\n" +
                    "%s\n\n" +
                    "If you didn't request this, you can safely ignore this email.\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "Best regards,\n" +
                    "Fitness Freaks Team",
                    user.getUsername(),
                    resetLink
                ),
                htmlContent
            );
            
            mailSender.send(message);
            return Map.of("message", "If an account exists with this email, you will receive a password reset link.");
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to {}: {}", email, e.getMessage());
            return Map.of("message", "Failed to send reset email. Please try again later.");
        }
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        User user = userService.getUserByResetToken(token);
        if (user == null) {
            return Map.of("message", "Invalid or expired reset token.");
        }

        // Update password and clear reset token
        user.setPassword(newPassword); // Note: Make sure to hash the password in UserService
        user.setResetToken(null);
        userService.saveUser(user);

        return Map.of("message", "Password has been reset successfully.");
    }
}
