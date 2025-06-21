package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.Review;
import com.fitnessfreaks.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        try {
            List<Review> reviews = reviewRepository.findAll();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("Error fetching reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        try {
            System.out.println("Received review: " + review);
            
            // Validate the review data
            if (review.getName() == null || review.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (review.getRating() < 1 || review.getRating() > 5) {
                return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
            }
            if (review.getMessage() == null || review.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Message is required");
            }
            
        Review savedReview = reviewRepository.save(review);
            System.out.println("Saved review: " + savedReview);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating review: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create review: " + e.getMessage());
        }
    }
}
