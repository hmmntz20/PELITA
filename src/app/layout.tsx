import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PELITA — Personal Life Assistant",
  description:
    "Plan your time. Control your money. Understand your health.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>

      <body
        className="
          min-h-full flex flex-col
          bg-[var(--bg-main)]
          text-[var(--text-primary)]
        "
      >
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}