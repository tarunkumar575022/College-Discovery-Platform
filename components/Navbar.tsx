'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { GraduationCap, Bookmark, Columns, LogIn, LogOut, UserPlus, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [compareCount, setCompareCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  // Close explore mega menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.explore-menu-container')) {
        setIsExploreOpen(false);
      }
    };
    if (isExploreOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isExploreOpen]);

  // Scroll event listener to toggle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    checkCompareCount(); // call here as well

    // Listen for custom storage events when user updates comparison checklist
    window.addEventListener('storage', checkCompareCount);
    window.addEventListener('compare-updated', checkCompareCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkCompareCount);
      window.removeEventListener('compare-updated', checkCompareCount);
    };
  }, []);

  const checkCompareCount = () => {
    try {
      const stored = localStorage.getItem('compare_colleges');
      if (stored) {
        const ids = JSON.parse(stored);
        setCompareCount(ids.length);
      } else {
        setCompareCount(0);
      }
    } catch (e) {
      setCompareCount(0);
    }
  };

  // Sync current theme state on mount
  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)]' : ''}`}>
      <div className="w-full max-w-none px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950">
                  <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-slate-900 dark:from-white via-slate-700 dark:via-slate-100 to-indigo-600 dark:to-indigo-400 bg-clip-text text-xl font-bold tracking-wider text-transparent sm:block hidden">
                Edu<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-205 ${
                isActive('/') && !isExploreOpen
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 mt-1 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 pb-1'
              }`}
            >
              Discover
            </Link>

            {/* Explore Mega Menu */}
            <div className="relative explore-menu-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExploreOpen(!isExploreOpen);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-205 pb-1 ${
                  isExploreOpen
                    ? 'text-indigo-650 dark:text-indigo-400 border-b-2 border-indigo-650 dark:border-indigo-400 mt-1 font-semibold'
                    : 'text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Explore
                <svg
                  className={`h-4 w-4 fill-current transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {/* Mega Menu Dropdown Panel */}
              {isExploreOpen && (
                <div className="absolute left-1/2 -translate-x-[40%] top-full mt-4 z-50 w-[700px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl backdrop-blur-md grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-2">
                      Colleges & Reviews
                    </h4>
                    <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Top Universities & Colleges</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Popular Courses</Link>
                      <Link href="/colleges/1" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Read College Reviews</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Admission Alerts 2026</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">College Predictor</Link>
                      <Link href="/saved" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Bookmarked Profiles</Link>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-2">
                      Tools & Exams
                    </h4>
                    <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      <Link href="/compare" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Compare Colleges</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Study Abroad</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Entrance Exams</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Education Loan Alerts</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Scholarship Schemes</Link>
                      <Link href="/" onClick={() => setIsExploreOpen(false)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Course Finder</Link>
                    </div>
                  </div>

                  {/* Column 3 (Banner Card) */}
                  <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900/60 p-5 border border-amber-200/40 dark:border-slate-800 flex flex-col justify-between text-center relative overflow-hidden">
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest">
                        Write a Review
                      </h4>
                      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-350 leading-snug">
                        Share your campus experience & help other students choose!
                      </p>
                      <div className="flex justify-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="text-amber-500">★</span>
                        ))}
                      </div>
                    </div>
                    
                    <Link
                      href="/colleges/1"
                      onClick={() => setIsExploreOpen(false)}
                      className="mt-4 inline-block w-full rounded-xl bg-orange-600 hover:bg-orange-700 dark:bg-amber-600 dark:hover:bg-amber-700 py-2 text-xs font-bold text-white shadow-md transition-all duration-200"
                    >
                      Write Review Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              href="/compare"
              className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-205 ${
                isActive('/compare') 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 mt-1 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 pb-1'
              }`}
            >
              <Columns className="h-4 w-4" />
              Compare
              {compareCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-1.5 text-xs font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] animate-pulse">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              href="/saved"
              className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-205 ${
                isActive('/saved') 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 mt-1 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 pb-1'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Bookmarks
            </Link>

            <Link
              href="/discussions"
              className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-205 ${
                isActive('/discussions') 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 mt-1 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 pb-1'
              }`}
            >
              Discussions
            </Link>
          </div>

          {/* Controls Panel */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-500" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-600" />
              )}
            </button>

            {/* Small screen Compare indicator */}
            <Link href="/compare" className="relative md:hidden flex items-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
              <Columns className="h-5 w-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold text-white">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link href="/saved" className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
              <Bookmark className="h-5 w-5" />
            </Link>

            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-slate-900 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                      {session.user?.name ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                  </div>
                  <span className="hidden lg:block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all duration-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all duration-200"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden sm:flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/20 transition-all duration-200"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
