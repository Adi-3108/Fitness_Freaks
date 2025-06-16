"use client"

import { useState } from "react"
import Dialog from "../../app/components/Dialog"

export default function BMICalculator() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [result, setResult] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")

  const calculateBMI = () => {
    const weightVal = parseFloat(weight)
    const heightCm = parseFloat(height)

    if (weightVal <= 0 || heightCm <= 0) {
      setDialogMessage("Please enter valid positive numbers for weight and height.")
      setShowDialog(true)
      return
    }

    const heightM = heightCm / 100 // Convert height from cm to meters
    const bmi = (weightVal / (heightM * heightM)).toFixed(2) // Calculate BMI and round to 2 decimal places
    const bmiNum = parseFloat(bmi)

    let category = ""
    let resultColor = ""

    if (bmiNum < 18.5) {
      category = "Underweight"
      resultColor = "#007bff" // Blue for underweight
    } else if (bmiNum < 24.9) {
      category = "Normal weight"
      resultColor = "#28a745" // Green for normal weight
    } else if (bmiNum < 29.9) {
      category = "Overweight"
      resultColor = "#ffc107" // Yellow for overweight
    } else {
      category = "Obese"
      resultColor = "#dc3545" // Red for obese
    }

    setResult(`
      <p>Your BMI is <span style="color: var(--main-color);">${bmi}</span>.</p>
      <p>You are classified as <span style="color: ${resultColor};">${category}</span>.</p>
    `)
  }

  return (
    <>
      <Dialog 
        isOpen={showDialog}
        message={dialogMessage}
        onClose={() => setShowDialog(false)}
        type="info"
      />
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
    </>
  )
}