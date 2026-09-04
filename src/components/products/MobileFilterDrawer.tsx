"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronRight,
} from "lucide-react";

interface MobileFilterDrawerProps {
  categories: any[];
  brands: any[];
  activeCategory?: string;
  activeBrand?: string;
  activeCategoryName?: string;
  activeBrandName?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStockOnly?: string;
  totalCount: number;
}

export default function MobileFilterDrawer({
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeCategoryName,
  activeBrandName,
  search,
  minPrice,
  maxPrice,
  inStockOnly,
  totalCount,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Active filter count
  let activeFilterCount = 0;
  if (activeCategory) activeFilterCount++;
  if (activeBrand) activeFilterCount++;
  if (search) activeFilterCount++;
  if (minPrice || maxPrice) activeFilterCount++;
  if (inStockOnly === "true") activeFilterCount++;

  return (
    <div className="lg:hidden mb-4 space-y-3">
      {/* Active Filter Quick Badges (Flipkart style) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* Open Filter Drawer Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-xs shrink-0 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Active Category Badge */}
        {activeCategory && (
          <Link
            href={`/products?${activeBrand ? `brand=${activeBrand}&` : ""}${
              search ? `search=${search}&` : ""
            }`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shrink-0"
          >
            <span>{activeCategoryName || activeCategory}</span>
            <X className="w-3 h-3 text-blue-500" />
          </Link>
        )}

        {/* Active Brand Badge */}
        {activeBrand && (
          <Link
            href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
              search ? `search=${search}&` : ""
            }`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shrink-0"
          >
            <span>{activeBrandName || activeBrand}</span>
            <X className="w-3 h-3 text-purple-500" />
          </Link>
        )}

        {/* In-Stock Badge */}
        {inStockOnly === "true" && (
          <Link
            href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
              activeBrand ? `brand=${activeBrand}&` : ""
            }`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shrink-0"
          >
            <span>In Stock</span>
            <X className="w-3 h-3 text-emerald-500" />
          </Link>
        )}

        {/* Reset All Filters if any applied */}
        {activeFilterCount > 0 && (
          <Link
            href="/products"
            className="text-xs text-rose-600 font-bold hover:underline shrink-0 px-2 py-1 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </Link>
        )}
      </div>

      {/* Mobile Slide-Over / Bottom Sheet Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-black text-white">Filter Products</h3>
                <span className="text-xs text-slate-400">({totalCount} items)</span>
              </div>

              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <Link
                    href="/products"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                  >
                    Reset All
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Options */}
            <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Categories */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <Link
                    href={`/products?${activeBrand ? `brand=${activeBrand}&` : ""}`}
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      !activeCategory
                        ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Categories</span>
                    {!activeCategory && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </Link>
                  {categories.map((c) => {
                    const isCatActive =
                      activeCategory?.toLowerCase() === c.slug.toLowerCase() ||
                      activeCategory?.toLowerCase() === `${c.slug.toLowerCase()}s` ||
                      activeCategory?.toLowerCase() === c.slug.toLowerCase().replace(/s$/, "");

                    return (
                      <Link
                        key={c.id}
                        href={`/products?category=${c.slug}${activeBrand ? `&brand=${activeBrand}` : ""}`}
                        onClick={() => setIsOpen(false)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                          isCatActive
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {isCatActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Brands
                </h4>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  <Link
                    href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}`}
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      !activeBrand
                        ? "bg-purple-50 border-purple-300 text-purple-700 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Brands</span>
                    {!activeBrand && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </Link>
                  {brands.map((b) => {
                    const isBrandActive = activeBrand?.toLowerCase() === b.slug.toLowerCase();

                    return (
                      <Link
                        key={b.id}
                        href={`/products?brand=${b.slug}${activeCategory ? `&category=${activeCategory}` : ""}`}
                        onClick={() => setIsOpen(false)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                          isBrandActive
                            ? "bg-purple-50 border-purple-300 text-purple-700 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{b.name}</span>
                        {isBrandActive && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Price Range
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
                      activeBrand ? `brand=${activeBrand}&` : ""
                    }maxPrice=25000`}
                    onClick={() => setIsOpen(false)}
                    className="block p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 font-medium"
                  >
                    Under ₹25,000
                  </Link>
                  <Link
                    href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
                      activeBrand ? `brand=${activeBrand}&` : ""
                    }minPrice=25000&maxPrice=60000`}
                    onClick={() => setIsOpen(false)}
                    className="block p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 font-medium"
                  >
                    ₹25,000 - ₹60,000
                  </Link>
                  <Link
                    href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
                      activeBrand ? `brand=${activeBrand}&` : ""
                    }minPrice=60000&maxPrice=120000`}
                    onClick={() => setIsOpen(false)}
                    className="block p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 font-medium"
                  >
                    ₹60,000 - ₹1,20,000
                  </Link>
                  <Link
                    href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
                      activeBrand ? `brand=${activeBrand}&` : ""
                    }minPrice=120000`}
                    onClick={() => setIsOpen(false)}
                    className="block p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 font-bold text-blue-600"
                  >
                    Above ₹1,20,000 (Enthusiast / Pro)
                  </Link>
                </div>
              </div>

              {/* In-Stock Only */}
              <div className="pt-4 border-t border-slate-100 pb-2">
                <Link
                  href={`/products?${activeCategory ? `category=${activeCategory}&` : ""}${
                    activeBrand ? `brand=${activeBrand}&` : ""
                  }${inStockOnly === "true" ? "" : "inStockOnly=true"}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    inStockOnly === "true"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span>Show In-Stock Only</span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      inStockOnly === "true" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs text-center shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Apply & View {totalCount} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
