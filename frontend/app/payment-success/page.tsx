"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    const registrationData = localStorage.getItem("registrationData");

    if (!paymentIntentId) {
      setStatus("error");
      setMessage("Invalid payment session");
      return;
    }

    const completeRegistration = async () => {
      try {
        // Prioritize equipment purchase flow
        const equipmentCart = localStorage.getItem("equipmentCart");
        const equipmentUserEmail = localStorage.getItem("equipmentUserEmail");
        const equipmentUserId = localStorage.getItem("equipmentUserId");

        if (equipmentCart && equipmentUserEmail && equipmentUserId) {
          const cartItems = JSON.parse(equipmentCart);
          const res = await fetch("http://localhost:8080/api/payment/confirm-equipment-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: paymentIntentId,
              userEmail: equipmentUserEmail,
              userId: parseInt(equipmentUserId),
              cartItems: cartItems,
            }),
          });

          const data = await res.json();

          if (res.ok && data.message && data.message.includes("Equipment order placed successfully!")) {
            setStatus("success");
            setMessage("Payment successful! Your equipment order has been placed.");
            localStorage.removeItem("equipmentCart");
            localStorage.removeItem("equipmentUserEmail");
            localStorage.removeItem("equipmentUserId");
            localStorage.removeItem("registrationData"); // Ensure registrationData is also cleared
          } else {
            throw new Error(data.error || data.message || "Equipment order failed");
          }
        } else {
          // If no equipmentCart, then check for user registration data
          const registrationData = localStorage.getItem("registrationData");
          if (registrationData) {
            const userData = JSON.parse(registrationData);
            const res = await fetch("http://localhost:8080/api/payment/confirm-and-register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: paymentIntentId,
                registrationData: userData,
              }),
            });

            const data = await res.json();

            if (res.ok && data.message) {
              if (data.message.includes("OTP sent for verification")) {
                setStatus("success");
                setMessage("Payment successful! Please verify your email with the OTP sent.");
                localStorage.setItem("username", userData.email);
                localStorage.removeItem("registrationData");
                router.push(`/verify-otp?email=${userData.email}`); // Redirect to OTP verification page
              } else if (data.message.includes("Payment confirmed and user registered successfully!")) {
                setStatus("success");
                setMessage("Payment successful and registration complete!");
                localStorage.setItem("username", userData.email);
                localStorage.removeItem("registrationData");
              }
            } else {
              throw new Error(data.error || data.message || "Payment confirmation or registration failed");
            }
          } else {
            // Fallback if neither registration data nor equipment data is found
            setStatus("error");
            setMessage("Payment successful, but order details were missing.");
          }
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Something went wrong");
      }
    };

    completeRegistration();
  }, [searchParams]);

  return (
    <main
      style={{
        background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "apple-system, sans-serif",
      }}
    >
      <div className="main">
        <div className="signup" style={{ padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
          {status === "loading" && (
            <div className="loading" style={{ color: 'var(--main-color)', fontSize: '2rem' }}>
              <h2>Processing your payment...</h2>
              <div className="spinner" style={{
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid var(--main-color)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                margin: '20px auto'
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {status === "success" && (
            <div className="success" style={{ color: 'var(--text-color)' }}>
              <h2 style={{ color: 'var(--main-color)', fontSize: '3rem', marginBottom: '15px' }}>Payment Successful!</h2>
              <p style={{ fontSize: '1.8rem', marginBottom: '30px' }}>{message}</p>
              <Link href="/" className="btn">
                Return to Home
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="error" style={{ color: 'var(--text-color)' }}>
              <h2 style={{ color: '#ff6b6b', fontSize: '3rem', marginBottom: '15px' }}>Payment Failed</h2>
              <p style={{ fontSize: '1.8rem', marginBottom: '30px' }}>{message}</p>
              <Link href="/" className="btn">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 