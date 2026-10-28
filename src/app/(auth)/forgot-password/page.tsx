"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-black/5 p-7 flex flex-col gap-5">
        {/* Icon banner */}
        <div className="w-full h-20 bg-[#efefee] rounded-xl flex items-center justify-center border">
          <Wallet
            className="w-7 h-7 text-foreground/40"
            strokeWidth={1.5}
          />
        </div>

        {/* Label + Title */}
        <div>
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-foreground/40 font-medium mb-1">
            Let&apos;s get you back
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Reset Password
          </h2>
          <p className="text-xs text-foreground/45 mt-1">
            We&apos;ll send a single-use reset link to your email.
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="forgot-email"
              className="text-xs font-medium text-foreground/70"
            >
              Email Address
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
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-10 rounded-lg border border-black/10 bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition"
              />
            </div>
          </div>

          {/* Send Reset Link button */}
          <button
            id="forgot-submit"
            type="submit"
            className="w-full h-11 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2 hover:bg-foreground/85 active:translate-y-px transition-all"
          >
            Send Reset Link
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

        {/* Back to Sign In */}
        <p className="text-center text-xs text-foreground/40">
          <Link
            href="/sign-in"
            className="text-foreground/60 hover:text-foreground transition"
          >
            Back to Sign In
          </Link>
        </p>
    </div>
  );
}
