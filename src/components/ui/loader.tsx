// src/components/ui/loader.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

// ============================================================================
// 1. KOMPONEN INTI: 3 BAR LOGO PELITA (GERAK NAIK-TURUN RANDOM)
// ============================================================================
export interface PelitaBarsProps {
  /** Ukuran tinggi kontainer bar */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Warna bar: 'light' (putih), 'dark' (hitam), 'theme' (otomatis tema), atau 'current' */
  tone?: "light" | "dark" | "theme" | "current";
  /** Aktifkan efek glow/shadow lembut pada masing-masing bar */
  glow?: boolean;
  /** Kecepatan pengacakan dalam milidetik */
  intervalMs?: number;
  className?: string;
}

interface BarRandomState {
  heightPct: number;
  offsetY: number;
  durationMs: number;
}

// Proporsi awal siluet logo PELITA
const INITIAL_BARS: [BarRandomState, BarRandomState, BarRandomState] = [
  { heightPct: 78, offsetY: -8, durationMs: 260 },
  { heightPct: 72, offsetY: 6, durationMs: 240 },
  { heightPct: 38, offsetY: 4, durationMs: 280 },
];

const SIZE_CONFIG = {
  xs: { containerHeight: 14, barWidth: 2.5, gap: 2.5 }, // Untuk tombol kecil
  sm: { containerHeight: 18, barWidth: 3.5, gap: 3.5 }, // Untuk tombol standar & chat
  md: { containerHeight: 32, barWidth: 6, gap: 6 },     // Untuk kartu / skeleton
  lg: { containerHeight: 88, barWidth: 16, gap: 14 },   // Ukuran proporsional Fullscreen Loader
  xl: { containerHeight: 108, barWidth: 20, gap: 18 },  // Ukuran ekstra besar
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function PelitaBars({
  size = "md",
  tone = "current",
  glow = false,
  intervalMs = 240,
  className = "",
}: PelitaBarsProps) {
  const [bars, setBars] =
    useState<[BarRandomState, BarRandomState, BarRandomState]>(INITIAL_BARS);
  const { containerHeight, barWidth, gap } = SIZE_CONFIG[size];

  useEffect(() => {
    const randomize = () => {
      setBars([
        // Bar Kiri: variasi tinggi sedang-tinggi & geser vertikal acak
        {
          heightPct: randomBetween(45, 92),
          offsetY: randomBetween(-18, 16),
          durationMs: randomBetween(180, 320),
        },
        // Bar Tengah: variasi dominan tinggi & geser vertikal acak
        {
          heightPct: randomBetween(52, 100),
          offsetY: randomBetween(-16, 18),
          durationMs: randomBetween(160, 300),
        },
        // Bar Kanan: variasi pendek-sedang & geser vertikal acak
        {
          heightPct: randomBetween(28, 68),
          offsetY: randomBetween(-18, 18),
          durationMs: randomBetween(190, 340),
        },
      ]);
    };

    const firstTick = setTimeout(randomize, 30);
    const timer = setInterval(randomize, intervalMs);

    return () => {
      clearTimeout(firstTick);
      clearInterval(timer);
    };
  }, [intervalMs]);

  const toneClass =
    tone === "light"
      ? "bg-[#F4F4F5]"
      : tone === "dark"
      ? "bg-[#18181B]"
      : tone === "theme"
      ? "bg-[var(--text-primary)]"
      : "bg-current";

  const glowStyle =
    glow && tone === "light"
      ? "0 0 24px rgba(255, 255, 255, 0.35)"
      : glow && tone === "dark"
      ? "0 0 20px rgba(0, 0, 0, 0.25)"
      : undefined;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{
        height: `${containerHeight}px`,
        gap: `${gap}px`,
      }}
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          className={`inline-block rounded-full will-change-transform ${toneClass}`}
          style={{
            width: `${barWidth}px`,
            height: `${bar.heightPct}%`,
            transform: `translateY(${bar.offsetY}%)`,
            boxShadow: glowStyle,
            transitionProperty: "height, transform",
            transitionDuration: `${bar.durationMs}ms`,
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      ))}
    </span>
  );
}

// ============================================================================
// 2. VARIAN FULLSCREEN LOADER (SESUAI DESAIN ANDA + OTOMATIS IKUT TEMA)
// ============================================================================
export interface FullscreenLoaderProps {
  label?: string;
  brandTitle?: string;
  /** 'auto' otomatis mengikuti Light/Dark mode aktif, atau paksa dengan 'dark' / 'light' */
  variant?: "auto" | "dark" | "light";
  children?: React.ReactNode;
}

export function FullscreenLoader({
  brandTitle = "PELITA",
  variant = "auto",
  children,
}: FullscreenLoaderProps) {
  const { theme } = useTheme();
  const resolvedVariant = variant === "auto" ? theme : variant;
  const isDark = resolvedVariant === "dark";

  return (
    <div
      role="alert"
      aria-busy="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 overflow-hidden select-none transition-colors duration-200 ${
        isDark ? "bg-[#18181B] text-[#F4F4F5]" : "bg-[#EDEDEE] text-[#18181B]"
      }`}
    >
      {/* Lapisan Radial Spotlight / Ambient Shadow di Tengah (Sesuai Racikan Anda) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[460px] h-[460px] rounded-full blur-[90px]"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 65%, rgba(0,0,0,0) 75%)"
              : "radial-gradient(circle, rgba(0, 0, 0, 0.31) 0%, rgba(0,0,0,0.04) 65%, rgba(255,255,255,0) 75%)",
          }}
        />
      </div>

      {/* Konten Utama di Atas Radial Shadow */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[290px]">
        {/* 3 Bar Kapsul Mengambang Tanpa Kotak Border */}
        <div className="mb-8">
          <PelitaBars
            size="lg"
            tone={isDark ? "light" : "dark"}
            glow={true}
          />
        </div>

        {/* Teks P E L I T A dengan Spasi Huruf Lebar */}
        {brandTitle && (
          <h1
            className={`text-2xl font-bold uppercase tracking-[0.38em] pl-[0.38em] mb-7 ${
              isDark ? "text-[#F4F4F5]" : "text-[#18181B]"
            }`}
          >
            {brandTitle}
          </h1>
        )}
      </div>

      {children}
    </div>
  );
}

// ============================================================================
// 3. VARIAN INLINE / MINI LOADER (UNTUK TOMBOL SIGN IN, GOOGLE, SAVE, DLL)
// ============================================================================
export interface InlineLoaderProps {
  size?: "xs" | "sm";
  tone?: "light" | "dark" | "theme" | "current";
  label?: string;
  className?: string;
}

export function InlineLoader({
  size = "sm",
  tone = "current",
  label,
  className = "",
}: InlineLoaderProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <PelitaBars size={size} tone={tone} intervalMs={200} />
      {label && <span>{label}</span>}
    </span>
  );
}

// ============================================================================
// 4. VARIAN AI CHAT LOADER (UNTUK PANEL AI QUICK ASSISTANT DI KANAN)
// ============================================================================
export interface AIChatLoaderProps {
  label?: string;
  showSkeletonLines?: boolean;
  className?: string;
}

export function AIChatLoader({
  label = "PELITA AI is thinking...",
  showSkeletonLines = true,
  className = "",
}: AIChatLoaderProps) {
  return (
    <div
      className={`w-full rounded-2xl border border-[var(--border-surface)] bg-[var(--surface)] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-colors ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--action-primary)] text-[var(--action-primary-text)] flex items-center justify-center shrink-0">
          <PelitaBars size="xs" tone="current" intervalMs={210} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[var(--text-primary)] tracking-tight">
            {label}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            Processing structured actions...
          </span>
        </div>
      </div>

      {showSkeletonLines && (
        <div className="space-y-2 pt-1 border-t border-[var(--border-surface)]">
          <div className="h-2.5 w-4/5 rounded-full bg-[var(--progress-track)] animate-pulse" />
          <div className="h-2.5 w-3/5 rounded-full bg-[var(--bg-supporting)] animate-pulse" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. VARIAN DASHBOARD / PAGE SKELETON (UNTUK PINDAH HALAMAN DI (app))
// ============================================================================
export interface DashboardSkeletonProps {
  label?: string;
}

export function DashboardSkeleton({
  label = "Syncing workspace...",
}: DashboardSkeletonProps) {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border-surface)] bg-[var(--surface)] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-[var(--progress-track)] animate-pulse" />
          <div className="h-6 w-48 rounded-lg bg-[var(--bg-supporting)] animate-pulse" />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border-surface)] bg-[var(--bg-supporting)] px-3.5 py-2">
          <PelitaBars size="sm" tone="theme" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[var(--border-surface)] bg-[var(--surface)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded-full bg-[var(--progress-track)] animate-pulse" />
              <div className="h-7 w-7 rounded-lg bg-[var(--bg-supporting)] animate-pulse" />
            </div>
            <div className="h-7 w-36 rounded-lg bg-[var(--progress-track)] animate-pulse" />
            <div className="space-y-2 pt-1">
              <div className="h-2 w-full rounded-full bg-[var(--progress-track)] animate-pulse" />
              <div className="h-2 w-2/3 rounded-full bg-[var(--bg-supporting)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border-surface)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-surface)]">
          <div className="h-4 w-40 rounded-full bg-[var(--progress-track)] animate-pulse" />
          <div className="h-8 w-24 rounded-lg bg-[var(--bg-supporting)] animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-xl border border-[var(--border-surface)] p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[var(--progress-track)] animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-36 rounded-full bg-[var(--progress-track)] animate-pulse" />
                  <div className="h-2.5 w-24 rounded-full bg-[var(--bg-supporting)] animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-20 rounded-full bg-[var(--progress-track)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. KOMPONEN PEMBUNGKUS UTAMA <Loader mode="..." />
// ============================================================================
export interface LoaderProps {
  mode?: "fullscreen" | "inline" | "mini" | "skeleton" | "ai-chat";
  variant?: "auto" | "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  brandTitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Loader({
  mode = "fullscreen",
  variant = "auto",
  size,
  label,
  brandTitle = "PELITA",
  className = "",
  children,
}: LoaderProps) {
  if (mode === "inline" || mode === "mini") {
    return (
      <InlineLoader
        size={size === "xs" ? "xs" : "sm"}
        label={label}
        className={className}
      />
    );
  }

  if (mode === "ai-chat") {
    return <AIChatLoader label={label} className={className} />;
  }

  if (mode === "skeleton") {
    return <DashboardSkeleton label={label} />;
  }

  return (
    <FullscreenLoader
      label={label}
      brandTitle={brandTitle}
      variant={variant}
    >
      {children}
    </FullscreenLoader>
  );
}