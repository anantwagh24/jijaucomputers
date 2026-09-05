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
  const topCities = [
    { name: "Pune", count: "80+" },
    { name: "Baramati", count: "25+" },
    { name: "Shirur", count: "20+" },
    { name: "Pimpri-Chinchwad", count: "40+" },
    { name: "Satara", count: "15+" },
    { name: "Ahmednagar", count: "18+" },
  ];

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
              See Happy Customers from <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Your City</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore 150+ verified photos of custom gaming rigs, laptops, and Apple MacBooks delivered to customers across Pune, Baramati, Shirur, and Maharashtra.
            </p>

            {/* Quick City Filter Navigation Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Popular Cities:</span>
              </span>
              {topCities.map((city) => (
                <Link
                  key={city.name}
                  href={`/happy-customers?city=${encodeURIComponent(city.name)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/30 text-slate-200 hover:text-white border border-slate-700/80 hover:border-blue-400 text-xs font-bold transition-all hover:scale-105"
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">({city.count})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Customer Photo Strip & CTA */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-5">
            {/* Customer Avatars Preview Stack */}
            {customers.length > 0 && (
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl backdrop-blur-md">
                <div className="flex -space-x-3 overflow-hidden">
                  {customers.slice(0, 5).map((c) => (
                    <img
                      key={c.id}
                      src={c.photoUrl}
                      alt={c.name}
                      className="inline-block h-11 w-11 rounded-full ring-2 ring-indigo-500 object-cover"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-xs font-black text-white ml-1">5.0</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">
                    100% Genuine Tech Verified
                  </div>
                </div>
              </div>
            )}

            {/* Direct Link to Happy Customers Gallery */}
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
      </div>
    </section>
  );
}
