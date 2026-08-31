"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Laptop,
  Smartphone,
  Printer,
  Camera,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Package,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

// The 4 main requested stacks in exact order
const STACKED_CATEGORIES = [
  {
    id: "laptops",
    slug: "laptops",
    name: "Laptop",
    icon: Laptop,
    badge: "1. LAPTOPS",
    tagline: "Gaming, Ultrabooks, Business & Student Laptops",
    color: "from-blue-600 to-indigo-700",
    activeColor: "bg-blue-600 text-white shadow-blue-500/20",
    bgPattern: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    featuredBrands: ["Dell", "HP", "ASUS", "Lenovo", "Apple"],
  },
  {
    id: "mobiles",
    slug: "mobiles",
    name: "Mobile",
    icon: Smartphone,
    badge: "2. MOBILES",
    tagline: "5G Flagships, Smartphones & High-Performance Tablets",
    color: "from-amber-600 to-orange-600",
    activeColor: "bg-amber-600 text-white shadow-amber-500/20",
    bgPattern: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    featuredBrands: ["Apple", "Samsung", "OnePlus", "Xiaomi"],
  },
  {
    id: "printers",
    slug: "printers",
    name: "Printer",
    icon: Printer,
    badge: "3. PRINTERS",
    tagline: "Ink Tank, Laser All-in-One Wireless Printers & Scanners",
    color: "from-emerald-600 to-teal-700",
    activeColor: "bg-emerald-600 text-white shadow-emerald-500/20",
    bgPattern: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80",
    featuredBrands: ["HP", "Epson", "Canon", "Brother"],
  },
  {
    id: "cctv-camera",
    slug: "cctv-camera",
    name: "CCTV Camera",
    icon: Camera,
    badge: "4. CCTV CAMERAS",
    tagline: "HD IP Cameras, ColorVu Night Vision, WiFi PTZ & NVRs",
    color: "from-purple-600 to-indigo-800",
    activeColor: "bg-purple-600 text-white shadow-purple-500/20",
    bgPattern: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
    featuredBrands: ["CP PLUS", "Hikvision", "TP-Link"],
  },
];

interface DevicesClientProps {
  initialCategories: any[];
  initialProducts: any[];
  initialBrands: any[];
}

export default function DevicesClient({
  initialCategories,
  initialProducts,
  initialBrands,
}: DevicesClientProps) {
  const [selectedStackSlug, setSelectedStackSlug] = useState<string>("laptops");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Get the active stack object
  const activeStack = useMemo(() => {
    return (
      STACKED_CATEGORIES.find((s) => s.slug === selectedStackSlug) ||
      STACKED_CATEGORIES[0]
    );
  }, [selectedStackSlug]);

  // Extract brands available for the active stack
  const availableBrandsForStack = useMemo(() => {
    const stackProducts = initialProducts.filter(
      (p) =>
        p.category?.slug === selectedStackSlug ||
        p.category?.name.toLowerCase().includes(activeStack.name.toLowerCase())
    );

    const brandsFound = new Map<string, { name: string; count: number }>();

    stackProducts.forEach((p) => {
      if (p.brand?.name) {
        const existing = brandsFound.get(p.brand.name) || {
          name: p.brand.name,
          count: 0,
        };
        existing.count += 1;
        brandsFound.set(p.brand.name, existing);
      }
    });

    return Array.from(brandsFound.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [initialProducts, selectedStackSlug, activeStack]);

  // Filter products by active stack and selected brand
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter(
      (p) =>
        p.category?.slug === selectedStackSlug ||
        p.category?.name.toLowerCase().includes(activeStack.name.toLowerCase())
    );

    // Filter by Brand
    if (selectedBrand !== "all") {
      result = result.filter(
        (p) =>
          p.brand?.name?.toLowerCase() === selectedBrand.toLowerCase() ||
          p.brand?.slug?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q) ||
          p.shortDesc?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [initialProducts, selectedStackSlug, activeStack, selectedBrand, searchQuery, sortBy]);

  const handleStackChange = (slug: string) => {
    setSelectedStackSlug(slug);
    setSelectedBrand("all"); // Reset brand selection when changing category stack
    setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      {/* Page Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Category & Brand Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Select a Device Stack & Browse by Brand
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Pick your preferred category below (<span className="font-semibold text-slate-800">Laptop, Mobile, Printer, or CCTV Camera</span>), then click any brand (<span className="font-semibold text-slate-800">Dell, HP, ASUS, Apple, Samsung, CP PLUS, etc.</span>) to view exact matching models with official warranty.
        </p>
      </div>

      {/* 4 STACKED CATEGORIES (Ordered: 1. Laptop, 2. Mobile, 3. Printer, 4. CCTV Camera) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Choose Category Stack:
          </span>
          <span className="text-xs text-blue-600 font-bold">
            Showing 4 Main Device Categories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STACKED_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedStackSlug === cat.slug;

            // Count total products in this category
            const count = initialProducts.filter(
              (p) =>
                p.category?.slug === cat.slug ||
                p.category?.name.toLowerCase().includes(cat.name.toLowerCase())
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleStackChange(cat.slug)}
                className={`relative text-left p-5 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? "bg-gradient-to-br " +
                      cat.color +
                      " text-white border-transparent shadow-xl ring-4 ring-blue-500/20 scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-900"
                }`}
              >
                {/* Background decorative image with overlay */}
                <div
                  className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.bgPattern})` }}
                />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-colors ${
                        isSelected
                          ? "bg-white/20 text-white backdrop-blur-md"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-sm"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black tracking-tight">{cat.name}</h3>
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        isSelected ? "text-white/80" : "text-slate-500"
                      }`}
                    >
                      {cat.tagline}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative z-10 pt-4 mt-4 border-t flex items-center justify-between text-xs font-bold ${
                    isSelected
                      ? "border-white/20 text-white"
                      : "border-slate-100 text-slate-600"
                  }`}
                >
                  <span>{count} Available Models</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{isSelected ? "Active View" : "Explore"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC BRAND FILTER BAR FOR ACTIVE CATEGORY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Step 2: Filter by Manufacturer / Brand
            </span>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
              <span>{activeStack.name} Brands:</span>
              <span className="text-slate-500 font-normal text-xs">
                (Click any brand to filter)
              </span>
            </h2>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activeStack.name} models, specs...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-800 outline-none w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Brand Filter Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setSelectedBrand("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              selectedBrand === "all"
                ? "bg-slate-900 text-white shadow-md scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <span>All {activeStack.name} Brands</span>
            <span className="text-[10px] opacity-70">
              (
              {
                initialProducts.filter(
                  (p) =>
                    p.category?.slug === selectedStackSlug ||
                    p.category?.name
                      .toLowerCase()
                      .includes(activeStack.name.toLowerCase())
                ).length
              }
              )
            </span>
          </button>

          {availableBrandsForStack.map((brand) => {
            const isBrandSelected =
              selectedBrand.toLowerCase() === brand.name.toLowerCase();

            return (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isBrandSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{brand.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isBrandSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {brand.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT RESULTS HEADER & SORTING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-slate-900">
            {selectedBrand === "all" ? `All ${activeStack.name}s` : `${selectedBrand} ${activeStack.name}s`}{" "}
            <span className="text-slate-400 font-normal text-xs">
              ({filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-semibold outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="featured">Featured Deals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No {selectedBrand !== "all" ? `${selectedBrand} ` : ""}{activeStack.name}s found matching your search.
          </h3>
          <p className="text-xs text-slate-500">
            Try choosing a different brand or search keyword, or check our full hardware catalog.
          </p>
          <button
            onClick={() => {
              setSelectedBrand("all");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700"
          >
            View All {activeStack.name}s
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
