'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CollegeCard from '@/components/CollegeCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Bookmark, Columns, Trash2, ArrowRight, Sparkles, LogIn, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SavedDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'colleges' | 'comparisons'>('colleges');

  // Route Protection: Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=' + encodeURIComponent('/saved'));
    }
  }, [status, router]);

  // Fetch saved bookmarks
  const { data: savedCollegesData, isLoading: loadingColleges, mutate: mutateColleges } = useSWR(
    status === 'authenticated' ? '/api/saved' : null,
    fetcher
  );

  // Fetch saved comparisons
  const { data: savedComparisonsData, isLoading: loadingComparisons, mutate: mutateComparisons } = useSWR(
    status === 'authenticated' ? '/api/saved/comparisons' : null,
    fetcher
  );

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-200">
        <Navbar />
        <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-12 flex justify-center">
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-pulse">
            Authenticating Session...
          </div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 flex flex-col justify-center items-center transition-colors duration-200">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-bold">Access Protected</h2>
          <p className="text-sm text-slate-500">Redirecting to sign-in page...</p>
        </div>
      </main>
    );
  }

  const savedColleges = savedCollegesData?.success ? savedCollegesData.data : [];
  const savedComparisons = savedComparisonsData?.success ? savedComparisonsData.data : [];

  // Handle deleting saved comparison set
  const handleDeleteComparison = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this saved comparison?')) return;

    try {
      const res = await fetch(`/api/saved/comparisons/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        mutateComparisons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <Navbar />

      <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10">
        {/* Header Title */}
        <div className="space-y-1 mb-8 border-b border-slate-200 dark:border-slate-900 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Bookmarks
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-500 font-medium">
            Manage your bookmark list of colleges and saved side-by-side comparison profiles.
          </p>
        </div>

        {/* Dynamic Tab Controls */}
        <div className="flex gap-2 rounded-xl bg-slate-200/60 dark:bg-slate-900/60 p-1 border border-slate-250 dark:border-slate-900 w-fit mb-8">
          <button
            onClick={() => setActiveTab('colleges')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 ${
              activeTab === 'colleges'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Bookmarked Colleges ({savedColleges.length})
          </button>
          
          <button
            onClick={() => setActiveTab('comparisons')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 ${
              activeTab === 'comparisons'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns className="h-4 w-4" />
            Saved Comparisons ({savedComparisons.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'colleges' ? (
          <div>
            {loadingColleges ? (
              <SkeletonLoader type="card" count={3} />
            ) : savedColleges.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/10 p-16 text-center shadow-sm dark:shadow-none">
                <Bookmark className="h-10 w-10 text-slate-400 dark:text-slate-600" />
                <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-300">No bookmarked colleges</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  Save colleges by clicking the heart bookmark icon on the search cards list.
                </p>
                <Link
                  href="/"
                  className="mt-6 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-600 transition-colors"
                >
                  Discover Colleges
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedColleges.map((item: any) => (
                  <CollegeCard
                    key={item.id}
                    college={item.college}
                    isSelectedForCompare={false}
                    onCompareToggle={() => {}} // disabled on bookmark tab
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {loadingComparisons ? (
              <SkeletonLoader type="list" count={3} />
            ) : savedComparisons.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/10 p-16 text-center shadow-sm dark:shadow-none">
                <Columns className="h-10 w-10 text-slate-400 dark:text-slate-600" />
                <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-300">No saved comparisons</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  Go to compare page and click Save Comparison to bookmark parameters for later.
                </p>
                <Link
                  href="/"
                  className="mt-6 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-600 transition-colors"
                >
                  Discover Colleges
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedComparisons.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-200 shadow-sm dark:shadow-none"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Comparison Set</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-600 font-semibold">&bull; {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.colleges.map((col: any) => (
                          <span
                            key={col.id}
                            className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300"
                          >
                            {col.name} ({col.location.split(',')[0]})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        onClick={(e) => handleDeleteComparison(item.id, e)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-400 dark:text-slate-500 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 transition-all"
                        title="Delete saved comparison"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/compare?ids=${item.collegeIds}`}
                        className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all shadow-sm dark:shadow-none"
                      >
                        Reload
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
