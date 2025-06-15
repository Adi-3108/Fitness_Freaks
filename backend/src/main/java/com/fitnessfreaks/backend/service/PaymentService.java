package com.fitnessfreaks.backend.service;

import com.fitnessfreaks.backend.entity.Payment;
import com.fitnessfreaks.backend.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Service
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3005"})
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            @Value("${stripe.secret.key}") String stripeSecretKey) {
        this.paymentRepository = paymentRepository;
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntent createPaymentIntent(Integer amount, String email) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount * 100L) // Convert to cents
                .setCurrency("inr")
                .setReceiptEmail(email)
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Save payment record
        Payment payment = new Payment();
        payment.setUserEmail(email);
        payment.setAmount(amount);
        payment.setCurrency("inr");
        payment.setPaymentStatus("pending");
        payment.setPaymentIntentId(paymentIntent.getId());
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return paymentIntent;
    }

    public void handleSuccessfulPayment(String paymentIntentId) {
        Payment payment = paymentRepository.findByPaymentIntentId(paymentIntentId);
        if (payment != null) {
            payment.setPaymentStatus("succeeded");
            paymentRepository.save(payment);
        }
    }
} 