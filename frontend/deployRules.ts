import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local') });

const source = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
    match /sales/{saleId} {
      allow read, write: if request.auth != null;
    }
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role in ['ADMIN', 'MANAGER'];
    }
  }
}
`;

async function deploy() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  const rules = getSecurityRules();
  try {
    const ruleset = await rules.createRuleset({
      name: 'firestore.rules',
      content: source
    });
    
    await rules.releaseFirestoreRuleset(ruleset.name);
    console.log('Successfully deployed Firestore rules!');
  } catch (error) {
    console.error('Error deploying rules:', error);
  }
}

deploy().then(() => process.exit(0));
