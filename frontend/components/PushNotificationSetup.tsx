"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"
import { messaging, getToken, onMessage, db } from "@/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"

export default function PushNotificationSetup() {
  const router = useRouter()
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementBody, setAnnouncementBody] = useState("")
  const [announcementTimestamp, setAnnouncementTimestamp] = useState<Timestamp | null>(null)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const lastAnnouncementId = useRef<string | null>(null)
  const [announcementSource, setAnnouncementSource] = useState<'fcm' | 'firestore' | null>(null)

  useEffect(() => {
    console.log("PushNotificationSetup useEffect initiated.")

    // Check if the user has opted to not show this announcement again
    const storedLastAnnouncementId = localStorage.getItem("lastShownAnnouncementId");
    if (storedLastAnnouncementId) {
      lastAnnouncementId.current = storedLastAnnouncementId;
    }

    // Request notification permission and get FCM token
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          if (messaging) {
            getToken(messaging, { vapidKey: "BAnGBstyk6HmvpiJs9JLBcHgMcW1GFz9gekCJrBCEoWdd-UKOdM9A0lvReurquSRc3afAsRDgGfgEnPZaQDUvlM" }).then(token => {
              console.log("FCM Token:", token)
            }).catch(err => {
              console.error("Error getting FCM token:", err)
            })
          }
        }
      }).catch(err => {
        console.error("Error requesting notification permission:", err)
      })

      // Listen for foreground messages (push notifications)
      if (messaging) {
        onMessage(messaging, payload => {
          console.log("FCM Message received:", payload)
          // Use the announcement ID from the message, if available, or generate one
          const newId = payload.data?.id || new Date().getTime().toString();
          if (newId !== lastAnnouncementId.current) {
            setAnnouncementTitle(payload.notification?.title || "New Notification")
            setAnnouncementBody(payload.notification?.body || "You have a new notification.")
            setAnnouncementTimestamp(null); // FCM messages don't always have timestamp
            setShowAnnouncementDialog(true)
            lastAnnouncementId.current = newId;
            console.log("showAnnouncementDialog set to true from FCM.")
            setAnnouncementSource('fcm');
          }
        })
      }
    }

    // Listen for Firestore changes (new announcements)
    if (!db) {
      console.error("Firestore is not initialized in PushNotificationSetup.");
      return;
    }

    console.log("Setting up Firestore listener...")
    const q = query(collection(db, "announcements"), orderBy("datePosted", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore snapshot received.", snapshot.empty ? "Snapshot is empty." : "Snapshot contains data.")
      if (!snapshot.empty) {
        const latestAnnouncement = snapshot.docs[0];
        const latestAnnouncementData = latestAnnouncement.data();

        // Only show dialog if it's a new announcement based on its ID and not set to "don't show again"
        if (latestAnnouncement.id !== lastAnnouncementId.current) {
          setAnnouncementTitle("New Announcement Available!");
          setAnnouncementBody("A new announcement has been posted! Visit the Announcement Page for more details.");
          setAnnouncementTimestamp(latestAnnouncementData.datePosted);
          setShowAnnouncementDialog(true);
          lastAnnouncementId.current = latestAnnouncement.id;
          console.log("showAnnouncementDialog set to true from Firestore.")
          setAnnouncementSource('firestore');

          // Save the ID to localStorage if "Don't show again" is checked when it's dismissed
          if (dontShowAgain) {
            localStorage.setItem("lastShownAnnouncementId", latestAnnouncement.id);
          }
        }
      }
    }, (error) => {
      console.error("Error fetching announcements from Firestore:", error);
    });

    // Cleanup listener on component unmount
    return () => {
      console.log("Cleaning up Firestore listener.")
      unsubscribe()
    }
  }, [dontShowAgain]) // Add dontShowAgain to dependency array

  const handleGoToAnnouncements = () => {
    setShowAnnouncementDialog(false)
    router.push("/announcement")
  }

  const handleDialogClose = (open: boolean) => {
    setShowAnnouncementDialog(open);
    if (!open && dontShowAgain && lastAnnouncementId.current) {
      localStorage.setItem("lastShownAnnouncementId", lastAnnouncementId.current);
    }
  };

  return (
    <>
      <Dialog open={showAnnouncementDialog} onOpenChange={handleDialogClose}>
        <DialogContent style={{ background: "#181818", borderRadius: 16, color: "#fff", minWidth: '550px', padding: '30px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#ebeb4b", fontSize: 32, fontWeight: 700, marginBottom: '5px' }}>
              {announcementSource === 'fcm' ? 'New Notification' : 'New Announcement'}
            </DialogTitle>
          </DialogHeader>
          {announcementSource === 'firestore' && announcementTimestamp && (
            <p style={{ color: "#ccc", fontSize: 16, marginBottom: '15px' }}>
              Posted: {announcementTimestamp.toDate().toLocaleString()}
            </p>
          )}
          <div className="notification-content" style={{ color: "#fff", fontSize: 20, lineHeight: 1.6 }}>
            {announcementSource === 'fcm' ? (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: '#e0e0e0' }}>Notification Title:</span>
                  <p style={{ marginTop: '5px', color: '#fff' }}>{announcementTitle}</p>
                </div>
                <div>
                  <span style={{ color: '#e0e0e0' }}>Notification Text:</span>
                  <p style={{ marginTop: '5px', color: '#fff' }}>{announcementBody}</p>
                </div>
              </>
            ) : (
              <p style={{ color: '#fff' }}>{announcementBody}</p>
            )}
          </div>
          {announcementSource === 'firestore' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
              <label style={{ display: 'flex', 'alignItems': 'center', cursor: 'pointer', fontSize: 18, color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={e => setDontShowAgain(e.target.checked)}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                Don't show this announcement again
              </label>
              <Button
                style={{
                  background: "#ebeb4b",
                  color: "#232526",
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
                }}
                onClick={handleGoToAnnouncements}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d2c124';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(235, 235, 75, 0.8)';
                  e.currentTarget.style.color = '#181818';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ebeb4b';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.color = '#232526';
                }}
              >
                Go to Announcements
              </Button>
            </div>
          )}
           <DialogClose asChild>
             <button
               style={{
                 position: 'absolute',
                 top: '10px',
                 right: '10px',
                 background: '#dc2626',
                 color: '#fff',
                 borderRadius: '50%',
                 width: '30px',
                 height: '30px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 cursor: 'pointer',
                 border: 'none',
                 fontSize: '18px',
                 fontWeight: 'bold',
                 boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
                 transition: 'box-shadow 0.2s ease-in-out',
               }}
               onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 8px rgba(220, 38, 38, 0.8)'}
               onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0px rgba(0, 0, 0, 0)'}
             >
               X
             </button>
           </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
} 