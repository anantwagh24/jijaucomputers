"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
}

const DEFAULT_SLIDES: BannerItem[] = [
  {
    id: "b-1",
    title: "CCTV & Security Systems",
    subtitle: "PTZ 4K ColorVu Cameras, WiFi Smart Doorbells & 8-Channel NVRs",
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&auto=format&fit=crop&q=80",
    linkUrl: "/devices",
  },
  {
    id: "b-2",
    title: "High-Performance Laptops",
    subtitle: "MacBook Pro M3, ROG Strix RTX 4080 & Dell XPS at Best Pune Prices",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&auto=format&fit=crop&q=80",
    linkUrl: "/devices",
  },
  {
    id: "b-3",
    title: "Assemble Your Dream Gaming Rig",
    subtitle: "Liquid-Cooled Panoramic RGB Battlestations with 3 Years Warranty",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80",
    linkUrl: "/custom-pc",
  },
];

export default function MobileBannerSlider({ banners }: { banners?: BannerItem[] }) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 aspect-[16/9] sm:aspect-[21/9] shadow-2xl border border-slate-800">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Banner Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col justify-end">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-600/90 text-white font-mono text-[10px] uppercase tracking-wider font-bold mb-1.5 w-fit">
                Featured Deal
              </span>
              <h2 className="text-lg sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 mt-1 max-w-lg">
                  {slide.subtitle}
                </p>
              )}
              {slide.linkUrl && (
                <Link
                  href={slide.linkUrl}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold w-fit shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
                >
                  Explore Now →
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-transform active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-transform active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                current === i ? "w-6 h-2 bg-gradient-to-r from-purple-500 to-blue-500" : "w-2 h-2 bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
