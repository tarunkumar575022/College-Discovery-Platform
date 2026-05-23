'use client';

import { useState } from 'react';
import { X, CheckCircle, GraduationCap, Phone, Mail, User, MapPin } from 'lucide-react';
import Image from 'next/image';
import { College } from '@/lib/types';

interface ApplyModalProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyModal({ college, isOpen, onClose }: ApplyModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    agree: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !college) return null;

  const coursesList = college.courseTypes ? college.courseTypes.split(',') : ['B.Tech', 'MBA', 'B.Sc'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.agree) newErrors.agree = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      course: '',
      agree: false,
    });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={handleReset}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl transition-all duration-300 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute right-4 top-4 z-10 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/80 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-850 dark:hover:text-white transition-all shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Application Submitted!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mx-auto">
                Your application to <span className="font-bold text-slate-850 dark:text-slate-200">{college.name}</span> has been sent successfully. An admissions counselor will reach out to you shortly.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 px-6 text-xs font-bold text-white shadow-md transition-all duration-200"
            >
              Close Window
            </button>
          </div>
        ) : (
          /* Application Form */
          <div className="flex flex-col">
            {/* Header Banner */}
            <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src={college.image}
                alt={college.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col gap-0.5">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Apply Admission 2026</span>
                <h2 className="text-lg font-black leading-snug truncate">{college.name}</h2>
                <div className="flex items-center gap-1 text-[10px] text-slate-350 font-medium">
                  <MapPin className="h-3 w-3 text-blue-400" />
                  {college.location}
                </div>
              </div>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-within:border-blue-500/50 p-0.5">
                  <User className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 focus-within:border-blue-500/50 p-0.5">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-within:border-blue-500/50 p-0.5">
                  <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.phone}</p>}
              </div>

              {/* Course selection */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Course Interested In
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-within:border-blue-500/50 p-0.5">
                  <GraduationCap className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-transparent py-2.5 pl-10 pr-10 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="" disabled className="dark:bg-slate-950">Select Course</option>
                    {coursesList.map((course) => (
                      <option key={course} value={course} className="dark:bg-slate-950">
                        {course.trim()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 pointer-events-none text-slate-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
                {errors.course && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.course}</p>}
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="mt-0.5 rounded border-slate-200 dark:border-slate-800 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 shrink-0"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                    I agree to receive communications from {college.name} admissions department regarding my application.
                  </span>
                </label>
                {errors.agree && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.agree}</p>}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
