package com.fitnessfreaks.backend.service;

import com.fitnessfreaks.backend.entity.User;
import com.fitnessfreaks.backend.repository.UserRepository;
import com.fitnessfreaks.backend.util.OtpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public String registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setOtp(OtpUtil.generateOtp());
        user.setVerified(false);
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), user.getOtp());
        return "OTP sent to your email!";
    }
    public String verifyOtp(String emailOrPhone, String otp) {
        Optional<User> userOpt = emailOrPhone.contains("@")
                ? userRepository.findByEmail(emailOrPhone)
                : userRepository.findByPhoneNumber(emailOrPhone);
        if (userOpt.isEmpty()) return "User not found.";
        User user = userOpt.get();
        if (user.getOtp().equals(otp)) {
            user.setVerified(true);
            userRepository.save(user);
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
            return "OTP verified successfully!";
        }
        return "Invalid OTP.";
    }
    public String loginAndSendOtp(String emailOrPhone, String password) {
        Optional<User> userOpt = emailOrPhone.contains("@")
                ? userRepository.findByEmail(emailOrPhone)
                : userRepository.findByPhoneNumber(emailOrPhone);
        if (userOpt.isEmpty()) return "User not found.";
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid credentials.";
        }
        user.setOtp(OtpUtil.generateOtp());
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), user.getOtp());
        return "OTP sent for verification.";
    }
    public String resendOtp(String emailOrPhone) {
        Optional<User> userOpt = emailOrPhone.contains("@")
                ? userRepository.findByEmail(emailOrPhone)
                : userRepository.findByPhoneNumber(emailOrPhone);
        if (userOpt.isEmpty()) return "User not found.";
        User user = userOpt.get();
        user.setOtp(OtpUtil.generateOtp());
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), user.getOtp());
        return "OTP resent to your email.";
    }
    public Optional<User> authenticate(String emailOrPhone, String password) {
        Optional<User> userOpt = emailOrPhone.contains("@")
                ? userRepository.findByEmail(emailOrPhone)
                : userRepository.findByPhoneNumber(emailOrPhone);
        return userOpt.filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public User getUserByPhone(String phone) {
        return userRepository.findByPhoneNumber(phone).orElse(null);
    }
    public void deleteByEmail(String email) {
        userRepository.deleteByEmail(email);
    }
} 