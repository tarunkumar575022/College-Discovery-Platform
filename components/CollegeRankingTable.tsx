'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { College } from '@/lib/types';

interface CollegeRankingTableProps {
  colleges: College[];
}

export default function CollegeRankingTable({ colleges }: CollegeRankingTableProps) {
  const [selectedAgency, setSelectedAgency] = useState('Indiatoday');

  const agencies = [
    'Collegedunia',
    'Indiatoday',
    'The Week',
    'NIRF',
    'Outlook',
    'IIRF',
  ];

  // Helper to map dynamic rankings based on agency
  const getRankedData = () => {
    if (selectedAgency === 'Indiatoday') {
      return [
        {
          name: 'SRM University',
          collegeMatch: colleges.find(c => c.name.includes('SRM')),
          rank: '1 out of 77',
          streams: 'Overall',
        },
        {
          name: 'IIT Delhi',
          collegeMatch: colleges.find(c => c.name.includes('Delhi') && !c.name.includes('DTU')),
          rank: '1 out of 45',
          streams: 'Overall',
        },
        {
          name: 'Symbiosis Institute of Technology',
          collegeMatch: colleges.find(c => c.name.includes('Symbiosis')),
          rank: '2 out of 77',
          streams: 'Overall',
        },
        {
          name: 'JNTU Hyderabad',
          collegeMatch: colleges.find(c => c.name.includes('JNTU')),
          rank: '2 out of 45',
          streams: 'Overall',
        },
        {
          name: 'Amity University',
          collegeMatch: colleges.find(c => c.name.includes('Amity')),
          rank: '3 out of 77',
          streams: 'Overall',
        },
        {
          name: 'Osmania University',
          collegeMatch: colleges.find(c => c.name.includes('Osmania')),
          rank: '3 out of 45',
          streams: 'Overall',
        },
      ];
    }

    if (selectedAgency === 'Collegedunia') {
      return [
        {
          name: 'IIT Bombay',
          collegeMatch: colleges.find(c => c.name.includes('Bombay')),
          rank: '1 out of 100',
          streams: 'Engineering',
        },
        {
          name: 'IIT Delhi',
          collegeMatch: colleges.find(c => c.name.includes('Delhi') && !c.name.includes('DTU')),
          rank: '2 out of 100',
          streams: 'Engineering',
        },
        {
          name: 'BITS Pilani',
          collegeMatch: colleges.find(c => c.name.includes('Pilani')),
          rank: '3 out of 100',
          streams: 'Engineering',
        },
        {
          name: 'IIIT Hyderabad',
          collegeMatch: colleges.find(c => c.name.includes('IIIT')),
          rank: '4 out of 100',
          streams: 'Engineering',
        },
        {
          name: 'Jadavpur University',
          collegeMatch: colleges.find(c => c.name.includes('Jadavpur')),
          rank: '5 out of 100',
          streams: 'Engineering',
        },
      ];
    }

    // Default Fallback / NIRF / Others
    // Show seeded colleges sorted by NIRF rank
    return colleges
      .filter((c) => c.nirfRanking)
      .sort((a, b) => (a.nirfRanking || 100) - (b.nirfRanking || 100))
      .slice(0, 6)
      .map((c) => ({
        name: c.name,
        collegeMatch: c,
        rank: `${c.nirfRanking} out of 200`,
        streams: 'Overall',
      }));
  };

  const list = getRankedData();

  return (
    <div className="w-full bg-white dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800/80 py-10 px-4 sm:px-8 lg:px-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
            College Ranking 2026
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse institution rankings categorized by major national survey agencies
          </p>
        </div>

        <Link 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            // Trigger all ratings sorted
            const el = document.getElementById('all-colleges-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-450 dark:hover:text-blue-350 hover:underline uppercase tracking-wider shrink-0"
        >
          View All Colleges
        </Link>
      </div>

      {/* Agency Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[10px] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mr-1.5">
          Agencies:
        </span>
        {agencies.map((agency) => {
          const isActive = selectedAgency === agency;
          return (
            <button
              key={agency}
              onClick={() => setSelectedAgency(agency)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 border ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400 hover:border-slate-400/30'
              }`}
            >
              {agency}
            </button>
          );
        })}
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm dark:shadow-none">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-550 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 w-1/2">College</th>
              <th className="p-4">Ranking</th>
              <th className="p-4">Streams</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-250">
            {list.map((item, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200/50 dark:border-slate-800/80">
                      {item.collegeMatch ? (
                        <Image 
                          src={item.collegeMatch.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          sizes="36px"
                        />
                      ) : (
                        <div className="h-full w-full bg-blue-500/10 text-blue-650 font-bold flex items-center justify-center text-xs">
                          C
                        </div>
                      )}
                    </div>
                    <div>
                      {item.collegeMatch ? (
                        <Link 
                          href={`/colleges/${item.collegeMatch.id}`} 
                          className="font-bold text-slate-905 dark:text-white leading-normal hover:text-blue-605 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-905 dark:text-white leading-normal">
                          {item.name}
                        </span>
                      )}
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {item.collegeMatch?.location || 'India'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  {item.rank}
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  {item.streams}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
