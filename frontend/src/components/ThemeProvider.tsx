"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  const applyTheme = (t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    const allThemeClasses = ["dark", "light", "theme-dark", "theme-light"];

    root.classList.remove(...allThemeClasses);
    if (body) body.classList.remove(...allThemeClasses);

    if (t === "dark") {
      root.classList.add("dark", "theme-dark");
      if (body) body.classList.add("dark", "theme-dark");
    } else {
      root.classList.add("light", "theme-light");
      if (body) body.classList.add("light", "theme-light");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("app_theme") as Theme | null;
    if (saved && (saved === "dark" || saved === "light")) {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      applyTheme("light");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("app_theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
