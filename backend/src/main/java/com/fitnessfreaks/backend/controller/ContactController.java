package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.ContactMessage;
import com.fitnessfreaks.backend.repository.ContactMessageRepository;
import com.fitnessfreaks.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String subject = payload.get("subject");
        String message = payload.get("message");

        // Validate input
        if (name == null || email == null || subject == null || message == null ||
            name.trim().isEmpty() || email.trim().isEmpty() || subject.trim().isEmpty() || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        }

        // Create contact message
        ContactMessage contactMessage = new ContactMessage(name, email, subject, message);
        contactMessageRepository.save(contactMessage);

        // Send confirmation email to user
        try {
            String userHtmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            margin: 0; 
                            padding: 0; 
                            background: linear-gradient(135deg, #232526 0%, #414345 100%);
                            color: #ffffff;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 20px auto; 
                            background: #1a1a1a; 
                            border-radius: 20px; 
                            overflow: hidden; 
                            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                        }
                        .header { 
                            background: linear-gradient(135deg, #ebeb4b 0%, #dcdc3f 100%); 
                            color: #000; 
                            padding: 40px 30px; 
                            text-align: center; 
                            position: relative;
                        }
                        .header::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 4px;
                            background: linear-gradient(90deg, #4ecdc4, #ebeb4b, #ff6b6b);
                        }
                        .header h1 { 
                            margin: 0; 
                            font-size: 32px; 
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                        .header p {
                            margin: 10px 0 0 0;
                            font-size: 16px;
                            opacity: 0.8;
                        }
                        .content { 
                            padding: 40px 30px; 
                            background: #1a1a1a;
                        }
                        .message-box {
                            background: rgba(235, 235, 75, 0.1);
                            border: 2px solid rgba(235, 235, 75, 0.3);
                            border-radius: 15px;
                            padding: 25px;
                            margin: 25px 0;
                        }
                        .message-box h3 {
                            color: #ebeb4b;
                            margin-top: 0;
                            font-size: 20px;
                        }
                        .message-details {
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 10px;
                            padding: 20px;
                            margin: 20px 0;
                        }
                        .message-details p {
                            margin: 8px 0;
                            font-size: 16px;
                        }
                        .message-details strong {
                            color: #ebeb4b;
                        }
                        .footer { 
                            text-align: center; 
                            padding: 30px; 
                            background: #111;
                            border-top: 1px solid rgba(235, 235, 75, 0.2);
                        }
                        .footer p {
                            margin: 5px 0;
                            font-size: 14px;
                            opacity: 0.7;
                        }
                        @media (max-width: 600px) {
                            .container { margin: 10px; }
                            .header, .content { padding: 20px; }
                            .header h1 { font-size: 24px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Fitness Freaks</h1>
                            <p>Thank You for Contacting Us</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #ebeb4b; margin-top: 0;">Hello %s! 👋</h2>
                            
                            <p>Thank you for reaching out to Fitness Freaks! We have received your message and our team will get back to you within 24 hours.</p>
                            
                            <div class="message-box">
                                <h3>📧 Your Message Details:</h3>
                                <div class="message-details">
                                    <p><strong>Subject:</strong> %s</p>
                                    <p><strong>Message:</strong></p>
                                    <p style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 10px 0;">%s</p>
                                </div>
                            </div>
                            
                            <p>We appreciate your interest in Fitness Freaks and look forward to helping you achieve your fitness goals!</p>
                            
                            <p style="color: #ebeb4b; font-weight: 600;">What happens next?</p>
                            <ul style="line-height: 1.8;">
                                <li>Our team will review your message within 24 hours</li>
                                <li>You'll receive a detailed response via email</li>
                                <li>If needed, we may follow up with additional questions</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p><strong>Fitness Freaks Team</strong></p>
                            <p>Building stronger, healthier lives together</p>
                            <p style="font-size: 12px; margin-top: 20px;">
                                This is an automated confirmation. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                    name.replace("<", "&lt;").replace(">", "&gt;"),
                    subject.replace("<", "&lt;").replace(">", "&gt;"),
                    message.replace("<", "&lt;").replace(">", "&gt;")
                );
            
            emailService.sendHtmlEmail(email, 
                "Thank You for Contacting Fitness Freaks - We'll Get Back to You Soon! 📧", 
                "Hello " + name + ",\n\nThank you for contacting Fitness Freaks! We have received your message and will get back to you within 24 hours.\n\nYour message:\nSubject: " + subject + "\nMessage: " + message + "\n\nBest regards,\nFitness Freaks Team", 
                userHtmlContent
            );
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
            // Continue with admin notification even if user email fails
        }

        // Send notification email to admin
        try {
            String adminHtmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            margin: 0; 
                            padding: 0; 
                            background: linear-gradient(135deg, #232526 0%, #414345 100%);
                            color: #ffffff;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 20px auto; 
                            background: #1a1a1a; 
                            border-radius: 20px; 
                            overflow: hidden; 
                            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                        }
                        .header { 
                            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); 
                            color: #fff; 
                            padding: 40px 30px; 
                            text-align: center; 
                            position: relative;
                        }
                        .header::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 4px;
                            background: linear-gradient(90deg, #ff6b6b, #ebeb4b, #4ecdc4);
                        }
                        .header h1 { 
                            margin: 0; 
                            font-size: 32px; 
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                        .header p {
                            margin: 10px 0 0 0;
                            font-size: 16px;
                            opacity: 0.9;
                        }
                        .content { 
                            padding: 40px 30px; 
                            background: #1a1a1a;
                        }
                        .alert-box {
                            background: rgba(255, 107, 107, 0.1);
                            border: 2px solid rgba(255, 107, 107, 0.3);
                            border-radius: 15px;
                            padding: 25px;
                            margin: 25px 0;
                        }
                        .alert-box h3 {
                            color: #ff6b6b;
                            margin-top: 0;
                            font-size: 22px;
                        }
                        .message-details {
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 10px;
                            padding: 20px;
                            margin: 20px 0;
                        }
                        .message-details p {
                            margin: 8px 0;
                            font-size: 16px;
                        }
                        .message-details strong {
                            color: #ebeb4b;
                        }
                        .cta-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                            color: #fff;
                            padding: 12px 25px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            margin: 15px 0;
                            transition: all 0.3s ease;
                        }
                        .cta-button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
                        }
                        .footer { 
                            text-align: center; 
                            padding: 30px; 
                            background: #111;
                            border-top: 1px solid rgba(255, 107, 107, 0.2);
                        }
                        .footer p {
                            margin: 5px 0;
                            font-size: 14px;
                            opacity: 0.7;
                        }
                        @media (max-width: 600px) {
                            .container { margin: 10px; }
                            .header, .content { padding: 20px; }
                            .header h1 { font-size: 24px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Contact Message</h1>
                            <p>Action Required - Customer Inquiry Received</p>
                        </div>
                        <div class="content">
                            <div class="alert-box">
                                <h3>🚨 New Contact Form Submission</h3>
                                <p>A new message has been submitted through the Fitness Freaks contact form. Please review and respond within 24 hours.</p>
                            </div>
                            
                            <div class="message-details">
                                <h3 style="color: #ebeb4b; margin-top: 0;">📋 Message Details:</h3>
                                <p><strong>From:</strong> %s</p>
                                <p><strong>Email:</strong> %s</p>
                                <p><strong>Subject:</strong> %s</p>
                                <p><strong>Submitted:</strong> %s</p>
                                <p><strong>Message:</strong></p>
                                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ebeb4b;">
                                    %s
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="mailto:%s?subject=Re: %s" class="cta-button">
                                    📧 Reply to Customer
                                </a>
                            </div>
                            
                            <p style="color: #ebeb4b; font-weight: 600;">Quick Actions:</p>
                            <ul style="line-height: 1.8;">
                                <li>Reply directly to the customer's email</li>
                                <li>Check if this is a common question for FAQ updates</li>
                                <li>Follow up if no response within 24 hours</li>
                                <li>Mark as resolved in the admin dashboard</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p><strong>Fitness Freaks Admin</strong></p>
                            <p>Automated notification system</p>
                            <p style="font-size: 12px; margin-top: 20px;">
                                This is an automated notification. Please respond to the customer directly.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                    name.replace("<", "&lt;").replace(">", "&gt;"),
                    email.replace("<", "&lt;").replace(">", "&gt;"),
                    subject.replace("<", "&lt;").replace(">", "&gt;"),
                    contactMessage.getCreatedAt(),
                    message.replace("<", "&lt;").replace(">", "&gt;"),
                    email.replace("<", "&lt;").replace(">", "&gt;"),
                    subject.replace("<", "&lt;").replace(">", "&gt;")
                );
            
            emailService.sendHtmlEmail("axyz97836@gmail.com", 
                "New Contact Message from " + name + " - Fitness Freaks", 
                "New contact form submission:\n\nName: " + name + "\nEmail: " + email + "\nSubject: " + subject + "\nMessage: " + message + "\n\nSubmitted at: " + contactMessage.getCreatedAt(), 
                adminHtmlContent
            );
        } catch (Exception e) {
            System.err.println("Failed to send admin notification: " + e.getMessage());
            // Continue even if admin notification fails
        }

        return ResponseEntity.ok(Map.of("message", "Message sent successfully! We'll get back to you soon."));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/messages/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        List<ContactMessage> messages = contactMessageRepository.findByIsReadFalseOrderByCreatedAtDesc();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/messages/count/unread")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = contactMessageRepository.countByIsReadFalse();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id) {
        ContactMessage message = contactMessageRepository.findById(id).orElse(null);
        if (message == null) {
            return ResponseEntity.notFound().build();
        }

        message.setIsRead(true);
        message.setReadAt(java.time.LocalDateTime.now());
        contactMessageRepository.save(message);

        return ResponseEntity.ok(Map.of("message", "Message marked as read"));
    }
} 