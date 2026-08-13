"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all ${
        isDark
          ? "bg-slate-900 border-slate-700/80 text-slate-200 hover:bg-slate-800"
          : "bg-white border-slate-300 text-slate-200 hover:bg-slate-100"
      }`}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Slate"}
    >
      {isDark ? (
        <>
          <Moon className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline-block">Dark Slate</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline-block">Light Mode</span>
        </>
      )}
    </button>
  );
};
