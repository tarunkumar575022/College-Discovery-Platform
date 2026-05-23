'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import SaveButton from '@/components/SaveButton';
import ApplyModal from '@/components/ApplyModal';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  GraduationCap,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Compass,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CollegeDetailPage({ params }: { params: { id: string } }) {
  const collegeId = params.id;
  const router = useRouter();
  const { data: session } = useSession();

  const { data, error, isLoading, mutate } = useSWR(`/api/colleges/${collegeId}`, fetcher);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews' | 'gallery' | 'discussions'>('overview');

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Discussions Q&A SWR & Form states
  const { data: discussionsData, mutate: mutateDiscussions } = useSWR(`/api/discussions?collegeId=${collegeId}`, fetcher);
  const collegeDiscussions = discussionsData?.success ? discussionsData.data : [];

  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [activeAnsweringQuestionId, setActiveAnsweringQuestionId] = useState<string | null>(null);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const college = data?.success ? data.data : null;

  // Track recent visits in localStorage
  useEffect(() => {
    if (college) {
      try {
        const stored = localStorage.getItem('recent_visits');
        let visits = stored ? JSON.parse(stored) : [];
        // Filter out current college to avoid duplicates
        visits = visits.filter((v: any) => v.id !== college.id);
        // Add to front of history
        visits.unshift({ id: college.id, name: college.name, location: college.location });
        // Cap to 3 visits
        visits = visits.slice(0, 3);
        localStorage.setItem('recent_visits', JSON.stringify(visits));
      } catch (e) {
        console.error('Failed to update recent visits', e);
      }
    }
  }, [college]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!comment.trim()) {
      setSubmitError('Please enter a comment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/colleges/${collegeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const result = await res.json();

      if (result.success) {
        setComment('');
        setRating(5);
        // Mutate SWR to show review instantly
        mutate();
      } else {
        setSubmitError(result.message || 'Failed to submit review.');
      }
    } catch (err) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newQuestionTitle,
          content: newQuestionContent,
          collegeId: college.id
        })
      });
      const result = await res.json();
      if (result.success) {
        setNewQuestionTitle('');
        setNewQuestionContent('');
        mutateDiscussions();
      } else {
        alert(result.message || 'Failed to submit question.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!newAnswerContent.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/discussions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newAnswerContent })
      });
      const result = await res.json();
      if (result.success) {
        setNewAnswerContent('');
        setActiveAnsweringQuestionId(null);
        mutateDiscussions();
      } else {
        alert(result.message || 'Failed to submit answer.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-200">
        <Navbar />
        <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10">
          <SkeletonLoader type="detail" />
        </div>
      </main>
    );
  }

  if (error || !college) {
    return (
      <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-200">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8">
            <h2 className="text-lg font-bold text-rose-400">College not found</h2>
            <p className="mt-2 text-sm text-slate-400">
              The college details could not be loaded. It might have been deleted or the database is currently unreachable.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Discover
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const placements = college.placements?.[0];
  const recruitersList = placements?.recruiters ? placements.recruiters.split(',') : [];
  const courses = college.courses || [];
  const reviews = college.reviews || [];

  const campusImages = [
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop', title: 'Main Campus Building' },
    { src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop', title: 'Central Library' },
    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop', title: 'Smart Lecture Hall' },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', title: 'Discussion Lounge' },
    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop', title: 'Science & Tech Lab' },
    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224b94?q=80&w=600&auto=format&fit=crop', title: 'Auditorium' }
  ];

  return (
    <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <Navbar />

      <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 select-none">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
          <span className="text-slate-350 dark:text-slate-700">&gt;</span>
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Colleges</Link>
          <span className="text-slate-350 dark:text-slate-700">&gt;</span>
          <span className="text-slate-750 dark:text-slate-200 font-bold truncate">{college.name}</span>
        </nav>

        {/* Back Button & Save Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm dark:shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listing
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              Apply Now
            </button>
            <SaveButton collegeId={college.id} />
          </div>
        </div>

        {/* Hero Jumbotron Section */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 md:p-8 lg:p-10 mb-8 backdrop-blur-md shadow-sm dark:shadow-none">
          {/* Background glowing colors */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-650 dark:text-indigo-300 border border-indigo-500/20">
                  <Compass className="h-3.5 w-3.5" />
                  Featured College Profile
                </div>
                {college.nirfRanking && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-455 border border-amber-500/20">
                    #{college.nirfRanking} NIRF Ranking
                  </div>
                )}
                {college.ownership && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {college.ownership}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                {college.name}
              </h1>

              {/* Meta items */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  {college.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Established {college.establishedYear}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{college.rating.toFixed(1)}</span> rating
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-3xl pt-2">
                {college.description}
              </p>
            </div>

            {/* Collage Image Container */}
            <div className="relative h-60 w-full lg:h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <Image
                src={college.image}
                alt={college.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-505 font-bold uppercase tracking-wider">Courses Count</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{courses.length} Standard Programs</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Placement Package</span>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {placements ? `₹${placements.avgSalary} LPA` : 'N/A'}
              </h3>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Student Rating</span>
              <h3 className="text-xl font-black text-amber-500 dark:text-amber-400 mt-0.5">{college.rating.toFixed(1)} / 5.0</h3>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 sticky top-16 z-30 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-3 mb-8 backdrop-blur-md">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {['Overview', 'Courses', 'Placements', 'Reviews', 'Gallery', 'Discussions'].map((tab) => {
              const tabVal = tab.toLowerCase();
              const isSelected = activeTab === tabVal;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabVal as any)}
                  className={`relative pb-2 text-sm font-bold transition-all duration-200 shrink-0 ${
                    isSelected
                      ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Specific Content */}
        <div>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                    About {college.name}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line">
                    {college.description}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    Quick Facts & Highlights
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <span className="block text-[10px] text-slate-550 font-bold uppercase tracking-wider">Established</span>
                      <span className="block text-sm font-extrabold text-slate-800 dark:text-white mt-1">{college.establishedYear}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <span className="block text-[10px] text-slate-550 font-bold uppercase tracking-wider">NIRF Ranking</span>
                      <span className="block text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">#{college.nirfRanking || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <span className="block text-[10px] text-slate-550 font-bold uppercase tracking-wider">Ownership</span>
                      <span className="block text-sm font-extrabold text-slate-800 dark:text-white mt-1">{college.ownership || 'Government'}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <span className="block text-[10px] text-slate-550 font-bold uppercase tracking-wider">Location</span>
                      <span className="block text-sm font-extrabold text-slate-800 dark:text-white mt-1 truncate" title={college.location}>{college.location.split(',')[0]}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <span className="block text-[10px] text-slate-550 font-bold uppercase tracking-wider">Course Options</span>
                      <span className="block text-sm font-extrabold text-slate-800 dark:text-white mt-1">{courses.length} Programs</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                      <span className="block text-[10px] text-slate-550 font-bold uppercase tracking-wider">Average Package</span>
                      <span className="block text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{placements ? `₹${placements.avgSalary} LPA` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none text-center">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">Academic Sections</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Explore the full range of parameters or take a direct action below.</p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-98"
                    >
                      Apply Now
                    </button>
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-450 dark:hover:text-blue-400 text-xs font-bold transition-all bg-slate-50 dark:bg-slate-950"
                    >
                      View Available Courses
                    </button>
                    <button 
                      onClick={() => setActiveTab('placements')}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-450 dark:hover:text-blue-400 text-xs font-bold transition-all bg-slate-50 dark:bg-slate-950"
                    >
                      Check Placements Report
                    </button>
                  </div>
                </div>

                {placements && recruitersList.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Top Recruiting Partners
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recruitersList.slice(0, 8).map((rec: string) => (
                        <span
                          key={rec}
                          className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-[10px] font-semibold text-indigo-650 dark:text-indigo-300"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Programs & Course Fees</h2>
              </div>

              {courses.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-slate-550 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-4 w-1/2">Course Title</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4 text-right">Annual Fees</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                          <td className="p-4 font-bold text-slate-900 dark:text-white leading-normal">{course.name}</td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{course.duration}</td>
                          <td className="p-4 text-right text-indigo-600 dark:text-indigo-300 font-extrabold">
                            ₹{course.fees.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  Course details are currently unavailable for this college.
                </div>
              )}
            </div>
          )}

          {/* PLACEMENTS TAB */}
          {activeTab === 'placements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Placement Statistics</h2>
                </div>

                {placements ? (
                  <div className="space-y-6">
                    {/* Salary bar chart */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-500 dark:text-slate-400">Average Salary Package</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{placements.avgSalary} LPA</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                            style={{ width: `${Math.min((placements.avgSalary / 30) * 100, 100)}%` }} // normalized against max of 30LPA for average
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-500 dark:text-slate-400">Highest Salary Package</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{placements.highSalary} LPA</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            style={{ width: `${Math.min((placements.highSalary / 160) * 100, 100)}%` }} // normalized against max of 160LPA
                          />
                        </div>
                      </div>
                    </div>

                    {/* Top recruiters list */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                        Top Recruiting Companies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {recruitersList.map((rec: string) => (
                          <span
                            key={rec}
                            className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-indigo-650 dark:text-indigo-300"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    Placement stats are currently unavailable for this college.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
              {/* Left Column: Reviews List */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm space-y-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Reviews ({reviews.length})</h2>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {reviews.length > 0 ? (
                    reviews.map((rev: any) => (
                      <ReviewCard key={rev.id} review={rev} />
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No reviews yet. Be the first to write a review!
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Write a Review Form */}
              <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                <div className="bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Write a review
                  </h3>
                  
                  {session ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Stars selection */}
                      <div>
                        <span className="block text-[10px] text-slate-500 font-semibold mb-1">YOUR RATING</span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="text-amber-400 transition-transform duration-150 hover:scale-120"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment Area */}
                      <div>
                        <span className="block text-[10px] text-slate-500 font-semibold mb-1">COMMENT</span>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience (campus life, curriculum, food...)"
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-550/50 focus:outline-none"
                        />
                      </div>

                      {submitError && (
                        <p className="text-[10px] text-rose-505 font-semibold">{submitError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-indigo-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-600 disabled:opacity-50 transition-all"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs text-slate-500 mb-3">
                        Log in to write a student review for this college.
                      </p>
                      <Link
                        href={`/auth/login?callbackUrl=${encodeURIComponent(
                          typeof window !== 'undefined' ? window.location.pathname : ''
                        )}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-750 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      >
                        Sign In to Review
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                Campus Life Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {campusImages.map((img, idx) => (
                  <div key={idx} className="group relative h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-xs font-bold text-white tracking-wide">{img.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISCUSSIONS TAB */}
          {activeTab === 'discussions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
              
              {/* Left column: Ask a Question Form */}
              <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                  Ask a Question
                </h3>
                {session ? (
                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                        Question Summary
                      </label>
                      <input
                        type="text"
                        value={newQuestionTitle}
                        onChange={(e) => setNewQuestionTitle(e.target.value)}
                        placeholder="What is coding culture like here?"
                        className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs text-slate-855 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-400 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                        More Context (Optional)
                      </label>
                      <textarea
                        value={newQuestionContent}
                        onChange={(e) => setNewQuestionContent(e.target.value)}
                        placeholder="Provide details about your query..."
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs text-slate-855 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingQuestion}
                      className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-650 py-2 text-xs font-bold text-white shadow-md transition-all"
                    >
                      {isSubmittingQuestion ? 'Posting...' : 'Post Question'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-500 mb-3 px-4">
                      Log in to ask a question about {college.name}.
                    </p>
                    <Link
                      href={`/auth/login?callbackUrl=${encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.pathname : ''
                      )}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-105 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-750 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    >
                      Sign In to Participate
                    </Link>
                  </div>
                )}
              </div>

              {/* Right column: Questions & Answers Feed */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 backdrop-blur-sm shadow-sm dark:shadow-none space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                  Q&A discussions ({collegeDiscussions.length})
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {collegeDiscussions.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No questions asked about this college yet. Be the first to ask!
                    </div>
                  ) : (
                    collegeDiscussions.map((q: any) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 space-y-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-550 font-bold uppercase tracking-wider">
                          <span>{q.user.name}</span>
                          <span>{new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{q.title}</h4>
                          {q.content && <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{q.content}</p>}
                        </div>

                        {/* Answers nested feed */}
                        {q.answers.length > 0 && (
                          <div className="pl-4 border-l border-slate-200 dark:border-slate-800 space-y-2 mt-2 pt-1.5">
                            {q.answers.map((ans: any) => (
                              <div key={ans.id} className="text-[11px] leading-relaxed">
                                <span className="font-bold text-slate-850 dark:text-slate-350">{ans.user.name}: </span>
                                <span className="text-slate-650 dark:text-slate-400">{ans.content}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Answer submit action */}
                        {activeAnsweringQuestionId === q.id ? (
                          <form onSubmit={(e) => handleAnswerSubmit(e, q.id)} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-900/40">
                            <input
                              type="text"
                              value={newAnswerContent}
                              onChange={(e) => setNewAnswerContent(e.target.value)}
                              placeholder="Type your answer..."
                              className="w-full bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-850 dark:text-white focus:outline-none"
                              required
                            />
                            <button
                              type="submit"
                              disabled={isSubmittingAnswer}
                              className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] px-3.5 py-1.5"
                            >
                              Post
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveAnsweringQuestionId(null)}
                              className="text-[10px] text-slate-400 hover:underline px-1"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : session ? (
                          <button
                            onClick={() => {
                              setActiveAnsweringQuestionId(q.id);
                              setNewAnswerContent('');
                            }}
                            className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
                          >
                            Answer this question
                          </button>
                        ) : null}

                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Application Popup Modal */}
      <ApplyModal
        college={college}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </main>
  );
}
