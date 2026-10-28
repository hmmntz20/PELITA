import type { Metadata } from "next";

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
    <div className="min-h-screen bg-[#f0f0ef] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            {/* PELITA logo icon — three vertical bars */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground"
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
          </div>
          <span className="text-[1.35rem] font-bold tracking-tight text-foreground">
            PELITA
          </span>
        </div>

        {/* Tagline */}
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-foreground/40 font-medium hidden sm:block">
          ✦ Your everyday, a little lighter
        </p>
      </header>

      {/* Page content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
