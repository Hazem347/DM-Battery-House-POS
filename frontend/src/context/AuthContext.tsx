'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name || '',
              email: firebaseUser.email || '',
              role: data.role || 'CASHIER'
            });
            // Update token in cookie for middleware
            const token = await firebaseUser.getIdToken();
            document.cookie = `token=${token}; path=/; max-age=86400`;
            document.cookie = `role=${data.role || 'CASHIER'}; path=/; max-age=86400`;
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user data from Firestore", err);
          setUser(null);
        }
      } else {
        setUser(null);
        document.cookie = `token=; path=/; max-age=0`;
        document.cookie = `role=; path=/; max-age=0`;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    document.cookie = `token=; path=/; max-age=0`;
    document.cookie = `role=; path=/; max-age=0`;
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
