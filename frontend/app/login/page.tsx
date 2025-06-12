"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Dialog from "../components/Dialog";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message && data.message.includes("OTP sent")) {
        setShowOtpDialog(true);
        localStorage.setItem("username", formData.username); // Save for OTP verification
        // After OTP verification, user info will be saved in localStorage
      } else if (response.ok && data.message && data.message.toLowerCase().includes("verified")) {
        // If login directly verifies (for future), fetch user details
        const userRes = await fetch(`http://localhost:8080/api/users/details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: formData.username }),
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          localStorage.setItem("user", JSON.stringify(userData));
        }
        router.push("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  };

  const handleOtpDialogClose = () => {
    setShowOtpDialog(false);
    router.push("/verify-otp");
  };

  return (
    <>
      <Dialog 
        isOpen={showOtpDialog}
        message="An OTP has been sent to your registered Email for Verification"
        onClose={handleOtpDialogClose}
      />
      <div
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Inter", sans-serif',
          background:
            "linear-gradient(135deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--text-color)",
          overflow: "hidden",
        }}
      >
        <div className="loginL1">
          <div className="L2">
            <h2>Welcome Back!</h2>
            <p>Log in to access your dashboard</p>
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your Registered Email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <span className="focus-border"></span>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="borderr"></span>
              </div>
              <div className="options">
                <label>
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />{" "}
                  Remember Me
                </label>
                <a href="/forgot-password">Forgot Password?</a>
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
            <p className="signuplink">
              Don&apos;t have an account? <Link href="/join">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
