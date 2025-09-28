// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";

// your config
const firebaseConfig = {
  apiKey: "AIzaSyBweQd55o1iZzOsTbT1oczX47cjnazfzdQ",
  authDomain: "plexiform-leaf-473416-g6.firebaseapp.com",
  projectId: "plexiform-leaf-473416-g6",
  storageBucket: "plexiform-leaf-473416-g6.firebasestorage.app",
  messagingSenderId: "175402345633",
  appId: "1:175402345633:web:cf6cfe562a2bd8aa17fce0",
  measurementId: "G-G8CB4DQ0XS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signIn() {
  // Popup is simplest in local dev; if you prefer redirect, switch to signInWithRedirect
  return signInWithPopup(auth, provider);
}

export async function signOut() {
  return fbSignOut(auth);
}
