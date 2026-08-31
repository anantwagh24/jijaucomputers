"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductItem } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import { Flame, Clock, ArrowRight, Zap } from "lucide-react";

export default function DealsSection({
  deals,
}: {
  deals: ProductItem[];
}) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!deals || deals.length === 0) return null;

  return (
    <section className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black tracking-wider uppercase mb-2 border border-rose-500/30">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>Flash Deals & Limited-Time Offers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Today's Super Deals
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Ends in:</span>
            <div className="flex items-center gap-1 text-xs font-mono font-black">
              <span className="bg-slate-900 text-white px-2 py-1 rounded-lg border border-slate-700">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-white px-2 py-1 rounded-lg border border-slate-700">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span>:</span>
              <span className="bg-rose-600 text-white px-2 py-1 rounded-lg animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {deals.slice(0, 4).map((product) => (
            <div key={product.id} className="text-slate-900">
              <ProductCard
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            </div>
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center mt-8">
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Explore All Festive Offers & Coupons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
