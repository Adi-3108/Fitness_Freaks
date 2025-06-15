package com.fitnessfreaks.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        sendEmail(to, "Your OTP for Fitness Freaks", "Your OTP is: " + otp);
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Fitness Freaks!");
        message.setText("Hello " + username + ",\n\nWelcome to the Fitness Freaks platform!");
        mailSender.send(message);
    }

    public void sendOrderConfirmationEmail(String to, String username,String number, String address, List<String> items, double total, String expectedDate) {
    StringBuilder messageText = new StringBuilder();
    messageText.append("Hello ").append(username).append(",\n\n");
    messageText.append("Thank you for your order on Fitness Freaks!\n\n");
    messageText.append("📦 Items Ordered:\n");
    for (String item : items) {
        messageText.append("- ").append(item).append("\n");
    }
    messageText.append("\nTotal Price: ₹").append(total);
    messageText.append("\nDelivery Address: ").append(address);
    messageText.append("\nContact No:").append(number); 
    messageText.append("\nEstimated Delivery Date: ").append(expectedDate);
    messageText.append("\n\nWe hope you stay fit and fabulous!\n\nCheers,\nFitness Freaks Team");

    sendEmail(to, "Order Confirmation - Fitness Freaks", messageText.toString());
}

}