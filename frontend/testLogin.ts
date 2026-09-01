import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAx31aKTSCfusdI8MB2cZ6SisVI1iq-3t8",
  authDomain: "dm-battery-house-b578f.firebaseapp.com",
  projectId: "dm-battery-house-b578f",
  storageBucket: "dm-battery-house-b578f.firebasestorage.app",
  messagingSenderId: "208852727787",
  appId: "1:208852727787:web:26b417f3b13a5d0b920bae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Mock the browser environment's origin if possible, but actually we can just try to sign in
async function testLogin() {
  try {
    console.log("Attempting login...");
    const userCredential = await signInWithEmailAndPassword(auth, "admin@dmbatteryhouse.com", "password123");
    console.log("Login successful! User ID:", userCredential.user.uid);
  } catch (error: any) {
    console.error("Login failed!");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
  }
}

testLogin();
