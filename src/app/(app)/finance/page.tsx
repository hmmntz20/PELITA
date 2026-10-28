"use client";

import {
  Plus,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Search,
  Calendar,
  ChevronDown,
  Paperclip,
  MoreHorizontal,
} from "lucide-react";

const TRANSACTIONS = [
  {
    date: "14 Oct",
    type: "Expense",
    merchant: "Nasi Goreng",
    subtext: null,
    category: "Food & drinks",
    wallet: "Cash Wallet",
    amount: "20.000",
  },
  {
    date: "14 Oct",
    type: "Refund",
    merchant: "Store return",
    subtext: "↳ Original Expense #TX-102",
    category: "Refund",
    wallet: "Bank BCA",
    amount: "50.000",
  },
  {
    date: "13 Oct",
    type: "Expense",
    merchant: "Groceries · #TX-102",
    subtext: null,
    category: "Shopping",
    wallet: "Bank BCA",
    amount: "150.000",
  },
  {
    date: "12 Oct",
    type: "Income",
    merchant: "Freelance project",
    subtext: null,
    category: "Work",
    wallet: "Bank BCA",
    amount: "750.000",
  },
];

export default function FinancePage() {
  return (
    <div className="w-full px-8 py-6">
      {/* Title & CTA */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[0.62rem] tracking-[0.16em] uppercase text-[#71717A] font-semibold mb-1">
            A HEALTHIER RELATIONSHIP WITH MONEY
          </p>
          <h1 className="text-[1.85rem] font-bold tracking-tight text-[#18181B] leading-tight">
            Finance
          </h1>
          <p className="text-[0.82rem] text-[#71717A] mt-1">
            Know where you stand. Make every rupiah count.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 bg-[#18181B] hover:bg-[#27272A] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 shadow-2xs">
          <p className="text-[0.72rem] text-[#71717A] font-medium">
            Total balance
          </p>
          <p className="text-xl font-bold text-[#18181B] mt-1 tracking-tight">
            Rp 1.250.000
          </p>
          <p className="text-[0.65rem] text-[#A1A1AA] mt-1">Updated just now</p>
        </div>

        <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 shadow-2xs">
          <p className="text-[0.72rem] text-[#71717A] font-medium">
            Gross expense
          </p>
          <p className="text-xl font-bold text-[#18181B] mt-1 tracking-tight">
            Rp 450.000
          </p>
          <p className="text-[0.65rem] text-[#A1A1AA] mt-1">Updated just now</p>
        </div>

        <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 shadow-2xs">
          <p className="text-[0.72rem] text-[#71717A] font-medium">
            Linked refunds
          </p>
          <p className="text-xl font-bold text-[#18181B] mt-1 tracking-tight">
            Rp 50.000
          </p>
          <p className="text-[0.65rem] text-[#A1A1AA] mt-1">Updated just now</p>
        </div>

        <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 shadow-2xs">
          <p className="text-[0.72rem] text-[#71717A] font-medium">
            Net spending
          </p>
          <p className="text-xl font-bold text-[#18181B] mt-1 tracking-tight">
            Rp 400.000
          </p>
          <p className="text-[0.65rem] text-[#A1A1AA] mt-1">Updated just now</p>
        </div>
      </div>

      {/* Your Wallets Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[0.85rem] font-bold text-[#18181B]">
            Your wallets
          </h2>
          <button
            type="button"
            className="text-[0.72rem] text-[#71717A] hover:text-[#18181B] flex items-center gap-1 font-medium transition"
          >
            <span>+ Add wallet</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-2.5">
          {/* Wallet 1: Bank BCA */}
          <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-[#A1A1AA] transition">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F4F4F5] border border-[#D4D4D8]/60 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-[#18181B]" />
              </div>
              <div>
                <p className="text-[0.72rem] font-medium text-[#71717A]">
                  Bank BCA
                </p>
                <p className="text-base font-bold text-[#18181B]">
                  Rp 1.000.000
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#D4D4D8] text-[0.65rem] font-medium text-[#18181B] bg-[#F4F4F5]">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981]" />
              Active
            </span>
          </div>

          {/* Wallet 2: Cash Wallet */}
          <div className="bg-white border border-[#D4D4D8] rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-[#A1A1AA] transition">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F4F4F5] border border-[#D4D4D8]/60 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-[#18181B]" />
              </div>
              <div>
                <p className="text-[0.72rem] font-medium text-[#71717A]">
                  Cash Wallet
                </p>
                <p className="text-base font-bold text-[#18181B]">
                  Rp 250.000
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#D4D4D8] text-[0.65rem] font-medium text-[#18181B] bg-[#F4F4F5]">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981]" />
              Active
            </span>
          </div>
        </div>

        {/* Archived Note */}
        <div className="flex items-center gap-2 text-[0.7rem] text-[#71717A]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#D4D4D8]/60 font-medium">
            Old BCA · Archived
          </span>
          <span>Available in historical reports only</span>
        </div>
      </section>

      {/* Transactions Section */}
      <section>
        <div className="mb-2.5">
          <h2 className="text-[0.85rem] font-bold text-[#18181B]">
            Transactions
          </h2>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#D4D4D8] rounded-lg px-3 py-1.5 shadow-2xs text-xs">
            <Search className="w-3.5 h-3.5 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full bg-transparent outline-none text-[#18181B] placeholder:text-[#A1A1AA]"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 bg-white border border-[#D4D4D8] px-3 py-1.5 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] shadow-2xs transition"
          >
            <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
            <span>14–20 Oct 2026</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-white border border-[#D4D4D8] px-3 py-1.5 rounded-lg text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] shadow-2xs transition"
          >
            <span>All types</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#D4D4D8] rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D4D4D8] bg-[#F4F4F5] text-[0.68rem] font-medium text-[#71717A]">
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Type</th>
                <th className="py-2.5 px-4 font-medium">Merchant / Description</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Wallet</th>
                <th className="py-2.5 px-4 font-medium">Amount (IDR)</th>
                <th className="py-2.5 px-4 font-medium text-center">Receipt</th>
                <th className="py-2.5 px-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4D4D8]/50">
              {TRANSACTIONS.map((tx, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#F4F4F5]/60 transition-colors text-[0.75rem]"
                >
                  <td className="py-3 px-4 text-[#71717A]">{tx.date}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#D4D4D8] text-[0.65rem] font-medium bg-[#F4F4F5] text-[#18181B]">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#71717A]" />
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#18181B]">{tx.merchant}</p>
                    {tx.subtext && (
                      <p className="text-[0.68rem] text-blue-600 mt-0.5">
                        {tx.subtext}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#71717A]">{tx.category}</td>
                  <td className="py-3 px-4 text-[#71717A]">{tx.wallet}</td>
                  <td className="py-3 px-4 font-bold text-[#18181B]">
                    {tx.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Paperclip className="w-3.5 h-3.5 text-[#71717A] mx-auto inline" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-[#E4E4E7] text-[#71717A] transition"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
