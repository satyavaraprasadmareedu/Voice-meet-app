// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZXRFK35xlxrsNo3q-htZUWkgxrrkOWpU",
    authDomain: "voicemeetapp.firebaseapp.com",
    projectId: "voicemeetapp",
    storageBucket: "voicemeetapp.firebasestorage.app",
    messagingSenderId: "760123377101",
    appId: "1:760123377101:web:aac45438dcdfb8fc357084",
    measurementId: "G-NYM5J8S6ZF"
  };
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
