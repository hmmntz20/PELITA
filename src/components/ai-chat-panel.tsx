"use client";

import { useState } from "react";
import {
  Bot,
  ShieldCheck,
  Apple,
  Wallet,
  Check,
  Camera,
  Paperclip,
  Plus,
  Mic,
} from "lucide-react";

interface AiChatPanelProps {
  width: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  isResizing?: boolean;
  onClose?: () => void;
}

export function AiChatPanel({
  width,
  onResizeStart,
  isResizing,
}: AiChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [showActions, setShowActions] = useState(false);

  return (
    <aside
      style={{ width: `${width}px` }}
      className="relative shrink-0 flex flex-col border-l border-[#D4D4D8] bg-white h-full select-none"
    >
      {/* Draggable resize handle on the left edge */}
      <div
        onMouseDown={onResizeStart}
        className={`absolute -left-1.5 top-0 bottom-0 w-3 cursor-col-resize z-30 group flex items-center justify-center transition-colors ${
          isResizing ? "bg-[#18181B]/15" : "hover:bg-[#18181B]/10"
        }`}
        title="Drag to resize panel (Min 400px)"
      >
        <div
          className={`w-[2px] h-8 rounded-full transition-colors ${
            isResizing
              ? "bg-[#18181B]"
              : "bg-transparent group-hover:bg-[#71717A]"
          }`}
        />
      </div>

      {/* Header aligned with TopNav height */}
      <div className="flex items-center justify-between px-4 py-[17px] border-b border-[#D4D4D8] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#18181B] text-white flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[0.8rem] font-bold text-[#18181B] leading-tight">
              PELITA AI
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-[0.65rem] text-[#71717A]">
                Online
              </span>
            </div>
          </div>
        </div>
        <div
          className="p-1 rounded text-[#71717A]"
          title="Privacy Protected"
        >
          <ShieldCheck className="w-4 h-4 text-[#71717A]" />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
        {/* Date Stamp */}
        <p className="text-center text-[0.62rem] text-[#71717A] uppercase tracking-wider font-medium">
          TODAY, OCTOBER 14
        </p>

        {/* User Query Message */}
        <div className="flex justify-end">
          <div className="max-w-[90%] bg-[#F4F4F5] border border-[#D4D4D8] text-[#18181B] text-[0.78rem] rounded-2xl rounded-tr-xs px-3.5 py-2.5 leading-relaxed shadow-2xs">
            I had nasi goreng for lunch, Rp20.000 from my Cash Wallet.
          </div>
        </div>

        {/* AI Assistant Response */}
        <div className="flex flex-col gap-2.5">
          {/* Assistant Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#18181B] flex items-center justify-center shrink-0">
                <span className="text-[0.6rem] font-bold text-white">P</span>
              </div>
              <span className="text-[0.7rem] font-bold text-[#18181B] tracking-tight">
                PELITA AI
              </span>
            </div>
            <span className="text-[0.62rem] text-[#71717A]">12:32</span>
          </div>

          {/* Structured Nutrition Card */}
          <div className="bg-white border border-[#D4D4D8] rounded-xl p-3 flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[0.62rem] font-medium text-[#71717A]">
                <Apple className="w-3 h-3 text-[#18181B]" />
                Nutrition
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.82rem] font-bold text-[#18181B]">
                Nasi Goreng
              </span>
              <span className="text-[0.62rem] px-2 py-0.5 rounded-full border border-[#D4D4D8] text-[#71717A] bg-[#F4F4F5] font-medium">
                Estimate
              </span>
            </div>
            <p className="text-[0.72rem] text-[#71717A]">
              Medium portion · 450 kcal
            </p>
          </div>

          {/* Structured Finance Card */}
          <div className="bg-white border border-[#D4D4D8] rounded-xl p-3 flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[0.62rem] font-medium text-[#71717A]">
                <Wallet className="w-3 h-3 text-[#18181B]" />
                Finance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.88rem] font-bold text-[#18181B]">
                Rp 20.000
              </span>
              <span className="text-[0.62rem] px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[#71717A] font-medium">
                Expense
              </span>
            </div>
            <p className="text-[0.72rem] text-[#71717A]">
              Cash Wallet · Food & drinks
            </p>
          </div>

          {/* Confirmation Notice */}
          <div className="pt-1 border-t border-[#D4D4D8]/60 flex items-center gap-1.5 text-[0.72rem] text-[#18181B]">
            <Check className="w-3.5 h-3.5 text-[#18181B] shrink-0" />
            <span className="font-medium">
              Noted — saved to Nutrition and Finance.
            </span>
          </div>

          <p className="text-center text-[0.6rem] text-[#A1A1AA] italic">
            Illustrative saved - record state
          </p>

          {/* Privacy Banner Card */}
          <div className="bg-[#F4F4F5] border border-[#D4D4D8] rounded-xl p-3 flex items-start gap-2.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-[#71717A] shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.72rem] font-semibold text-[#18181B]">
                Your life, your data.
              </p>
              <p className="text-[0.68rem] text-[#71717A] leading-relaxed">
                Chats are temporary. Only your records stay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Row with integrated + button inside and popover menu */}
      <div className="relative px-4 pb-3 pt-1">
        {/* Quick actions popup - only shown when + is clicked */}
        {showActions && (
          <div className="absolute bottom-full left-4 mb-2.5 w-44 rounded-xl border border-[#D4D4D8] bg-white p-1 shadow-lg flex flex-col gap-0.5 z-20 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => setShowActions(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition text-left"
            >
              <Camera className="w-4 h-4 text-[#71717A]" />
              <span>Take Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setShowActions(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition text-left"
            >
              <Paperclip className="w-4 h-4 text-[#71717A]" />
              <span>Attach File</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Integrated pill: + button inside input box */}
          <div className="flex-1 relative flex items-center rounded-full border border-[#D4D4D8] bg-white pl-1.5 pr-3 py-1 focus-within:border-[#18181B] transition shadow-2xs">
            <button
              type="button"
              onClick={() => setShowActions((prev) => !prev)}
              className={`w-7 h-7 rounded-full bg-transparent flex items-center justify-center shrink-0 text-[#71717A] hover:text-[#18181B] hover:bg-black/[0.04] active:scale-95 transition ${
                showActions ? "rotate-45 text-[#18181B]" : ""
              }`}
              title="Add attachment"
            >
              <Plus className="w-4 h-4 transition-transform duration-150" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask or tell PELITA..."
              className="flex-1 bg-transparent px-2.5 text-[0.78rem] text-[#18181B] placeholder:text-[#A1A1AA] outline-none"
            />
          </div>

          {/* Voice Input Mic Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 hover:bg-[#27272A] transition"
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[0.58rem] text-[#A1A1AA] pb-3 px-4">
        Private by design. Powered by your context.
      </p>
    </aside>
  );
}
