"use client"

import { useState, useEffect } from "react"

export default function Announcement() {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <body className={`${theme}-mode`}>
      <div className="announcement-container">
        <header className="header">
          <h1>Gym Announcements</h1>
          <button id="mode-toggle" onClick={toggleMode}>
            Toggle Mode
          </button>
        </header>
        <section className="announcement">
          <h2>Special Event: Fitness Challenge 2024!</h2>
          <p>
            Join us on <strong>Saturday, November 25th</strong>, for a day of fitness fun, challenges, and prizes! Open
            to all members.
          </p>
        </section>
        <section className="announcement">
          <h2>Holiday Hours</h2>
          <p>
            We&apos;ll be closed on <strong>November 28th</strong> for Thanksgiving. Regular hours resume on November
            29th.
          </p>
        </section>
        <section className="announcement">
          <h2>New Equipment Alert</h2>
          <p>We&apos;ve added brand new treadmills and weight machines to the floor. Come check them out!</p>
        </section>
        <footer className="footer">
          <p>&copy; 2024 Fitness Freaks | Stay Strong, Stay Healthy!</p>
        </footer>
      </div>
    </body>
  )
}
