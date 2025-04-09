import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx3lAmx_gV4KMm_thRzHDl5CZk4zwBE7o",
  authDomain: "aitravelplanner-2024.firebaseapp.com",
  projectId: "aitravelplanner-2024",
  storageBucket: "aitravelplanner-2024.appspot.com",
  messagingSenderId: "954019400793",
  appId: "1:954019400793:web:480cb2f2e9c297e416f548",
  measurementId: "G-FSX44PZ6HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics;

// Enhanced offline persistence setup
const initializePersistence = () => {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    
    enableIndexedDbPersistence(db)
      .then(() => console.log('Offline persistence enabled'))
      .catch((err) => {
        console.error(`Persistence error (${err.code}): ${err.message}`);
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        }
      });
  }
};

initializePersistence();

export { app, auth, analytics, db, serverTimestamp };