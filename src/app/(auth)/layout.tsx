import type { Metadata } from "next";
import AuthHero from "@/components/auth-hero";

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Kiri: 25% (1/4), Background Hitam, Logo Putih di Tengah */}
      <div className="w-full lg:w-[30%] bg-black flex flex-col items-center justify-center p-8 min-h-[30vh] lg:min-h-screen">
        <div className="flex items-center gap-3 text-white">
          {/* Logo PELITA */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#ededee]"
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
          <h1
            className="text-4xl font-bold uppercase tracking-[0.38em] pl-[0.38em] text-white"
          >
            PELITA
          </h1>
        </div>
      </div>

      {/* Kanan: 75% (3/4), Background Abu-abu terang, Berisi Form */}
      <div className="w-full lg:w-[70%] bg-[#ededee] flex flex-col min-h-[70vh] lg:min-h-screen relative">
        
        {/* Tagline Kanan Atas */}
        <div className="absolute top-0 left-0 p-8 w-full flex justify-between">
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-foreground/40 font-medium hidden sm:block">
            ✦ Your everyday, a little lighter
          </p>
          <button>
            toggle 
          </button>
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