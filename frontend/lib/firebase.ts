import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLMW1zD0Z88mP3xIfmwn4j-rBBECtCKo4",
  authDomain: "fitnessfreaks-baed3.firebaseapp.com",
  projectId: "fitnessfreaks-baed3",
  storageBucket: "fitnessfreaks-baed3.firebasestorage.app",
  messagingSenderId: "652304596272",
  appId: "1:652304596272:web:2c85904bb41b13b22a1cf5",
  measurementId: "G-856QEY7X16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let messaging = null as ReturnType<typeof getMessaging> | null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { messaging, getToken, onMessage, db }; 