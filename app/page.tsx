'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import CollegeCard from '@/components/CollegeCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { GraduationCap, ArrowRight, ArrowLeft, X, Columns, Sparkles, SlidersHorizontal, Briefcase, TrendingUp, Palette, Beaker } from 'lucide-react';
import Link from 'next/link';


interface FilterState {
  location: string;
  feesRange: string;
  rating: number;
  courseType: string;
  ownership: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const popularLocations = [
  'Mumbai, Maharashtra',
  'New Delhi, Delhi',
  'Warangal, Telangana',
  'Pilani, Rajasthan',
  'Vellore, Tamil Nadu',
  'Hyderabad, Telangana',
  'Manipal, Karnataka',
  'Chennai, Tamil Nadu',
  'Noida, Uttar Pradesh',
  'Bengaluru, Karnataka',
  'Coimbatore, Tamil Nadu',
  'Patiala, Punjab',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
];

const studyGoals = [
  {
    name: 'Engineering',
    count: '6,384 Colleges',
    iconName: 'engineering',
    links: [
      { label: 'BE/B.Tech', courseVal: 'B.Tech' },
      { label: 'ME/M.Tech', courseVal: 'M.Tech' },
      { label: 'B.E.', courseVal: 'B.E.' }
    ]
  },
  {
    name: 'Management',
    count: '8,087 Colleges',
    iconName: 'management',
    links: [
      { label: 'MBA/PGDM', courseVal: 'MBA' },
      { label: 'Executive MBA', courseVal: 'MBA' },
      { label: 'BBA', courseVal: 'BBA' }
    ]
  },
  {
    name: 'Commerce',
    count: '5,113 Colleges',
    iconName: 'commerce',
    links: [
      { label: 'B.Com', courseVal: 'B.Com' },
      { label: 'M.Com', courseVal: 'M.Com' }
    ]
  },
  {
    name: 'Arts',
    count: '5,741 Colleges',
    iconName: 'arts',
    links: [
      { label: 'BA', courseVal: 'BA' },
      { label: 'MA', courseVal: 'MA' }
    ]
  },
  {
    name: 'Science',
    count: '4,923 Colleges',
    iconName: 'science',
    links: [
      { label: 'B.Sc', courseVal: 'B.Sc' },
      { label: 'M.Sc', courseVal: 'M.Sc' }
    ]
  }
];

const renderGoalIcon = (iconName: string) => {
  switch (iconName) {
    case 'engineering':
      return <GraduationCap className="h-5 w-5" />;
    case 'management':
      return <Briefcase className="h-5 w-5" />;
    case 'commerce':
      return <TrendingUp className="h-5 w-5" />;
    case 'arts':
      return <Palette className="h-5 w-5" />;
    case 'science':
      return <Beaker className="h-5 w-5" />;
    default:
      return <GraduationCap className="h-5 w-5" />;
  }
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    feesRange: 'all',
    rating: 0,
    courseType: '',
    ownership: '',
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareColleges, setCompareColleges] = useState<any[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  // Sync comparison selections from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('compare_colleges');
      if (stored) {
        setCompareIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse compare_colleges', e);
    }
  }, []);

  // Load recent visits from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_visits');
      if (stored) {
        setRecentVisits(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent visits', e);
    }
  }, []);

  // Compute fees boundaries from selection ranges
  let feesMin = 0;
  let feesMax = Number.MAX_SAFE_INTEGER;
  if (filters.feesRange === 'under1l') {
    feesMax = 100000;
  } else if (filters.feesRange === '1l-3l') {
    feesMin = 100000;
    feesMax = 300000;
  } else if (filters.feesRange === '3l-5l') {
    feesMin = 300000;
    feesMax = 500000;
  } else if (filters.feesRange === 'above5l') {
    feesMin = 500000;
  }

  // Construct search query
  const queryParams = new URLSearchParams();
  if (search) queryParams.set('search', search);
  if (filters.location) queryParams.set('location', filters.location.split(',')[0]); // search by city substring
  if (filters.rating > 0) queryParams.set('rating', filters.rating.toString());
  if (feesMin > 0) queryParams.set('feesMin', feesMin.toString());
  if (feesMax < Number.MAX_SAFE_INTEGER) queryParams.set('feesMax', feesMax.toString());
  if (filters.courseType) queryParams.set('courseType', filters.courseType);
  if (filters.ownership) queryParams.set('ownership', filters.ownership);
  queryParams.set('page', page.toString());

  const { data, error, isLoading } = useSWR(`/api/colleges?${queryParams.toString()}`, fetcher);



  // Fetch full details for colleges in comparison drawer
  const { data: compareData } = useSWR(
    compareIds.length > 0 ? `/api/colleges?limit=100` : null,
    fetcher
  );

  useEffect(() => {
    if (compareData?.success && compareIds.length > 0) {
      // Find matches in the all-college database query
      const allColleges = compareData.data.colleges || [];
      const matched = compareIds
        .map((id) => allColleges.find((c: any) => c.id === id))
        .filter(Boolean);
      setCompareColleges(matched);
    } else if (compareIds.length === 0) {
      setCompareColleges([]);
    }
  }, [compareData, compareIds]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1); // Reset to page 1 on search change
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 on filter change
  };

  // Compare Checklist actions
  const toggleCompare = (collegeId: string) => {
    let updated: string[];
    if (compareIds.includes(collegeId)) {
      updated = compareIds.filter((id) => id !== collegeId);
    } else {
      if (compareIds.length >= 3) {
        alert('You can compare a maximum of 3 colleges at once.');
        return;
      }
      updated = [...compareIds, collegeId];
    }
    setCompareIds(updated);
    localStorage.setItem('compare_colleges', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare-updated'));
  };

  const clearCompare = () => {
    setCompareIds([]);
    localStorage.removeItem('compare_colleges');
    window.dispatchEvent(new Event('compare-updated'));
  };

  const colleges = data?.success ? data.data.colleges : [];
  const pagination = data?.success ? { page: data.data.page, pages: data.data.pages, total: data.data.total } : { page: 1, pages: 1, total: 0 };

  return (
    <main className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900/20 py-16 border-b border-slate-200 dark:border-slate-900/60">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 text-center relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            Discover Your Dream Education
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Explore India’s Top <span className="bg-gradient-to-r from-indigo-500 via-purple-550 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Colleges</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Compare placements, annual fees, courses, and genuine student reviews side-by-side. Your future, simplified.
          </p>
          
          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar initialValue={search} onSearch={handleSearch} />

            {/* Your Recent Visits */}
            {recentVisits.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 select-none animate-in fade-in duration-200">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-500">
                  Your Recent Visits:
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {recentVisits.map((v: any) => (
                    <Link
                      key={v.id}
                      href={`/colleges/${v.id}`}
                      className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:text-indigo-650 dark:hover:text-indigo-400 hover:border-indigo-500/30 font-semibold transition-all duration-200"
                    >
                      {v.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filter Chips */}
            {(() => {
              const activeChips: { type: string; label: string; onRemove: () => void }[] = [];
              if (filters.location) {
                activeChips.push({
                  type: 'location',
                  label: `Location: ${filters.location.split(',')[0]}`,
                  onRemove: () => handleFilterChange({ ...filters, location: '' }),
                });
              }
              if (filters.feesRange !== 'all') {
                let feeLabel = '';
                if (filters.feesRange === 'under1l') feeLabel = 'Under ₹1 Lakh';
                else if (filters.feesRange === '1l-3l') feeLabel = '₹1L - ₹3 Lakhs';
                else if (filters.feesRange === '3l-5l') feeLabel = '₹3L - ₹5 Lakhs';
                else if (filters.feesRange === 'above5l') feeLabel = 'Above ₹5 Lakhs';
                activeChips.push({
                  type: 'fees',
                  label: `Fees: ${feeLabel}`,
                  onRemove: () => handleFilterChange({ ...filters, feesRange: 'all' }),
                });
              }
              if (filters.rating > 0) {
                activeChips.push({
                  type: 'rating',
                  label: `Rating: ${filters.rating}+ Stars`,
                  onRemove: () => handleFilterChange({ ...filters, rating: 0 }),
                });
              }

              if (filters.courseType) {
                activeChips.push({
                  type: 'courseType',
                  label: `Course: ${filters.courseType}`,
                  onRemove: () => handleFilterChange({ ...filters, courseType: '' }),
                });
              }
              if (filters.ownership) {
                activeChips.push({
                  type: 'ownership',
                  label: `Type: ${filters.ownership}`,
                  onRemove: () => handleFilterChange({ ...filters, ownership: '' }),
                });
              }

              if (activeChips.length === 0) return null;

              return (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-in fade-in slide-in-from-top-1 duration-205">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mr-1">
                    Active Filters:
                  </span>
                  {activeChips.map((chip) => (
                    <span
                      key={chip.type}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-indigo-650 dark:text-indigo-300 shadow-sm transition-all"
                    >
                      {chip.label}
                      <button
                        onClick={chip.onRemove}
                        className="p-0.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-400 hover:text-indigo-650 dark:hover:text-indigo-200 transition-colors shrink-0"
                        title="Remove filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => handleFilterChange({ location: '', feesRange: 'all', rating: 0, courseType: '', ownership: '' })}
                    className="text-[10px] text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-350 font-bold uppercase tracking-wider hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Select Your Study Goal Section */}
      <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800/80">
        <h2 className="text-xl font-extrabold text-slate-850 dark:text-white mb-6 text-center sm:text-left">
          Select Your Study Goal
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {studyGoals.map((goal) => (
            <div 
              key={goal.name}
              className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/45 dark:bg-slate-900/40 hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-indigo-500/10 transition-all duration-300 min-h-[170px]"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-450 border border-blue-200 dark:border-blue-500/30 shrink-0">
                  {renderGoalIcon(goal.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {goal.name}
                  </h3>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {goal.count}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {goal.links.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleFilterChange({ ...filters, courseType: link.courseVal })}
                    className="text-left text-xs font-semibold text-slate-655 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMobileFiltersOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Drawer container */}
        <div
          className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-950 p-6 shadow-2xl transition-transform duration-350 ease-out flex flex-col ${
            isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header with Close button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Filters</span>
            </div>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-slate-200 dark:border-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              availableLocations={popularLocations}
              onClose={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Main Grid Content (All Colleges Explorer Directory) */}
      <div id="all-colleges-section" className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-12">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
            All Colleges Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and compare across all {pagination.total} institutions in our database
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Side Filter Panel (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-[80px] lg:h-fit">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              availableLocations={popularLocations}
            />
          </aside>

          {/* Results Grid */}
          <section className="lg:col-span-3 space-y-6">
            {/* Explore Programs Pill Row */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm dark:shadow-none">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Explore Programs
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { label: 'All Programs', value: '' },
                  { label: 'B.Tech', value: 'B.Tech' },
                  { label: 'MBA', value: 'MBA' },
                  { label: 'M.Tech', value: 'M.Tech' },
                  { label: 'MCA', value: 'MCA' },
                  { label: 'B.E.', value: 'B.E.' },
                  { label: 'B.Sc', value: 'B.Sc' },
                  { label: 'BA', value: 'BA' },
                  { label: 'B.Com', value: 'B.Com' },
                ].map((prog) => {
                  const isSelected = filters.courseType === prog.value;
                  return (
                    <button
                      key={prog.value}
                      onClick={() => handleFilterChange({ ...filters, courseType: prog.value })}
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-205 shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400 hover:border-blue-500/40 hover:text-blue-650 dark:hover:text-blue-400'
                      }`}
                    >
                      {prog.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Filters Toggle Button */}
            <div className="flex lg:hidden items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">
                Filters & Sorting
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
                Show Filters
                {(() => {
                  let activeCount = 0;
                  if (filters.location) activeCount += 1;
                  if (filters.feesRange !== 'all') activeCount += 1;
                  if (filters.rating > 0) activeCount += 1;
                  return activeCount > 0 ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-black text-white ml-0.5">
                      {activeCount}
                    </span>
                  ) : null;
                })()}
              </button>
            </div>

            {isLoading ? (
              <SkeletonLoader type="card" count={6} />
            ) : error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
                <p className="text-sm text-rose-400 font-medium">Failed to load colleges. Please check your connection.</p>
              </div>
            ) : colleges.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 p-16 text-center shadow-sm dark:shadow-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500 shadow-md">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">No colleges found</h3>
                <p className="mt-2 text-sm text-slate-605 dark:text-slate-500 max-w-sm">
                  We couldn't find any colleges matching your search query or filters. Try adjusting your filter tags.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setFilters({ location: '', feesRange: 'all', rating: 0, courseType: '', ownership: '' });
                  }}
                  className="mt-6 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Result counts */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Showing {colleges.length} of {pagination.total} Colleges</span>
                  <span>Page {pagination.page} of {pagination.pages}</span>
                </div>

                {/* College Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {colleges.map((col: any) => (
                    <CollegeCard
                      key={col.id}
                      college={col}
                      isSelectedForCompare={compareIds.includes(col.id)}
                      onCompareToggle={() => toggleCompare(col.id)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-900">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm dark:shadow-none"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none select-none">
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                      disabled={page === pagination.pages}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm dark:shadow-none"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>



      {/* Sticky Bottom Comparison Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.3)] transition-all duration-300 animate-in slide-in-from-bottom">
          <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {compareIds.length} {compareIds.length === 1 ? 'College' : 'Colleges'} Selected
              </span>
              <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
              <div className="hidden sm:flex flex-wrap items-center gap-1.5">
                {compareColleges.map((col) => (
                  <span
                    key={col.id}
                    className="inline-block rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[150px] truncate"
                  >
                    {col.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-350 font-bold uppercase tracking-wider transition-colors"
                title="Clear all"
              >
                Clear All
              </button>
              <Link
                href={`/compare?ids=${compareIds.join(',')}`}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200"
              >
                Compare Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
