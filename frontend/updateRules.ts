import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';
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

const rulesSource = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'ADMIN';
    }

    // Publicly readable collections
    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /brands/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Authenticated access
    match /sales/{document=**} {
      allow read, write: if isAuthenticated();
    }
    
    match /customers/{document=**} {
      allow read, write: if isAuthenticated();
    }

    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }
    
    // Default fallback
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

async function updateRules() {
  try {
    console.log('Deploying new Firestore Security Rules...');
    const securityRules = getSecurityRules();
    await securityRules.releaseFirestoreRulesetFromSource(rulesSource);
    console.log('Successfully deployed Firestore Security Rules!');
  } catch (error) {
    console.error('Failed to deploy rules:', error);
  }
}

updateRules();
