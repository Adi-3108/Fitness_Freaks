"use client"

import { useState } from "react"

export default function BMICalculator() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [result, setResult] = useState("")

  const calculateBMI = async () => {
    const weightVal = parseFloat(weight)
    const heightVal = parseFloat(height)

    if (weightVal <= 0 || heightVal <= 0) {
      alert("Please enter valid positive numbers for weight and height.")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/bmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: weightVal, height: heightVal }),
      })

      const data = await response.json()
      const bmi = parseFloat(data.bmi)

      let category = ""
      if (bmi < 18.5) {
        category = "Underweight"
      } else if (bmi < 24.9) {
        category = "Normal weight"
      } else if (bmi < 29.9) {
        category = "Overweight"
      } else {
        category = "Obese"
      }

      setResult(`
        <p>Your BMI is <span style="color: #007bff;">${bmi}</span>.</p>
        <p>You are classified as <span style="color: #dc3545;">${category}</span>.</p>
      `)
    } catch (err) {
      console.error("Error contacting backend:", err)
      alert("Server error. Please make sure the backend is running.")
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <div className="bmi-container">
        <h1>BMI Calculator</h1>
        <p>Calculate your Body Mass Index (BMI) and see which category you fall into.</p>

        <form id="bmiForm" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            placeholder="Enter your weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />

          <label htmlFor="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            placeholder="Enter your height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />

          <button type="button" onClick={calculateBMI}>
            Calculate BMI
          </button>
        </form>

        <div id="bmiResult" className="bmi-result" dangerouslySetInnerHTML={{ __html: result }}></div>
      </div>
    </div>
  )
}