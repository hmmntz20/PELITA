// src/app/(auth)/sign-in/page.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { Calendar } from "lucide-react";
import { Loader } from "@/components/ui/loader";

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
        `reduced-motion: ${reduced ? "ON (JS random bar tetap aktif)" : "OFF"} · transisi berjalan: ${running}`
      );
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="absolute bottom-8 text-xs text-[var(--text-muted)] font-mono">
      {info}
    </p>
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
  // State khusus saat redirect menuju Google OAuth (/api/auth/google)
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  // true selama navigasi router.push ke dashboard berlangsung
  const [isRedirecting, startRedirect] = useTransition();
  // Hanya untuk pengujian: tampilkan loader selama 5 detik
  const [isPreviewingLoader, setIsPreviewingLoader] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [devVerifyUrl, setDevVerifyUrl] = useState<string | null>(null);

  const errorMessage = formError || queryError;
  const successMessage =
    queryVerified === "1" || queryMessage
      ? queryMessage || "Email verified successfully. You can now sign in."
      : null;

  // Reset state Google redirect jika user menekan tombol Back di browser dari halaman Google
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsGoogleRedirecting(false);
        setIsLoading(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

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

        if (data?.devVerifyUrl) {
          setDevVerifyUrl(data.devVerifyUrl);
        }
        setIsLoading(false);
        return;
      }

      // Login success
      const redirectTarget =
        searchParams.get("redirect") || data?.redirectTo || "/dashboard";

      // Jangan biarkan password tersisa di state setelah login
      setPassword("");
      setIsLoading(false);

      // Aktifkan Fullscreen Loader selama proses navigasi ke dashboard
      startRedirect(() => {
        router.push(redirectTarget);
        router.refresh();
      });
    } catch (err) {
      console.error("[SignIn] Network or parsing error:", err);
      setFormError(
        "Unable to connect to the authentication server. Please check your connection."
      );
      setIsLoading(false);
    }
  }

  function handleGoogleSignIn() {
    setFormError(null);
    setIsGoogleRedirecting(true);
    window.location.href = "/api/auth/google";
  }

  const isBusy = isLoading || isRedirecting || isGoogleRedirecting;
  const showFullscreenLoader =
    isRedirecting || isGoogleRedirecting || isPreviewingLoader;

  const fullscreenLabel = isPreviewingLoader
    ? "Previewing PELITA Loader..."
    : isGoogleRedirecting
    ? "Connecting to Google..."
    : "Entering Dashboard...";

  return (
    <>
      {showFullscreenLoader && (
        <Loader mode="fullscreen" variant="auto" label={fullscreenLabel}>
          {isPreviewingLoader && <LoaderDebug />}
        </Loader>
      )}

      <div className="w-full max-w-sm bg-[var(--surface)] rounded-2xl shadow-sm border border-[var(--border-surface)] p-7 flex flex-col gap-5 transition-colors duration-200">
        {/* Icon banner */}
        <div className="w-full h-20 bg-[var(--bg-supporting)] rounded-xl flex items-center justify-center border border-[var(--border-surface)] transition-colors">
          <Calendar
            className="w-7 h-7 text-[var(--text-muted)]"
            strokeWidth={1.5}
          />
        </div>

        {/* Label + Title */}
        <div>
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--text-muted)] font-medium mb-1">
            Welcome back
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Sign In
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Your day, beautifully in balance.
          </p>
        </div>

        {/* Success Alert (Monochrome) */}
        {successMessage && (
          <div className="rounded-xl border border-[var(--border-input)] bg-[var(--bg-supporting)] p-3 text-xs text-[var(--text-primary)] flex items-start gap-2.5">
            <svg
              className="w-4 h-4 shrink-0 text-[var(--icon-important)] mt-0.5"
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
          <div className="rounded-xl border border-[var(--border-input)] bg-[var(--bg-supporting)] p-3 text-xs text-[var(--text-primary)] flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <svg
                className="w-4 h-4 shrink-0 text-[var(--icon-important)] mt-0.5"
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
            {devVerifyUrl && (
              <div className="pt-1.5 border-t border-[var(--border-surface)]">
                <a
                  href={devVerifyUrl}
                  className="inline-block font-semibold text-[var(--text-primary)] underline"
                >
                  [Dev Mode] Click here to verify email now &rarr;
                </a>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signin-email"
              className="text-xs font-medium text-[var(--text-secondary)]"
            >
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[var(--text-muted)]">
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
                disabled={isBusy}
                placeholder="you@example.com"
                required
                className="w-full h-10 rounded-lg border border-[var(--border-input)] bg-transparent pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]/10 transition disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="signin-password"
                className="text-xs font-medium text-[var(--text-secondary)]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[var(--text-muted)]">
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
                disabled={isBusy}
                placeholder="At least 8 characters"
                required
                className="w-full h-10 rounded-lg border border-[var(--border-input)] bg-transparent pl-9 pr-9 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]/10 transition disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
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
            disabled={isBusy}
            className="w-full h-11 rounded-xl bg-[var(--action-primary)] text-[var(--action-primary-text)] text-sm font-semibold flex items-center justify-center gap-2.5 hover:bg-[var(--action-primary-hover)] active:translate-y-px transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading || isRedirecting ? (
              <Loader
                mode="inline"
                label={isRedirecting ? "Redirecting..." : "Signing In..."}
              />
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
          <div className="flex-1 h-px bg-[var(--border-surface)]" />
          <span className="text-[0.7rem] text-[var(--text-muted)]">or</span>
          <div className="flex-1 h-px bg-[var(--border-surface)]" />
        </div>

        {/* Google button */}
        <button
          id="signin-google"
          type="button"
          disabled={isBusy}
          onClick={handleGoogleSignIn}
          className="w-full h-10 rounded-xl border border-[var(--border-input)] bg-transparent text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2.5 hover:bg-[var(--bg-supporting)] hover:text-[var(--text-primary)] active:translate-y-px transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleRedirecting ? (
            <Loader mode="inline" label="Connecting to Google..." />
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7.5"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                />
                <path
                  d="M8 3.5A4.5 4.5 0 1 0 11.182 11"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M8 8h3.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--text-muted)]">
          New here?{" "}
          <Link
            href="/sign-up"
            className="text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition"
          >
            Sign Up
          </Link>
        </p>

        {/* Tombol Uji Loader 5 Detik (Hanya tampil saat mode development) */}
        {process.env.NODE_ENV !== "production" && (
          <button
            type="button"
            onClick={previewLoader}
            className="mt-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline transition text-center cursor-pointer"
          >
            [Dev] Test PELITA Fullscreen Loader (5s)
          </button>
        )}
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={<Loader mode="fullscreen" variant="auto" label="Loading Sign In..." />}
    >
      <SignInForm />
    </Suspense>
  );
}