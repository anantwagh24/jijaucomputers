import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import DealsSection from "@/components/home/DealsSection";
import CustomPcBanner from "@/components/home/CustomPcBanner";
import BrandCarousel from "@/components/home/BrandCarousel";
import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Cpu,
  Laptop,
  CheckCircle2,
  TrendingUp,
  Award,
  Truck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [banners, categories, brands, featuredProducts, bestsellers, newArrivals, gamingDeals] =
    await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { isFeatured: true, inStock: true },
        take: 8,
        include: { category: true, brand: true, images: { orderBy: { order: "asc" } } },
      }),
      prisma.product.findMany({
        where: { isBestseller: true },
        take: 8,
        include: { category: true, brand: true, images: { orderBy: { order: "asc" } } },
      }),
      prisma.product.findMany({
        where: { isNewArrival: true },
        take: 8,
        include: { category: true, brand: true, images: { orderBy: { order: "asc" } } },
      }),
      prisma.product.findMany({
        where: { isGamingDeal: true },
        take: 4,
        include: { category: true, brand: true, images: { orderBy: { order: "asc" } } },
      }),
    ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1">
        {/* 1. HERO SLIDER */}
        <HeroSlider banners={banners} />

        {/* 2. CATEGORY BROWSE GRID */}
        <CategoryGrid categories={categories} />

        {/* 2.5 STACKED DEVICE FINDER CALLOUT (Laptop, Mobile, Printer, CCTV Camera) */}
        <section className="py-8 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Brand Filter</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Shop by Device Stack: Laptop, Mobile, Printer & CCTV
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Pick any category and filter instantly by leading brands like <span className="text-amber-400 font-bold">Dell, HP, ASUS, Apple, Samsung, CP PLUS & Hikvision</span>.
                </p>
              </div>

              <Link
                href="/devices"
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
              >
                <span>Open Device & Brand Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. FLASH DEALS / SUPER DEALS SECTION */}
        <DealsSection deals={gamingDeals as any} />

        {/* 4. FEATURED PRODUCTS SHOWCASE */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Hand-Picked Recommendations
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Featured Products & Hardware
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>View All Featured</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. CUSTOM PC RIG BUILDER BANNER */}
        <CustomPcBanner />

        {/* 6. BESTSELLERS & TRENDING HARDWARE */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                  Customer Favorites
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Top Bestsellers & Trending Gear
                </h2>
              </div>
              <Link
                href="/products?sort=popular"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <span>Explore Bestsellers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. WHY CHOOSE JIJAU COMPUTERS */}
        <section className="py-14 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                The Jijau Computers Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Why Thousands of Customers in Pune Trust Us
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Precision Custom PC Assemblies
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every PC built at Jijau Computers undergoes 24-hour AIDA64 & Furmark stress testing, zero-cable-mess routing, and BIOS/XMP performance tuning.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Chip-Level Repair & Service Center
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  From broken laptop screens, motherboard BGA re-balling to graphics card servicing and data recovery — transparent tracking with live status updates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  100% Genuine Direct Brand Invoices
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Authorized billing with direct OEM warranty across Intel, AMD, NVIDIA, ASUS, Corsair, Samsung, HP, Lenovo, Dell, and Logitech.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. BRAND PARTNERS */}
        <BrandCarousel brands={brands} />
      </main>

      <Footer />
    </div>
  );
}
