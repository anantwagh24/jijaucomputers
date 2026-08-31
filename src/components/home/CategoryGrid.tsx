"use client";

import React from "react";
import Link from "next/link";
import {
  Laptop,
  Monitor,
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Headphones,
  ShieldCheck,
  Wifi,
  Server,
  ArrowRight,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  _count?: { products: number };
}

export default function CategoryGrid({
  categories,
}: {
  categories: CategoryItem[];
}) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "laptops": return <Laptop className="w-6 h-6 text-blue-600" />;
      case "desktop-pcs": return <Monitor className="w-6 h-6 text-indigo-600" />;
      case "custom-gaming-pcs": return <Cpu className="w-6 h-6 text-amber-500" />;
      case "processors": return <Cpu className="w-6 h-6 text-sky-600" />;
      case "graphics-cards": return <Tv className="w-6 h-6 text-emerald-600" />;
      case "motherboards": return <Layers className="w-6 h-6 text-purple-600" />;
      case "ram-memory": return <HardDrive className="w-6 h-6 text-cyan-600" />;
      case "storage": return <Server className="w-6 h-6 text-teal-600" />;
      case "monitors": return <Monitor className="w-6 h-6 text-blue-500" />;
      case "gaming-accessories": return <Headphones className="w-6 h-6 text-rose-500" />;
      case "cctv-security": return <ShieldCheck className="w-6 h-6 text-red-500" />;
      case "printers-networking": return <Wifi className="w-6 h-6 text-emerald-600" />;
      default: return <Monitor className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <span>Hardware & Electronics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Browse by Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category Image or Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  getCategoryIcon(category.slug)
                )}
              </div>

              {/* Title & Count */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {category._count ? `${category._count.products} Items` : "Explore"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
