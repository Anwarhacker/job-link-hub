"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 sm:p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center bg-slate-900/60 dark:bg-slate-900/60 hover:bg-slate-800 text-amber-400 dark:text-amber-300 border-slate-700/80 shadow-md"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 sm:w-4 sm:h-4 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 sm:w-4 sm:h-4 text-indigo-400 animate-fade-in" />
      )}
    </button>
  );
};
