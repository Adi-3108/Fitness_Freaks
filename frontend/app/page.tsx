"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ReviewSection from "@/components/ReviewSection";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Header />
      <section className="home" id="home">
        <div className="home-content">
          <h3 id="box">Build Your</h3>
          <h1>Dream Physique</h1>
          <h3>
            <span className="multiple-text">BodyBuilding</span>
          </h3>
          <p>Every Rep, Every Step you are one move closer to a stronger, healthier you. Start Your Journey Now!</p>

          <Link href="/join" className="btn">
            Join Us
          </Link>
        </div>

        <div className="home-img">
          <Image src="/home image.jpg" alt="Home image" width={600} height={400} />
        </div>

    </section>



      <section className="services" id="services">
        <h2 className="heading">
          Our <span>Services</span>
        </h2>

        <div className="services-content">
          <div className="row">
            <Image src="/image1.jpg" alt="Physical Fitness" width={400} height={300} />
            <h4>Physical Fitness</h4>
          </div>
          <div className="row">
            <Image src="/image2.jpg" alt="Weight Gain" width={400} height={300} />
            <h4>Weight Gain</h4>
          </div>
          <div className="row">
            <Image src="/image3.jpg" alt="Strength Training" width={400} height={300} />
            <h4>Strength Training</h4>
          </div>
          <div className="row">
            <Image src="/image4.jpg" alt="Fat Loss" width={400} height={300} />
            <h4>Fat Loss</h4>
          </div>
          <div className="row">
            <Image src="/image5.jpg" alt="Yoga Classes" width={400} height={300} />
            <h4>Yoga Classes</h4>
          </div>
          <div className="row">
            <Image src="/about.jpg" alt="Running" width={400} height={300} />
            <h4>Running</h4>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-img">
          <Image src="/about.jpg" alt="About Us" width={600} height={400} />
        </div>

        <div className="about-content">
          <h2 className="heading">Why Choose Us</h2>

          <p>
            Our Diverse membership base creates a friendly and supportive atmosphere, where you can make friends and
            stay motivated.
          </p>
          <p>
            Choose us for a results-driven fitness experience with top-tier trainers and innovative workout plans. Our
            state-of-the-art facilities create the perfect environment for reaching your goals. We&apos;re here to
            inspire, support, and challenge you!
          </p>
          <p>
            Experience the difference with customized workouts and world-class trainers committed to your success. Our
            gym provides a motivating environment where your goals become reality. Let&apos;s push limits together!
          </p>
          <p>
            With cutting-edge equipment and dedicated trainers, we&apos;re focused on delivering results. Whether
            you&apos;re just starting or a seasoned athlete, we offer the perfect space to challenge yourself and
            thrive!!!
          </p>

          <a href="#" className="btn">
            Book A Free Class
          </a>
        </div>
      </section>
       <section className="diet-plan" id="diet">
                        <h2 className="heading"><span>Diet </span>Importance</h2>

                        <div className="diet-content">
                          <div className="diet-text">
                            <p>
                             <span> A proper diet is just as essential as exercise when it comes to achieving your fitness
                              goals in the gym. While workouts help build strength, endurance, and muscle, it's your
                              diet that fuels these efforts and determines the results.</span>
                              </p>
                              <p>
                               Skipping meals or following unstructured diets can lead to fatigue, poor performance,
                              muscle loss, or even injury. Moreover, essential vitamins and minerals found in fruits
                             and vegetables enhance your immune system, keep your metabolism functioning optimally,
                             and contribute to better mental focus during training.
                            </p>
                          </div>
                          <div className="diet-img">
                            <Image src="/healthy.jpg" alt="Healthy Meal" width={500} height={350} />
                          </div>
                        </div>
                      </section>
      <section className="plans" id="plans">
        <h2 className="heading">
          Our <span>Plans</span>
        </h2>

        <div className="plans-content">
          <div className="box">
            <h3>BASIC</h3>
            <h2>
              <span>Rs800/Month</span>
            </h2>
            <ul>
              <li>Smart Workout Plan</li>
              <li>At Home Workout</li>
            </ul>
            <Link href="/join">
              Join Now
              <i className="bx bx-right-arrow-alt"></i>
            </Link>
          </div>
          <div className="box">
            <h3>PRO</h3>
            <h2>
              <span>Rs1000/Month</span>
            </h2>
            <ul>
              <li>Pro Gyms</li>
              <li>At Home Workout</li>
              <li>Smart Workout Plan</li>
            </ul>
            <Link href="/join">
              Join Now
              <i className="bx bx-right-arrow-alt"></i>
            </Link>
          </div>
          <div className="box">
            <h3>PREMIUM</h3>
            <h2>
              <span>Rs1500/Month</span>
            </h2>
            <ul>
              <li>Elite Gyms And Classes</li>
              <li>Pro GYMS</li>
              <li>Smart Workout Plan</li>
              <li>At Home Workout</li>
              <li>Personal Training</li>
            </ul>
            <Link href="/join">
              Join Now
              <i className="bx bx-right-arrow-alt"></i>
            </Link>
          </div>
        </div>
      </section>

     
      <ReviewSection />
      <Footer />
    </>
  )
}
