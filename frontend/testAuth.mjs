import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testLogin() {
    try {
        console.log("Attempting login...");
        const userCredential = await signInWithEmailAndPassword(auth, "admin@dmbatteryhouse.com", "password123");
        console.log("Login successful! UID:", userCredential.user.uid);
        
        console.log("Checking firestore for user doc...");
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
            console.log("User doc exists:", userDoc.data());
        } else {
            console.log("User doc DOES NOT EXIST.");
        }
    } catch (e) {
        console.error("Login failed:", e.code, e.message);
    }
    process.exit();
}
testLogin();
