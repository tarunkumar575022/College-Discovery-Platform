'use client';

import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRef } from 'react';

interface CityData {
  name: string;
  count: number;
  gradient: string;
  icon: string;
}

const cities: CityData[] = [
  { name: 'New Delhi', count: 2, gradient: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20', icon: '🏛️' },
  { name: 'Mumbai', count: 2, gradient: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20', icon: '🌊' },
  { name: 'Bengaluru', count: 2, gradient: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20', icon: '💻' },
  { name: 'Pune', count: 1, gradient: 'from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20', icon: '🏔️' },
  { name: 'Hyderabad', count: 4, gradient: 'from-purple-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20', icon: '🕌' },
  { name: 'Chennai', count: 2, gradient: 'from-sky-500/10 to-cyan-500/10 hover:from-sky-500/20 hover:to-cyan-500/20', icon: '🏖️' },
];

interface TopStudyPlacesProps {
  onSelectCity: (city: string) => void;
  activeCity: string;
}

export default function TopStudyPlaces({ onSelectCity, activeCity }: TopStudyPlacesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800/80 py-8 px-4 sm:px-8 lg:px-12 relative group/nav">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
            Top Study Places
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore and filter institutions in India's leading education hubs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm transition-all"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm transition-all"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x"
      >
        {cities.map((city) => {
          const isActive = activeCity.toLowerCase().includes(city.name.toLowerCase());
          return (
            <button
              key={city.name}
              onClick={() => onSelectCity(isActive ? '' : city.name)}
              className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-300 min-w-[200px] snap-start shrink-0 text-left ${
                isActive
                  ? 'border-blue-600 bg-blue-600/5 dark:bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-sm border border-slate-100 dark:border-slate-800 shrink-0 bg-gradient-to-br ${city.gradient}`}
              >
                {city.icon}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {city.name}
                </h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  <MapPin className="h-3 w-3 text-blue-500 shrink-0" />
                  {city.count} {city.count === 1 ? 'College' : 'Colleges'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
