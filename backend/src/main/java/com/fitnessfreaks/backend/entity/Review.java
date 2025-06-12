package com.fitnessfreaks.backend.entity;
import jakarta.persistence.*;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int rating;
    private String message;
    private String imageUrl;

    // Default constructor
    public Review() {}

    // Constructor with fields
    public Review(String name, int rating, String message, String imageUrl) {
        this.name = name;
        this.rating = rating;
        this.message = message;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", rating=" + rating +
                ", message='" + message + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}


