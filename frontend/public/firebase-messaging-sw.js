importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCLMW1zD0Z88mP3xIfmwn4j-rBBECtCKo4",
  authDomain: "fitnessfreaks-baed3.firebaseapp.com",
  projectId: "fitnessfreaks-baed3",
  storageBucket: "fitnessfreaks-baed3.firebasestorage.app",
  messagingSenderId: "652304596272",
  appId: "1:652304596272:web:2c85904bb41b13b22a1cf5",
  measurementId: "G-856QEY7X16"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 