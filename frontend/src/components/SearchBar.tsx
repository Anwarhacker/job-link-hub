"use client";

import React, { useState } from "react";
import { Search, X, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search jobs by title, company or skill...",
  initialValue = "",
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      {/* Outer Rotating Snake Light Border Wrapper */}
      <div className="relative p-[2px] rounded-[20px] overflow-hidden shadow-2xl shadow-blue-500/15 group-hover:shadow-blue-500/30 group-focus-within:shadow-indigo-500/40 transition-all duration-500">
        {/* Rotating Conic Gradient (Snake Light Effect) */}
        <div className="absolute -inset-[300%] bg-[conic-gradient(from_0deg_at_50%_50%,#3b82f6_0deg,#6366f1_90deg,#ec4899_180deg,#06b6d4_270deg,#3b82f6_360deg)] animate-snake-border opacity-80 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" />

        {/* Inner Input Container */}
        <div className="relative flex items-center w-full bg-slate-950/95 rounded-[18px] backdrop-blur-xl">
          <div className="absolute left-4 text-blue-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none flex items-center gap-1">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onSearch(e.target.value.trim());
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-[18px] bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none transition-all font-sans"
          />

          {value ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-4 text-slate-600 pointer-events-none hidden sm:block">
              <Sparkles className="w-4 h-4 text-blue-500/40 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
