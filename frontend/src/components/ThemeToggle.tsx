"use client";

import React from "react";
import { Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  return (
    <button
      type="button"
      disabled
      className="p-2 sm:p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-center bg-slate-900/60 text-indigo-400 opacity-50 cursor-default"
      aria-label="Dark mode"
    >
      <Moon className="w-4 h-4" />
    </button>
  );
};
