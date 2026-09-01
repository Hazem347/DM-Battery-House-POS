import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role, password, active } = body;

    // 1. Update user in Firebase Auth
    const updateAuthParams: any = {};
    if (email) updateAuthParams.email = email;
    if (password) updateAuthParams.password = password;
    if (name) updateAuthParams.displayName = name;
    if (active !== undefined) updateAuthParams.disabled = !active;

    if (Object.keys(updateAuthParams).length > 0) {
      await adminAuth.updateUser(id, updateAuthParams);
    }

    // 2. Update user document in Firestore
    const updateDocParams: any = {};
    if (name !== undefined) updateDocParams.name = name;
    if (email !== undefined) updateDocParams.email = email;
    if (role !== undefined) updateDocParams.role = role;
    if (active !== undefined) updateDocParams.active = active;

    if (Object.keys(updateDocParams).length > 0) {
      await adminDb.collection('users').doc(id).update(updateDocParams);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating user - FULL STACK:', error.stack || error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      code: error.code || 'UNKNOWN_ERROR',
      details: 'Firebase Admin SDK might be misconfigured in production'
    }, { status: 500 });
  }
}
