// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Add this

const firebaseConfig = {
  apiKey: "AIzaSyDbtGJEvmzoBBZAL6Gek32JmiUBP9DUg0Q",
  authDomain: "digitalmarketingwebsite-cf2de.firebaseapp.com",
  projectId: "digitalmarketingwebsite-cf2de",
  storageBucket: "digitalmarketingwebsite-cf2de.firebasestorage.app",
  messagingSenderId: "279934072725",
  appId: "1:279934072725:web:883cb1e3d78b347bb5a89c",
  measurementId: "G-SE0K7XRBM5",
  databaseURL: "https://digitalmarketingwebsite-cf2de-default-rtdb.firebaseio.com" // Add Realtime DB URL
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const realtimeDb = getDatabase(app); // Export Realtime Database
