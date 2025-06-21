"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired reset link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password has been reset successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
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
            <h2>Invalid Reset Link</h2>
            <p style={{ 
              color: "red", 
              fontSize: "1.1rem",
              fontWeight: "500",
              textAlign: "center",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 0, 0, 0.1)"
            }}>
              {message}
            </p>
            <p className="signuplink">
              <Link href="/forgot-password">Request a new reset link</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <span className="focus-border"></span>
            </div>
            <div className="input-field">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              <span className="focus-border"></span>
            </div>
            {message && (
              <div 
                className="message" 
                style={{ 
                  margin: "15px 0", 
                  color: message.includes("successfully") ? "green" : "red",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: message.includes("successfully") ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"
                }}
              >
                {message}
              </div>
            )}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
} 