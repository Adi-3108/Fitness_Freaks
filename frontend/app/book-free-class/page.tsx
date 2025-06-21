"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dialog from "../components/Dialog";
import Image from "next/image";

const classTypes = [
  "Yoga",
  "HIIT",
  "Strength Training",
  "Zumba",
  "Pilates",
  "Cardio",
];

export default function BookFreeClass() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    classType: classTypes[0],
  });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setDialogMessage("Your free class has been booked! Check your email for confirmation.");
      setShowDialog(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        classType: classTypes[0],
      });
    }, 1200);
  };

  return (
    <>
      <Header />
      <Dialog
        isOpen={showDialog}
        message={dialogMessage}
        onClose={() => setShowDialog(false)}
        type="success"
      />
      {/* Hero Section */}
      <section
        style={{
          marginTop: 0,
          padding: 0,
          minHeight: 320,
          background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/about.jpg"
          alt="Free Class Hero"
          fill
          style={{ objectFit: "cover", opacity: 0.25, zIndex: 1 }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "#fff",
            width: "100%",
            padding: "80px 0 40px 0",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: 2, color: "#ebeb4b", marginBottom: 12 }}>
            Book a Free Class
          </h1>
          <p style={{ fontSize: 22, maxWidth: 600, margin: "0 auto", color: "#fff", opacity: 0.95 }}>
            Experience our world-class trainers and facilities for free! Fill out the form below to reserve your spot in a group or personal class.
          </p>
        </div>
      </section>
      {/* Form Section */}
      <section style={{ background: "#181818", padding: "0 0 60px 0" }}>
        <div
          style={{
            maxWidth: 600,
            margin: "-80px auto 0 auto",
            background: "rgba(35,37,38,0.98)",
            borderRadius: 24,
            boxShadow: "0 8px 32px rgba(235,235,75,0.18)",
            padding: 40,
            position: "relative",
            zIndex: 3,
            border: "2px solid #ebeb4b",
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: 32, marginBottom: 24, color: "#ebeb4b", fontWeight: 700, letterSpacing: 1 }}>
            Reserve Your Free Spot
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, color: "#ebeb4b", fontSize: 18 }}>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #ebeb4b", marginTop: 8, background: "#232526", color: "#fff", fontSize: 18 }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, color: "#ebeb4b", fontSize: 18 }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #ebeb4b", marginTop: 8, background: "#232526", color: "#fff", fontSize: 18 }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, color: "#ebeb4b", fontSize: 18 }}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit number"
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #ebeb4b", marginTop: 8, background: "#232526", color: "#fff", fontSize: 18 }}
              />
            </div>
            <div style={{ marginBottom: 22, display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, color: "#ebeb4b", fontSize: 18 }}>Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #ebeb4b", marginTop: 8, background: "#232526", color: "#fff", fontSize: 18 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, color: "#ebeb4b", fontSize: 18 }}>Preferred Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #ebeb4b", marginTop: 8, background: "#232526", color: "#fff", fontSize: 18 }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontWeight: 600, color: "#ebeb4b", fontSize: 18 }}>Class Type</label>
              <select
                name="classType"
                value={form.classType}
                onChange={handleChange}
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1.5px solid #ebeb4b", marginTop: 8, background: "#232526", color: "#fff", fontSize: 18 }}
              >
                {classTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn"
              style={{ width: "100%", padding: 18, fontSize: 22, background: "#ebeb4b", color: "#232526", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1, boxShadow: "0 2px 12px rgba(235,235,75,0.12)" }}
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Free Class"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
} 