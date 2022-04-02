// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_APP_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_APP_FIREBASE_AUTH_DOMIAN,
  projectId: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_APP_FIREBASE_STORGAE_BUCKET,
  storageBucket: "linux-scripts-a4c99.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
