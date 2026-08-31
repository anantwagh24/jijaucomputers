"use client";

import React from "react";
import Link from "next/link";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export default function BrandCarousel({ brands }: { brands: BrandItem[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-12 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            Authorized Hardware Partners
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Shop by Official Brands
          </h2>
        </div>

        {/* Brand Grid / List */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 items-center">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 group"
            >
              <div className="h-10 w-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-8 max-w-[90px] object-contain"
                  />
                ) : (
                  <span className="font-bold text-sm text-slate-700">{brand.name}</span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-600 mt-2 transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
