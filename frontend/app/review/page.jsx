"use client"
import { useEffect, useState } from "react";
import Image from "next/image";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, []);

  return (
    <section className="review" id="review">
      <div className="review-box">
        <h2 className="heading">
          Client <span>Reviews</span>
        </h2>
        <div className="wrapper">
          {reviews.map((rev, index) => (
            <div className="review-item" key={index}>
              <Image
                src={rev.imageUrl || "/default.jpg"}
                alt={rev.name}
                width={150}
                height={150}
              />
              <h2>{rev.name}</h2>
              <div className="rating">
                {[...Array(rev.rating)].map((_, i) => (
                  <i className="bx bx-star" id="star" key={i}></i>
                ))}
              </div>
              <p>&quot;{rev.message}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
