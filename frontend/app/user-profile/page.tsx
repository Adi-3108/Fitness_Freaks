"use client"

import { useEffect, useState, useRef } from "react"
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
  const [schedules, setSchedules] = useState<any[]>([])
  const [newSchedule, setNewSchedule] = useState({ type: "class", workoutType: [], diet: "", scheduledAt: "" })
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [workoutTypeDraft, setWorkoutTypeDraft] = useState<string[]>([]);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const workoutOptions = [
    "Deadlift",
    "Barbell Back Squat",
    "Bench Press (Barbell or Dumbbell)",
    "Pull-Ups / Chin-Ups",
    "Overhead Shoulder Press (Barbell or Dumbbell)",
    "Barbell Row / Dumbbell Row",
    "Romanian Deadlift",
    "Lunges (Walking or Stationary, with weights)",
    "Dips (Bodyweight or Weighted)",
    "Farmer's Carry (Heavy Dumbbells or Trap Bar)",
    "Treadmill Running / Jogging",
    "Cycling (Stationary or Road)",
    "Jump Rope",
    "Stair Climber",
    "Rowing Machine",
    "Elliptical Trainer",
    "Swimming"
  ];

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

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/schedule/user/${user.id}`)
        .then(res => res.json())
        .then(setSchedules);
    }
  }, [user?.id]);

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

  // When type changes, reset workoutTypeDraft
useEffect(() => {
  setWorkoutTypeDraft([]);
}, [newSchedule.type]);

  const handleAddSchedule = async (e: any) => {
    e.preventDefault();
    let scheduledAt = newSchedule.scheduledAt;
    if (scheduledAt) {
      if (scheduledAt.length > 19) scheduledAt = scheduledAt.slice(0, 19);
      if (scheduledAt.length === 16) scheduledAt += ':00';
      if (scheduledAt[10] !== 'T') scheduledAt = scheduledAt.slice(0, 10) + 'T' + scheduledAt.slice(11);
    }
    const formattedSchedule = {
      ...newSchedule,
      workoutType: workoutTypeDraft.join(", "), // convert array to string
      scheduledAt,
      user: { id: user.id }
    };
    const res = await fetch("http://localhost:8080/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedSchedule)
    });
    if (res.ok) {
      const added = await res.json();
      setSchedules([...schedules, added]);
      setNewSchedule({ type: "class", workoutType: [], diet: "", scheduledAt: "" });
      setWorkoutTypeDraft([]);
    } else {
      let errorMsg = "Failed to add schedule.";
      try {
        const err = await res.json();
        errorMsg = err.message || JSON.stringify(err);
      } catch (e) {
        errorMsg = await res.text();
      }
      alert(errorMsg);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    await fetch(`http://localhost:8080/api/schedule/${id}`, { method: "DELETE" });
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const calculateRemainingTime = () => {
    if (!user?.planStartDate || !user?.plan) {
      setRemainingTime("Plan information not available. Please contact support.");
      return;
    }

    const startDate = new Date(user.planStartDate);
    const now = new Date();
    let monthsToAdd = 0;

    switch (user.plan.toLowerCase()) {
      case 'basic':
        monthsToAdd = 1;
        break;
      case 'pro':
        monthsToAdd = 3;
        break;
      case 'premium':
        monthsToAdd = 6;
        break;
      default:
        setRemainingTime("Invalid plan type. Please contact support.");
        return;
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + monthsToAdd);

    if (now > endDate) {
      setRemainingTime("Your plan has expired. Please renew to continue enjoying our services.");
      return;
    }

    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      setRemainingTime("Your plan has expired. Please renew to continue enjoying our services.");
    } else {
      setRemainingTime(`Your plan will expire in ${diffDays} days`);
    }
  };

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
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #181818 60%, #232526 100%)",
            border: "2px solid #ebeb4b",
            borderRadius: 18,
            boxShadow: "0 4px 32px 0 rgba(235,235,75,0.10)",
            padding: "48px 48px 36px 48px",
            marginTop: 8,
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 600, // increased minWidth
            maxWidth: 900, // increased maxWidth
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 32, color: "#ebeb4b", fontWeight: 700, textShadow: "0 2px 8px #232526" }}>
              Welcome!
            </div>
            <div style={{ fontSize: 40, color: "#ebeb4b", marginBottom: 12, fontWeight: 700, textShadow: "0 2px 8px #232526" }}>
              {user.username}
            </div>
          </div>
          <p style={{ color: "#fff", fontSize: 22, marginBottom: 32, fontWeight: 500 }}>
            Thank you for being a part of Fitness Freaks!
          </p>
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => {
                setShowRemainingTime(!showRemainingTime);
                if (!showRemainingTime) {
                  calculateRemainingTime();
                }
              }}
              style={{
                background: "#ebeb4b",
                color: "#232526",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                transition: 'background 0.2s, transform 0.2s',
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              className="check-time-hover"
            >
              <i className="bx bx-time"></i>
              {showRemainingTime ? "Hide Remaining Time" : "Plan Expiry"}
            </button>
            {showRemainingTime && remainingTime && (
              <div
                style={{
                  marginTop: 16,
                  padding: 20,
                  background: "rgba(235, 235, 75, 0.1)",
                  borderRadius: 8,
                  border: "2px solid #ebeb4b",
                  color: "#ebeb4b",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                }}
              >
                {remainingTime}
              </div>
            )}
          </div>
          <div style={{ fontSize: 22, marginBottom: 12, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "#fff", fontWeight: 600, minWidth: 90 }}>Email:</span>
            <span style={{
              color: "#ebeb4b",
              marginLeft: 12,
              wordBreak: "break-all",
              overflowWrap: "break-word",
              maxWidth: "calc(100% - 110px)",
              display: "inline-block"
            }}>{user.email}</span>
          </div>
          <div style={{ fontSize: 22, marginBottom: 12, display: "flex", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 600, minWidth: 90 }}>Phone:</span>
            <span style={{ color: "#ebeb4b", marginLeft: 12 }}>{user.phoneNumber}</span>
          </div>
          <div style={{ fontSize: 22, marginBottom: 12, display: "flex", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 600, minWidth: 90 }}>Address:</span>
            <span style={{ color: "#ebeb4b", marginLeft: 12 }}>{user.address}</span>
          </div>
          <div style={{ fontSize: 22, marginBottom: 12, display: "flex", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 600, minWidth: 90 }}>Plan:</span>
            <span style={{ color: "#ebeb4b", marginLeft: 12 }}>{user.plan}</span>
          </div>
          <div style={{ fontSize: 22, marginBottom: 12, display: "flex", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 600, minWidth: 90 }}>Joined:</span>
            <span style={{ color: "#ebeb4b", marginLeft: 12 }}>
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
              marginBottom: 16,
              alignSelf: "flex-start"
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
              transition: 'background 0.2s, transform 0.2s',
              alignSelf: "center",
              boxShadow: "0 2px 12px 0 rgba(231,76,60,0.10)"
            }}
            onClick={() => setShowCancelModal(true)}
            className="cancel-sub-hover"
          >
            Cancel Subscription
          </button>
        </div>
      </main>
      <div
        style={{
          marginTop: 40,
          background: "#000",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgb(255, 255, 255)",
          padding: 48,
          maxWidth: 1000,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h3 style={{ color: '#ebeb4b', fontSize: 28, marginBottom: 16, textAlign: "center" }}>My Schedule</h3>
        <form
          onSubmit={handleAddSchedule}
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <select
            value={newSchedule.type}
            onChange={e => {
              setNewSchedule({ ...newSchedule, type: e.target.value });
              setWorkoutTypeDraft([]);
            }}
            style={{
              fontSize: 18,
              padding: 8,
              borderRadius: 6,
              textAlign: "center",
              width: 200,
              minWidth: 200,
              maxWidth: 200,
              height: 48,
              flex: "0 0 200px"
            }}
          >
            {/* <option value="class">Class</option> */}
            <option value="muscle_strength">Muscle strength</option>
            <option value="weight_loose">Weight loose</option>
          </select>
          <div
            ref={dropdownRef}
            style={{
              position: "relative",
              width: 200,
              minWidth: 200,
              maxWidth: 200,
              height: 48,
              fontSize: 18,
              borderRadius: 6,
              background: "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
              textAlign: "center",
              padding: 0,
              flex: "0 0 200px"
            }}
            tabIndex={0}
          >
            <div
              style={{
                padding: "8px",
                minHeight: 32,
                // height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#232526",
                background: "#fff",
                borderRadius: 6,
                height: "100%"
              }}
              onClick={() => setDropdownOpen(v => !v)}
            >
              Workout Type
              <span style={{ marginLeft: 8, fontSize: 16, color: "#888" }}>▼</span>
            </div>
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 6,
                zIndex: 10,
                maxHeight: 220,
                overflowY: "auto",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)"
              }}>
                {workoutOptions.map(opt => (
                  <label
                    key={opt}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontSize: 17,
                      color: "#232526",
                      textAlign: "left",
                      userSelect: "none"
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={workoutTypeDraft.includes(opt)}
                      onChange={e => {
                        setWorkoutTypeDraft(draft =>
                          draft.includes(opt)
                            ? draft.filter(o => o !== opt)
                            : [...draft, opt]
                        );
                      }}
                      style={{ marginRight: 8 }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={newSchedule.diet}
            onChange={e => setNewSchedule({ ...newSchedule, diet: e.target.value })}
            placeholder="Other"
            style={{
              fontSize: 18,
              padding: 8,
              borderRadius: 6,
              textAlign: "center",
              width: 200,
              minWidth: 200,
              maxWidth: 200,
              height: 48,
              flex: "0 0 200px"
            }}
          />
          <input
            type="datetime-local"
            value={newSchedule.scheduledAt}
            onChange={e => setNewSchedule({ ...newSchedule, scheduledAt: e.target.value })}
            required
            style={{
              fontSize: 18,
              padding: 8,
              borderRadius: 6,
              textAlign: "center",
              width: 200,
              minWidth: 200,
              maxWidth: 200,
              height: 48,
              flex: "0 0 200px"
            }}
          />
          <button
            type="submit"
            style={{
              background: '#27ae60', // green color
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              width: 90,
              minWidth: 90,
              maxWidth: 90,
              height: 48,
              flex: "0 0 90px"
            }}
          >
            Add
          </button>
        </form>
        <div style={{ overflowX: 'auto', borderRadius: 14, boxShadow: '0 4px 24px rgba(235,235,75,0.08)', width: "100%" }}>
          <table style={{ width: '100%', color: '#fff', borderCollapse: 'separate', borderSpacing: 0, background: '#232526', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #ebeb4b 0%, #f7d358 100%)', color: '#232526' }}>
                <th style={{ padding: 14, fontSize: 20, fontWeight: 700, borderTopLeftRadius: 14, borderRight: '2px solid #fff', textAlign: "center", minWidth: 70, width: 90 }}>Type</th>
                <th style={{ padding: 14, fontSize: 20, fontWeight: 700, borderRight: '2px solid #fff', textAlign: "center", minWidth: 260, width: 320 }}>Workout Type</th>
                <th style={{ padding: 14, fontSize: 20, fontWeight: 700, borderRight: '2px solid #fff', textAlign: "center", minWidth: 220, width: 280 }}>Diet</th>
                <th style={{ padding: 14, fontSize: 20, fontWeight: 700, borderRight: '2px solid #fff', textAlign: "center", minWidth: 90, width: 120 }}>Date</th>
                <th style={{ padding: 14, fontSize: 20, fontWeight: 700, borderTopRightRadius: 14, textAlign: "center", minWidth: 80, width: 100 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, idx) => (
                <tr key={s.id} style={{ background: idx % 2 === 0 ? '#181818' : '#232526', transition: 'background 0.2s', borderBottom: '1px solid #333', cursor: 'pointer' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#2d2d2d')}
                  onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#181818' : '#232526')}
                >
                  <td style={{ padding: 12, fontSize: 18, borderRight: '2px solid #fff', borderBottomLeftRadius: idx === schedules.length - 1 ? 14 : 0, textAlign: "center", minWidth: 70, width: 90 }}>{s.type}</td>
                  <td style={{ padding: 12, fontSize: 18, borderRight: '2px solid #fff', textAlign: "center", minWidth: 260, width: 320 }}>
                    {Array.isArray(s.workoutType) ? s.workoutType.join(", ") : s.workoutType}
                  </td>
                  <td style={{ padding: 12, fontSize: 18, borderRight: '2px solid #fff', textAlign: "center", minWidth: 220, width: 280 }}>{s.diet}</td>
                  <td style={{ padding: 12, fontSize: 18, borderRight: '2px solid #fff', textAlign: "center", minWidth: 90, width: 120 }}>
                    {s.scheduledAt
                      ? (() => {
                          const d = new Date(s.scheduledAt);
                          return (
                            <>
                              <div>{d.toLocaleDateString()}</div>
                              <div>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </>
                          );
                        })()
                      : ''}
                  </td>
                  <td style={{ padding: 12, fontSize: 18, borderBottomRightRadius: idx === schedules.length - 1 ? 14 : 0, textAlign: "center", minWidth: 80, width: 100 }}>
                    <button onClick={() => handleDeleteSchedule(s.id)} style={{ background: 'linear-gradient(90deg, #e74c3c 0%, #ff7675 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(231,76,60,0.12)', transition: 'background 0.2s, transform 0.2s' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
        .check-time-hover:hover {
          background: #ffe066 !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
