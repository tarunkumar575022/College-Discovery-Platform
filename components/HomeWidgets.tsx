'use client';

import { useState } from 'react';
import { Award, Search, ArrowRight, Layers, Award as ExamIcon, Compass, CheckCircle2, X, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { College } from '@/lib/types';

interface HomeWidgetsProps {
  colleges: College[];
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

export default function HomeWidgets({ colleges, onFilterChange, currentFilters }: HomeWidgetsProps) {
  // Predictor form state
  const [predictorExam, setPredictorExam] = useState('JEE Main');
  const [predictorRank, setPredictorRank] = useState('');
  const [predictorStream, setPredictorStream] = useState('B.Tech');
  const [predictions, setPredictions] = useState<College[]>([]);
  const [isPredictorModalOpen, setIsPredictorModalOpen] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);

  // Find actual colleges in list for comparisons
  const iitBombay = colleges.find(c => c.name.toLowerCase().includes('bombay'));
  const iitDelhi = colleges.find(c => c.name.toLowerCase().includes('delhi'));
  const bitsPilani = colleges.find(c => c.name.toLowerCase().includes('pilani'));
  const vitVellore = colleges.find(c => c.name.toLowerCase().includes('vellore'));

  const handlePredictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rankVal = parseInt(predictorRank, 10);
    if (isNaN(rankVal) || rankVal <= 0) {
      alert('Please enter a valid rank/score.');
      return;
    }

    setHasPredicted(true);

    // Predictor algorithm based on seeded colleges
    let matched: College[] = [];
    if (predictorStream === 'B.Tech') {
      if (rankVal <= 1000) {
        // Elite IITs
        matched = colleges.filter(c => 
          c.name.toLowerCase().includes('bombay') || 
          c.name.toLowerCase().includes('delhi') ||
          c.name.toLowerCase().includes('hyderabad') && c.name.toLowerCase().includes('iiit')
        );
      } else if (rankVal <= 5000) {
        // High NIT / IIIT / BITS
        matched = colleges.filter(c => 
          c.name.toLowerCase().includes('pilani') || 
          c.name.toLowerCase().includes('hyderabad') && c.name.toLowerCase().includes('iiit') ||
          c.name.toLowerCase().includes('warangal')
        );
      } else if (rankVal <= 15000) {
        // Mid tier
        matched = colleges.filter(c => 
          c.name.toLowerCase().includes('dtu') || 
          c.name.toLowerCase().includes('vellore') ||
          c.name.toLowerCase().includes('jadavpur') ||
          c.name.toLowerCase().includes('psg') ||
          c.name.toLowerCase().includes('anna')
        );
      } else {
        // Open
        matched = colleges.filter(c => 
          c.name.toLowerCase().includes('manipal') || 
          c.name.toLowerCase().includes('srm') ||
          c.name.toLowerCase().includes('amity') ||
          c.name.toLowerCase().includes('pes') ||
          c.name.toLowerCase().includes('symbiosis')
        );
      }
    } else if (predictorStream === 'MBA') {
      // Based on percentile for CAT
      const p = rankVal; // Treat input as percentile if CAT
      if (p >= 98) {
        matched = colleges.filter(c => c.courseTypes?.includes('MBA') && (c.name.includes('IIT') || c.name.includes('Management')));
      } else if (p >= 90) {
        matched = colleges.filter(c => c.courseTypes?.includes('MBA') && (c.name.includes('DTU') || c.name.includes('Symbiosis') || c.name.includes('Christ')));
      } else {
        matched = colleges.filter(c => c.courseTypes?.includes('MBA') && (c.name.includes('Amity') || c.name.includes('Osmania') || c.name.includes('SRM')));
      }
    } else {
      // Other streams
      matched = colleges.filter(c => c.courseTypes?.includes(predictorStream)).slice(0, 3);
    }

    setPredictions(matched);
    setIsPredictorModalOpen(true);
  };

  return (
    <div className="w-full max-w-none px-4 sm:px-8 lg:px-12 py-10 bg-slate-55 dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800/80">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. RANKING WIDGET */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Ranking</h3>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Colleges ranked based on latest parameters & verified agency scores
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="block text-[10px] font-bold text-slate-450 uppercase dark:text-slate-500">NIRF 2025</span>
                <span className="block text-xs font-black text-slate-850 dark:text-slate-200 mt-1">#2 IIT Delhi</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="block text-[10px] font-bold text-slate-450 uppercase dark:text-slate-500">Indiatoday</span>
                <span className="block text-xs font-black text-slate-850 dark:text-slate-200 mt-1">#1 IIT Bombay</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="block text-[10px] font-bold text-slate-450 uppercase dark:text-slate-500">Outlook</span>
                <span className="block text-xs font-black text-slate-850 dark:text-slate-200 mt-1">#3 BITS Pilani</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="block text-[10px] font-bold text-slate-450 uppercase dark:text-slate-500">IIRF</span>
                <span className="block text-xs font-black text-slate-850 dark:text-slate-200 mt-1">#2 Jadavpur</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onFilterChange({ ...currentFilters, rating: 4.5 })}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit mt-2 uppercase tracking-wider"
          >
            Top Ranked Colleges in India <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 2. FIND COLLEGES WIDGET */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Find Colleges</h3>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Discover top-rated colleges grouped by standard academic domains
            </p>
            <div className="flex flex-col gap-2.5 mb-4">
              <button
                onClick={() => onFilterChange({ ...currentFilters, courseType: 'MBA' })}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all text-left"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-250">Best MBA colleges in India</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md">8 Colleges</span>
              </button>
              <button
                onClick={() => onFilterChange({ ...currentFilters, courseType: 'B.Tech' })}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all text-left"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-250">Best BTech colleges in India</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-md">15 Colleges</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => onFilterChange({ location: '', feesRange: 'all', rating: 0, courseType: '', ownership: '' })}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit mt-2 uppercase tracking-wider"
          >
            Discover Top Colleges in India <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 3. COMPARE COLLEGES WIDGET */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Compare Colleges</h3>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Compare courses, fees, placements, and ratings side-by-side
            </p>
            <div className="flex flex-col gap-2.5 mb-4">
              {iitBombay && iitDelhi && (
                <Link
                  href={`/compare?ids=${iitBombay.id},${iitDelhi.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-[10px]">IB</span>
                    <span className="text-xs font-bold text-slate-750 dark:text-slate-300">IIT Bombay</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-405 dark:text-slate-600">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-750 dark:text-slate-300">IIT Delhi</span>
                    <span className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-[10px]">ID</span>
                  </div>
                </Link>
              )}
              {bitsPilani && vitVellore && (
                <Link
                  href={`/compare?ids=${bitsPilani.id},${vitVellore.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-[10px]">BP</span>
                    <span className="text-xs font-bold text-slate-750 dark:text-slate-300">BITS Pilani</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-405 dark:text-slate-600">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-750 dark:text-slate-300">VIT Vellore</span>
                    <span className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-[10px]">VV</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
          <Link
            href="/compare"
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit mt-2 uppercase tracking-wider"
          >
            Compare Colleges <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* 4. EXAMS WIDGET */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Exams</h3>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
                <ExamIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Get detailed updates, eligibility criteria, and cutoffs for major entrance tests
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['JEE Main', 'JEE Advanced', 'CAT', 'NEET', 'GATE', 'TS EAMCET', 'CUET'].map(exam => (
                <button
                  key={exam}
                  onClick={() => alert(`Details for ${exam} will be added in standard college circular logs.`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500/30 transition-all"
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => alert('Exams calendar scheduled for 2026 Admissions.')}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit mt-2 uppercase tracking-wider"
          >
            Check All Entrance Exams in India <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 5. COLLEGE PREDICTOR WIDGET (WORKING!) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">College Predictor</h3>
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500 dark:text-pink-400">
                <Compass className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4.5">
              Enter your rank/percentile to find matching admissions chances
            </p>
            <form onSubmit={handlePredictSubmit} className="space-y-2.5 mb-2">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={predictorExam}
                  onChange={(e) => {
                    setPredictorExam(e.target.value);
                    if (e.target.value === 'CAT') setPredictorStream('MBA');
                    else setPredictorStream('B.Tech');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="CAT">CAT Exam</option>
                  <option value="GATE">GATE</option>
                  <option value="NEET">NEET</option>
                </select>
                <select
                  value={predictorStream}
                  onChange={(e) => setPredictorStream(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="MBA">MBA / PGDM</option>
                  <option value="M.Tech">M.Tech / M.E.</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={predictorRank}
                  onChange={(e) => setPredictorRank(e.target.value)}
                  placeholder={predictorExam === 'CAT' ? 'Enter Percentile (e.g. 98.5)' : 'Enter Rank (e.g. 4500)'}
                  className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 pl-3 pr-20 text-[11px] font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                  required
                />
                <span className="absolute right-3 text-[10px] font-extrabold text-slate-400 tracking-wider">
                  {predictorExam === 'CAT' ? '%ILE' : 'RANK'}
                </span>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-655 text-white font-bold text-xs py-2 shadow-sm transition-all hover:shadow-[0_0_12px_rgba(249,115,22,0.25)] uppercase tracking-wider"
              >
                Predict Now
              </button>
            </form>
          </div>
          <button
            type="button"
            onClick={() => {
              setPredictorRank('1200');
              setPredictorExam('JEE Main');
              setPredictorStream('B.Tech');
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit uppercase tracking-wider"
          >
            Find Where you may get Admission <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 6. COURSE FINDER WIDGET */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Course Finder</h3>
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500 dark:text-teal-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Explore programs and match qualifications with fee models
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { name: 'BE/B.Tech', val: 'B.Tech', count: 15 },
                { name: 'MBA/PGDM', val: 'MBA', count: 8 },
                { name: 'ME/M.Tech', val: 'M.Tech', count: 10 },
                { name: 'MCA', val: 'MCA', count: 5 },
              ].map(course => (
                <button
                  key={course.name}
                  onClick={() => onFilterChange({ ...currentFilters, courseType: course.val })}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-500/30 transition-all text-center"
                >
                  <span className="block text-[11px] font-black text-slate-800 dark:text-slate-200">{course.name}</span>
                  <span className="block text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase mt-0.5">{course.count} Colleges</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onFilterChange({ location: '', feesRange: 'all', rating: 0, courseType: '', ownership: '' })}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 w-fit mt-2 uppercase tracking-wider"
          >
            Get Top Courses in Indian Colleges <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

      {/* COLLEGE PREDICTOR RESULTS DIALOG */}
      {isPredictorModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsPredictorModalOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsPredictorModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Predicted Admission Matches
              </h2>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Based on your score of <span className="font-bold text-slate-800 dark:text-white">{predictorRank}</span> on {predictorExam}, you have high admission chances at the following colleges:
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-4">
              {predictions.length > 0 ? (
                predictions.map((col) => (
                  <Link
                    key={col.id}
                    href={`/colleges/${col.id}`}
                    onClick={() => setIsPredictorModalOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-500/40 transition-all block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image src={col.image} alt={col.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-tight truncate max-w-[200px]">{col.name}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{col.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 text-[10px] border border-emerald-500/20">
                        High Chance
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-6 text-center text-slate-500 text-xs">
                  No direct matches found. Try entering a different score/rank.
                </div>
              )}
            </div>

            <button
              onClick={() => setIsPredictorModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white text-xs font-bold transition-all uppercase tracking-wider"
            >
              Close Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
