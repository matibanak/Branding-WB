import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcfV_etXNy04qetX350ylqjLyQctmh93U",
  authDomain: "branding-studio-wb.firebaseapp.com",
  projectId: "branding-studio-wb",
  storageBucket: "branding-studio-wb.firebasestorage.app",
  messagingSenderId: "986321735739",
  appId: "1:986321735739:web:9c17d47346cf6284cf4c1e",
  measurementId: "G-PF399DF71F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
