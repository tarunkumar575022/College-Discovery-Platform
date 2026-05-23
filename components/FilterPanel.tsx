'use client';

import { SlidersHorizontal, MapPin, IndianRupee, Star, RotateCcw, Check, Briefcase, GraduationCap } from 'lucide-react';

interface FilterState {
  location: string;
  feesRange: string; // 'all', 'under1l', '1l-3l', '3l-5l', 'above5l'
  rating: number; // 0, 3.5, 4.0, 4.5
  courseType: string; // 'B.Tech', 'MBA', 'M.Tech', etc.
  ownership: string; // 'Government', 'Private'
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableLocations: string[];
  onClose?: () => void;
}

export default function FilterPanel({ filters, onFilterChange, availableLocations, onClose }: FilterPanelProps) {
  
  const handleLocationChange = (loc: string) => {
    onFilterChange({ ...filters, location: loc });
  };

  const handleFeesChange = (range: string) => {
    onFilterChange({ ...filters, feesRange: range });
  };

  const handleRatingChange = (rate: number) => {
    onFilterChange({ ...filters, rating: rate });
  };

  const handleCourseTypeChange = (course: string) => {
    onFilterChange({ ...filters, courseType: course });
  };

  const handleOwnershipChange = (owner: string) => {
    onFilterChange({ ...filters, ownership: owner });
  };

  const handleReset = () => {
    onFilterChange({
      location: '',
      feesRange: 'all',
      rating: 0,
      courseType: '',
      ownership: '',
    });
    if (onClose) onClose();
  };

  const feeOptions = [
    { label: 'Any Fees', value: 'all' },
    { label: 'Under ₹1 Lakh', value: 'under1l' },
    { label: '₹1L - ₹3 Lakhs', value: '1l-3l' },
    { label: '₹3L - ₹5 Lakhs', value: '3l-5l' },
    { label: 'Above ₹5 Lakhs', value: 'above5l' },
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '4.5+ Stars', value: 4.5 },
    { label: '4.0+ Stars', value: 4.0 },
    { label: '3.5+ Stars', value: 3.5 },
  ];

  // Calculate active filter count
  let activeCount = 0;
  if (filters.location) activeCount += 1;
  if (filters.feesRange !== 'all') activeCount += 1;
  if (filters.rating > 0) activeCount += 1;
  if (filters.courseType) activeCount += 1;
  if (filters.ownership) activeCount += 1;

  const isResetDisabled = !filters.location && filters.feesRange === 'all' && filters.rating === 0 && !filters.courseType && !filters.ownership;

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 backdrop-blur-sm shadow-sm dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Filters</h2>
          {activeCount > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-blue-500 px-2 text-[10px] font-black text-white shadow-sm shadow-blue-500/20">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {/* Course Type Filter */}
        <div>
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Course Type</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {['all', 'B.Tech', 'MBA', 'M.Tech', 'MCA', 'B.E.'].map((course) => {
              const isSelected = course === 'all' ? !filters.courseType : filters.courseType === course;
              return (
                <button
                  key={course}
                  type="button"
                  onClick={() => handleCourseTypeChange(course === 'all' ? '' : course)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-605 dark:text-slate-400 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {course === 'all' ? 'All Courses' : course}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Location</span>
          </div>
          <div className="mt-2.5 relative flex items-center">
            <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <select
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-705 dark:text-slate-300 focus:border-blue-500 hover:border-blue-500/60 dark:focus:border-blue-500 dark:hover:border-blue-500/40 focus:outline-none transition-colors duration-205 cursor-pointer appearance-none"
            >
              <option value="">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        {/* Fees Filter */}
        <div>
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <IndianRupee className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Annual Fees</span>
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5">
            {feeOptions.map((opt) => {
              const isSelected = filters.feesRange === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleFeesChange(opt.value)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <Star className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Minimum Rating</span>
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5">
            {ratingOptions.map((opt) => {
              const isSelected = filters.rating === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleRatingChange(opt.value)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{opt.label}</span>
                    {opt.value > 0 && (
                      <div className="flex items-center">
                        {Array.from({ length: Math.floor(opt.value) }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        ))}
                        {opt.value % 1 !== 0 && (
                          <Star key="half" className="h-3 w-3 fill-yellow-500 text-yellow-500 opacity-80" />
                        )}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ownership Filter */}
        <div>
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-3">
            <Briefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Ownership</span>
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5">
            {[
              { label: 'All Types', value: '' },
              { label: 'Government', value: 'Government' },
              { label: 'Private', value: 'Private' },
            ].map((opt) => {
              const isSelected = filters.ownership === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleOwnershipChange(opt.value)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear All Filters Button */}
        <button
          onClick={handleReset}
          disabled={isResetDisabled}
          className="mt-6 w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-955 transition-all duration-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
