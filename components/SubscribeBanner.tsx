'use client';

import { useState } from 'react';
import { Mail, Phone, CheckCircle, BellRing, Sparkles, GraduationCap } from 'lucide-react';

export default function SubscribeBanner() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim() || !course) {
      alert('Please fill out all fields.');
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/[\s-+]/g, ''))) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setEmail('');
    setPhone('');
    setCourse('');
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10 bg-slate-50 dark:bg-slate-900/10 border-t border-b border-slate-200 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto text-center space-y-6 relative">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
            Subscribe To Our News Letter
          </h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold tracking-wide">
            Get College Notifications, Exam Notifications and News Updates
          </p>
        </div>

        {/* Form or Success State */}
        {isSuccess ? (
          <div className="max-w-xl mx-auto flex items-center justify-center gap-3 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-6 py-4 rounded-2xl text-emerald-600 dark:text-emerald-450 animate-in fade-in duration-300">
            <CheckCircle className="h-6 w-6 shrink-0" />
            <div className="text-left">
              <span className="block text-sm font-bold leading-tight">Subscribed Successfully!</span>
              <span className="block text-xs opacity-80 mt-0.5">We will send updates for {course} course options to your mobile and email.</span>
              <button 
                type="button" 
                onClick={handleReset} 
                className="text-[10px] text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-350 underline font-bold mt-1 block"
              >
                Subscribe another email
              </button>
            </div>
          </div>
        ) : (
          <form 
            onSubmit={handleSubscribe} 
            className="flex flex-col md:flex-row items-center gap-3 w-full bg-white dark:bg-slate-950 p-2.5 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm focus-within:border-orange-500/30 transition-colors"
          >
            {/* Email input */}
            <div className="relative flex items-center w-full px-1 py-1">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email id"
                className="w-full bg-transparent pl-10 pr-3 py-1.5 text-xs text-slate-805 dark:text-white placeholder-slate-400 focus:outline-none"
                required
              />
            </div>
            
            <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

            {/* Mobile input */}
            <div className="relative flex items-center w-full px-1 py-1">
              <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile no"
                className="w-full bg-transparent pl-10 pr-3 py-1.5 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none"
                required
              />
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

            {/* Course select input */}
            <div className="relative flex items-center w-full px-1 py-1">
              <GraduationCap className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-transparent pl-10 pr-8 py-1.5 text-xs text-slate-805 dark:text-white placeholder-slate-400 focus:outline-none cursor-pointer appearance-none"
                required
              >
                <option value="" disabled className="dark:bg-slate-950">Choose your course</option>
                <option value="B.Tech" className="dark:bg-slate-950">B.Tech / B.E.</option>
                <option value="MBA" className="dark:bg-slate-950">MBA / PGDM</option>
                <option value="M.Tech" className="dark:bg-slate-950">M.Tech / M.E.</option>
                <option value="MCA" className="dark:bg-slate-950">MCA</option>
                <option value="B.Sc" className="dark:bg-slate-950">B.Sc</option>
                <option value="BA" className="dark:bg-slate-950">BA</option>
                <option value="B.Com" className="dark:bg-slate-950">B.Com</option>
              </select>
              <div className="absolute right-3.5 pointer-events-none text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-8 py-3.5 md:py-2.5 rounded-2xl md:rounded-full transition-all shrink-0 uppercase tracking-wider shadow-md shadow-orange-500/10 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
