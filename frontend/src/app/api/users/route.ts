import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      name: name || '',
      email,
      role,
      active: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      id: userRecord.uid, 
      name, 
      email, 
      role,
      active: true 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user - FULL STACK:', error.stack || error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      code: error.code || 'UNKNOWN_ERROR',
      details: 'Firebase Admin SDK might be misconfigured in production'
    }, { status: 500 });
  }
}
