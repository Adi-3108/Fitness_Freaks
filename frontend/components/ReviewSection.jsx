"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Dialog from "../app/components/Dialog";

export default function ReviewSection() {
  // Always show only these three reviews on the homepage
  const fixedReviews = [
    {
      id: 1001,
      name: "Tushar",
      rating: 5,
      message: "Amazing gym with top-notch equipment and professional trainers. The atmosphere is motivating and the facilities are well-maintained. Highly recommended for anyone serious about fitness!",
      imageUrl: "/1.jpg",
    },
    {
      id: 1002,
      name: "Manan",
      rating: 4,
      message: "Great trainers and friendly environment! The workout plans are personalized and effective. The community here is supportive and welcoming. A perfect place to achieve your fitness goals.",
      imageUrl: "/2.jpg",
    },
    {
      id: 1003,
      name: "Rahul",
      rating: 5,
      message: "I achieved my fitness goals here! The trainers are knowledgeable and supportive. The equipment is modern and well-maintained. The atmosphere is motivating and the results are amazing.",
      imageUrl: "/3.jpg",
    },
  ];

  const [reviews, setReviews] = useState(fixedReviews);

  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [allBackendReviews, setAllBackendReviews] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState('info');

  // Fetch all backend reviews on mount and after every submission
  const fetchAllBackendReviews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reviews");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllBackendReviews(data);
        }
      }
    } catch (err) {
      console.error("Error fetching backend reviews:", err);
    }
  };

  useEffect(() => {
    fetchAllBackendReviews();
  }, []);

  // Calculate average rating from all backend reviews
  const calculateAverageRating = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) return 0;
    const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviewsList.length).toFixed(1);
  };

  // Get total number of reviews
  const getTotalReviews = (reviewsList) => {
    return reviewsList ? reviewsList.length : 0;
  };

  // Validate and sanitize image URL
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return "/1.jpg";
    }
    
    // If it's already a relative path, return as is
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // If it's a valid URL, return it
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (error) {
      // If URL is invalid, return default
      return "/1.jpg";
    }
  };

  // Handle image loading errors
  const handleImageError = (reviewId) => {
    setImageErrors(prev => new Set(prev).add(reviewId));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          rating: parseInt(rating),
          message,
        }),
      });
      if (res.ok) {
        setDialogMessage("Review submitted successfully! Thank you for your feedback.");
        setDialogType('success');
        setShowDialog(true);
        setName("");
        setRating("");
        setMessage("");
        // Fetch all backend reviews again to update average/count
        fetchAllBackendReviews();
      } else {
        const errorBody = await res.text();
        setDialogMessage(`Failed to submit review: ${errorBody}`);
        setDialogType('info');
        setShowDialog(true);
      }
    } catch (error) {
      setDialogMessage("Network error. Please check your connection and try again.");
      setDialogType('info');
      setShowDialog(true);
    }
  };

  return (
    <>
      <Dialog 
        isOpen={showDialog}
        message={dialogMessage}
        onClose={() => setShowDialog(false)}
        type={dialogType}
      />
      <section className="review" id="review">
        <div className="review-box">
          <h2 className="heading">
            Client <span>Reviews</span>
          </h2>
          {/* Average Rating Display (optional: you can use fixedReviews for this) */}
          <div className="average-rating-container">
            <div className="average-rating-box">
              <div className="average-rating-number">
                {calculateAverageRating(allBackendReviews)}
              </div>
              <div className="average-rating-stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={`avg-star-${i}`}
                    className={`bx bx-star ${i < Math.floor(Number(calculateAverageRating(allBackendReviews))) ? 'filled' : ''}`}
                  ></i>
                ))}
              </div>
              <div className="average-rating-text">
                Based on {getTotalReviews(allBackendReviews)} reviews
              </div>
            </div>
          </div>
          <div className="wrapper">
            {fixedReviews.map((review, index) => (
              <div className="review-item" key={`${review.id}-${index}`}>
                <div className="review-image-container">
                  <Image
                    src={imageErrors.has(review.id) ? "/1.jpg" : getValidImageUrl(review.imageUrl)}
                    alt={review.name}
                    width={150}
                    height={150}
                    onError={() => handleImageError(review.id)}
                    unoptimized={true}
                    className="review-image"
                  />
                </div>
                <h2>{review.name}</h2>
                <div className="rating">
                  {[...Array(Number(review.rating))].map((_, i) => (
                    <i className="bx bx-star" id="star" key={`${review.id}-star-${i}`}></i>
                  ))}
                </div>
                <p className="review-message">&quot;{review.message}&quot;</p>
              </div>
            ))}
          </div>
          {/* 👇 Submit Review Form */}
          <div className="review-form-container">
            <h3 className="review-form-title">Share Your Experience</h3>
            <p className="review-form-subtitle">Help others by sharing your fitness journey with us</p>
          <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
            <input
                    id="name"
              type="text"
                    placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
                </div>
                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <select
                    id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
                  >
                    <option value="">Select rating</option>
                    <option value="1">⭐ 1 Star</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Review</label>
            <textarea
                  id="message"
                  placeholder="Tell us about your experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
                  rows="4"
            />
              </div>
              <button type="submit" className="submit-review-btn">
                <i className="bx bx-send"></i>
                Submit Review
              </button>
          </form>
          </div>
        </div>
      </section>
    </>
  );
}
