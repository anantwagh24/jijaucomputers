"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import {
  Cpu,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  MessageCircle,
  ExternalLink,
  Award,
} from "lucide-react";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      {/* 1. TRUST BADGES / USP ROW */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Hardware</h4>
              <p className="text-xs text-slate-400">Direct Brand Warranty & Bill</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Expert Custom PC Builds</h4>
              <p className="text-xs text-slate-400">Stress-Tested & Cable Managed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast & Safe Delivery</h4>
              <p className="text-xs text-slate-400">Fast Store Pickup & Express Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Tech Support</h4>
              <p className="text-xs text-slate-400">WhatsApp & Phone Assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl || "/images/jijau-logo.jpg"}
                alt={settings.storeName || "Jijau Computers"}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/90 shadow-lg"
              />
              <span className="text-2xl font-black text-white tracking-tight">
                {settings.storeName}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline ||
                "Premier computer hardware and electronics center. Specializing in gaming rigs, workstation builds, laptops, CCTV security, and reliable chip-level repair services."}
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span>{settings.address}</span>
                  <Link href="/contact" className="block text-[11px] text-amber-400 font-bold hover:underline mt-0.5">
                    📍 View all 3+ Store Branches & Service Centers →
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
            </div>

            {/* Social Media Presence */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Connect on Social Media:
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={settings.instagramUrl || "https://www.instagram.com/jijau_computers_jafrabad"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="Follow on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href={settings.youtubeUrl || "https://www.youtube.com/@Pavan_Kad_JAFRBAD"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="Subscribe on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {settings.gstin && (
              <div className="inline-block bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-slate-400">
                GSTIN: <span className="text-slate-200">{settings.gstin}</span>
              </div>
            )}
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/products?category=laptops" className="hover:text-white transition-colors">
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link href="/custom-pc" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Custom PC Builder
                </Link>
              </li>
              <li>
                <Link href="/products?category=graphics-cards" className="hover:text-white transition-colors">
                  RTX 40-Series GPUs
                </Link>
              </li>
              <li>
                <Link href="/products?category=processors" className="hover:text-white transition-colors">
                  Intel & AMD Processors
                </Link>
              </li>
              <li>
                <Link href="/products?category=monitors" className="hover:text-white transition-colors">
                  High Refresh Gaming Displays
                </Link>
              </li>
              <li>
                <Link href="/products?category=cctv-security" className="hover:text-white transition-colors">
                  CCTV & Surveillance
                </Link>
              </li>
              <li>
                <Link href="/products?category=storage" className="hover:text-white transition-colors">
                  NVMe Gen4 SSDs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/track-service" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Track Laptop/PC Repair
                </Link>
              </li>
              <li>
                <Link href="/quote-request" className="hover:text-white transition-colors">
                  Request Bulk/B2B Quotation
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Warranty & RMA Claims
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors">
                  Festive Deals & Coupons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  3+ Store Branches & Map
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Service Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Google Maps / Contact CTA */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Visit Store
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Walk-in to experience live demo setups and speak with our PC hardware specialists across our 3+ branches.
            </p>
            <a
              href={settings.googleMapsUrl || "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Need Immediate Help?
              </span>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Hello Jijau Computers, I need help with choosing computer parts / laptop."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COPYRIGHT & BOTTOM BAR WITH TECH SPROUT CREDIT */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-900 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-white font-semibold">{settings.storeName}</span>. All rights reserved.
        </p>

        {/* Built with love by Tech Sprout */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/90 hover:border-orange-500/50 shadow-sm transition-all group">
          <span className="text-[11px] text-slate-400">Built with <span className="text-rose-500 animate-pulse">❤️</span> by</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded overflow-hidden bg-orange-500 shrink-0 flex items-center justify-center">
              <img
                src="/images/tech-sprout-logo.png"
                alt="Tech Sprout"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-black text-orange-400 tracking-tight group-hover:text-orange-300 transition-colors">
              Tech Sprout
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-[11px]">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/warranty" className="hover:text-white transition-colors">
            Warranty Guidelines
          </Link>
        </div>
      </div>
    </footer>
  );
}
