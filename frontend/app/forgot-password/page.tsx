"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset instructions have been sent to your email.");
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <h2>Forgot Password</h2>
          <p>Enter your email address to reset your password</p>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="focus-border"></span>
            </div>
            {message && (
              <div 
                className="message" 
                style={{ 
                  margin: "15px 0", 
                  color: message.includes("sent") ? "green" : "red",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: message.includes("sent") ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"
                }}
              >
                {message}
              </div>
            )}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p className="signuplink">
            Remember your password? <Link href="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 