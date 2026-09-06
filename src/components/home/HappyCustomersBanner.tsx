import React from "react";
import Link from "next/link";
import { Users, Sparkles, MapPin, ArrowRight, Star, Heart, CheckCircle2 } from "lucide-react";

interface HappyCustomerPreview {
  id: string;
  name: string;
  city: string;
  village?: string | null;
  district: string;
  productName: string;
  photoUrl: string;
  rating: number;
}

interface HappyCustomersBannerProps {
  customers?: HappyCustomerPreview[];
}

export default function HappyCustomersBanner({ customers = [] }: HappyCustomersBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-6 sm:p-8 md:p-10 shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Heading & City Pills */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Real Customer Stories & Setups</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              See Happy Customers & <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Custom Builds</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore verified photos of custom gaming rigs, laptops, and Apple MacBooks delivered to satisfied customers across Maharashtra.
            </p>

            {/* Feature Highlights */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/80 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Deliveries</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/80 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custom Gaming Rigs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/80 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Original GST Invoices</span>
              </span>
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-5">
            <Link
              href="/happy-customers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Explore All Happy Customers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Real Customer Cards Showcase Grid */}
        {customers.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {customers.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href="/happy-customers"
                className="group relative rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800 hover:border-amber-400/60 transition-all hover:shadow-xl hover:-translate-y-1 block"
              >
                <div className="aspect-square w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={c.photoUrl}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-md">
                    <Star className="w-2.5 h-2.5 fill-slate-950" />
                    <span>{c.rating || 5}.0</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <h4 className="text-white font-bold text-xs truncate group-hover:text-amber-300 transition-colors">
                    {c.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                    <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{c.city || c.district}</span>
                  </div>
                  <p className="text-[10px] text-amber-400/90 truncate font-semibold">
                    {c.productName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
