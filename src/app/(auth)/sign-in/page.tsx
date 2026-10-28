"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { Calendar } from "lucide-react";

// Hanya untuk diagnosis di mode development (muncul di bawah loader saat tombol uji diklik)
function LoaderDebug() {
  const [info, setInfo] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const running = document
        .getAnimations()
        .filter((a) => a.playState === "running").length;
      setInfo(
        `reduced-motion: ${reduced ? "ON (bar hanya berkedip)" : "OFF"} · animasi berjalan: ${running}`
      );
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="absolute bottom-8 text-xs text-foreground/50">{info}</p>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryError = searchParams.get("error");
  const queryVerified = searchParams.get("verified");
  const queryMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // true hanya selama navigasi ke dashboard berlangsung, lalu otomatis false
  // (tidak ikut "menempel" kalau halaman ini disimpan/dipulihkan oleh Next.js)
  const [isRedirecting, startRedirect] = useTransition();
  // Hanya untuk pengujian: tampilkan loader selama 5 detik (tombol di bawah form)
  const [isPreviewingLoader, setIsPreviewingLoader] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [devVerifyUrl, setDevVerifyUrl] = useState<string | null>(null);

  const errorMessage = formError || queryError;
  const successMessage =
    queryVerified === "1" || queryMessage
      ? queryMessage || "Email verified successfully. You can now sign in."
      : null;

  function previewLoader() {
    setIsPreviewingLoader(true);
    setTimeout(() => setIsPreviewingLoader(false), 5000);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setDevVerifyUrl(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(data?.error || "Invalid email address or password.");

        // If email not verified in local dev, an instant link is provided
        if (data?.devVerifyUrl) {
          setDevVerifyUrl(data.devVerifyUrl);
        }
        return;
      }

      // Login success
      const redirectTarget =
        searchParams.get("redirect") || data?.redirectTo || "/dashboard";

      // Jangan biarkan password tersisa di state setelah login
      setPassword("");

      // Loader layar penuh tampil selama navigasi ke dashboard (isRedirecting)
      startRedirect(() => {
        router.push(redirectTarget);
        router.refresh();
      });
    } catch (err) {
      console.error("[SignIn] Network or parsing error:", err);
      setFormError(
        "Unable to connect to the authentication server. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-black/5 p-7 flex flex-col gap-5">
        {/* Icon banner */}
        <div className="w-full h-20 bg-[#efefee] rounded-xl flex items-center justify-center border">
          <Calendar
            className="w-7 h-7 text-foreground/40"
            strokeWidth={1.5}
          />
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

        {/* Success Alert */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800 flex items-start gap-2.5">
            <svg
              className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 font-medium leading-relaxed">
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
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
          </div>
        )}

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="At least 8 characters"
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

          {/* Sign In button */}
          <button
            id="signin-submit"
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
                Signing In...
              </>
            ) : (
              <>
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
              </>
            )}
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
          onClick={() => {
            window.location.href = "/api/auth/google";
          }}
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
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 text-foreground/40 text-xs">
          Loading sign in...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}