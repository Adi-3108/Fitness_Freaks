"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Get identifier (email or phone) from localStorage
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
        // credentials: "include"
      });
      const data = await res.json();
      if (res.ok && data.message && data.message.toLowerCase().includes("verified")) {
        // Fetch user details after OTP verification
        const userRes = await fetch(`http://localhost:8080/api/users/details`, {
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
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        padding: 32,
        minWidth: 340,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}>
        <h2 style={{ marginBottom: 16, color: "#232526" }}>OTP Verification</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
            required
            style={{
              padding: 12,
              fontSize: 18,
              borderRadius: 8,
              border: error ? "2px solid #e74c3c" : "2px solid #ccc",
              outline: "none",
              transition: "border 0.2s"
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              fontSize: 18,
              borderRadius: 8,
              background: loading ? "#aaa" : "#232526",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {loading ? (
              <span className="otp-loader" style={{ display: "inline-block", width: 24, height: 24, border: "3px solid #232526", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            ) : "Verify OTP"}
          </button>
        </form>
        <button
          onClick={handleResend}
          disabled={loading}
          style={{
            marginTop: 16,
            padding: 8,
            fontSize: 15,
            borderRadius: 6,
            background: "#f5f5f5",
            color: "#232526",
            border: "1px solid #ccc",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          Resend OTP
        </button>
        {error && <p style={{ marginTop: 16, color: error.includes("OTP") ? "#e74c3c" : "#27ae60", fontWeight: 600, fontSize: 20 }}>{error}</p>}
      </div>
      {/* Success Modal */}
      {showSuccess && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 40, minWidth: 320, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 48, color: "#27ae60", marginBottom: 16, animation: "pop 0.5s" }}>✔️</div>
            <h3 style={{ color: "#232526" }}>OTP Verified!</h3>
          </div>
        </div>
      )}
      {/* Welcome Modal */}
      {showWelcome && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100
        }}>
          <div style={{ background: "#232526", borderRadius: 20, padding: 48, minWidth: 400, textAlign: "center", color: "#fff", boxShadow: "0 12px 48px rgba(0,0,0,0.3)" }}>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>Thank you for choosing us!!</h2>
            <p style={{ fontSize: 20, marginBottom: 24 }}>Welcome to <span style={{ color: "#27ae60", fontWeight: 700 }}>FitnessFreaks</span></p>
            <div style={{ fontSize: 48, marginBottom: 8, animation: "pop 0.5s" }}>🎉</div>
            <button
              onClick={() => {
                setShowWelcome(false);
                router.push("/");
              }}
              style={{
                marginTop: 16,
                padding: "12px 32px",
                fontSize: 18,
                borderRadius: 8,
                background: "#27ae60",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      )}
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
      `}</style>
    </div>
  );
} 