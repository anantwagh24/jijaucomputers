"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  tag?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  linkUrl?: string | null;
  isActive?: boolean;
}

const DEFAULT_SLIDES: BannerItem[] = [
  {
    id: "b-1",
    title: "CCTV & Security Systems",
    subtitle: "PTZ 4K ColorVu Cameras, WiFi Smart Doorbells & 8-Channel NVRs",
    tag: "SECURITY DEALS",
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1400&auto=format&fit=crop&q=80",
    ctaText: "Shop CCTV Now",
    ctaLink: "/devices",
  },
  {
    id: "b-2",
    title: "High-Performance Laptops",
    subtitle: "MacBook Pro M3, ROG Strix RTX 4080 & Dell XPS at Best Pune Prices",
    tag: "MEGA FESTIVAL",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1400&auto=format&fit=crop&q=80",
    ctaText: "Explore Laptops",
    ctaLink: "/products?category=laptops",
  },
  {
    id: "b-3",
    title: "Assemble Your Dream Gaming Rig",
    subtitle: "Liquid-Cooled Panoramic RGB Battlestations with 3 Years Warranty",
    tag: "CUSTOM RIG",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1400&auto=format&fit=crop&q=80",
    ctaText: "Start PC Build",
    ctaLink: "/custom-pc",
  },
];

export default function MobileBannerSlider({ banners }: { banners?: BannerItem[] }) {
  const activeBanners = (banners || []).filter((b) => b.isActive !== false);
  const slides = activeBanners.length > 0 ? activeBanners : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 aspect-[16/9] sm:aspect-[21/9] shadow-2xl border border-slate-800 group">
        {slides.map((slide, idx) => {
          const destination = slide.ctaLink || slide.linkUrl || "/products";
          const isCurrent = idx === current;

          return (
            <Link
              key={slide.id}
              href={destination}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer block ${
                isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Fallback */}
              <img
                src={slide.imageUrl || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80"}
                alt={slide.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

              {/* Banner Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col justify-end">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-600/90 text-white font-mono text-[10px] uppercase tracking-wider font-extrabold mb-1.5 w-fit shadow-sm">
                  {slide.tag || "FEATURED DEAL"}
                </span>

                <h2 className="text-lg sm:text-3xl font-black text-white leading-tight drop-shadow-md max-w-2xl">
                  {slide.title}
                </h2>

                {slide.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 sm:line-clamp-2 mt-1 max-w-xl">
                    {slide.subtitle}
                  </p>
                )}

                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold w-fit shadow-lg shadow-blue-600/30">
                  <span>{slide.ctaText || "Explore Now"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-transform active:scale-90"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-transform active:scale-90"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`transition-all rounded-full ${
                  current === i ? "w-6 h-2 bg-gradient-to-r from-amber-400 to-blue-500" : "w-2 h-2 bg-slate-500"
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
