'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import CompareTable from '@/components/CompareTable';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Columns, ArrowLeft, Bookmark, Search, Plus, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'loading'; message: string }>({
    type: 'idle',
    message: '',
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize from search URL parameters or localStorage fallback
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean);
      setCompareIds(ids);
      localStorage.setItem('compare_colleges', JSON.stringify(ids));
    } else {
      try {
        const stored = localStorage.getItem('compare_colleges');
        if (stored) {
          const ids = JSON.parse(stored);
          setCompareIds(ids);
          // Sync URL search params
          if (ids.length > 0) {
            router.replace(`/compare?ids=${ids.join(',')}`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  // Click outside close listener for additions dropdown
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // SWR fetch college comparison data (POST req can be simulated by GET or using a custom fetcher)
  // Let's use a POST query to '/api/colleges/compare' via SWR!
  const { data: compareResult, error, isLoading, mutate } = useSWR(
    compareIds.length > 0 ? ['/api/colleges/compare', compareIds] : null,
    async ([url, ids]) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: ids }),
      });
      return res.json();
    }
  );

  // Autocomplete search queries for adding colleges
  const { data: searchResult } = useSWR(
    searchQuery.trim().length > 1 ? `/api/colleges?search=${searchQuery}` : null,
    fetcher
  );

  const comparedColleges = compareResult?.success ? compareResult.data : [];
  const searchResultsList = searchResult?.success ? searchResult.data.colleges : [];

  // Remove college from checklist
  const handleRemove = (idToRemove: string) => {
    const updated = compareIds.filter((id) => id !== idToRemove);
    setCompareIds(updated);
    localStorage.setItem('compare_colleges', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare-updated'));

    // Update URL
    if (updated.length > 0) {
      router.replace(`/compare?ids=${updated.join(',')}`);
    } else {
      router.replace('/compare');
    }
    mutate();
  };

  // Add college from search dropdown
  const handleAdd = (idToAdd: string) => {
    if (compareIds.includes(idToAdd)) return;
    if (compareIds.length >= 3) {
      alert('You can compare a maximum of 3 colleges.');
      return;
    }
    const updated = [...compareIds, idToAdd];
    setCompareIds(updated);
    localStorage.setItem('compare_colleges', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare-updated'));
    router.replace(`/compare?ids=${updated.join(',')}`);
    setSearchQuery('');
    setShowDropdown(false);
    mutate();
  };

  // Save comparison list
  const handleSaveComparison = async () => {
    if (!session) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (compareIds.length === 0) return;

    setSaveStatus({ type: 'loading', message: 'Saving comparison set...' });

    try {
      const res = await fetch('/api/saved/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: compareIds }),
      });
      const data = await res.json();

      if (data.success) {
        setSaveStatus({ type: 'success', message: 'Comparison set saved successfully!' });
        setTimeout(() => setSaveStatus({ type: 'idle', message: '' }), 3000);
      } else {
        setSaveStatus({ type: 'error', message: data.message || 'Failed to save.' });
      }
    } catch (e) {
      setSaveStatus({ type: 'error', message: 'An unexpected error occurred.' });
    }
  };

  return (
    <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <Navbar />

      <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10">
        {/* Navigation Head */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-slate-900 pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-wider hover:text-indigo-500 dark:hover:text-indigo-300 uppercase mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Discover
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Columns className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              Compare Colleges
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Analyze parameters side-by-side. Make data-driven decisions.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search autocomplete widget to add college */}
            {compareIds.length < 3 && (
              <div ref={dropdownRef} className="relative w-64">
                <div className="relative flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 focus-within:border-indigo-500/50">
                  <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search college to add..."
                    className="w-full bg-transparent py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Dropdown Results */}
                {showDropdown && searchQuery.trim().length > 1 && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md max-h-60 overflow-y-auto">
                    {searchResultsList.length > 0 ? (
                      searchResultsList
                        .filter((col: any) => !compareIds.includes(col.id))
                        .map((col: any) => (
                          <button
                            key={col.id}
                            onClick={() => handleAdd(col.id)}
                            className="w-full text-left rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white flex items-center justify-between group"
                          >
                            <span className="truncate">{col.name}</span>
                            <Plus className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 shrink-0 ml-2" />
                          </button>
                        ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400 dark:text-slate-550">No colleges matched</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Save Comparison button */}
            {compareIds.length > 0 && (
              <button
                onClick={handleSaveComparison}
                disabled={saveStatus.type === 'loading'}
                className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                  saveStatus.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {saveStatus.type === 'success' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Save Comparison
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Display feedback status messages */}
        {saveStatus.message && saveStatus.type !== 'success' && (
          <div
            className={`mb-6 rounded-xl border p-4 text-xs font-semibold ${
              saveStatus.type === 'error'
                ? 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                : 'border-indigo-500/20 bg-indigo-500/5 text-indigo-300'
            }`}
          >
            {saveStatus.message}
          </div>
        )}

        {/* Compare specs list */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900/20 p-12">
            <SkeletonLoader type="list" count={5} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center text-rose-400">
            Failed to load comparison data.
          </div>
        ) : (
          <CompareTable colleges={comparedColleges} onRemove={handleRemove} />
        )}
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 animate-pulse">
        <Navbar />
        <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10">
          <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-900 mb-6" />
          <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" />
        </div>
      </main>
    }>
      <CompareContent />
    </Suspense>
  );
}
