// src/components/theme-provider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const STORAGE_KEY = "pelita-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
      applyThemeToDOM(saved);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initial: Theme = prefersDark ? "dark" : defaultTheme;
      setThemeState(initial);
      applyThemeToDOM(initial);
    }
    setMounted(true);

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setThemeState(e.newValue);
        applyThemeToDOM(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyThemeToDOM(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback aman bila komponen dipanggil di luar provider
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
      mounted: false,
    };
  }
  return context;
}

export function ThemeScript() {
  const code = `
    (function() {
      try {
        var saved = localStorage.getItem('${STORAGE_KEY}');
        var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
        var root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}