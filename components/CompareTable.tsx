'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Star, IndianRupee, MapPin, Briefcase, Award, GraduationCap, X } from 'lucide-react';
import { College } from '@/lib/types';

interface CompareTableProps {
  colleges: College[];
  onRemove: (id: string) => void;
}

export default function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/10 p-12 text-center shadow-sm dark:shadow-none">
        <GraduationCap className="h-12 w-12 text-slate-400 dark:text-slate-600" />
        <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-300">No colleges selected</h3>
        <p className="mt-2 text-xs text-slate-500 max-w-sm">
          Select colleges from the search page to compare their courses, fees, placements, and rankings side-by-side.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-600 transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  // Format fees
  const formatFees = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}/year`;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 backdrop-blur-sm shadow-sm dark:shadow-none">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
            <th className="p-5 font-bold text-slate-500 dark:text-slate-400 w-1/4">Comparison Specs</th>
            {colleges.map((col) => (
              <th key={col.id} className="p-5 relative w-1/4 group/column">
                <div className="flex flex-col gap-3">
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(col.id)}
                    className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all text-slate-400 dark:text-slate-500"
                    title="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* College Header */}
                  <div className="relative h-24 w-full overflow-hidden rounded-lg bg-slate-950">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-slate-950/50" />
                  </div>

                  <div>
                    <Link
                      href={`/colleges/${col.id}`}
                      className="text-sm font-extrabold text-slate-900 dark:text-white hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                    >
                      {col.name}
                    </Link>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
                      Estd {col.establishedYear}
                    </span>
                  </div>
                </div>
              </th>
            ))}
            {/* Pad column if less than 3 colleges */}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <th key={`empty-${i}`} className="p-5 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex flex-col items-center justify-center py-8">
                    <PlusPlaceholder />
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
          {/* Location */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Location
            </td>
            {colleges.map((col) => (
              <td key={col.id} className="p-5 font-medium text-slate-700 dark:text-slate-200">
                {col.location}
              </td>
            ))}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-loc-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>

          {/* Rating */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              Rating
            </td>
            {colleges.map((col) => (
              <td key={col.id} className="p-5">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                  <Star className="h-4 w-4 fill-amber-400" />
                  {col.rating.toFixed(1)} / 5.0
                </div>
              </td>
            ))}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-rate-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>

          {/* Fees */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Average Annual Fees
            </td>
            {colleges.map((col) => (
              <td key={col.id} className="p-5 font-bold text-indigo-600 dark:text-indigo-300">
                {formatFees(col.fees)}
              </td>
            ))}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-fees-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>

          {/* Average Package */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Average Package
            </td>
            {colleges.map((col) => {
              const placement = col.placements?.[0];
              return (
                <td key={col.id} className="p-5 font-bold text-emerald-600 dark:text-emerald-400">
                  {placement ? `${placement.avgSalary} LPA` : 'N/A'}
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-pkg-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>

          {/* Highest Package */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              Highest Package
            </td>
            {colleges.map((col) => {
              const placement = col.placements?.[0];
              return (
                <td key={col.id} className="p-5 font-extrabold text-emerald-600 dark:text-emerald-400">
                  {placement ? `${placement.highSalary} LPA` : 'N/A'}
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-high-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>

          {/* Recruiters */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              Top Recruiters
            </td>
            {colleges.map((col) => {
              const placement = col.placements?.[0];
              const recruiters = placement?.recruiters ? placement.recruiters.split(',') : [];
              return (
                <td key={col.id} className="p-5">
                  <div className="flex flex-wrap gap-1">
                    {recruiters.length > 0 ? (
                      recruiters.map((rec: string) => (
                        <span
                          key={rec}
                          className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-1 text-[10px] font-semibold text-purple-600 dark:text-purple-300"
                        >
                          {rec}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">N/A</span>
                    )}
                  </div>
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-rec-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>

          {/* Courses */}
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
            <td className="p-5 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Key Courses
            </td>
            {colleges.map((col) => {
              const courses = col.courses || [];
              return (
                <td key={col.id} className="p-5">
                  <ul className="space-y-1.5">
                    {courses.length > 0 ? (
                      courses.slice(0, 3).map((course) => (
                        <li key={course.id} className="text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-900 dark:text-white block leading-snug">{course.name}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {course.duration} &bull; ₹{course.fees.toLocaleString('en-IN')}
                          </span>
                        </li>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">N/A</span>
                    )}
                  </ul>
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-course-${i}`} className="p-5 bg-slate-50/50 dark:bg-slate-950/10" />
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PlusPlaceholder() {
  return (
    <Link href="/" className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
        <Trash2 className="h-4 w-4 rotate-45 text-slate-400 dark:text-slate-500" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">Add College</span>
    </Link>
  );
}
