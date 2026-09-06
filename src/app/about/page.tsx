import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import {
  Cpu,
  ShieldCheck,
  Award,
  Wrench,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About Us | Jijau Computers",
  description: "Learn about Jijau Computers - Premier hardware retailer, custom PC builder and certified repair center.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Serving Customers Since 2012</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Premier Computer Hardware & Custom PC Specialists
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Welcome to <span className="font-bold text-slate-900">Jijau Computers</span>. Founded with a vision to deliver genuine computing technology, extreme gaming hardware, and reliable chip-level laptop repairs at transparent prices.
          </p>
        </div>

        {/* 2-Column Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our Journey & Mission
            </h2>
            <p>
              Over the last decade, Jijau Computers has evolved into a trusted destination for PC gamers, content creators, architecture studios, and corporate IT departments.
            </p>
            <p>
              We believe every PC build should be a masterpiece. We hand-select high-grade silicon, design optimal airflow dynamics, execute clean hidden cable management, and stress-test every setup under maximum thermal load before handover.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                <span className="text-xl sm:text-2xl font-black text-blue-600 block">15,000+</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">Systems Delivered</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 block">3+</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">Store Branches</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                <span className="text-xl sm:text-2xl font-black text-amber-500 block">4.9 ★</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">Customer Rating</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-video">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=900&auto=format&fit=crop&q=80"
                alt="Jijau Computers Store & Custom Rig Setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% Genuine Silicon</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We source directly from authorized Indian national distributors (Ingram Micro, Redington, Savex) ensuring valid GST invoices and full brand warranty.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Chip-Level Repair Center</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              State-of-the-art BGA rework stations, digital oscilloscopes, and microscope workstations for delicate laptop motherboard and GPU repairs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Passionate Tech Staff</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our hardware advisors are PC builders and gamers themselves who listen to your exact budget and recommend zero-bottleneck configurations.
            </p>
          </div>
        </div>

        {/* Store CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center border border-slate-800 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Upgrade Your Computing Setup?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Contact our experience team to customize high-refresh displays, mechanical keyboards, and liquid-cooled PC rigs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/custom-pc"
              className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow transition-colors"
            >
              Build Your Custom PC
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
