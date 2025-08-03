//firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebase = {
  apiKey: "AIzaSyDSRx__iprq3awsKRJgMWTCy6jKMGaGwkY",
  authDomain: "vitalriskshield.firebaseapp.com",
  projectId: "vitalriskshield",
  storageBucket: "vitalriskshield.appspot.com",
  messagingSenderId: "57525045392",
  appId: "1:57525045392:web:efea383f89727eb47db015",
  measurementId: "G-F3QZBFM3F4"
};

// Initialize Firebase
const app = initializeApp(firebase);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Add new user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
        authProvider: "google"
      });
    }
    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});