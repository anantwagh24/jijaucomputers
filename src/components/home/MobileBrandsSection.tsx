"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Smartphone, ArrowRight, X, MessageCircle, ShoppingCart } from "lucide-react";
import { ProductItem } from "@/lib/types";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";

interface MobileBrand {
  id: string;
  name: string;
  query: string;
  logo: string;
  badge: string;
}

const MOBILE_BRANDS: MobileBrand[] = [
  {
    id: "apple",
    name: "Apple iPhones",
    query: "apple",
    logo: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80",
    badge: "IPHONE 15",
  },
  {
    id: "samsung",
    name: "Samsung Galaxy",
    query: "samsung",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80",
    badge: "S24 ULTRA",
  },
  {
    id: "oneplus",
    name: "OnePlus",
    query: "oneplus",
    logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80",
    badge: "FLAGSHIP",
  },
  {
    id: "pixel",
    name: "Google Pixel",
    query: "pixel",
    logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
    badge: "AI CAMERA",
  },
  {
    id: "xiaomi",
    name: "Xiaomi / Redmi",
    query: "xiaomi",
    logo: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop&q=80",
    badge: "5G VALUE",
  },
  {
    id: "vivo",
    name: "Vivo & Realme",
    query: "vivo",
    logo: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80",
    badge: "CAMERA 5G",
  },
];

export default function MobileBrandsSection({ products = [] }: { products?: ProductItem[] }) {
  const [selectedBrand, setSelectedBrand] = useState<MobileBrand | null>(null);
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useSettings();

  // Filter products for the selected mobile brand
  const mobileProducts = selectedBrand
    ? products.filter((p) => {
        const isMobile =
          (p.category?.slug && p.category.slug.includes("mobile")) ||
          (p.category?.name && p.category.name.toLowerCase().includes("mobile"));
        const brandMatch =
          (p.brand?.slug && p.brand.slug.toLowerCase().includes(selectedBrand.query)) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(selectedBrand.query)) ||
          p.name.toLowerCase().includes(selectedBrand.query);
        return isMobile && brandMatch;
      })
    : [];

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
          href="/devices?category=mobile"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Horizontal Scrollable Row of Mobile Brands (Matching Reference Image 3) */}
      <div className="flex items-stretch overflow-x-auto no-scrollbar gap-3 sm:gap-4 pb-2 snap-x">
        {MOBILE_BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelectedBrand(b)}
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
          </button>
        ))}
      </div>

      {/* 3. Interactive Mobile Models Drawer */}
      {selectedBrand && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setSelectedBrand(null)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl min-h-[65vh] sm:min-h-0 max-h-[90vh] flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedBrand.name} Smartphones
                  </h3>
                  <span className="text-xs text-blue-300">
                    {mobileProducts.length} model{mobileProducts.length === 1 ? "" : "s"} available with instant warranty
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBrand(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 pb-24 sm:pb-6">
              {mobileProducts.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">New {selectedBrand.name} units in transit!</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Inquire directly with our store team for stock ETA and special pre-booking offers.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                      `Hi Jijau Computers, I am looking for ${selectedBrand.name} smartphones. Can you share availability and prices?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              ) : (
                mobileProducts.map((p) => {
                  const price = p.salePrice ?? p.price;
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-blue-50/40 hover:border-blue-300 transition-all shadow-sm"
                    >
                      {/* Thumbnail & Info */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-20 h-20 rounded-xl bg-white p-2 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                          <img
                            src={
                              p.images?.[0]?.url ||
                              "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300"
                            }
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              In Stock
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {p.warranty || "1 Year Brand Warranty"}
                            </span>
                          </div>
                          <Link
                            href={`/products/${p.slug}`}
                            onClick={() => setSelectedBrand(null)}
                            className="font-black text-slate-900 text-sm hover:text-blue-600 line-clamp-1 block transition-colors"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {p.shortDesc || "100% Original Indian Unit • Brand Warranty"}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="font-black text-slate-900 text-base">
                              {formatPrice(price)}
                            </span>
                            {p.salePrice && p.salePrice < p.price && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(p.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(p, 1);
                            setIsCartOpen(true);
                            setSelectedBrand(null);
                          }}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer text-center"
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={() => setSelectedBrand(null)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs text-center transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
