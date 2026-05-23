'use client';

import { ArrowUpRight } from 'lucide-react';

interface CourseItem {
  label: string;
  value: string;
}

const courses: CourseItem[] = [
  { label: 'BE/B.Tech', value: 'B.Tech' },
  { label: 'BA', value: 'BA' },
  { label: 'B.Sc', value: 'B.Sc' },
  { label: 'MBA/PGDM', value: 'MBA' },
  { label: 'M.Sc', value: 'M.Sc' },
  { label: 'ME/M.Tech', value: 'M.Tech' },
  { label: 'MA', value: 'MA' },
  { label: 'Polytechnic', value: 'B.Tech' },
  { label: 'BE/B.Tech Lateral', value: 'B.Tech' },
  { label: 'M.Phil/Ph.D in Science', value: 'PhD' },
  { label: 'B.Com', value: 'B.Com' },
  { label: 'BBA/BMS', value: 'BBA' },
  { label: 'MD', value: 'MBBS' },
  { label: 'M.Phil/Ph.D in Arts', value: 'PhD' },
  { label: 'M.Phil/Ph.D in Engineering', value: 'PhD' },
];

interface TopCoursesProps {
  onSelectCourse: (course: string) => void;
}

export default function TopCourses({ onSelectCourse }: TopCoursesProps) {
  const handleClick = (value: string) => {
    onSelectCourse(value);
    
    // Smooth scroll up to All Colleges Directory
    const el = document.getElementById('all-colleges-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800/80 py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
            Top Courses
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse major academic degrees and quickly refine institution lists
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          {courses.map((course, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(course.value)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm group"
            >
              <span>{course.label}</span>
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-955/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
