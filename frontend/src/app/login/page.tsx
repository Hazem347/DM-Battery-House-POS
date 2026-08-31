'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Explicitly set the cookie here to avoid race condition with AuthContext
      const token = await userCredential.user.getIdToken();
      document.cookie = `token=${token}; path=/; max-age=86400`;
      
      router.push('/admin'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant/30 p-8 rounded-xl w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 text-on-primary">
            <span className="material-symbols-outlined text-3xl">battery_charging_full</span>
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Admin Login</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Sign in to DM Battery House Management</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="admin@dmbatteryhouse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md hover:bg-primary/90 transition-all flex justify-center items-center h-[52px]"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
            ) : (
               'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
