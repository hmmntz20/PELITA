"use client";

import { Search, Bell, PanelRight } from "lucide-react";

interface TopNavProps {
  section: string;
  page: string;
  chatOpen: boolean;
  onToggleChat: () => void;
}

export function TopNav({
  section,
  page,
  chatOpen,
  onToggleChat,
}: TopNavProps) {
  return (
    <header className="h-[68px] border-b border-[#D4D4D8] flex items-center justify-between px-6 shrink-0 bg-white select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[0.75rem] text-[#71717A]">
        <span className="font-medium text-[#71717A]">{section}</span>
        <span className="text-[#D4D4D8]">/</span>
        <span className="text-[#18181B] font-semibold">{page}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input Box */}
        <div className="flex items-center gap-2 text-[#71717A] text-[0.72rem] bg-white border border-[#D4D4D8] rounded-lg px-2.5 py-1">
          <Search className="w-3.5 h-3.5 text-[#71717A]" />
          <span className="text-[#A1A1AA]">Search anything...</span>
          <kbd className="text-[0.62rem] bg-[#F4F4F5] border border-[#D4D4D8] px-1.5 py-0.2 rounded text-[#71717A] font-sans font-medium">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          title="Notifications"
          className="relative text-[#71717A] hover:text-[#18181B] transition p-1"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#18181B]" />
        </button>

        {/* Toggle AI Chat Panel */}
        <button
          type="button"
          onClick={onToggleChat}
          title={chatOpen ? "Hide AI Assistant" : "Show AI Assistant"}
          className={`p-1 rounded transition ${chatOpen
              ? "text-[#18181B] bg-[#F4F4F5]"
              : "text-[#71717A] hover:text-[#18181B]"
            }`}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
