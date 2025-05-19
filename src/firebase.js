// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbL-9Tgs-9hPC72jAZIOi_N0c7ZCI8mmg",
  authDomain: "todo-940cd.firebaseapp.com",
  projectId: "todo-940cd",
  storageBucket: "todo-940cd.firebasestorage.app",
  messagingSenderId: "893479310269",
  appId: "1:893479310269:web:1fefda11833fa05fa478d4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
