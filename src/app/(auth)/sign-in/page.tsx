"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Metadata must be in a server component; add it via generateMetadata if needed.
// For now we keep this as a client component for form interactivity.

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call real auth — for now, redirect straight to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
      {/* Hero text */}
      <div className="text-center mb-10">
        <h1 className="text-[2rem] font-bold tracking-tight text-foreground leading-tight">
          A little space for your whole life.
        </h1>
        <p className="text-sm text-foreground/50 mt-2">
          Plan your time. Control your money. Understand your health.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-black/5 p-7 flex flex-col gap-5">
        {/* Icon banner */}
        <div className="w-full h-20 bg-[#f0f0ef] rounded-xl flex items-center justify-center">
          {/* Calendar icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground/40"
          >
            <rect
              x="3"
              y="5"
              width="26"
              height="22"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <line
              x1="3"
              y1="12"
              x2="29"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <line
              x1="10"
              y1="3"
              x2="10"
              y2="9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="22"
              y1="3"
              x2="22"
              y2="9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Label + Title */}
        <div>
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-foreground/40 font-medium mb-1">
            Welcome back
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign In
          </h2>
          <p className="text-xs text-foreground/45 mt-1">
            Your day, beautifully in balance.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signin-email"
              className="text-xs font-medium text-foreground/70"
            >
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-foreground/30">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="2.5"
                    width="13"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M1 4.5L7.5 8.5L14 4.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-10 rounded-lg border border-black/10 bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="signin-password"
                className="text-xs font-medium text-foreground/70"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-foreground/50 hover:text-foreground transition"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-foreground/30">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="6.5"
                    width="9"
                    height="7"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="At least 8 characters"
                className="w-full h-10 rounded-lg border border-black/10 bg-transparent pl-9 pr-9 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-foreground/30 hover:text-foreground/60 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 7.5C1 7.5 3.5 3 7.5 3s6.5 4.5 6.5 4.5S11.5 12 7.5 12 1 7.5 1 7.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="7.5"
                      cy="7.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="2"
                      y1="13"
                      x2="13"
                      y2="2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 7.5C1 7.5 3.5 3 7.5 3s6.5 4.5 6.5 4.5S11.5 12 7.5 12 1 7.5 1 7.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="7.5"
                      cy="7.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign In button */}
          <button
            id="signin-submit"
            type="submit"
            className="w-full h-11 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2 hover:bg-foreground/85 active:translate-y-px transition-all"
          >
            Sign In
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-black/8" />
          <span className="text-[0.7rem] text-foreground/30">or</span>
          <div className="flex-1 h-px bg-black/8" />
        </div>

        {/* Google button */}
        <button
          id="signin-google"
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full h-10 rounded-xl border border-black/10 bg-transparent text-sm font-medium text-foreground/70 flex items-center justify-center gap-2.5 hover:bg-black/[0.03] active:translate-y-px transition-all"
        >
          {/* Google icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7.5" stroke="#E0E0E0" strokeWidth="1" />
            <path
              d="M8 3.5A4.5 4.5 0 1 0 11.182 11"
              stroke="#4285F4"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M8 8h3.5"
              stroke="#4285F4"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-foreground/40">
          New here?{" "}
          <Link
            href="/sign-up"
            className="text-foreground/70 font-medium hover:text-foreground transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
