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
  href: string;
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
    href: "/products?brand=apple&category=laptops",
    tagline: "M2 & M3 Apple Silicon",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    badge: "M3 CHIP",
  },
  {
    id: "hp",
    name: "HP Laptops",
    query: "hp",
    href: "/products?brand=hp&category=laptops",
    tagline: "Pavilion, Victus & Omen",
    imageUrl: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=600&auto=format&fit=crop&q=80",
    badge: "BESTSELLER",
  },
  {
    id: "dell",
    name: "Dell Laptops",
    query: "dell",
    href: "/products?brand=dell&category=laptops",
    tagline: "Inspiron, XPS & Alienware",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    badge: "DURABLE",
  },
  {
    id: "asus",
    name: "ASUS Laptops",
    query: "asus",
    href: "/products?brand=asus&category=laptops",
    tagline: "ROG Strix & TUF Gaming",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    badge: "RTX GAMING",
  },
  {
    id: "lenovo",
    name: "Lenovo Laptops",
    query: "lenovo",
    href: "/products?brand=lenovo&category=laptops",
    tagline: "Legion & IdeaPad Gaming",
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    badge: "AI POWERED",
  },
  {
    id: "acer",
    name: "Acer Laptops",
    query: "acer",
    href: "/products?brand=acer&category=laptops",
    tagline: "Nitro & Predator Gaming",
    imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
    badge: "BUDGET RIG",
  },
];

export default function LaptopBrandsSection({ products = [] }: { products?: ProductItem[] }) {
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
          href="/products?category=laptops"
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Horizontal Scrollable Row of Laptop Brands (Opens Brand Products Page on Click) */}
      <div className="flex items-stretch overflow-x-auto no-scrollbar gap-3 sm:gap-4 pb-2 snap-x">
        {LAPTOP_BRANDS.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="w-[135px] sm:w-[155px] shrink-0 snap-start group relative flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300 active:scale-95 text-center cursor-pointer overflow-hidden"
          >
            {/* Laptop Hardware Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-2 flex items-center justify-center transition-transform group-hover:scale-110">
              <img
                src={b.imageUrl}
                alt={b.name}
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-sm"
              />
            </div>

            {/* Title */}
            <div className="mt-2 w-full">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                {b.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

