"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Zap, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function CustomPcBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden gaming-gradient text-white p-8 sm:p-12 lg:p-14 border border-slate-800 shadow-2xl">
          {/* Glowing Accents */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom PC Builder & Quotation</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Build Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">Custom Gaming Rig</span> with Pune's Master Assemblers
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Choose your desired budget, purpose (4K Gaming, 3D Rendering, Streaming, Office, AI/ML), CPU & GPU preferences. Get a customized, bottleneck-free part list and immediate quote over WhatsApp!
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Pro Cable Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3-Year Hardware Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24-Hour Stress Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Original GST Invoices</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/custom-pc"
                  className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-400/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Cpu className="w-5 h-5" />
                  <span>Launch PC Builder Configurator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/quote-request"
                  className="px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
                >
                  Request Bulk / Office Quote
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-slate-700/80 p-2 bg-slate-900/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=700&auto=format&fit=crop&q=80"
                  alt="Custom Gaming PC build"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                    Starting from ₹28,990 to ₹4,50,000+
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Hand-crafted according to your exact budget
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
