"use client";

import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-2.5 group flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1 font-sans">
              TechHire{" "}
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                BIO
              </span>
            </span>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
              Latest Jobs & Internships
            </p>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <ThemeToggle />
          <Link
            href="/jobs"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-700 hover:bg-slate-900"
          >
            All Opportunities
          </Link>
        </div>
      </div>
    </nav>
  );
};
