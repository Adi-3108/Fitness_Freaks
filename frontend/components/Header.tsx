"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoggedIn(!!localStorage.getItem("user"))
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsed = JSON.parse(userData)
        setProfilePic(parsed.profilePic || localStorage.getItem("profilePic"))
      }
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleAvatarClick = () => {
    setShowDropdown((prev) => !prev)
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
    setShowDropdown(false)
  }

  const confirmLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("username")
    setLoggedIn(false)
    setShowLogoutConfirm(false)
    router.push("/")
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <header>
      <Link href="/">
        <Image src="/logo.jpeg.jpg" alt="Logo" width={60} height={60} />
      </Link>
      <Link href="/" className="logo">
        Fitness <span>Freaks</span>
      </Link>

      <div className="bx bx-menu" id="menu-icon" onClick={toggleMenu}></div>

      <ul className={`navbar ${menuOpen ? "active" : ""}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/#services">Services</Link>
        </li>
        <li>
          <Link href="/#about">About Us</Link>
        </li>
        <li>
          <Link href="/#plans">Pricing</Link>
        </li>
        <li>
          <Link href="/#review">Review</Link>
        </li>
        <li>
          <div className="dropdown">
            <a>
              <button className="dropbtn">More</button>
            </a>
            <div className="dropdown-content">
              <Link href="/user-profile">Your Profile</Link>
              <Link href="/buy-equipment">Buy Equipments</Link>
              <Link href="/announcement">Announcements</Link>
              <Link href="/workout-plan">Work Out Plan</Link>
              <Link href="/bmi-calculator">BMI Calculator</Link>
              <Link href="/diet">Diet Plan</Link>
            </div>
          </div>
        </li>
      </ul>

      <div className="top-btn">
        {!loggedIn ? (
          <Link href="/login" className="nav-btn">
            Login
          </Link>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              className="user-avatar-btn"
              onClick={handleAvatarClick}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginLeft: 12
              }}
              aria-label="User menu"
            >
              <Image src={profilePic || "/user-icon.jpg"} alt="User" width={40} height={40} style={{ borderRadius: "50%", border: "2px solid #232526", objectFit: "cover", objectPosition: "center" }} />
            </button>
            {showDropdown && (
              <div style={{
                position: "absolute",
                right: 0,
                top: 48,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                minWidth: 160,
                zIndex: 1000,
                padding: 8
              }}>
                <Link href="/user-profile" style={{ display: "block",fontSize:20, padding: "10px 16px", color: "#232526", textDecoration: "none" }} onClick={() => setShowDropdown(false)}>
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    fontSize:20,
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    color: "#e74c3c",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, minWidth: 320, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h3 style={{ color: "#232526", marginBottom: 16 }}>Are you sure you want to logout?</h3>
            <button
              onClick={confirmLogout}
              style={{
                marginRight: 16,
                padding: "10px 24px",
                fontSize: 16,
                borderRadius: 8,
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Yes, Logout
            </button>
            <button
              onClick={cancelLogout}
              style={{
                padding: "10px 24px",
                fontSize: 16,
                borderRadius: 8,
                background: "#232526",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
