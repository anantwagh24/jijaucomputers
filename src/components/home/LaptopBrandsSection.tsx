"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Laptop, ArrowRight, CheckCircle2, MessageCircle, X } from "lucide-react";
import { ProductItem } from "@/lib/types";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";

interface BrandCard {
  id: string;
  name: string;
  query: string;
  tagline: string;
  imageUrl: string;
  logoUrl?: string;
  badge?: string;
}

const LAPTOP_BRANDS: BrandCard[] = [
  {
    id: "apple",
    name: "MacBook",
    query: "apple",
    tagline: "M2 & M3 Apple Silicon",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    badge: "M3 CHIP",
  },
  {
    id: "hp",
    name: "HP Laptops",
    query: "hp",
    tagline: "Pavilion, Victus & Omen",
    imageUrl: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=600&auto=format&fit=crop&q=80",
    badge: "BESTSELLER",
  },
  {
    id: "dell",
    name: "Dell Laptops",
    query: "dell",
    tagline: "Inspiron, XPS & Alienware",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    badge: "DURABLE",
  },
  {
    id: "asus",
    name: "ASUS Laptops",
    query: "asus",
    tagline: "ROG Strix & TUF Gaming",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    badge: "RTX GAMING",
  },
  {
    id: "lenovo",
    name: "Lenovo Laptops",
    query: "lenovo",
    tagline: "Legion & IdeaPad Gaming",
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    badge: "AI POWERED",
  },
  {
    id: "acer",
    name: "Acer Laptops",
    query: "acer",
    tagline: "Nitro & Predator Gaming",
    imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
    badge: "BUDGET RIG",
  },
];

export default function LaptopBrandsSection({ products = [] }: { products?: ProductItem[] }) {
  const [selectedBrand, setSelectedBrand] = useState<BrandCard | null>(null);
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useSettings();

  // Filter products for the selected brand
  const brandProducts = selectedBrand
    ? products.filter((p) => {
        const isLaptop =
          (p.category?.slug && p.category.slug.includes("laptop")) ||
          (p.category?.name && p.category.name.toLowerCase().includes("laptop"));
        const brandMatch =
          (p.brand?.slug && p.brand.slug.toLowerCase().includes(selectedBrand.query)) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(selectedBrand.query)) ||
          p.name.toLowerCase().includes(selectedBrand.query);
        return isLaptop && brandMatch;
      })
    : [];

  return (
    <section className="py-6 max-w-7xl mx-auto px-4">
      {/* 1. Header matching reference image: Bag Icon + LAPTOP Brands + View All */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>LAPTOP Brands</span>
            </h2>
          </div>
        </div>

        <Link
          href="/devices?category=laptop"
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Horizontal Scrollable / Responsive Grid of Laptop Brands */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {LAPTOP_BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelectedBrand(b)}
            className="group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 active:scale-95 text-center cursor-pointer overflow-hidden"
          >
            {/* Top Badge */}
            {b.badge && (
              <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {b.badge}
              </span>
            )}

            {/* Laptop Hardware Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-2 flex items-center justify-center transition-transform group-hover:scale-110">
              <img
                src={b.imageUrl}
                alt={b.name}
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md"
              />
            </div>

            {/* Title & Tagline */}
            <div className="mt-2 w-full">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                {b.name}
              </h3>
              <span className="text-[10px] text-slate-500 line-clamp-1 font-medium">
                {b.tagline}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 3. Interactive Brand Laptop Models Modal / Drawer */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedBrand(null)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedBrand.name} in Stock
                  </h3>
                  <span className="text-xs text-purple-300">
                    {brandProducts.length} model{brandProducts.length === 1 ? "" : "s"} ready for dispatch & store pickup
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBrand(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {brandProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <Laptop className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold">
                    New stock arriving for {selectedBrand.name}!
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                      `Hi Jijau Computers, I am looking for ${selectedBrand.name}. Can you share available models and prices?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              ) : (
                brandProducts.map((p) => {
                  const price = p.salePrice ?? p.price;
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5 hover:bg-purple-50/50 hover:border-purple-200 transition-all"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                        <img
                          src={
                            p.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300"
                          }
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={() => setSelectedBrand(null)}
                          className="font-bold text-slate-900 text-xs sm:text-sm hover:text-purple-600 line-clamp-1 block"
                        >
                          {p.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {p.shortDesc || "1 Year Brand Warranty • Official GST Bill"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-black text-slate-900 text-sm">
                            {formatPrice(price)}
                          </span>
                          {p.salePrice && p.salePrice < p.price && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(p.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Action */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(p, 1);
                            setIsCartOpen(true);
                            setSelectedBrand(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={() => setSelectedBrand(null)}
                          className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] text-center"
                        >
                          Details
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
