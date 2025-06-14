"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Dialog from "../components/Dialog";

export default function Join() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
    email: "",
    plan: "BASIC",
  });

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [validations, setValidations] = useState({
    name: { isValid: false, message: "", touched: false },
    phone: { isValid: false, message: "", touched: false },
    address: { isValid: false, message: "", touched: false },
    password: { isValid: false, message: "", touched: false },
    email: { isValid: false, message: "", touched: false },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (name: string, value: string) => {
    let isValid = false;
    let message = "";

    switch (name) {
      case "name":
        isValid = value.trim() !== "";
        message = isValid ? "" : "Full name required";
        break;
      case "phone":
        isValid = /^[0-9]{10}$/.test(value);
        message = isValid ? "" : "Phone number must be 10 digits";
        break;
      case "address":
        isValid = value.trim() !== "";
        message = isValid ? "" : "Enter your address";
        break;
      case "password":
        isValid = value.length >= 8;
        message = isValid ? "" : "Password must be at least 8 characters";
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = isValid ? "" : "Enter a valid email";
        break;
      default:
        break;
    }

    setValidations((prev) => ({
      ...prev,
      [name]: { isValid, message, touched: true },
    }));

    return isValid;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const getPlanAmount = (plan: string) => {
    switch (plan) {
      case "BASIC":
        return 800;
      case "PRO":
        return 1000;
      case "PREMIUM":
        return 1500;
      default:
        return 800;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameValid = validateField("name", formData.name);
    const phoneValid = validateField("phone", formData.phone);
    const addressValid = validateField("address", formData.address);
    const passwordValid = validateField("password", formData.password);
    const emailValid = validateField("email", formData.email);

    if (nameValid && phoneValid && addressValid && passwordValid && emailValid) {
      // Store form data in localStorage for after payment
      localStorage.setItem("registrationData", JSON.stringify(formData));
      
      // Redirect to payment page
      const amount = getPlanAmount(formData.plan);
      router.push(`/payments?amount=${amount}&email=${formData.email}`);
    }
  };

  return (
    <>
      <Dialog 
        isOpen={showOtpDialog}
        message="An OTP has been sent to your registered Email for Verification"
        onClose={() => setShowOtpDialog(false)}
      />
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
          <div className="signup">
            <form id="signupForm" onSubmit={handleSubmit} noValidate>
              <label>Join us now</label>

              <div className={`input-container ${validations.name.touched ? (validations.name.isValid ? "success" : "error") : ""}`}>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="validation-message">{validations.name.message}</span>
              </div>

              <div className={`input-container ${validations.email.touched ? (validations.email.isValid ? "success" : "error") : ""}`}>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="validation-message">{validations.email.message}</span>
              </div>

              <div className={`input-container ${validations.phone.touched ? (validations.phone.isValid ? "success" : "error") : ""}`}>
                <input
                  type="tel"
                  placeholder="Enter your Phone Number"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="validation-message">{validations.phone.message}</span>
              </div>

              <div className={`input-container ${validations.address.touched ? (validations.address.isValid ? "success" : "error") : ""}`}>
                <input
                  type="text"
                  placeholder="Enter your Address"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="validation-message">{validations.address.message}</span>
              </div>

              <div className={`input-container ${validations.password.touched ? (validations.password.isValid ? "success" : "error") : ""}`}>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="validation-message">{validations.password.message}</span>
              </div>

              <div className="plan-selection">
                <h4>Choose your plan:</h4>
                <select
                  name="plan"
                  id="plan"
                  value={formData.plan}
                  onChange={handleChange}
                >
                  <option value="BASIC">BASIC - ₹800/month</option>
                  <option value="PRO">PRO - ₹1000/month</option>
                  <option value="PREMIUM">PREMIUM - ₹1500/month</option>
                </select>
              </div>

              <button type="submit">Proceed to Payment</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
