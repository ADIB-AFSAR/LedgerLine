import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration using project ID found in server config
// Replace these placeholders with your actual Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCOQyY8Kpk2sEi5t4Skd1R1p7MfT9bQ6Mw",
  authDomain: "itr-project-9be2b.firebaseapp.com",
  projectId: "itr-project-9be2b",
  storageBucket: "itr-project-9be2b.firebasestorage.app",
  messagingSenderId: "364114167905",
  appId: "1:364114167905:web:de377eb60e331ba7654220",
  measurementId: "G-MJQHD3S9P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
