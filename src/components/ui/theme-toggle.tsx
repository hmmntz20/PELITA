// src/components/ui/theme-toggle.tsx
"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`h-9 w-9 rounded-xl border border-[var(--border-surface)] bg-[var(--surface)] text-[var(--text-primary)] flex items-center justify-center shadow-2xs hover:bg-[var(--bg-supporting)] active:scale-95 transition-all duration-200 cursor-pointer select-none ${className}`}
    >
      {isDark ? (
        <Sun
          className="w-4 h-4 text-[var(--text-primary)] transition-transform duration-200 rotate-0"
          strokeWidth={1.75}
        />
      ) : (
        <Moon
          className="w-4 h-4 text-[var(--text-primary)] transition-transform duration-200 rotate-0"
          strokeWidth={1.75}
        />
      )}
    </button>
  );
}