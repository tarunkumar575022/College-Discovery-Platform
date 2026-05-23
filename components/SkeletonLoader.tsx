'use client';

export default function SkeletonLoader({ type = 'card', count = 3 }: { type?: 'card' | 'list' | 'detail' | 'review'; count?: number }) {
  const skeletons = Array.from({ length: count });

  if (type === 'list') {
    return (
      <div className="space-y-4 w-full">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="w-full h-16 rounded-xl bg-slate-900/40 border border-slate-800/80 animate-pulse flex items-center px-4 justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3 w-32 rounded bg-slate-800" />
                <div className="h-2 w-20 rounded bg-slate-800" />
              </div>
            </div>
            <div className="h-6 w-16 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'review') {
    return (
      <div className="space-y-4 w-full">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="w-full rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5 animate-pulse space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-slate-800" />
                  <div className="h-2.5 w-20 rounded bg-slate-800" />
                </div>
              </div>
              <div className="h-6 w-10 rounded bg-slate-800" />
            </div>
            <div className="h-12 w-full rounded-xl bg-slate-800/40" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="w-full space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-64 md:h-80 w-full rounded-3xl bg-slate-900 border border-slate-800" />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
          <div className="space-y-6">
            <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/20 p-0.5 animate-pulse"
        >
          {/* Image box */}
          <div className="h-48 w-full bg-slate-900" />
          
          {/* Card Content */}
          <div className="p-5 space-y-4 flex-1 flex flex-col">
            <div className="space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-800" />
              <div className="h-3.5 w-1/2 rounded bg-slate-800" />
            </div>
            
            <div className="h-10 w-full rounded-xl bg-slate-900" />

            <div className="mt-auto pt-4 border-t border-slate-800/40 flex justify-between">
              <div className="space-y-2">
                <div className="h-2 w-10 rounded bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-800" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-10 rounded bg-slate-800" />
                <div className="h-3 w-14 rounded bg-slate-800" />
              </div>
            </div>
            
            <div className="h-9 w-full rounded-xl bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
