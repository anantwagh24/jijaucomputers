"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Wrench, Cpu } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  tag?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
}

export default function HeroSlider({ banners }: { banners: BannerItem[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeBanners = banners && banners.length > 0 ? banners : [
    {
      id: "1",
      title: "Jijau Custom Gaming Battlestations",
      subtitle: "Unleash Ultimate Power with Intel 14th Gen & RTX 4080 Super | Custom Liquid Cooling & Rig Tuning",
      tag: "FLAGSHIP PC BUILDS",
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1400&auto=format&fit=crop&q=80",
      ctaText: "Configure Your PC",
      ctaLink: "/custom-pc",
    },
    {
      id: "2",
      title: "Mega Laptop Festival 2026",
      subtitle: "Up to ₹25,000 Off on ASUS ROG, HP OMEN, Lenovo Legion & Dell XPS + Free Accessories",
      tag: "FESTIVAL SPECIAL",
      imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1400&auto=format&fit=crop&q=80",
      ctaText: "Shop Laptop Deals",
      ctaLink: "/products?category=laptops",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const slide = activeBanners[currentSlide];

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Background Graphic Grid */}
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-40 transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Tag Badge */}
            {slide.tag && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 text-xs font-black tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                {slide.subtitle}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={slide.ctaLink || "/products"}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>{slide.ctaText || "Explore Catalog"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/custom-pc"
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-400/30 font-bold text-sm sm:text-base flex items-center gap-2 transition-colors"
              >
                <Cpu className="w-4 h-4" />
                <span>Build Custom PC</span>
              </Link>
            </div>

            {/* Micro Trust Proofs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Invoices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Chip-Level Repair Center</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Best Pune Market Rates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white/80 hover:text-white backdrop-blur-sm border border-slate-700 transition-colors hidden sm:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white/80 hover:text-white backdrop-blur-sm border border-slate-700 transition-colors hidden sm:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Dots Indicator */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === i ? "w-8 bg-blue-500" : "w-2 bg-slate-600"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
