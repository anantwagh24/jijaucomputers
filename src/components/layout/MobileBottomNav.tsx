"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, ShoppingCart, User, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  // Don't show bottom nav on admin panel or invoice pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/invoices")) return null;

  const isHome = pathname === "/";
  const isTrack = pathname.startsWith("/track-service");
  const isAccount = pathname.startsWith("/account") || pathname.startsWith("/admin");

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090d18]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] flex items-center justify-around print:hidden no-print">
      {/* 1. Home */}
      <Link
        href="/"
        onClick={() => setIsCartOpen(false)}
        className={`flex flex-col items-center justify-center transition-all ${
          isHome ? "text-purple-400 font-black" : "text-slate-400 hover:text-white"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isHome
              ? "bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)] scale-110"
              : "bg-transparent text-slate-400"
          }`}
        >
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold mt-0.5">Home</span>
      </Link>

      {/* 2. Track Hub */}
      <Link
        href="/track-service"
        onClick={() => setIsCartOpen(false)}
        className={`flex flex-col items-center justify-center transition-all ${
          isTrack ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isTrack
              ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105"
              : "bg-transparent text-slate-400"
          }`}
        >
          <Package className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Track Hub</span>
      </Link>

      {/* 3. Cart with Badge */}
      <button
        type="button"
        onClick={() => setIsCartOpen(!totalItems ? true : true)}
        className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
      >
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-300">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#090d18] shadow-md animate-pulse">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Cart</span>
      </button>

      {/* 4. Account */}
      <Link
        href="/account"
        onClick={() => setIsCartOpen(false)}
        className={`flex flex-col items-center justify-center transition-all ${
          isAccount ? "text-blue-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isAccount
              ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105"
              : "bg-transparent text-slate-400"
          }`}
        >
          <User className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Account</span>
      </Link>
    </div>
  );
}

