"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Clock,
  Globe,
  Key,
  Eye,
  EyeOff,
  Save,
  Check,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Jakarta");
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full px-8 py-7 flex flex-col gap-8 max-w-4xl">
      {/* Title */}
      <div>
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-[#71717A] font-semibold mb-1">
          PREFERENCES & ACCOUNT
        </p>
        <h1 className="text-[2rem] font-black tracking-tight text-[#18181B] leading-tight">
          Settings
        </h1>
        <p className="text-[0.85rem] text-[#71717A] mt-1">
          Manage your personal workspace, privacy, timezone, and security.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: Profile Card */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#71717A]" />
            <span>Profile Information</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Hamam"
                className="w-full bg-white border border-[#D4D4D8] rounded-lg px-3 py-2 text-xs text-[#18181B] outline-none focus:border-[#18181B] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#D4D4D8] rounded-lg px-3 py-2 text-xs text-[#71717A]">
                <Mail className="w-3.5 h-3.5" />
                <span>hamam@pelita.local</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Timezone & Regional Preferences */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#71717A]" />
            <span>Timezone & Regional</span>
          </h2>
          <p className="text-[0.72rem] text-[#71717A] mb-4">
            All calendar schedules, reminders, and daily nutrition resets adapt to this timezone.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Timezone Select */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Primary Timezone
              </label>
              <div className="relative">
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="w-full bg-white border border-[#D4D4D8] rounded-lg px-3 py-2 text-xs text-[#18181B] font-medium outline-none focus:border-[#18181B] transition appearance-none cursor-pointer"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB · GMT+7)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA · GMT+8)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT · GMT+9)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT · GMT+8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST · GMT+9)</option>
                  <option value="UTC">UTC (Coordinated Universal Time · GMT+0)</option>
                  <option value="Europe/London">Europe/London (GMT · GMT+0)</option>
                  <option value="America/New_York">America/New_York (EST · GMT-5)</option>
                </select>
                <Clock className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Time Format
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTimeFormat("24h")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition ${
                    timeFormat === "24h"
                      ? "bg-[#18181B] text-white border-[#18181B]"
                      : "bg-white text-[#71717A] border-[#D4D4D8] hover:bg-[#F4F4F5]"
                  }`}
                >
                  24-Hour (13:00)
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFormat("12h")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition ${
                    timeFormat === "12h"
                      ? "bg-[#18181B] text-white border-[#18181B]"
                      : "bg-white text-[#71717A] border-[#D4D4D8] hover:bg-[#F4F4F5]"
                  }`}
                >
                  12-Hour (1:00 PM)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Change Password */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-1 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#71717A]" />
            <span>Change Password</span>
          </h2>
          <p className="text-[0.72rem] text-[#71717A] mb-4">
            Ensure your account uses a secure password to keep your personal records safe.
          </p>

          <div className="flex flex-col gap-3.5">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Current Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  placeholder="Enter current password"
                  className="w-full bg-white border border-[#D4D4D8] rounded-lg pl-3 pr-9 py-2 text-xs text-[#18181B] outline-none focus:border-[#18181B] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 text-[#71717A] hover:text-[#18181B] transition"
                >
                  {showCurrentPass ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password & Confirm Password Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white border border-[#D4D4D8] rounded-lg pl-3 pr-9 py-2 text-xs text-[#18181B] outline-none focus:border-[#18181B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 text-[#71717A] hover:text-[#18181B] transition"
                  >
                    {showNewPass ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="w-full bg-white border border-[#D4D4D8] rounded-lg pl-3 pr-9 py-2 text-xs text-[#18181B] outline-none focus:border-[#18181B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 text-[#71717A] hover:text-[#18181B] transition"
                  >
                    {showConfirmPass ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[0.68rem] text-[#71717A]">
              Must be at least 8 characters long, including letters and numbers.
            </p>
          </div>
        </div>

        {/* Section 4: Privacy & Storage */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#71717A]" />
            <span>Privacy & Storage</span>
          </h2>
          <div className="flex flex-col gap-3 text-xs text-[#71717A]">
            <div className="flex items-center justify-between py-2 border-b border-[#D4D4D8]/50">
              <div>
                <p className="font-semibold text-[#18181B]">
                  Local AI Processing
                </p>
                <p className="text-[0.7rem]">
                  Keep all AI queries and context strictly on device.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#18181B] text-white text-[0.65rem] font-semibold">
                Enabled
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#D4D4D8]/50">
              <div>
                <p className="font-semibold text-[#18181B]">Temporary Chats</p>
                <p className="text-[0.7rem]">
                  Chat logs are cleared automatically. Records persist.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#18181B] text-white text-[0.65rem] font-semibold">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Save button with status */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>Settings and preferences saved successfully!</span>
            </div>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#18181B] hover:bg-[#27272A] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
