'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, IndianRupee, Star, Briefcase, Plus, Check } from 'lucide-react';
import SaveButton from './SaveButton';
import { College } from '@/lib/types';

interface CollegeCardProps {
  college: College;
  isSelectedForCompare: boolean;
  onCompareToggle: () => void;
}

export default function CollegeCard({ college, isSelectedForCompare, onCompareToggle }: CollegeCardProps) {
  // Format fees to readable Indian format (e.g., 2.2 Lakhs or 35,000)
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Get placement salary if available
  const avgSalary = college.placements?.[0]?.avgSalary;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-indigo-500/10 hover:shadow-indigo-500/15 shadow-sm dark:shadow-none min-h-[400px] h-full">
      {/* Top Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Image
          src={college.image}
          alt={college.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-slate-900 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle();
            }}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all duration-300 shadow-sm ${
              isSelectedForCompare
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]'
            }`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Comparing
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Compare
              </>
            )}
          </button>

          {/* Bookmark Button */}
          <SaveButton collegeId={college.id} />
        </div>

        {/* NIRF Ranking Badge */}
        {college.nirfRanking && (
          <div className="absolute bottom-3 left-4 flex items-center gap-1 rounded-lg bg-indigo-600/90 text-white px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-indigo-500 shadow-sm backdrop-blur-sm">
            #{college.nirfRanking} NIRF Ranking
          </div>
        )}

        {/* Rating Overlay */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1 rounded-lg bg-white/90 dark:bg-slate-950/85 px-2 py-1 text-xs font-bold text-amber-500 dark:text-amber-400 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 dark:text-amber-400" />
          {college.rating.toFixed(1)}
        </div>
      </div>

      {/* Card Info Section */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/colleges/${college.id}`} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
            {college.name}
          </h3>
        </Link>

        {/* Course Tags */}
        {college.courseTypes && (
          <div className="mt-2 flex flex-wrap gap-1">
            {college.courseTypes.split(',').map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Location & Fees prominent row */}
        <div className="mt-3 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1 text-slate-650 dark:text-slate-400 font-medium">
            <MapPin className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span className="truncate max-w-[130px]">{college.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-0.5 text-blue-600 dark:text-blue-450 font-extrabold">
            <IndianRupee className="h-3.5 w-3.5 shrink-0" />
            <span>{formatFees(college.fees)} / Year</span>
          </div>
        </div>

        {/* Description brief */}
        <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {college.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
          {/* Established Year */}
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ESTABLISHED</span>
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              Year {college.establishedYear}
            </span>
          </div>

          {/* Placements info */}
          {avgSalary ? (
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avg Package</span>
              <div className="flex items-center justify-end text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5 gap-0.5">
                <Briefcase className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {avgSalary} LPA
              </div>
            </div>
          ) : (
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avg Package</span>
              <span className="block text-xs font-bold text-slate-400 mt-0.5">N/A</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/colleges/${college.id}`}
          className="mt-4 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-955/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
