"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Calendar,
  Wallet,
  Apple,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  badge?: number;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    href: "/schedule",
    label: "Schedule",
    badge: 2,
    icon: Calendar,
  },
  {
    href: "/finance",
    label: "Finance",
    icon: Wallet,
  },
  {
    href: "/nutrition",
    label: "Nutrition",
    icon: Apple,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-[250px] shrink-0 flex flex-col border-r border-[#D4D4D8] bg-white h-full select-none">
      {/* Brand Logo with 35px icon and scaled typography (padding-x 18px) */}
      <div className="px-[18px] pt-5 pb-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          {/* Logo icon sized exactly 35px */}
          <div className="w-[35px] h-[35px] bg-[#18181B] rounded-[10px] flex items-center justify-center gap-[2.5px] shrink-0 shadow-2xs">
            <span className="w-[3px] h-[13px] bg-white rounded-full inline-block" />
            <span className="w-[3px] h-[19px] bg-white rounded-full inline-block" />
            <span className="w-[3px] h-[13px] bg-white rounded-full inline-block" />
          </div>
          {/* Proportional PELITA typography */}
          <div className="flex items-start">
            <span className="text-[1.35rem] font-black tracking-wider text-[#18181B] leading-none">
              PELITA
            </span>
            <span className="w-2 h-2 rounded-full border-[1.5px] border-[#3B82F6] inline-block ml-0.5 -mt-1" />
          </div>
        </Link>
      </div>

      {/* Tailscale Connected badge (padding-x 18px) */}
      <div className="mx-[18px] mt-1 mb-2 px-3.5 py-1.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#71717A] shrink-0" />
          <span className="text-[0.75rem] text-[#18181B] font-medium">
            Tailscale: Connected
          </span>
        </div>
        <ShieldCheck className="w-4 h-4 text-[#71717A]" />
      </div>

      {/* Workspace Section Header (padding-x 18px) */}
      <div className="px-[18px] mt-4 mb-2">
        <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[#71717A] font-semibold">
          WORKSPACE
        </p>
      </div>

      {/* Navigation Items: px-[18px], gap-[7px], height 47px, icon 18px */}
      <nav className="flex flex-col gap-[7px] px-[18px] flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 h-[47px] rounded-xl transition-colors ${
                isActive
                  ? "bg-[#F4F4F5] text-[#18181B] font-bold shadow-2xs"
                  : "text-[#18181B] font-medium hover:bg-[#F4F4F5]/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className="w-[18px] h-[18px] text-[#18181B] shrink-0" />
                <span className="text-[0.875rem]">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-md border border-[#D4D4D8] text-[#71717A] bg-white font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Card (padding-x 18px) */}
      <div className="px-[18px] pb-[18px] pt-3 border-t border-[#D4D4D8]">
        <div className="rounded-xl border border-[#D4D4D8] bg-white p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 text-xs font-bold">
              H
            </div>
            <div className="min-w-0">
              <p className="text-[0.78rem] font-bold text-[#18181B] truncate leading-tight">
                Hamam
              </p>
              <p className="text-[0.62rem] text-[#71717A] truncate">
                Personal workspace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch (err) {
                console.error("Sign out error:", err);
              }
              router.push("/sign-in");
              router.refresh();
            }}
            title="Sign out"
            className="p-1 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
