"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function AssembleDesktopCard() {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2b080c] via-[#4a0e17] to-[#1a0508] border border-rose-900/50 shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white group">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Content */}
        <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Interactive PC Builder</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Assemble a desktop
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Customize your dream Gaming, Video Editing, or Office PC with verified compatible Intel / AMD CPUs, RTX 40-Series GPUs, DDR5 RAM, and liquid cooling.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-rose-200">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3 Years Hardware Warranty
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" /> Free Assembly & Stress Tested
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/custom-pc"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Cpu className="w-5 h-5" />
            <span>Start Building Rig</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
