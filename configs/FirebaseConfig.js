import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAx3lAmx_gV4KMm_thRzHDl5CZk4zwBE7o",
  authDomain: "aitravelplanner-2024.firebaseapp.com",
  projectId: "aitravelplanner-2024",
  storageBucket: "aitravelplanner-2024.appspot.com", // Fixed storage bucket
  messagingSenderId: "954019400793",
  appId: "1:954019400793:web:480cb2f2e9c297e416f548",
  measurementId: "G-FSX44PZ6HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let analytics;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, analytics };
export const db = getFirestore(app);