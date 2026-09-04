"use client";

import React from "react";
import Link from "next/link";
import { Smartphone, ArrowRight } from "lucide-react";
import { ProductItem } from "@/lib/types";

interface MobileBrand {
  id: string;
  name: string;
  query: string;
  href: string;
  logo: string;
  badge: string;
}

const MOBILE_BRANDS: MobileBrand[] = [
  {
    id: "apple",
    name: "Apple iPhones",
    query: "apple",
    href: "/products?brand=apple&category=mobiles",
    logo: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80",
    badge: "IPHONE 15",
  },
  {
    id: "samsung",
    name: "Samsung Galaxy",
    query: "samsung",
    href: "/products?brand=samsung&category=mobiles",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80",
    badge: "S24 ULTRA",
  },
  {
    id: "oneplus",
    name: "OnePlus",
    query: "oneplus",
    href: "/products?brand=oneplus&category=mobiles",
    logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80",
    badge: "FLAGSHIP",
  },
  {
    id: "pixel",
    name: "Google Pixel",
    query: "pixel",
    href: "/products?brand=pixel&category=mobiles",
    logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
    badge: "AI CAMERA",
  },
  {
    id: "xiaomi",
    name: "Xiaomi / Redmi",
    query: "xiaomi",
    href: "/products?brand=xiaomi&category=mobiles",
    logo: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop&q=80",
    badge: "5G VALUE",
  },
  {
    id: "vivo",
    name: "Vivo & Realme",
    query: "vivo",
    href: "/products?brand=vivo&category=mobiles",
    logo: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80",
    badge: "CAMERA 5G",
  },
];

export default function MobileBrandsSection({ products = [] }: { products?: ProductItem[] }) {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4">
      {/* 1. Header: Smartphone icon + Mobiles + View All Products */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
              <span>Mobiles</span>
            </h2>
          </div>
        </div>

        <Link
          href="/products?category=mobiles"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Horizontal Scrollable Row of Mobile Brands (Opens Brand Products Page on Click) */}
      <div className="flex items-stretch overflow-x-auto no-scrollbar gap-3 sm:gap-4 pb-2 snap-x">
        {MOBILE_BRANDS.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="w-[135px] sm:w-[155px] shrink-0 snap-start group relative flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 active:scale-95 text-center cursor-pointer overflow-hidden"
          >
            {/* Mobile Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-2 flex items-center justify-center transition-transform group-hover:scale-110">
              <img
                src={b.logo}
                alt={b.name}
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-sm"
              />
            </div>

            {/* Name */}
            <div className="mt-2 w-full">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                {b.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

