package com.fitnessfreaks.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.Map;
import java.time.DayOfWeek;
import java.time.LocalDate;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private ObjectMapper objectMapper;

    // Daily workout variations for each category
    private final Map<String, Map<DayOfWeek, List<String>>> dailyWorkouts = Map.of(
        "ABS", Map.of(
            DayOfWeek.MONDAY, List.of("Hanging Knees - 3 sets of 12 reps", "Decline Crunch - 3 sets of 15 reps", "Plank - 3 sets of 45 seconds"),
            DayOfWeek.TUESDAY, List.of("Hanging Leg Raises - 3 sets of 10 reps", "Russian Twist - 3 sets of 20 reps", "Abs Rollout - 3 sets of 12 reps"),
            DayOfWeek.WEDNESDAY, List.of("Decline Crunch - 4 sets of 15 reps", "Plank - 3 sets of 60 seconds", "Hanging Knees - 3 sets of 15 reps"),
            DayOfWeek.THURSDAY, List.of("Russian Twist - 4 sets of 20 reps", "Abs Rollout - 3 sets of 15 reps", "Hanging Leg Raises - 3 sets of 12 reps"),
            DayOfWeek.FRIDAY, List.of("Plank - 4 sets of 45 seconds", "Hanging Knees - 3 sets of 15 reps", "Decline Crunch - 3 sets of 20 reps"),
            DayOfWeek.SATURDAY, List.of("Abs Rollout - 4 sets of 12 reps", "Russian Twist - 3 sets of 25 reps", "Hanging Leg Raises - 3 sets of 15 reps"),
            DayOfWeek.SUNDAY, List.of("Plank - 3 sets of 60 seconds", "Decline Crunch - 3 sets of 20 reps", "Abs Rollout - 3 sets of 15 reps")
        ),
        "CHEST", Map.of(
            DayOfWeek.MONDAY, List.of("Barbell Bench Press - 4 sets of 8-10 reps", "Dumbbell Bench Press - 3 sets of 10-12 reps", "Push-Up - 3 sets of 15 reps"),
            DayOfWeek.TUESDAY, List.of("Machine Chest Press - 4 sets of 10-12 reps", "Cable cross-overs - 3 sets of 12-15 reps", "Dips - 3 sets of 12 reps"),
            DayOfWeek.WEDNESDAY, List.of("Dumbbell Bench Press - 4 sets of 10-12 reps", "Push-Up - 4 sets of 15 reps", "Barbell Bench Press - 3 sets of 8-10 reps"),
            DayOfWeek.THURSDAY, List.of("Cable cross-overs - 4 sets of 12-15 reps", "Dips - 3 sets of 15 reps", "Machine Chest Press - 3 sets of 12 reps"),
            DayOfWeek.FRIDAY, List.of("Push-Up - 4 sets of 20 reps", "Barbell Bench Press - 3 sets of 10 reps", "Dumbbell Bench Press - 3 sets of 12 reps"),
            DayOfWeek.SATURDAY, List.of("Dips - 4 sets of 12 reps", "Cable cross-overs - 3 sets of 15 reps", "Machine Chest Press - 3 sets of 12 reps"),
            DayOfWeek.SUNDAY, List.of("Barbell Bench Press - 3 sets of 8-10 reps", "Push-Up - 3 sets of 15 reps", "Dips - 3 sets of 12 reps")
        ),
        "ARM", Map.of(
            DayOfWeek.MONDAY, List.of("Close-grip bench press - 4 sets of 8-10 reps", "Triceps Extension - 3 sets of 12 reps", "Barbell Curl - 3 sets of 10 reps"),
            DayOfWeek.TUESDAY, List.of("Cable overhead triceps extension - 4 sets of 12 reps", "Standing Biceps Cable Curl - 3 sets of 12-15 reps"),
            DayOfWeek.WEDNESDAY, List.of("Barbell Curl - 4 sets of 10 reps", "Close-grip bench press - 3 sets of 10 reps"),
            DayOfWeek.THURSDAY, List.of("Standing Biceps Cable Curl - 4 sets of 12-15 reps", "Triceps Extension - 3 sets of 15 reps"),
            DayOfWeek.FRIDAY, List.of("Triceps Extension - 4 sets of 12 reps", "Barbell Curl - 3 sets of 12 reps"),
            DayOfWeek.SATURDAY, List.of("Close-grip bench press - 3 sets of 10 reps", "Cable overhead triceps extension - 3 sets of 15 reps"),
            DayOfWeek.SUNDAY, List.of("Barbell Curl - 3 sets of 10 reps", "Standing Biceps Cable Curl - 3 sets of 12 reps")
        ),
        "LEG", Map.of(
            DayOfWeek.MONDAY, List.of("Leg extensions - 4 sets of 12 reps", "Leg press - 3 sets of 10 reps", "Squats - 3 sets of 8-10 reps"),
            DayOfWeek.TUESDAY, List.of("Adduction machine - 4 sets of 15 reps", "Barbell deadlift - 3 sets of 8 reps", "Leg extensions - 3 sets of 12 reps"),
            DayOfWeek.WEDNESDAY, List.of("Squats - 4 sets of 8-10 reps", "Leg press - 3 sets of 12 reps", "Adduction machine - 3 sets of 15 reps"),
            DayOfWeek.THURSDAY, List.of("Barbell deadlift - 4 sets of 8 reps", "Leg extensions - 3 sets of 15 reps", "Squats - 3 sets of 10 reps"),
            DayOfWeek.FRIDAY, List.of("Leg press - 4 sets of 10 reps", "Adduction machine - 3 sets of 12 reps", "Barbell deadlift - 3 sets of 8 reps"),
            DayOfWeek.SATURDAY, List.of("Squats - 3 sets of 8-10 reps", "Leg extensions - 3 sets of 12 reps", "Leg press - 3 sets of 10 reps"),
            DayOfWeek.SUNDAY, List.of("Barbell deadlift - 3 sets of 8 reps", "Adduction machine - 3 sets of 15 reps", "Squats - 3 sets of 10 reps")
        ),
        "SHOULDER", Map.of(
            DayOfWeek.MONDAY, List.of("Push-Press - 4 sets of 8-10 reps", "Lateral Raise - 3 sets of 12 reps", "Front Raise - 3 sets of 12 reps"),
            DayOfWeek.TUESDAY, List.of("Rear Delt Row - 4 sets of 12 reps", "Seated Dumbbell Press - 3 sets of 10 reps", "Arnold Press - 3 sets of 10 reps"),
            DayOfWeek.WEDNESDAY, List.of("Seated Dumbbell Press - 4 sets of 10 reps", "Lateral Raise - 3 sets of 15 reps", "Push-Press - 3 sets of 8-10 reps"),
            DayOfWeek.THURSDAY, List.of("Arnold Press - 4 sets of 10 reps", "Front Raise - 3 sets of 12 reps", "Rear Delt Row - 3 sets of 12 reps"),
            DayOfWeek.FRIDAY, List.of("Lateral Raise - 4 sets of 12 reps", "Push-Press - 3 sets of 10 reps", "Seated Dumbbell Press - 3 sets of 10 reps"),
            DayOfWeek.SATURDAY, List.of("Front Raise - 4 sets of 12 reps", "Arnold Press - 3 sets of 10 reps", "Lateral Raise - 3 sets of 12 reps"),
            DayOfWeek.SUNDAY, List.of("Rear Delt Row - 3 sets of 12 reps", "Seated Dumbbell Press - 3 sets of 10 reps", "Push-Press - 3 sets of 8-10 reps")
        ),
        "BACK", Map.of(
            DayOfWeek.MONDAY, List.of("Deadlift - 4 sets of 8 reps", "Pull-up - 3 sets of 10 reps", "Bent-over row - 3 sets of 10 reps"),
            DayOfWeek.TUESDAY, List.of("T-bar row - 4 sets of 10 reps", "Seated row - 3 sets of 12 reps", "Lat pull-down - 3 sets of 12 reps"),
            DayOfWeek.WEDNESDAY, List.of("Bent-over row - 4 sets of 10 reps", "Deadlift - 3 sets of 8 reps", "Pull-up - 3 sets of 12 reps"),
            DayOfWeek.THURSDAY, List.of("Lat pull-down - 4 sets of 12 reps", "T-bar row - 3 sets of 10 reps", "Seated row - 3 sets of 12 reps"),
            DayOfWeek.FRIDAY, List.of("Pull-up - 4 sets of 10 reps", "Bent-over row - 3 sets of 12 reps", "Deadlift - 3 sets of 8 reps"),
            DayOfWeek.SATURDAY, List.of("Seated row - 4 sets of 12 reps", "Lat pull-down - 3 sets of 12 reps", "T-bar row - 3 sets of 10 reps"),
            DayOfWeek.SUNDAY, List.of("Deadlift - 3 sets of 8 reps", "Pull-up - 3 sets of 10 reps", "Bent-over row - 3 sets of 10 reps")
        )
    );

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

    public void sendHtmlEmail(String to, String subject, String textContent, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(textContent, htmlContent);
            mailSender.send(message);
        } catch (MessagingException e) {
            // Fallback to plain text email if HTML fails
            sendEmail(to, subject, textContent);
        }
    }

    public void sendWelcomeEmail(String to, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Fitness Freaks!");
        message.setText("Hello " + username + ",\n\nWelcome to the Fitness Freaks platform!");
        mailSender.send(message);
    }

    public void sendOrderConfirmationEmail(String to, String username, String number, String address, List<String> items, double total, String expectedDate) {
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

    public void sendWorkoutPlanEmail(String to, String username, String category, List<String> exercises) {
        // Get today's day of week
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        
        // Get today's specific workout for the category
        List<String> dailyExercises = dailyWorkouts.get(category).get(today);
        
        StringBuilder messageText = new StringBuilder();
        messageText.append("Hello ").append(username).append(",\n\n");
        messageText.append("Here is your ").append(category).append(" workout plan for ").append(today).append("!\n\n");
        messageText.append("🏋️‍♂️ Today's Exercises:\n");
        for (String exercise : dailyExercises) {
            messageText.append("- ").append(exercise).append("\n");
        }
        messageText.append("\n\nStay fit and fabulous!\n\nCheers,\nFitness Freaks Team");

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
                .append(".workout-list { list-style-type: none; padding: 0; margin: 20px 0; }")
                .append(".workout-item { padding: 15px; margin: 10px 0; background-color: #222; border-radius: 4px; border-left: 4px solid #ebeb4b; }")
                .append(".workout-item:hover { background-color: #2a2a2a; transform: translateX(5px); transition: all 0.3s ease; }")
                .append(".footer { text-align: center; padding: 20px; font-size: 14px; color: #aaa; border-top: 1px solid #333; }")
                .append(".visit-btn { display: inline-block; background-color: #ebeb4b; color: #111; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; font-weight: bold; }")
                .append(".day-badge { display: inline-block; background-color: #ebeb4b; color: #111; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-left: 10px; }")
                .append("@media (max-width: 600px) { .container { margin: 10px; } }")
                .append("</style>")
                .append("</head><body>")
                .append("<div class='container'>")
                .append("<div class='header'><h1>Fitness Freaks</h1></div>")
                .append("<div class='content'>")
                .append("<h2>Hello ").append(username).append(",</h2>")
                .append("<p>Here is your personalized ").append(category).append(" workout plan for <span class='day-badge'>").append(today).append("</span>:</p>")
                .append("<ul class='workout-list'>");

        for (String exercise : dailyExercises) {
            htmlContent.append("<li class='workout-item'>").append(exercise).append("</li>");
        }

        htmlContent.append("</ul>")
                .append("<p>Remember to:</p>")
                .append("<ul class='workout-list'>")
                .append("<li class='workout-item'>Warm up properly before starting</li>")
                .append("<li class='workout-item'>Maintain proper form throughout each exercise</li>")
                .append("<li class='workout-item'>Stay hydrated during your workout</li>")
                .append("<li class='workout-item'>Take adequate rest between sets</li>")
                .append("</ul>")
                .append("<p>Stay fit and fabulous!</p>")
                .append("<a href='http://localhost:3000' class='visit-btn'>Visit Fitness Freaks</a>")
                .append("</div>")
                .append("<div class='footer'>Fitness Freaks Team | Your Partner in Fitness Journey</div>")
                .append("</div></body></html>");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Your " + category + " Workout Plan for " + today + " - Fitness Freaks");
            helper.setText(messageText.toString(), htmlContent.toString());
            mailSender.send(message);
        } catch (MessagingException e) {
            // Fallback to plain text email if HTML fails
            sendEmail(to, "Your " + category + " Workout Plan for " + today + " - Fitness Freaks", messageText.toString());
        }
    }

    /**
     * Get the daily workout exercises for a specific category and day
     * @param category The workout category (e.g., ABS, CHEST, ARM, etc.)
     * @param day The day of the week
     * @return List of exercises for the specified category and day, or null if not found
     */
    public List<String> getDailyWorkout(String category, DayOfWeek day) {
        Map<DayOfWeek, List<String>> categoryWorkouts = dailyWorkouts.get(category);
        if (categoryWorkouts == null) {
            return null;
        }
        return categoryWorkouts.get(day);
    }
}