'use client';

import { Download } from 'lucide-react';

interface MegaFooterProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

export default function MegaFooter({ onFilterChange, currentFilters }: MegaFooterProps) {
  
  const handleTopColleges = (courseVal: string) => {
    onFilterChange({ ...currentFilters, courseType: courseVal });
    scrollToDirectory();
  };

  const handleTopUniversities = (ownershipVal: string) => {
    onFilterChange({ ...currentFilters, ownership: ownershipVal });
    scrollToDirectory();
  };

  const handleTopExam = (examName: string) => {
    alert(`Set Predictor/Exam target to ${examName}. Scrolling to Predictor calculator.`);
    
    // Smooth scroll to widgets predictor
    const el = document.getElementById('all-colleges-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDirectory = () => {
    const el = document.getElementById('all-colleges-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 px-4 sm:px-8 lg:px-12 border-t border-slate-805">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Top Colleges */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Top Colleges</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <button onClick={() => handleTopColleges('MBA')} className="text-left hover:text-white transition-colors">M.B.A</button>
              <button onClick={() => handleTopColleges('B.Tech')} className="text-left hover:text-white transition-colors">B.Tech/B.E.</button>
              <button onClick={() => handleTopColleges('MCA')} className="text-left hover:text-white transition-colors">MCA</button>
              <button onClick={() => handleTopColleges('MCA')} className="text-left hover:text-white transition-colors">BCA</button>
              <button onClick={() => handleTopColleges('M.Tech')} className="text-left hover:text-white transition-colors">M.Tech</button>
              <button onClick={() => handleTopColleges('MA')} className="text-left hover:text-white transition-colors">MA</button>
              <button onClick={() => handleTopColleges('BA')} className="text-left hover:text-white transition-colors">BA</button>
            </div>
          </div>

          {/* Column 2: Top Universities */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Top Universities</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <button onClick={() => handleTopUniversities('Government')} className="text-left hover:text-white transition-colors">Government Universities</button>
              <button onClick={() => handleTopUniversities('Private')} className="text-left hover:text-white transition-colors">Private Universities</button>
              <button onClick={() => handleTopColleges('B.Tech')} className="text-left hover:text-white transition-colors">Engineering Colleges</button>
              <button onClick={() => handleTopColleges('MBA')} className="text-left hover:text-white transition-colors">Management Colleges</button>
              <button onClick={() => handleTopColleges('MBBS')} className="text-left hover:text-white transition-colors">Medical Colleges</button>
              <button onClick={() => handleTopColleges('B.Sc')} className="text-left hover:text-white transition-colors">Science Universities</button>
              <button onClick={() => handleTopColleges('BA')} className="text-left hover:text-white transition-colors">Arts Colleges</button>
            </div>
          </div>

          {/* Column 3: Top Exams */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Top Exams</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <button onClick={() => handleTopExam('CAT')} className="text-left hover:text-white transition-colors">CAT</button>
              <button onClick={() => handleTopExam('GATE')} className="text-left hover:text-white transition-colors">GATE</button>
              <button onClick={() => handleTopExam('JEE Main')} className="text-left hover:text-white transition-colors">Jee Main</button>
              <button onClick={() => handleTopExam('NEET')} className="text-left hover:text-white transition-colors">NEET</button>
              <button onClick={() => handleTopExam('XAT')} className="text-left hover:text-white transition-colors">XAT</button>
              <button onClick={() => handleTopExam('CLAT')} className="text-left hover:text-white transition-colors">CLAT</button>
              <button onClick={() => handleTopExam('MAT')} className="text-left hover:text-white transition-colors">MAT</button>
            </div>
          </div>

          {/* Column 4: Study Abroad */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Study Abroad</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="flex flex-col gap-2">
                <button onClick={() => alert('Opening Canada Study Guide...')} className="text-left hover:text-white transition-colors">Canada</button>
                <button onClick={() => alert('Opening USA Study Guide...')} className="text-left hover:text-white transition-colors">USA</button>
                <button onClick={() => alert('Opening UK Study Guide...')} className="text-left hover:text-white transition-colors">UK</button>
                <button onClick={() => alert('Opening UAE Study Guide...')} className="text-left hover:text-white transition-colors">UAE</button>
                <button onClick={() => alert('Opening Australia Study Guide...')} className="text-left hover:text-white transition-colors">Australia</button>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => alert('Opening Ireland Study Guide...')} className="text-left hover:text-white transition-colors">Ireland</button>
                <button onClick={() => alert('Opening Germany Study Guide...')} className="text-left hover:text-white transition-colors">Germany</button>
                <button onClick={() => alert('Opening Singapore Study Guide...')} className="text-left hover:text-white transition-colors">Singapore</button>
                <button onClick={() => alert('Opening Sweden Study Guide...')} className="text-left hover:text-white transition-colors">Sweden</button>
                <button onClick={() => alert('Opening Italy Study Guide...')} className="text-left hover:text-white transition-colors">Italy</button>
              </div>
            </div>
          </div>

          {/* Column 5: Board Exams */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Board Exams</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <button onClick={() => alert('Loading CBSE Class 12 Details')} className="text-left hover:text-white transition-colors">CBSE Class 12</button>
              <button onClick={() => alert('Loading CBSE Class 12th Results')} className="text-left hover:text-white transition-colors">CBSE Class 12th Results</button>
              <button onClick={() => alert('Loading CBSE Class 12th Syllabus')} className="text-left hover:text-white transition-colors">CBSE Class 12th Syllabus</button>
              <button onClick={() => alert('Loading CBSE Class 12th Dates')} className="text-left hover:text-white transition-colors">CBSE Class 12th Exam Dates</button>
              <button onClick={() => alert('Loading CBSE Class 10 Details')} className="text-left hover:text-white transition-colors">CBSE Class 10</button>
              <button onClick={() => alert('Loading CBSE Class 10th Result')} className="text-left hover:text-white transition-colors">CBSE Class 10th Result</button>
            </div>
          </div>

        </div>

        {/* Separator */}
        <div className="h-px bg-slate-800" />

        {/* Bottom Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Other Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold">
            <a href="#" className="hover:text-white transition-colors">About EduSphere</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            <a href="#" className="hover:text-white transition-colors">Advertising</a>
            <a href="#" className="hover:text-white transition-colors">Career</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Youtube">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        {/* Copyright Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-555 uppercase tracking-widest pt-4 border-t border-slate-850">
          <span>© 2026 EduSphere Web Pvt. Ltd. All Rights Reserved</span>
          
          {/* App download mock badges */}
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-1 bg-slate-950 text-white hover:bg-black border border-slate-800 rounded-lg px-2.5 py-1 transition-colors">
              <Download className="h-3 w-3" />
              <span>Google Play</span>
            </a>
            <a href="#" className="flex items-center gap-1 bg-slate-950 text-white hover:bg-black border border-slate-800 rounded-lg px-2.5 py-1 transition-colors">
              <Download className="h-3 w-3" />
              <span>App Store</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
