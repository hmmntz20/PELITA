// src/app/(auth)/layout.tsx
import type { Metadata } from "next";
import AuthHero from "@/components/auth-hero";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "PELITA — Personal Life Assistant",
  description:
    "Plan your time. Control your money. Understand your health.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen flex flex-col lg:flex-row relative overflow-hidden
        text-[var(--text-primary)] transition-colors duration-300
        bg-[linear-gradient(180deg,var(--login-panel-bg)_0%,var(--login-panel-mid)_28%,var(--bg-main)_55%,var(--bg-main)_100%)]
        lg:bg-[linear-gradient(90deg,var(--login-panel-bg)_0%,var(--login-panel-bg)_18%,var(--login-panel-mid)_38%,var(--bg-main)_62%,var(--bg-main)_100%)]
      "
    >
      {/* Kiri: 30%, Transparan mengikuti bagian gelap gradien induk */}
      <div className="w-full lg:w-[30%] bg-transparent flex flex-col items-center justify-center p-8 min-h-[28vh] lg:min-h-screen relative select-none">
        <div className="absolute top-0 left-0 p-8 w-full flex items-center justify-start z-20">
          <p className="hidden sm:flex items-center h-10 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] font-medium">
            ✦ Your everyday, a little lighter
          </p>
        </div>
        <div className="flex items-center gap-3 text-[var(--login-logo-title)] transition-colors duration-300">
          {/* Logo PELITA */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[var(--login-logo-title)] transition-colors duration-300"
          >
            <rect
              x="2"
              y="6"
              width="5"
              height="16"
              rx="2.5"
              fill="currentColor"
            />
            <rect
              x="11"
              y="2"
              width="5"
              height="24"
              rx="2.5"
              fill="currentColor"
            />
            <rect
              x="20"
              y="9"
              width="5"
              height="13"
              rx="2.5"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-4xl font-bold uppercase tracking-[0.38em] pl-[0.38em] text-[var(--login-logo-title)] transition-colors duration-300">
            PELITA
          </h1>
        </div>
      </div>

      {/* Kanan: 70%, Transparan mengikuti bagian gradien yang memudar ke --bg-main */}
      <div className="w-full lg:w-[70%] bg-transparent flex flex-col min-h-[72vh] lg:min-h-screen relative">
        {/* Tagline & Tombol Trigger 1-Klik di Kanan Atas */}
        <div className="absolute top-0 left-0 p-8 w-full flex items-center justify-end z-20">          
          <ThemeToggle />
        </div>

        {/* Area Utama Form */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 mt-12 lg:mt-0">
          <AuthHero />
          {children}
        </main>
      </div>
    </div>
  );
}