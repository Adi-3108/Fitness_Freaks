"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function UserProfile() {
  const [user, setUser] = useState<any>(null)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [cancelStep, setCancelStep] = useState(1)
  const [cancelError, setCancelError] = useState("")
  const [cancelCode, setCancelCode] = useState("")
  const [enteredCode, setEnteredCode] = useState("")
  const [sendingCode, setSendingCode] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
      } else {
        setUser(JSON.parse(userData))
        const storedPic = JSON.parse(userData).profilePic || localStorage.getItem("profilePic")
        if (storedPic) setProfilePic(storedPic)
      }
    }
  }, [router])

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfilePic(reader.result as string)
        // Save to user object in localStorage
        if (user) {
          const updatedUser = { ...user, profilePic: reader.result }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
        localStorage.setItem("profilePic", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) return null

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "inherit" }}>
      <header style={{ display: "flex", alignItems: "center", padding: "24px 48px", background: "#000", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <Link href="/" className="logo" style={{ fontSize: 36, fontWeight: 700, color: "#fff", textDecoration: "none", marginRight: 32, letterSpacing: 1, transition: 'color 0.2s, transform 0.2s' }}>
          <span className="logo-hover">Fitness <span style={{ color: "#fff" }}>Freaks</span></span>
        </Link>
        <nav style={{ flex: 1 }}>
          <Link href="/" style={{ marginRight: 32, marginLeft: 300, color: "#ebeb4b", textDecoration: "none", fontWeight: 500, fontSize: 20, transition: 'color 0.2s, text-decoration 0.2s, transform 0.2s' }} className="nav-hover">Home</Link>
          <Link href="/#services" style={{ marginRight: 32, color: "#ebeb4b", textDecoration: "none", fontWeight: 500, fontSize: 20, transition: 'color 0.2s, text-decoration 0.2s, transform 0.2s' }} className="nav-hover">Services</Link>
          <Link href="/#plans" style={{ marginRight: 32, color: "#ebeb4b", textDecoration: "none", fontWeight: 500, fontSize: 20, transition: 'color 0.2s, text-decoration 0.2s, transform 0.2s' }} className="nav-hover">Plans</Link>
        </nav>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to log out?")) {
              localStorage.removeItem("user")
              localStorage.removeItem("username")
              router.push("/")
            }
          }}
          style={{
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 20,
            fontWeight: 600,
            cursor: "pointer",
            transition: 'background 0.2s, transform 0.2s'
          }}
          className="logout-hover"
        >
          Logout
        </button>
      </header>
      <main style={{ maxWidth: 1000, margin: "48px auto", background: "#000", borderRadius: 24, boxShadow: "0 8px 32px rgb(255, 255, 255)", padding: 48, display: "flex", alignItems: "center", gap: 64 }}>
        <div>
          <Image src={profilePic || require("../../public/user-icon.jpg")}
            alt="User"
            width={200}
            height={200}
            style={{ borderRadius: "50%", border: "4px solid #27ae60", background: "#e0e0e0", objectFit: "cover", objectPosition: "center" }}
          />
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <input
              type="file"
              accept="image/*"
              id="profilePicInput"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
            <button
              style={{
                background: "#ebeb4b",
                color: "#232526",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 8,
                transition: 'background 0.2s, transform 0.2s'
              }}
              onClick={() => document.getElementById("profilePicInput")?.click()}
              className="change-profile-hover"
            >
              Change Profile
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 40, color: "#ebeb4b", marginBottom: 12, fontWeight: 700 }}>
  Welcome, {user.username}
</h2>
<p style={{ color: "#fff", fontSize: 22, marginBottom: 32, fontWeight: 500 }}>
  Thank you for being a part of Fitness Freaks!
</p>

<div style={{ fontSize: 22, marginBottom: 12 }}>
  <span style={{ color: "#fff", fontWeight: 600 }}>Email: </span>
  <span style={{ color: "#ebeb4b" }}>{user.email}</span>
</div>

<div style={{ fontSize: 22, marginBottom: 12 }}>
  <span style={{ color: "#fff", fontWeight: 600 }}>Phone: </span>
  <span style={{ color: "#ebeb4b" }}>{user.phoneNumber}</span>
</div>

<div style={{ fontSize: 22, marginBottom: 12 }}>
  <span style={{ color: "#fff", fontWeight: 600 }}>Plan: </span>
  <span style={{ color: "#ebeb4b" }}>{user.plan}</span>
</div>

<div style={{ fontSize: 22, marginBottom: 12 }}>
  <span style={{ color: "#fff", fontWeight: 600 }}>Address: </span>
  <span style={{ color: "#ebeb4b" }}>{user.address}</span>
</div>

<div style={{ fontSize: 22, marginBottom: 12 }}>
  <span style={{ color: "#fff", fontWeight: 600 }}>Joined: </span>
  <span style={{ color: "#ebeb4b" }}>
    {user.createdAt ? new Date(user.createdAt).toLocaleString() : `User #${user.id}`}
  </span>
</div>

{/* Diet Plan Button */}
<button
  style={{
    marginTop: 16,
    padding: "14px 36px",
    fontSize: 20,
    borderRadius: 10,
    background: "#ebeb4b",
    color: "#232526",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: 'background 0.2s, transform 0.2s',
    marginBottom: 16
  }}
  onClick={() => router.push("/my-diet")}
>
  View My Diet Plan
</button>

          <button
            style={{
              marginTop: 32,
              padding: "16px 40px",
              fontSize: 22,
              borderRadius: 10,
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              transition: 'background 0.2s, transform 0.2s'
            }}
            onClick={() => setShowCancelModal(true)}
            className="cancel-sub-hover"
          >
            Cancel Subscription
          </button>
        </div>
      </main>
      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 }}>
          <div style={{ background: "#181818", borderRadius: 20, padding: 40, minWidth: 420, color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontFamily: "inherit" }}>
            {cancelStep === 1 && (
              <>
                <h2 style={{ fontSize: 28, marginBottom: 18, color: "#ebeb4b" }}>Discontinue Fitness Freaks Account</h2>
                <label style={{ fontSize: 20, marginBottom: 8, display: "block" }}>Reason to Discontinue: <span style={{ color: "#e74c3c" }}>*</span></label>
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  style={{ width: "100%", minHeight: 80, fontSize: 18, borderRadius: 8, border: "1px solid #ebeb4b", marginBottom: 16, padding: 10, background: "#222", color: "#fff" }}
                  required
                />
                <div style={{ fontSize: 16, color: "#ccc", marginBottom: 16 }}>
                  We are sad that you no more want to continue with your profile. Please let us know the reason! We'll try and improve on your suggestions. Thanks.
                </div>
                <div style={{ marginBottom: 16 }}>
                  <input type="checkbox" id="confirmDelete" checked={confirmDelete} onChange={e => setConfirmDelete(e.target.checked)} />
                  <label htmlFor="confirmDelete" style={{ marginLeft: 8, fontSize: 16 }}>
                    I agree that after this action, <b>ALL MY PERSONAL DETAILS WILL BE DELETED AND I WOULD NOT BE ABLE TO RECOVER MY ACCOUNT</b>
                  </label>
                </div>
                {cancelError && <div style={{ color: "#e74c3c", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>{cancelError}</div>}
                <button
                  style={{ background: "#ebeb4b", color: "#232526", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 20, fontWeight: 700, cursor: "pointer", marginTop: 8, width: "100%" }}
                  disabled={sendingCode}
                  onClick={async () => {
                    setCancelError("");
                    if (!cancelReason.trim()) { setCancelError("Reason is required."); return; }
                    if (!confirmDelete) { setCancelError("You must agree to the terms."); return; }
                    setSendingCode(true);
                    // Send code to email
                    const res = await fetch("http://localhost:8080/api/users/send-cancel-code", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user.email })
                    });
                    const data = await res.json();
                    setSendingCode(false);
                    if (res.ok && data.code) {
                      setCancelCode(data.code);
                      setCancelStep(2);
                    } else {
                      setCancelError(data.message || "Failed to send code.");
                    }
                  }}
                  className="cancel-continue-hover"
                >
                  Continue
                </button>
              </>
            )}
            {cancelStep === 2 && (
              <>
                <h2 style={{ fontSize: 28, marginBottom: 18, color: "#ebeb4b" }}>Enter Verification Code</h2>
                <div style={{ fontSize: 18, marginBottom: 16 }}>A code has been sent to your email. Please enter it below to confirm account deletion.</div>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={e => setEnteredCode(e.target.value)}
                  style={{ width: "100%", fontSize: 20, borderRadius: 8, border: "1px solid #ebeb4b", marginBottom: 16, padding: 10, background: "#222", color: "#fff" }}
                  maxLength={6}
                  required
                />
                {cancelError && <div style={{ color: "#e74c3c", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>{cancelError}</div>}
                <button
                  style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 20, fontWeight: 700, cursor: "pointer", marginTop: 8, width: "100%" }}
                  disabled={verifying}
                  onClick={async () => {
                    setCancelError("");
                    if (enteredCode !== cancelCode) { setCancelError("Invalid code."); return; }
                    setVerifying(true);
                    // Call backend to delete user
                    const res = await fetch("http://localhost:8080/api/users/cancel-subscription", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user.email })
                    });
                    setVerifying(false);
                    if (res.ok) {
                      localStorage.removeItem("user");
                      localStorage.removeItem("username");
                      localStorage.removeItem("profilePic");
                      setShowSuccessDialog(true);
                      setTimeout(() => {
                        setShowSuccessDialog(false);
                        router.push("/");
                      }, 3000);
                    } else {
                      setCancelError("Failed to delete account. Try again.");
                    }
                  }}
                  className="cancel-delete-hover"
                >
                  I don't want to keep Fitness Freaks User Profile
                </button>
              </>
            )}
            <button
              style={{ background: "none", color: "#ebeb4b", border: "none", fontSize: 18, marginTop: 18, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setShowCancelModal(false)}
              className="cancel-go-back-hover"
            >
              Go back
            </button>
          </div>
        </div>
      )}
      {showSuccessDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4000 }}>
          <div style={{ background: "#27ae60", borderRadius: 20, padding: 40, color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontFamily: "inherit", textAlign: "center" }}>
            <h2 style={{ fontSize: 32, marginBottom: 18, color: "#fff" }}>Subscription Cancelled Successfully!</h2>
            <p style={{ fontSize: 20 }}>Redirecting to homepage...</p>
          </div>
        </div>
      )}
      <style>{`
        .nav-hover:hover {
          color: #fff !important;
          text-decoration: underline;
          transform: scale(1.07);
        }
        .logo-hover:hover {
          color: #ebeb4b !important;
          transform: scale(1.07);
          cursor: pointer;
        }
        .logout-hover:hover {
          background: #c0392b !important;
          transform: scale(1.05);
        }
        .cancel-sub-hover:hover {
          background: #c0392b !important;
          transform: scale(1.05);
        }
        .change-profile-hover:hover {
          background: #ffe066 !important;
          transform: scale(1.05);
        }
        .cancel-continue-hover:hover {
          background: #ffe066 !important;
          transform: scale(1.05);
        }
        .cancel-delete-hover:hover {
          background: #c0392b !important;
          transform: scale(1.05);
        }
        .cancel-go-back-hover:hover {
          color: #fff !important;
          text-decoration: underline;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
