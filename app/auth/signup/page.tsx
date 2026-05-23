'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, UserPlus, Mail, Lock, User, AlertCircle, Sparkles, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Account created successfully! Redirecting to login page...');
        setName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 backdrop-blur-md relative shadow-xl shadow-slate-100">
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900">
              EduSphere
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-600 border border-indigo-100 mb-3 uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-indigo-500" /> Get Started
          </div>
          <h2 className="text-xl font-black text-slate-900">Create New Account</h2>
          <p className="text-xs text-slate-500 mt-1">Discover, bookmark, and review the best institutes.</p>
        </div>

        {/* Display submission messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start gap-2.5 text-xs text-rose-600 font-semibold leading-relaxed">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-2.5 text-xs text-emerald-650 font-semibold leading-relaxed shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <Check className="h-4 w-4 text-emerald-550 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
            <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-100 p-0.5 transition-all">
              <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tarun"
                required
                className="w-full bg-transparent py-3 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
            <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-100 p-0.5 transition-all">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="w-full bg-transparent py-3 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Password</label>
            <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-100 p-0.5 transition-all">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (Min. 6 chars)"
                required
                className="w-full bg-transparent py-3 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 mt-6 shadow-indigo-500/10"
          >
            <UserPlus className="h-4 w-4" />
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-semibold">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-650 hover:text-indigo-800 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
