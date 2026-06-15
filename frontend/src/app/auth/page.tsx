'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store';
import { motion } from 'framer-motion';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, user } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'ARTISAN'>('CUSTOMER');
  const [bio, setBio] = useState('');
  const [region, setRegion] = useState('');
  const [craft, setCraft] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const redirectParam = searchParams.get('redirect') || 'dashboard';

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push(`/${redirectParam}`);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const url = isLogin ? 'signin' : 'signup';
    const body = isLogin 
      ? { email, password } 
      : { email, password, name, role, bio, region, craft };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/auth/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      // Save to Zustand
      setSession(data.token, data.user);
      router.push(`/${redirectParam}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection to authentication service failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-outline-variant/20 rounded-xl luxury-shadow space-y-6">
      <div className="text-center space-y-2">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Access Portal</span>
        <h1 className="font-display text-3xl font-light text-on-surface">
          {isLogin ? 'Sign In to Sunartn' : 'Register Collector / Artisan'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Full Name</label>
            <input
              type="text"
              required
              placeholder="Sarah Williams"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Email Address</label>
          <input
            type="email"
            required
            placeholder="collector@sunartn.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {!isLogin && (
          <div className="space-y-4 pt-2 border-t border-outline-variant/10">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Account Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={role === 'CUSTOMER'}
                    onChange={() => setRole('CUSTOMER')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Customer Collector</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={role === 'ARTISAN'}
                    onChange={() => setRole('ARTISAN')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>Artisan Maker</span>
                </label>
              </div>
            </div>

            {role === 'ARTISAN' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-2"
              >
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Craft Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Pottery, Indigo Weaving"
                    value={craft}
                    onChange={(e) => setCraft(e.target.value)}
                    className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Studio Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajasthan, Kashmir"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Artisan Bio</label>
                  <textarea
                    placeholder="Share the story and legacy of your craft..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-primary font-medium">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
          ) : isLogin ? (
            'Sign In'
          ) : (
            'Register Account'
          )}
        </button>
      </form>

      <div className="text-center text-xs text-secondary border-t border-outline-variant/10 pt-4">
        {isLogin ? (
          <p>
            New to the movement?{' '}
            <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-semibold cursor-pointer">
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-semibold cursor-pointer">
              Sign In here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Access Portal...</div>}>
      <AuthForm />
    </Suspense>
  );
}
