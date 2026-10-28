"use client";

import {
  Plus,
  Apple,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function NutritionPage() {
  return (
    <div className="w-full px-8 py-6">
      {/* Title & CTA */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[0.62rem] tracking-[0.16em] uppercase text-[#71717A] font-semibold mb-1">
            SMALL HABITS, STRONGER YOU
          </p>
          <h1 className="text-[1.85rem] font-bold tracking-tight text-[#18181B] leading-tight">
            Nutrition tracking
          </h1>
          <p className="text-[0.82rem] text-[#71717A] mt-1">
            A balanced view of what fuels your day.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 bg-[#18181B] hover:bg-[#27272A] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meal (Multi-Item)</span>
        </button>
      </div>

      {/* Goal Profile Card */}
      <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 flex items-center justify-between mb-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] border border-[#D4D4D8]/60 flex items-center justify-center shrink-0">
            <Apple className="w-5 h-5 text-[#18181B]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#D4D4D8] text-[0.65rem] font-medium text-[#18181B] bg-[#F4F4F5]">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#18181B]" />
                Current goal: Bulking
              </span>
            </div>
            <p className="text-xs text-[#71717A]">
              Height <strong className="text-[#18181B]">172 cm</strong> · Current{" "}
              <strong className="text-[#18181B]">65 kg</strong> · Target{" "}
              <strong className="text-[#18181B]">68 kg</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 bg-white border border-[#D4D4D8] px-3 py-1.5 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] shadow-2xs transition"
        >
          <span>Edit Physical Targets</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
        </button>
      </div>

      {/* Daily Overview Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[0.85rem] font-bold text-[#18181B]">
            Daily overview
          </h2>
          <span className="text-[0.72rem] text-[#71717A] font-medium">
            Wednesday, 14 October 2026
          </span>
        </div>

        {/* Main Overview Card */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-6 shadow-2xs mb-3.5">
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Calorie Donut Ring Chart */}
            <div className="col-span-4 flex flex-col items-center justify-center text-center border-r border-[#D4D4D8]/60 pr-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
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
                  <span className="text-2xl font-extrabold text-[#18181B] leading-none">
                    1,850
                  </span>
                  <span className="text-[0.65rem] text-[#71717A] font-medium mt-0.5">
                    / 2,400 kcal
                  </span>
                </div>
              </div>
              <p className="text-[0.72rem] font-bold text-[#18181B] mt-2">
                Energy intake
              </p>
              <p className="text-[0.65rem] text-[#71717A]">
                550 kcal remaining
              </p>
            </div>

            {/* Daily Minimum Targets */}
            <div className="col-span-4 flex flex-col gap-3 px-2 border-r border-[#D4D4D8]/60">
              <p className="text-[0.62rem] tracking-[0.14em] uppercase text-[#71717A] font-bold">
                DAILY MINIMUM TARGETS
              </p>

              <div>
                <div className="flex justify-between text-[0.72rem] mb-1">
                  <span className="font-medium text-[#18181B]">Protein</span>
                  <span className="text-[#71717A]">110 / 130 g</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.72rem] mb-1">
                  <span className="font-medium text-[#18181B]">Fiber</span>
                  <span className="text-[#71717A]">22 / 30 g</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "73%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.72rem] mb-1">
                  <span className="font-medium text-[#18181B]">Water</span>
                  <span className="text-[#71717A]">2,100 / 2,500 ml</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "84%" }} />
                </div>
              </div>
            </div>

            {/* Daily Maximum Limits */}
            <div className="col-span-4 flex flex-col gap-3 pl-2">
              <p className="text-[0.62rem] tracking-[0.14em] uppercase text-[#71717A] font-bold">
                DAILY MAXIMUM LIMITS
              </p>

              <div>
                <div className="flex justify-between text-[0.72rem] mb-1">
                  <span className="font-medium text-[#18181B]">Sugar</span>
                  <span className="text-[#71717A]">35 / 50 g</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "70%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.72rem] mb-1">
                  <span className="font-medium text-[#18181B]">Sodium</span>
                  <span className="text-[#71717A]">1,800 / 2,000 mg</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E4E4E7] overflow-hidden">
                  <div className="h-full bg-[#18181B]" style={{ width: "90%" }} />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F4F5] border border-[#D4D4D8]/60 text-[0.65rem] text-[#71717A] mt-1 w-fit">
                <CheckCircle2 className="w-3 h-3 text-[#18181B]" />
                <span>Sodium nearing limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Macro Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[0.72rem] text-[#71717A] font-medium">
                Carbohydrates
              </p>
              <p className="text-[0.68rem] text-[#A1A1AA] mt-0.5">
                Today's intake · no target set
              </p>
            </div>
            <p className="text-2xl font-bold text-[#18181B] tracking-tight">
              230 g
            </p>
          </div>

          <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[0.72rem] text-[#71717A] font-medium">Fat</p>
              <p className="text-[0.68rem] text-[#A1A1AA] mt-0.5">
                Today's intake · no target set
              </p>
            </div>
            <p className="text-2xl font-bold text-[#18181B] tracking-tight">
              62 g
            </p>
          </div>
        </div>
      </section>

      {/* Today's Meal Timeline Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[0.85rem] font-bold text-[#18181B]">
            Today's meal timeline
          </h2>
          <button
            type="button"
            className="text-[0.72rem] text-[#71717A] hover:text-[#18181B] flex items-center gap-1 font-medium transition"
          >
            <span>Saved CustomFoods & Favorites</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Meal Card */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
          {/* Meal Card Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#D4D4D8]/60">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#D4D4D8] text-[0.65rem] font-medium text-[#71717A] bg-[#F4F4F5]">
                Estimate
              </span>
              <span className="text-sm font-bold text-[#18181B]">
                Lunch · 12:30 WIB
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#D4D4D8] text-[0.68rem] font-medium text-[#18181B] bg-[#F4F4F5]">
              <CheckCircle2 className="w-3 h-3 text-[#18181B]" />
              520 kcal · 42 g Protein
            </span>
          </div>

          {/* Food items & Illustration */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3 flex-1 max-w-md">
              {/* Item 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#F4F4F5] border border-[#D4D4D8] text-[0.65rem] font-bold text-[#71717A] flex items-center justify-center">
                    01
                  </span>
                  <span className="text-xs font-semibold text-[#18181B]">
                    White Rice (Medium, 150 g)
                  </span>
                </div>
                <span className="text-[0.7rem] text-[#71717A]">
                  Medium portion
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#F4F4F5] border border-[#D4D4D8] text-[0.65rem] font-bold text-[#71717A] flex items-center justify-center">
                    02
                  </span>
                  <span className="text-xs font-semibold text-[#18181B]">
                    Grilled Chicken Breast (100 g)
                  </span>
                </div>
                <span className="text-[0.7rem] text-[#71717A]">
                  Medium portion
                </span>
              </div>
            </div>

            {/* Apple Icon Illustration Card */}
            <div className="w-24 h-24 rounded-2xl bg-[#F4F4F5] border border-[#D4D4D8]/60 flex items-center justify-center shrink-0 ml-6">
              <Apple className="w-10 h-10 text-[#71717A]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
