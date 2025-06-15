"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"
import Link from "next/link"

export default function AboutUs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("user"))
    }
  }, [])

  return (
    <>
      <Header />

      
      <section className="about-us py-5" style={{ marginTop: "100px", padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="row" style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
            <div className="col-md-6" style={{ flex: "1", minWidth: "300px" }}>
              <h2 className="display-5" style={{ fontSize: "3.5rem", marginBottom: "20px" }}>
                About Us
              </h2>
              <p>
                Welcome to <strong>Fitness Freaks</strong>, your destination for fitness excellence. Our team is
                dedicated to helping you achieve your health and fitness goals through personalized training, expert
                guidance, and a supportive community.
              </p>
              <p>
                Whether you&apos;re here to lose weight, build muscle, or just stay active, we have everything you need
                to succeed. Join us today and be part of a thriving fitness family that inspires each other to reach new
                heights!
              </p>
              {!isLoggedIn && (
                <Link href="/join" className="btn mt-3" style={{ marginTop: "20px" }}>
                  Join Us
                </Link>
              )}
            </div>
            <div className="col-md-6" style={{ flex: "1", minWidth: "300px" }}>
              <Image
                src="/about.jpg"
                alt="Gym image"
                width={500}
                height={300}
                className="img-fluid rounded"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="mission bg-light py-5" style={{ background: "var(--snd-bg-color)", padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="row" style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
            <div className="col-md-6" style={{ flex: "1", minWidth: "300px" }}>
              <Image
                src="/about.jpg"
                alt="Mission image"
                width={500}
                height={300}
                className="img-fluid rounded"
                style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              />
            </div>
            <div className="col-md-6" style={{ flex: "1", minWidth: "300px" }}>
              <h2 className="display-6" style={{ fontSize: "3rem", marginBottom: "20px" }}>
                Our Mission
              </h2>
              <p>
                Our mission is to empower individuals to lead healthier and happier lives. We believe in fostering a
                positive environment where everyone, regardless of age or fitness level, feels motivated to push their
                boundaries.
              </p>
              <p>
                With state-of-the-art facilities, expert trainers, and diverse programs, <strong>Fitness Freaks</strong>{" "}
                is committed to supporting our members&apos; journey to better health and well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="team py-5" style={{ padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="text-center mb-5" style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 className="display-5" style={{ fontSize: "3.5rem", marginBottom: "10px" }}>
              Meet Our Team
            </h2>
            <p>Our experienced trainers and staff are here to guide and support you every step of the way.</p>
          </div>
          <div className="row" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            <div
              className="col-lg-4 col-md-6 mb-4"
              style={{ flex: "0 0 calc(33.333% - 20px)", minWidth: "300px", marginBottom: "30px" }}
            >
              <div
                className="card"
                style={{ background: "var(--snd-bg-color)", borderRadius: "10px", overflow: "hidden" }}
              >
                <Image
                  src="/1.jpg"
                  className="card-img-top"
                  alt="Trainer 1"
                  width={300}
                  height={300}
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="card-body text-center" style={{ padding: "20px", textAlign: "center" }}>
                  <h5 className="card-title" style={{ fontSize: "1.8rem", marginBottom: "5px" }}>
                    John Doe
                  </h5>
                  <p className="card-text" style={{ fontSize: "1.4rem" }}>
                    Certified Personal Trainer
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 mb-4"
              style={{ flex: "0 0 calc(33.333% - 20px)", minWidth: "300px", marginBottom: "30px" }}
            >
              <div
                className="card"
                style={{ background: "var(--snd-bg-color)", borderRadius: "10px", overflow: "hidden" }}
              >
                <Image
                  src="/2.jpg"
                  className="card-img-top"
                  alt="Trainer 2"
                  width={300}
                  height={300}
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="card-body text-center" style={{ padding: "20px", textAlign: "center" }}>
                  <h5 className="card-title" style={{ fontSize: "1.8rem", marginBottom: "5px" }}>
                    Jane Smith
                  </h5>
                  <p className="card-text" style={{ fontSize: "1.4rem" }}>
                    Yoga Instructor
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 mb-4"
              style={{ flex: "0 0 calc(33.333% - 20px)", minWidth: "300px", marginBottom: "30px" }}
            >
              <div
                className="card"
                style={{ background: "var(--snd-bg-color)", borderRadius: "10px", overflow: "hidden" }}
              >
                <Image
                  src="/3.jpg"
                  className="card-img-top"
                  alt="Trainer 3"
                  width={300}
                  height={300}
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="card-body text-center" style={{ padding: "20px", textAlign: "center" }}>
                  <h5 className="card-title" style={{ fontSize: "1.8rem", marginBottom: "5px" }}>
                    Alex Brown
                  </h5>
                  <p className="card-text" style={{ fontSize: "1.4rem" }}>
                    Strength & Conditioning Coach
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
