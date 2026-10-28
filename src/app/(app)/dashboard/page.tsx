"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  Wallet,
  Apple,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
} from "lucide-react";

interface ScheduleEvent {
  id: number;
  time: string;
  badge: string;
  badgeType: "event" | "task" | "urgent";
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const UPCOMING_EVENTS: ScheduleEvent[] = [
  {
    id: 1,
    time: "13:00",
    badge: "Event",
    badgeType: "event",
    title: "Team Project Sync",
    subtitle: "Product team · 1 hour",
    icon: Calendar,
  },
  {
    id: 2,
    time: "16:30",
    badge: "Event",
    badgeType: "event",
    title: "Client Sprint Review",
    subtitle: "Engineering & Design · 45 mins",
    icon: UserCheck,
  },
  {
    id: 3,
    time: "19:00",
    badge: "Task",
    badgeType: "task",
    title: "Doctor Health Checkup",
    subtitle: "Klinik Medika · Dr. Andi",
    icon: Clock,
  },
  {
    id: 4,
    time: "21:15",
    badge: "Task",
    badgeType: "task",
    title: "Personal Finance Review",
    subtitle: "Weekly budgeting check",
    icon: FileText,
  },
  {
    id: 5,
    time: "23:59",
    badge: "Deadline · Urgent",
    badgeType: "urgent",
    title: "IMPAL Report Submission",
    subtitle: "Due today · Don't miss it",
    icon: AlertCircle,
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full px-8 py-7 flex flex-col gap-8">
      {/* Top Welcome Header & Status */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.65rem] tracking-[0.18em] uppercase text-[#71717A] font-semibold mb-1">
              YOUR PERSONAL WORKSPACE
            </p>
            <h1 className="text-[2rem] font-black tracking-tight text-[#18181B] leading-tight">
              Hi, Hamam!
            </h1>
            <p className="text-[0.85rem] text-[#71717A] mt-1">
              A bright start. A little more balance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[0.75rem] text-[#18181B] bg-white border border-[#D4D4D8] rounded-xl px-3.5 py-2 shadow-2xs">
            <Clock className="w-4 h-4 text-[#71717A]" />
            <span className="font-semibold">Wednesday, 14 October</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl px-5 py-3.5 flex items-center justify-between shadow-2xs text-[0.78rem]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
            <span className="text-[#18181B] font-medium">
              You're all set for today.
            </span>
          </div>
          <div className="flex items-center gap-3.5 text-[#71717A]">
            <span>
              <strong className="text-[#18181B] font-semibold">
                {UPCOMING_EVENTS.length} agendas
              </strong>
            </span>
            <span className="text-[#D4D4D8]">·</span>
            <span>
              <strong className="text-[#18181B] font-semibold">77%</strong>{" "}
              nutrition goal
            </span>
            <span className="text-[#D4D4D8]">·</span>
            <span>
              <strong className="text-[#18181B] font-semibold">
                2 active wallets
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Upcoming Schedule (Horizontally Scrollable) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.9rem] font-bold text-[#18181B] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#71717A]" />
            <span>Upcoming schedule</span>
          </h2>
          <Link
            href="/schedule"
            className="text-[0.75rem] text-[#71717A] hover:text-[#18181B] flex items-center gap-1 font-semibold transition"
          >
            <span>View calendar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scrollable container for schedule cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scroll-smooth -mx-1 px-1">
          {UPCOMING_EVENTS.map((event) => {
            const Icon = event.icon;
            const isUrgent = event.badgeType === "urgent";

            return (
              <div
                key={event.id}
                className="min-w-[310px] max-w-[340px] shrink-0 bg-white border border-[#D4D4D8] rounded-xl p-4 flex items-start justify-between shadow-2xs hover:border-[#18181B] transition-all"
              >
                {/* Time with WIB strictly underneath */}
                <div className="flex flex-col items-start shrink-0 pr-4 border-r border-[#D4D4D8]/60">
                  <span className="text-[1.35rem] font-black text-[#18181B] leading-none tracking-tight">
                    {event.time}
                  </span>
                  <span className="text-[0.62rem] text-[#71717A] font-bold mt-1 tracking-wider uppercase">
                    WIB
                  </span>
                </div>

                {/* Event Information */}
                <div className="flex-1 min-w-0 px-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.62rem] font-semibold border ${
                        isUrgent
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-[#F4F4F5] text-[#71717A] border-[#D4D4D8]/60"
                      }`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {event.badge}
                    </span>
                  </div>
                  <p className="text-[0.82rem] font-bold text-[#18181B] truncate leading-tight">
                    {event.title}
                  </p>
                  <p className="text-[0.7rem] text-[#71717A] truncate mt-0.5">
                    {event.subtitle}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Finance Snapshot */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.9rem] font-bold text-[#18181B] flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#71717A]" />
            <span>Finance snapshot</span>
          </h2>
          <Link
            href="/finance"
            className="text-[0.75rem] text-[#71717A] hover:text-[#18181B] flex items-center gap-1 font-semibold transition"
          >
            <span>Open finance</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2 Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
            <p className="text-[0.75rem] text-[#71717A] font-semibold">
              Total balance
            </p>
            <p className="text-2xl font-black text-[#18181B] mt-1.5 tracking-tight">
              Rp 1.250.000
            </p>
            <p className="text-[0.7rem] text-[#A1A1AA] mt-1">
              Across 2 active wallets
            </p>
          </div>

          <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
            <p className="text-[0.75rem] text-[#71717A] font-semibold">
              7-day net spending
            </p>
            <p className="text-2xl font-black text-[#18181B] mt-1.5 tracking-tight">
              Rp 400.000
            </p>
            <p className="text-[0.7rem] text-[#A1A1AA] mt-1">
              Rp 450.000 expenses – Rp 50.000 refunds
            </p>
          </div>
        </div>

        {/* Budget Progress Bars Card */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
          <div className="grid grid-cols-2 gap-8">
            {/* Daily Budget */}
            <div>
              <div className="flex items-center justify-between text-[0.78rem] mb-2">
                <span className="font-bold text-[#18181B]">Daily budget</span>
                <span className="text-[#71717A] font-semibold">
                  Rp 40.000 / Rp 50.000
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                <div
                  className="h-full bg-[#18181B] rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
              <p className="text-[0.7rem] text-[#71717A] mt-2 font-medium">
                » Daily budget at 80%
              </p>
            </div>

            {/* Weekly Budget */}
            <div>
              <div className="flex items-center justify-between text-[0.78rem] mb-2">
                <span className="font-bold text-[#18181B]">
                  Weekly budget · Mon-Sun
                </span>
                <span className="text-[#71717A] font-semibold">
                  Rp 400.000 / Rp 350.000
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                <div
                  className="h-full bg-[#18181B] rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-[0.7rem] text-rose-600 mt-2 font-semibold">
                Weekly limit exceeded by Rp 50.000
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Today's Nutrition */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.9rem] font-bold text-[#18181B] flex items-center gap-2">
            <Apple className="w-4 h-4 text-[#71717A]" />
            <span>Today's nutrition</span>
          </h2>
          <Link
            href="/nutrition"
            className="text-[0.75rem] text-[#71717A] hover:text-[#18181B] flex items-center gap-1 font-semibold transition"
          >
            <span>View nutrition</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-[#D4D4D8] rounded-xl p-6 shadow-2xs">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Donut Calorie Ring Chart */}
            <div className="col-span-4 flex flex-col items-center justify-center text-center border-r border-[#D4D4D8]/60 pr-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E4E4E7"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#18181B"
                    strokeWidth="9"
                    strokeDasharray="251.2"
                    strokeDashoffset="57.8"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[1.75rem] font-black text-[#18181B] leading-none">
                    1,850
                  </span>
                  <span className="text-[0.68rem] text-[#71717A] font-semibold mt-0.5">
                    / 2,400 kcal
                  </span>
                </div>
              </div>
              <p className="text-[0.8rem] font-bold text-[#18181B] mt-2.5">
                Energy intake
              </p>
              <p className="text-[0.68rem] text-[#71717A]">
                550 kcal remaining
              </p>
            </div>

            {/* Daily Minimum Targets */}
            <div className="col-span-4 flex flex-col gap-3.5 px-3 border-r border-[#D4D4D8]/60">
              <p className="text-[0.65rem] tracking-[0.16em] uppercase text-[#71717A] font-bold">
                DAILY MINIMUM TARGETS
              </p>

              <div>
                <div className="flex justify-between text-[0.75rem] mb-1">
                  <span className="font-semibold text-[#18181B]">Protein</span>
                  <span className="text-[#71717A] font-medium">110 / 130 g</span>
                </div>
                <div className="h-2 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.75rem] mb-1">
                  <span className="font-semibold text-[#18181B]">Fiber</span>
                  <span className="text-[#71717A] font-medium">22 / 30 g</span>
                </div>
                <div className="h-2 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "73%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.75rem] mb-1">
                  <span className="font-semibold text-[#18181B]">Water</span>
                  <span className="text-[#71717A] font-medium">2,100 / 2,500 ml</span>
                </div>
                <div className="h-2 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "84%" }} />
                </div>
              </div>
            </div>

            {/* Daily Maximum Limits */}
            <div className="col-span-4 flex flex-col gap-3.5 pl-3">
              <p className="text-[0.65rem] tracking-[0.16em] uppercase text-[#71717A] font-bold">
                DAILY MAXIMUM LIMITS
              </p>

              <div>
                <div className="flex justify-between text-[0.75rem] mb-1">
                  <span className="font-semibold text-[#18181B]">Sugar</span>
                  <span className="text-[#71717A] font-medium">38 / 50 g</span>
                </div>
                <div className="h-2 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "76%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.75rem] mb-1">
                  <span className="font-semibold text-[#18181B]">Sodium</span>
                  <span className="text-[#71717A] font-medium">1,800 / 2,000 mg</span>
                </div>
                <div className="h-2 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "90%" }} />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F4F5] border border-[#D4D4D8]/60 text-[0.68rem] text-[#71717A] font-medium w-fit mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#18181B]" />
                <span>Sodium nearing limit</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
