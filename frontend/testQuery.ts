import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function testQuery() {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    console.log(`Found ${snapshot.size} products.`);
    if (snapshot.size > 0) {
      console.log('Sample product:', snapshot.docs[0].data());
    }
  } catch (error) {
    console.error('Error querying products:', error);
  }
}

testQuery();
