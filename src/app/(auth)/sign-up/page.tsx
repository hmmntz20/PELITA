"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    message: string;
    devVerifyUrl?: string;
    email: string;
  } | null>(null);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Display name must be at least 2 characters.");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage(
        "Password must contain at least one letter and one number."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedName,
          email: trimmedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.error || "Registration failed. Please try again.");
        return;
      }

      setSuccessData({
        message:
          data?.message ||
          "Account created! Please check your email inbox to verify your address before signing in.",
        devVerifyUrl: data?.devVerifyUrl,
        email: trimmedEmail,
      });
    } catch (err) {
      console.error("[SignUp] Network or parsing error:", err);
      setErrorMessage(
        "Unable to connect to the registration server. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
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
        {/* Success screen after account creation */}
        {successData ? (
          <div className="flex flex-col gap-4 text-center py-2 animate-in fade-in duration-300">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Verify your email
              </h2>
              <p className="text-xs text-foreground/60 mt-1.5 leading-relaxed">
                We sent a single-use verification link to{" "}
                <span className="font-semibold text-foreground">
                  {successData.email}
                </span>
                .
              </p>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-left text-xs text-foreground/75 leading-relaxed">
              {successData.message}
            </div>

            {/* Dev mode quick verify button */}
            {successData.devVerifyUrl && (
              <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl flex flex-col gap-1 text-left">
                <span className="text-[11px] font-semibold text-blue-900">
                  Development Mode:
                </span>
                <p className="text-[11px] text-blue-700">
                  No SMTP needed. You can verify this account immediately:
                </p>
                <a
                  href={successData.devVerifyUrl}
                  className="mt-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-lg text-center transition"
                >
                  Verify Email Now →
                </a>
              </div>
            )}

            <Link
              href="/sign-in"
              className="mt-2 w-full h-11 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2 hover:bg-foreground/85 transition-all"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Icon banner */}
            <div className="w-full h-20 bg-[#f0f0ef] rounded-xl flex items-center justify-center">
              {/* Apple / nutrition icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground/40"
              >
                <path
                  d="M16 9C16 9 12 3 8 5C5 7 5 11 7 14C9 17 13 19 16 19C19 19 23 17 25 14C27 11 27 7 24 5C20 3 16 9 16 9Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 9V19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10 19C10 23.4 12.7 27 16 27C19.3 27 22 23.4 22 19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16 5V7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Label + Title */}
            <div>
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-foreground/40 font-medium mb-1">
                A fresh start
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Create Account
              </h2>
              <p className="text-xs text-foreground/45 mt-1">
                Make room for a more balanced you.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
                <svg
                  className="w-4 h-4 shrink-0 text-rose-500 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1 font-medium leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
              {/* Display Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="signup-name"
                  className="text-xs font-medium text-foreground/70"
                >
                  Display Name
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
                      <circle
                        cx="7.5"
                        cy="4.5"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M2 13.5C2 11 4.5 9 7.5 9s5.5 2 5.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    placeholder="Your name"
                    required
                    className="w-full h-10 rounded-lg border border-black/10 bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="signup-email"
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
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="you@example.com"
                    required
                    className="w-full h-10 rounded-lg border border-black/10 bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="signup-password"
                  className="text-xs font-medium text-foreground/70"
                >
                  Password
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
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="At least 8 characters (letters & numbers)"
                    required
                    className="w-full h-10 rounded-lg border border-black/10 bg-transparent pl-9 pr-9 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition disabled:opacity-50"
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

              {/* Create Account button */}
              <button
                id="signup-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2 hover:bg-foreground/85 active:translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 h-4 w-4 text-background"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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
                  </>
                )}
              </button>
            </form>

            {/* Email verification notice */}
            <div className="flex items-center justify-center gap-1.5 text-[0.7rem] text-foreground/40">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                <line
                  x1="6"
                  y1="5"
                  x2="6"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <circle cx="6" cy="3.5" r="0.5" fill="currentColor" />
              </svg>
              Email verification required after sign up
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-foreground/40">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-foreground/70 font-medium hover:text-foreground transition"
              >
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

