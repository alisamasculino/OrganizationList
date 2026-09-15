// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxzQ4naTwzzw8tdEJUdPfRuWBPqknuYaE",
  authDomain: "organization-minsu-8bdf7.firebaseapp.com",
  databaseURL: "https://organization-minsu-8bdf7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "organization-minsu-8bdf7",
  storageBucket: "organization-minsu-8bdf7.firebasestorage.app",
  messagingSenderId: "677883244863",
  appId: "1:677883244863:web:ab8d4817413a423b62638a",
  measurementId: "G-JHTSJG5321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Analytics
const analytics = getAnalytics(app);

// Firebase Realtime Database
export const database = getDatabase(app);

// Firebase Authentication
export const auth = getAuth(app);