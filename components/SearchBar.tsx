'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  initialValue: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ initialValue, onSearch, placeholder = 'Search for colleges, courses, and more...' }: SearchBarProps) {
  const [input, setInput] = useState(initialValue);

  // Sync internal state with external updates (e.g. search clear)
  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  // Debounce input updates
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input);
    }, 300); // 300ms debounced delay

    return () => {
      clearTimeout(handler);
    };
  }, [input, onSearch]);

  const handleClear = () => {
    setInput('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full rounded-2xl bg-white dark:bg-slate-900 p-1 border border-slate-250 dark:border-slate-800 focus-within:border-blue-500 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.2)] dark:focus-within:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300 shadow-md flex items-center gap-2"
    >
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pl-12 pr-10 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0 mr-1"
      >
        Search
      </button>
    </form>
  );
}
