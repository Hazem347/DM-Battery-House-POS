import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local') });

async function test() {
  try {
    if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
       throw new Error("Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in .env.local");
    }

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    
    const db = getFirestore();
    const auth = getAuth();
    
    // Test Firestore
    await db.collection('users').limit(1).get();
    console.log("Firestore connected successfully.");
    
    // Test Auth
    await auth.listUsers(1);
    console.log("Auth connected successfully.");
    
    console.log("SUCCESS: All Firebase Admin systems initialized correctly.");
  } catch (e) {
    console.error("ERROR:", e);
    process.exit(1);
  }
}

test();
