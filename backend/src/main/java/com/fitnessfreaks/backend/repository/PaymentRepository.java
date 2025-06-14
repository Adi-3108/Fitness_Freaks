package com.fitnessfreaks.backend.repository;

import com.fitnessfreaks.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserEmail(String email);
    Payment findByPaymentIntentId(String paymentIntentId);
} 