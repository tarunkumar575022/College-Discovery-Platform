'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface SaveButtonProps {
  collegeId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SaveButton({ collegeId }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: savedData, error } = useSWR(session ? '/api/saved' : null, fetcher);
  const [isPending, setIsPending] = useState(false);

  // Determine if this college is saved based on SWR cache
  const savedList = savedData?.success ? savedData.data : [];
  const isSaved = savedList.some((item: any) => item.collegeId === collegeId);
  const savedItem = savedList.find((item: any) => item.collegeId === collegeId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      // Redirect to login if user is not authenticated
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isPending) return;
    setIsPending(true);

    try {
      if (isSaved && savedItem) {
        // Unsave: DELETE /api/saved/[id]
        const res = await fetch(`/api/saved/${savedItem.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          // Optimistically update SWR cache
          mutate('/api/saved');
        }
      } else {
        // Save: POST /api/saved
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId }),
        });
        const data = await res.json();
        if (data.success) {
          // Optimistically update SWR cache
          mutate('/api/saved');
        }
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`group/heart relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 backdrop-blur-md transition-all duration-300 ${
        isSaved
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-rose-500/20'
          : 'bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
      }`}
      title={isSaved ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <Heart
        className={`h-5 w-5 transition-transform duration-300 ${
          isSaved ? 'fill-rose-500 scale-110' : 'group-hover/heart:scale-110'
        }`}
      />
    </button>
  );
}
