"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  datePosted: Timestamp;
}

export default function Announcement() {
  const [theme, setTheme] = useState("dark")
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) setTheme(savedTheme)

    document.body.className = `${theme}-mode`

    if (!db) {
      setError("Firestore is not initialized.")
      setLoading(false)
      return
    }

    const q = query(collection(db, "announcements"), orderBy("datePosted", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetched: AnnouncementItem[] = []
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as AnnouncementItem)
        })
        setAnnouncements(fetched)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching announcements:", err)
        setError("Failed to load announcements.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const toggleMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.body.className = `${newTheme}-mode`
  }

  if (loading || error) {
    return (
      <div className={`${theme}-mode`}>
        <div
          className="announcement-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <p
            style={{
              color: error ? "#ff4b4b" : "#ebeb4b",
              fontSize: "24px"
            }}
          >
            {error || "Loading Announcements..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="announcement-container"
      style={{
        padding: 20,
        maxWidth: 800,
        margin: "1px auto 0",
        background: "#181818",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #ebeb4b",
          paddingBottom: 15,
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h1 style={{ color: "#ebeb4b", fontSize: 36, fontWeight: 700 }}>
          Gym Announcements
        </h1>
        <button
          id="mode-toggle"
          onClick={toggleMode}
          style={{
            background: "#ebeb4b",
            color: "#232526",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Toggle Mode
        </button>
      </header>
      <div style={{ height: "100px" }} />

      {announcements.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
          background: '#222',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          margin: '20px 0'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(235, 235, 75, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ebeb4b" strokeWidth="2"/>
              <path d="M12 16V12M12 8H12.01" stroke="#ebeb4b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 style={{
            color: '#ebeb4b',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            No Announcements Yet
          </h3>
          <p style={{
            color: '#ccc',
            fontSize: '16px',
            maxWidth: '400px',
            lineHeight: '1.6'
          }}>
            We'll notify you as soon as new announcements are posted. Stay tuned!
          </p>
        </div>
      ) : (
        announcements.map((a) => (
          <section
            key={a.id}
            style={{
              background: "#222",
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
            }}
          >
            <h2
              style={{
                color: "#ebeb4b",
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 10
              }}
            >
              <span style={{ color: "#ebeb4b", fontSize: "30px", fontWeight: 700, marginRight: "5px" }}>Title:</span>{a.title}
            </h2><br/>
            <p style={{ color: "#ccc", fontSize: 16, marginBottom: 15 }}>
            Date Posted: {a.datePosted?.toDate().toLocaleString() || "N/A"}<br />
            </p>
            <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.6 }}>
              <span style={{ color: "#fff", fontSize: "18px", fontWeight: 700, marginRight: "5px" }}>Message:</span>{a.content}
            </p>
          </section>
        ))
      )}

      <footer
        style={{
          borderTop: "1px solid #333",
          paddingTop: 15,
          marginTop: 30,
          textAlign: "center",
          color: "#888",
          fontSize: 14
        }}
      >
        <p>&copy; 2024 Fitness Freaks | Stay Strong, Stay Healthy!</p>
      </footer>
    </div>
  )
}
