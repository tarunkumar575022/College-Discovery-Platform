'use client';

import { useState } from 'react';
import { Star, IndianRupee, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { College } from '@/lib/types';

interface TopCollegesTableProps {
  colleges: College[];
}

interface MockMedicalCollege {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  image: string;
  nirfRanking: number;
  cutoff: string;
  deadline: string;
}

const mockMedicalColleges: MockMedicalCollege[] = [
  {
    id: 'aiims-delhi',
    name: 'AIIMS - All India Institute of Medical Sciences',
    location: 'New Delhi, Delhi',
    fees: 1628,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop',
    nirfRanking: 1,
    cutoff: 'NEET 2025 Cut off 710',
    deadline: '01 June - 15 July 2026',
  },
  {
    id: 'cmc-vellore',
    name: 'Christian Medical College',
    location: 'Vellore, Tamil Nadu',
    fees: 52000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
    nirfRanking: 3,
    cutoff: 'NEET 2025 Cut off 685',
    deadline: '10 May - 25 June 2026',
  },
  {
    id: 'mamc-delhi',
    name: 'Maulana Azad Medical College',
    location: 'New Delhi, Delhi',
    fees: 15450,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop',
    nirfRanking: 12,
    cutoff: 'NEET 2025 Cut off 695',
    deadline: '15 May - 30 June 2026',
  },
];

export default function TopCollegesTable({ colleges }: TopCollegesTableProps) {
  const [selectedStream, setSelectedStream] = useState('BE/B.Tech');

  const streams = [
    'BE/B.Tech',
    'MBA/PGDM',
    'MBBS',
    'ME/M.Tech',
    'B.Sc',
    'BA',
    'B.Com',
    'BCA',
    'BBA/BMS',
  ];

  // Helper to format fees to Lakhs or normal format
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Resolve cutoff info dynamically
  const getCutoff = (collegeName: string, stream: string) => {
    if (stream.includes('B.Tech') || stream.includes('M.Tech')) {
      if (collegeName.includes('Bombay')) return 'GATE / JEE Adv Cutoff 120';
      if (collegeName.includes('Delhi')) return 'GATE / JEE Adv Cutoff 135';
      if (collegeName.includes('BITS')) return 'BITSAT Cutoff 320';
      if (collegeName.includes('Warangal')) return 'JEE Main Cutoff 4500';
      return 'JEE Main Cutoff 15000';
    }
    if (stream.includes('MBA')) {
      if (collegeName.includes('Bombay') || collegeName.includes('Delhi')) return 'CAT 2025 Cutoff 98.5%';
      if (collegeName.includes('Christ')) return 'MAT 2025 Cutoff 600';
      if (collegeName.includes('Symbiosis')) return 'SNAP 2025 Cutoff 97%';
      return 'CAT 2025 Cutoff 85%';
    }
    return 'Merit Based Admission';
  };

  // Resolve application deadline
  const getDeadline = (collegeName: string) => {
    if (collegeName.includes('Bombay')) return '05 June - 22 July 2026';
    if (collegeName.includes('Delhi')) return '07 July - 08 Sept 2026';
    if (collegeName.includes('BITS')) return '14 Mar - 03 Apr 2026';
    return '15 June - 31 Aug 2026';
  };

  // Build Top List based on selectedStream
  const getFilteredList = () => {
    if (selectedStream === 'MBBS') {
      return mockMedicalColleges.map((c, idx) => ({
        rank: idx + 1,
        id: c.id,
        name: c.name,
        location: c.location,
        rating: c.rating,
        image: c.image,
        nirfRanking: c.nirfRanking,
        cutoff: c.cutoff,
        deadline: c.deadline,
        fees: c.fees,
        isMock: true,
      }));
    }

    let filterKey = 'B.Tech';
    if (selectedStream === 'MBA/PGDM') filterKey = 'MBA';
    else if (selectedStream === 'ME/M.Tech') filterKey = 'M.Tech';
    else if (selectedStream === 'B.Sc') filterKey = 'B.Sc';
    else if (selectedStream === 'BA') filterKey = 'BA';
    else if (selectedStream === 'B.Com') filterKey = 'B.Com';
    else if (selectedStream === 'BCA') filterKey = 'MCA'; // MCA as fallback
    else if (selectedStream === 'BBA/BMS') filterKey = 'BBA';

    // Find colleges offering this stream
    const matchedColleges = colleges
      .filter((c) => c.courseTypes?.toLowerCase().includes(filterKey.toLowerCase()))
      // Sort by rating or NIRF ranking descending
      .sort((a, b) => {
        if (a.nirfRanking && b.nirfRanking) return a.nirfRanking - b.nirfRanking;
        return b.rating - a.rating;
      })
      .slice(0, 10);

    return matchedColleges.map((c, idx) => ({
      rank: idx + 1,
      id: c.id,
      name: c.name,
      location: c.location,
      rating: c.rating,
      image: c.image,
      nirfRanking: c.nirfRanking || 100,
      cutoff: getCutoff(c.name, selectedStream),
      deadline: getDeadline(c.name),
      fees: c.fees,
      isMock: false,
    }));
  };

  const list = getFilteredList();

  return (
    <div className="w-full bg-white dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800/80 py-10 px-4 sm:px-8 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
            Top 10 Colleges
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare cutoffs, fees, and application timelines for leading options
          </p>
        </div>

        {/* Stream selector list */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full md:max-w-2xl py-1">
          {streams.map((stream) => {
            const isSelected = selectedStream === stream;
            return (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400 hover:border-blue-500/40 hover:text-blue-650 dark:hover:text-blue-400'
                }`}
              >
                {stream}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 10 list table container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none bg-white dark:bg-slate-950">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-550 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4 w-1/3">College</th>
              <th className="p-4">Ranking</th>
              <th className="p-4">Cutoff</th>
              <th className="p-4">Application Deadline</th>
              <th className="p-4 text-right">Total Fees</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-250">
            {list.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
              >
                <td className="p-4 text-center font-black text-slate-900 dark:text-white text-sm">
                  #{item.rank}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200/50 dark:border-slate-800/80">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                        sizes="40px"
                      />
                    </div>
                    <div>
                      {item.isMock ? (
                        <span className="font-bold text-slate-900 dark:text-white leading-normal hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {item.name}
                        </span>
                      ) : (
                        <Link 
                          href={`/colleges/${item.id}`} 
                          className="font-bold text-slate-900 dark:text-white leading-normal hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                        >
                          {item.name}
                        </Link>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {item.location}
                        </span>
                        <span className="text-slate-300 dark:text-slate-750">|</span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {item.rating.toFixed(1)}/5
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-0.5">
                    <span className="inline-flex rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black px-2 py-0.5 text-[10px] border border-indigo-500/20 uppercase tracking-wider">
                      #{item.nirfRanking} in India
                    </span>
                    <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 uppercase tracking-wider">
                      NIRF Ranking
                    </span>
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-900 dark:text-slate-200">
                  {item.cutoff}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">
                  {item.deadline}
                </td>
                <td className="p-4 text-right">
                  <span className="text-blue-600 dark:text-blue-450 font-black text-sm block">
                    {formatFees(item.fees)}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                    First Year Fees
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
