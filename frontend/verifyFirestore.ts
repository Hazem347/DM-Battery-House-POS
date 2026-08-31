import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local') });

async function verify() {
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

  console.log("=== PHASE 4: FIRESTORE COUNTS ===");
  const collections = ['users', 'categories', 'brands', 'products', 'customers', 'sales', 'settings', 'notifications'];
  for (const coll of collections) {
    const snapshot = await db.collection(coll).get();
    console.log(`- ${coll}: ${snapshot.size} documents`);
    
    if (coll === 'products' && snapshot.size > 0) {
      const doc = snapshot.docs[0].data();
      if (doc.inventory && typeof doc.inventory.quantity === 'number') {
        console.log(`  [Pass] Products have embedded inventory mapping.`);
      } else {
        console.log(`  [Fail] Products missing inventory mapping!`);
      }
    }
  }

  console.log("\n=== PHASE 5: AUTHENTICATION ===");
  const testEmails = ['admin@dmbatteryhouse.com', 'manager@dmbatteryhouse.com', 'cashier@dmbatteryhouse.com'];
  
  for (const email of testEmails) {
    try {
      const userRecord = await auth.getUserByEmail(email);
      console.log(`- User found: ${email} (UID: ${userRecord.uid})`);
      console.log(`  Role Custom Claim: ${userRecord.customClaims?.role || 'NONE'}`);
      
      const firestoreUser = await db.collection('users').doc(userRecord.uid).get();
      if (firestoreUser.exists) {
        console.log(`  Firestore Role: ${firestoreUser.data()?.role}`);
      } else {
        console.log(`  [Fail] User missing in Firestore!`);
      }
    } catch (e) {
      console.log(`- User NOT found: ${email}`);
    }
  }
}

verify().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
