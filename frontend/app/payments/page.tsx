"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import { useEffect, useState } from "react";

const stripePromise = loadStripe("pk_test_51RYuGAE8tL7ABuo5NdreB1GMZ72xEbPSRJ1J6krpzeT2Tvcss9f4rxR5FJQXxGWXtAdQcMvikEDacvAQTVVkih3G00ASsdJJMY"); // your public key

export default function PaymentPage() {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Get amount and email from URL parameters
        const params = new URLSearchParams(window.location.search);
        const amount = params.get("amount");
        const email = params.get("email");

        if (!amount || !email) {
            console.error("Missing amount or email in URL parameters.");
            // Optionally, redirect to an error page or show a user-friendly message
            return;
        }

        fetch("http://localhost:8080/api/payment/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseInt(amount), email: email }),
        })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    console.error("Error creating payment intent:", data.error);
                    // Handle error, maybe show a message to the user
                } else {
                    setClientSecret(data.clientSecret);
                }
            })
            .catch(error => {
                console.error("Network error creating payment intent:", error);
                // Handle network errors
            });
    }, []);

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
                <div className="signup" style={{ padding: '40px', borderRadius: '10px' }}>
                    <label style={{ fontSize: '3rem', marginBottom: '20px' }}>Complete Your Payment</label>
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm clientSecret={clientSecret} amount={parseInt(new URLSearchParams(window.location.search).get("amount") || "0")}/>
                        </Elements>
                    ) : (
                        <div className="loading" style={{ color: 'var(--main-color)', fontSize: '1.8rem', textAlign: 'center' }}>
                            Loading payment form...
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 