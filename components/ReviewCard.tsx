'use client';

import { Star, User } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
    user: {
      name: string | null;
      email: string;
    };
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Format Date
  const formatDate = (dateStr: Date | string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  const name = review.user?.name || 'Anonymous Student';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-5 backdrop-blur-sm shadow-sm dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-sm font-bold text-indigo-600 dark:text-indigo-300">
            {initials || <User className="h-4 w-4" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{name}</h4>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
              Verified Student &bull; {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Rating badge */}
        <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-bold text-amber-500 dark:text-amber-400">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {review.rating.toFixed(1)}
        </div>
      </div>

      {/* Review Comment */}
      <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/40">
        "{review.comment}"
      </p>
    </div>
  );
}
