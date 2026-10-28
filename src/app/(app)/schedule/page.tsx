"use client";

import { useState } from "react";
import {
  Plus,
  Circle,
  CircleDot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

interface ScheduleListItem {
  id: number;
  title: string;
  timeLabel: string;
}

const LIST_ITEMS: ScheduleListItem[] = [
  {
    id: 1,
    title: "Team Project Sync",
    timeLabel: "Oct 14, 13:00",
  },
  {
    id: 2,
    title: "IMPAL Report Submission",
    timeLabel: "Oct 14, 23:59",
  },
  {
    id: 3,
    title: "Night Hackathon",
    timeLabel: "Oct 16, 22:00 → Oct 17, 01:30",
  },
];

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  return (
    <div className="w-full px-8 py-6">
      {/* Page Title & CTA */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[0.62rem] tracking-[0.16em] uppercase text-[#71717A] font-semibold mb-1">
            MAKE TIME FOR WHAT MATTERS
          </p>
          <h1 className="text-[1.85rem] font-bold tracking-tight text-[#18181B] leading-tight">
            Schedule & Agendas
          </h1>
          <p className="text-[0.82rem] text-[#71717A] mt-1">
            Your plans, deadlines, and a little breathing room.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 bg-[#18181B] hover:bg-[#27272A] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Agenda</span>
        </button>
      </div>

      {/* Controls Row: View Toggle & Filters */}
      <div className="flex items-center justify-between mb-4">
        {/* Toggle Calendar / List matching reference */}
        <div className="inline-flex items-center bg-[#F4F4F5] border border-[#D4D4D8] rounded-xl p-1 text-xs font-medium text-[#71717A]">
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
              viewMode === "calendar"
                ? "bg-white text-[#18181B] shadow-2xs font-semibold border border-[#D4D4D8]/60"
                : "hover:text-[#18181B]"
            }`}
          >
            {viewMode === "calendar" ? (
              <CircleDot className="w-3.5 h-3.5 text-[#18181B]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-[#71717A]" />
            )}
            <span>Calendar View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
              viewMode === "list"
                ? "bg-white text-[#18181B] shadow-2xs font-semibold border border-[#D4D4D8]/60"
                : "hover:text-[#18181B]"
            }`}
          >
            {viewMode === "list" ? (
              <CircleDot className="w-3.5 h-3.5 text-[#18181B]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-[#71717A]" />
            )}
            <span>List View</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 bg-white border border-[#D4D4D8] px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition"
          >
            <span>All types</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-white border border-[#D4D4D8] px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition"
          >
            <span>All statuses</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>
        </div>
      </div>

      {/* Main Schedule Card */}
      <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4D4D8]/60">
          <h2 className="text-base font-bold text-[#18181B]">October 2026</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-[#F4F4F5] text-[#71717A] hover:text-[#18181B] transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#D4D4D8] text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition"
            >
              <span className="w-2 h-2 rounded-full border border-[#18181B]" />
              <span>Today</span>
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-[#F4F4F5] text-[#71717A] hover:text-[#18181B] transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switching: Calendar View vs List View */}
        {viewMode === "calendar" ? (
          <>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center py-2 text-[0.7rem] font-medium text-[#71717A] border-b border-[#D4D4D8]/40">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Calendar Grid (October 2026 starts Thursday) */}
            <div className="grid grid-cols-7 border-b border-[#D4D4D8]/40">
              {/* Week 1: Mon-Wed empty */}
              <div className="h-24 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 bg-[#FAFAFA]/40" />
              <div className="h-24 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 bg-[#FAFAFA]/40" />
              <div className="h-24 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 bg-[#FAFAFA]/40" />
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                1
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                2
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                3
              </div>
              <div className="h-24 p-2 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                4
              </div>

              {/* Week 2: 5 to 11 */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                5
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                6
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                7
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                8
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                9
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                10
              </div>
              <div className="h-24 p-2 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                11
              </div>

              {/* Week 3: 12 to 18 */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A] flex flex-col justify-between">
                <span>12</span>
                <Check className="w-3.5 h-3.5 text-[#18181B]" />
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                13
              </div>
              {/* Day 14 (Today active) */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 bg-[#F4F4F5]/60 flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-[#18181B] text-white font-bold text-xs flex items-center justify-center">
                  14
                </span>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                </div>
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                15
              </div>
              {/* Day 16 (Event bar) */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A] flex flex-col justify-between">
                <span>16</span>
                <div className="h-2 bg-[#71717A] rounded-full mb-1" />
              </div>
              {/* Day 17 (Event bar) */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A] flex flex-col justify-between">
                <span>17</span>
                <div className="h-2 bg-[#71717A] rounded-full mb-1" />
              </div>
              <div className="h-24 p-2 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                18
              </div>

              {/* Week 4: 19 to 25 */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                19
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                20
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                21
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A] flex flex-col justify-between">
                <span>22</span>
                <Check className="w-3.5 h-3.5 text-[#18181B]" />
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                23
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                24
              </div>
              <div className="h-24 p-2 border-b border-[#D4D4D8]/40 text-xs text-[#71717A]">
                25
              </div>

              {/* Week 5: 26 to 31 */}
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 text-xs text-[#71717A]">
                26
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 text-xs text-[#71717A]">
                27
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 text-xs text-[#71717A]">
                28
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 text-xs text-[#71717A]">
                29
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 text-xs text-[#71717A]">
                30
              </div>
              <div className="h-24 p-2 border-r border-[#D4D4D8]/40 text-xs text-[#71717A]">
                31
              </div>
              <div className="h-24 bg-[#FAFAFA]/40" />
            </div>
          </>
        ) : (
          /* List View matching media_1793145860294.png */
          <div className="flex flex-col gap-3.5 py-4 border-b border-[#D4D4D8]/40">
            {LIST_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#D4D4D8] rounded-xl px-6 py-7 flex items-center shadow-2xs hover:border-[#A1A1AA] transition"
              >
                <p className="text-[0.95rem] font-semibold text-[#18181B]">
                  {item.title}
                  <span className="text-[#71717A] font-normal mx-1.5">·</span>
                  <span className="text-[#18181B] font-medium">
                    {item.timeLabel}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Legend / Footer bar */}
        <div className="flex items-center justify-between pt-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#D4D4D8] text-[0.68rem] text-[#18181B] font-medium bg-[#F4F4F5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
              Event
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#D4D4D8] text-[0.68rem] text-[#18181B] font-medium bg-[#F4F4F5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
              Task
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#D4D4D8] text-[0.68rem] text-[#18181B] font-medium bg-[#F4F4F5]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Deadline
            </span>
          </div>
          <span className="text-[0.68rem] text-[#71717A]">
            All times in Asia/Jakarta (WIB)
          </span>
        </div>
      </div>
    </div>
  );
}
