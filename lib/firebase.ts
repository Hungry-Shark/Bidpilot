
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqgrV3eRuUxDI9OGCBYuNqrCjhSZzI5BE",
  authDomain: "bidpilot-9cb07.firebaseapp.com",
  projectId: "bidpilot-9cb07",
  storageBucket: "bidpilot-9cb07.firebasestorage.app",
  messagingSenderId: "945377193114",
  appId: "1:945377193114:web:9d192a9facb94ce41d8323",
  measurementId: "G-LD73TEBRP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
