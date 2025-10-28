// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJ0SeTCfkjHLgZKJo37kM2ynMI0gGgzEI",
  authDomain: "balmy-script-440718-u5.firebaseapp.com",
  projectId: "balmy-script-440718-u5",
  storageBucket: "balmy-script-440718-u5.firebasestorage.app",
  messagingSenderId: "1095261712374",
  appId: "1:1095261712374:web:ed4c7f028199107315a1d7",
  measurementId: "G-WY20PWKB2K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
