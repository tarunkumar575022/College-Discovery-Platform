'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import SkeletonLoader from '@/components/SkeletonLoader';
import { MessageSquare, Calendar, User, Search, Plus, MapPin, CheckCircle, ArrowRight, CornerDownRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DiscussionsPage() {
  const { data: session } = useSession();
  
  // SWR fetches
  const { data: discussionsData, error: discussionsError, isLoading: discussionsLoading, mutate: mutateDiscussions } = useSWR('/api/discussions', fetcher);
  const { data: collegesData } = useSWR('/api/colleges?limit=100', fetcher);

  const questions = discussionsData?.success ? discussionsData.data : [];
  const colleges = collegesData?.success ? collegesData.data.colleges : [];

  // Active state
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  // Ask Question Form state
  const [isAsking, setIsAsking] = useState(false);
  const [askTitle, setAskTitle] = useState('');
  const [askContent, setAskContent] = useState('');
  const [askCollegeId, setAskCollegeId] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Submit Answer state
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Set first question as active by default on load
  useEffect(() => {
    if (questions.length > 0 && !activeQuestionId) {
      setActiveQuestionId(questions[0].id);
    }
  }, [questions, activeQuestionId]);

  const activeQuestion = questions.find((q: any) => q.id === activeQuestionId);

  // Filtered questions list
  const filteredQuestions = questions.filter((q: any) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          (q.content && q.content.toLowerCase().includes(search.toLowerCase()));
    const matchesCollege = selectedCollegeId ? q.collegeId === selectedCollegeId : true;
    return matchesSearch && matchesCollege;
  });

  const handleAskQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askTitle.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: askTitle,
          content: askContent,
          collegeId: askCollegeId || null
        })
      });
      const result = await res.json();
      if (result.success) {
        setAskTitle('');
        setAskContent('');
        setAskCollegeId('');
        setIsAsking(false);
        // Refresh SWR
        mutateDiscussions();
        // Make the new question active
        setActiveQuestionId(result.data.id);
      } else {
        alert(result.message || 'Failed to submit question.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim() || !activeQuestionId) return;

    setIsSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/discussions/${activeQuestionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent })
      });
      const result = await res.json();
      if (result.success) {
        setAnswerContent('');
        // Refresh SWR list to display the new answer instantly
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

  return (
    <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <Navbar />

      <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-8 flex flex-col h-[calc(100vh-64px)]">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 shrink-0">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Q&A Discussion Board
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ask questions, answer peers, and discover insights directly from campus seniors
            </p>
          </div>
          <button
            onClick={() => {
              if (!session) {
                alert('Please sign in to ask questions.');
                return;
              }
              setIsAsking(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-md shadow-blue-500/10 shrink-0"
          >
            <Plus className="h-4 w-4" /> Ask a Question
          </button>
        </div>

        {/* Global Split Forum View */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8 py-6 relative">
          
          {/* LEFT PANEL: Questions list and Search filters */}
          <div className="lg:col-span-1 flex flex-col min-h-0 h-full space-y-4">
            
            {/* Search Input and College Filters */}
            <div className="space-y-2.5 shrink-0">
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 focus-within:border-blue-500/50">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800 dark:text-slate-200"
              >
                <option value="">All Colleges & General Discussions</option>
                {colleges.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions Feed Scrollbox */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-4">
              {discussionsLoading ? (
                <SkeletonLoader type="card" count={3} />
              ) : discussionsError ? (
                <div className="p-6 text-center text-xs text-rose-500 font-semibold border border-rose-500/10 rounded-xl bg-rose-500/5">
                  Failed to load discussions.
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/20">
                  No matching questions found. Be the first to ask!
                </div>
              ) : (
                filteredQuestions.map((q: any) => {
                  const isActive = q.id === activeQuestionId;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveQuestionId(q.id);
                        setIsAsking(false);
                      }}
                      className={`w-full p-4 text-left rounded-2xl border transition-all duration-200 block ${
                        isActive
                          ? 'border-blue-600 bg-blue-600/5 dark:bg-blue-600/10 shadow-[0_0_12px_rgba(37,99,235,0.06)]'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/25 hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          <User className="h-3 w-3 text-blue-500 shrink-0" />
                          <span>{q.user.name}</span>
                        </div>
                        {q.college && (
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-md font-bold text-indigo-650 dark:text-indigo-400 max-w-[120px] truncate">
                            {q.college.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {q.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-3 pt-2 border-t border-slate-100 dark:border-slate-900/60">
                        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                        <span>{q.answers.length} Answers</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT PANEL: Dynamic Question Details + Answers, OR "Ask Question" form */}
          <div className="lg:col-span-2 flex flex-col min-h-0 h-full bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
            
            {isAsking ? (
              /* ASK QUESTION FORM */
              <form onSubmit={handleAskQuestionSubmit} className="flex-1 flex flex-col min-h-0 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 shrink-0">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Ask a General or College Question
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAsking(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 hover:underline font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
                  {/* Title */}
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      value={askTitle}
                      onChange={(e) => setAskTitle(e.target.value)}
                      placeholder="e.g. Is it easy to get internships at IIT Delhi?"
                      className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-500 font-bold placeholder-slate-400"
                      required
                    />
                  </div>

                  {/* Associated College */}
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                      Link to a Specific College (Optional)
                    </label>
                    <select
                      value={askCollegeId}
                      onChange={(e) => setAskCollegeId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs font-bold focus:outline-none focus:border-blue-505 cursor-pointer text-slate-800 dark:text-slate-200"
                    >
                      <option value="">General (No College Link)</option>
                      {colleges.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content / Details */}
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                      Question Context / Details
                    </label>
                    <textarea
                      value={askContent}
                      onChange={(e) => setAskContent(e.target.value)}
                      placeholder="Provide background info, branch preferences, or specific things you want to know..."
                      rows={6}
                      className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Actions CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-900 shrink-0">
                  <button
                    type="submit"
                    disabled={isSubmittingQuestion}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all uppercase tracking-wider"
                  >
                    {isSubmittingQuestion ? 'Posting Question...' : 'Submit Question'}
                  </button>
                </div>
              </form>
            ) : activeQuestion ? (
              /* DETAILED VIEW */
              <div className="flex-1 flex flex-col min-h-0">
                {/* Header detail */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 shrink-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {activeQuestion.user.name}
                    </span>
                    <span className="text-slate-300 dark:text-slate-800 font-light">|</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {new Date(activeQuestion.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {activeQuestion.title}
                  </h2>
                  {activeQuestion.content && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-line leading-relaxed">
                      {activeQuestion.content}
                    </p>
                  )}

                  {activeQuestion.college && (
                    <div className="flex items-center mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
                      <Link
                        href={`/colleges/${activeQuestion.college.id}`}
                        className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10"
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        Discuss {activeQuestion.college.name} Profile
                      </Link>
                    </div>
                  )}
                </div>

                {/* Answers list scroll container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-50/20 dark:bg-slate-950/10">
                  <h3 className="text-[10px] font-bold text-slate-550 dark:text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                    Answers ({activeQuestion.answers.length})
                  </h3>

                  {activeQuestion.answers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No answers yet. Share your experience and help this peer!
                    </div>
                  ) : (
                    activeQuestion.answers.map((ans: any) => (
                      <div 
                        key={ans.id} 
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-900">
                          <span className="text-[10px] text-slate-650 dark:text-slate-350 font-bold uppercase tracking-wider flex items-center gap-1">
                            <CornerDownRight className="h-3.5 w-3.5 text-blue-500" />
                            {ans.user.name}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(ans.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {ans.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Answer area */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shrink-0">
                  {session ? (
                    <form onSubmit={handleAnswerSubmit} className="flex gap-2 items-center">
                      <textarea
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        placeholder="Write a helpful answer..."
                        rows={1}
                        className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingAnswer}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all shrink-0 uppercase tracking-wider"
                      >
                        {isSubmittingAnswer ? 'Posting...' : 'Answer'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250 dark:border-slate-850">
                      <p className="text-xs text-slate-505">
                        Log in to participate and post an answer on this thread.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* EMPTY PLACEHOLDER */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-550">
                <MessageSquare className="h-10 w-10 text-slate-400 mb-2" />
                <span className="text-xs font-bold">Select a question to view discussion details</span>
              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}
