"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "../components/Dialog";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  let username = "";
  if (typeof window !== "undefined") {
    username = localStorage.getItem("username") || "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp }),
      });
      const data = await res.json();
      if (res.ok && data.message?.toLowerCase().includes("verified")) {
        const userRes = await fetch("http://localhost:8080/api/users/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          localStorage.setItem("user", JSON.stringify(userData));
        }
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowWelcome(true);
        }, 1200);
        setTimeout(() => {
          setShowWelcome(false);
          localStorage.removeItem("username");
          router.push("/");
        }, 3500);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/users/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (res.ok) {
        setError("OTP resent! Check your email.");
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError("Failed to resend OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        isOpen={showSuccess}
        message="OTP Verified Successfully!"
        onClose={() => setShowSuccess(false)}
        type="success"
      />
      <Dialog 
        isOpen={showWelcome}
        message="Thank you for choosing Us and Welcome to Fitness Freaks"
        onClose={() => setShowWelcome(false)}
        type="welcome"
      />
      <div
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "apple-system, sans-serif",
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
        <div
          style={{
            background: "#111111",
            borderRadius: 20,
            boxShadow: "0 8px 32px #ebeb4b",
            border: "1px solid #ebeb4b",
            padding: 32,
            minWidth: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <h2 style={{ marginBottom: 16, color: "#ebeb4b", fontSize: "22px" }}>
            OTP Verification
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              style={{
                padding: 12,
                fontSize: 18,
                borderRadius: 8,
                border: error ? "2px solid #e74c3c" : "1px solid #ebeb4b",
                outline: "none",
                transition: "border 0.2s",
              }}
              autoFocus
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button
                type="submit"
                className="verify-btn"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 12,
                  fontSize: 18,
                  borderRadius: 8,
                  background: loading ? "#aaa" : "#ebeb4b",
                  color: "black",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {loading ? (
                  <span
                    className="otp-loader"
                    style={{
                      display: "inline-block",
                      width: 24,
                      height: 24,
                      border: "3px solid #232526",
                      borderTop: "3px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                ) : (
                  "Verify OTP"
                )}
              </button>
              <button
                onClick={handleResend}
                type="button"
                disabled={loading}
                className="resend-btn"
                style={{
                  flex: 1,
                  padding: 12,
                  fontSize: 18,
                  borderRadius: 8,
                  background: "#ebeb4b",
                  color: "#232526",
                  border: "1px solid #ccc",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Resend OTP
              </button>
            </div>
          </form>
          {error && (
            <p
              style={{
                marginTop: 16,
                color: error.includes("OTP") ? "#e74c3c" : "#27ae60",
                fontWeight: 600,
                fontSize: 20,
              }}
            >
              {error}
            </p>
          )}
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pop {
            0% { transform: scale(0.7); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          .verify-btn:hover {
            background: #fdfd96 !important;
          }

          .resend-btn:hover {
            background: #fdfd96 !important;
          }
        `}</style>
      </div>
    </>
  );
}
