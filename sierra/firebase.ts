import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcaLOo1r4wXmQ4BegKb0aSjlFO2AFuj5w",
  authDomain: "notion-56ca9.firebaseapp.com",
  projectId: "notion-56ca9",
  storageBucket: "notion-56ca9.firebasestorage.app",
  messagingSenderId: "46065870223",
  appId: "1:46065870223:web:8be9a53807ad0812c157fa",
  measurementId: "G-C7G292EMVZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig): getApp();
const db = getFirestore(app);

export { db };