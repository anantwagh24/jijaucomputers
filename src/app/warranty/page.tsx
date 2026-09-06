import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { Award, ShieldCheck, CheckCircle2, Wrench, Clock, FileText, AlertTriangle, Phone, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warranty Guidelines & Service Policy | Jijau Computers",
  description: "Complete guide on manufacturer brand warranty, claim processes, laptop and desktop service policies at Jijau Computers.",
};

export default function WarrantyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Official Brand Warranty & Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Warranty Guidelines & Service Policies
          </h1>
          <p className="text-sm text-slate-600">
            Every product sold at Jijau Computers is backed by official manufacturer brand warranty. Here is everything you need to know about warranty coverage and hassle-free claims.
          </p>
        </div>

        {/* Brand Warranty Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Genuine Tax Invoice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every item comes with an official GST Tax Bill containing exact serial numbers, recognized at all authorized brand service centers across India.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Doorstep / Branch Help</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Facing issues? Walk into any of our 3+ branch locations or connect on WhatsApp. Our technicians will test the hardware and facilitate direct brand RMA replacement for you.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">48-Hour DOA Replacement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an item is found defective on unboxing within 48 hours of purchase, we initiate an immediate direct counter replacement (subject to brand verification).
            </p>
          </div>
        </div>

        {/* Detailed Guidelines Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          {/* Section 1: Standard Warranty Durations */}
          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              1. Standard Manufacturer Warranty Periods
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Typical Brand Warranty</th>
                    <th className="p-3">Major Brands Covered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Processors (CPUs)</td>
                    <td className="p-3 text-emerald-600 font-semibold">3 Years Brand Warranty</td>
                    <td className="p-3">Intel, AMD</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Motherboards</td>
                    <td className="p-3 text-emerald-600 font-semibold">3 Years Brand Warranty</td>
                    <td className="p-3">Asus, MSI, Gigabyte, ASRock</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Graphics Cards (GPUs)</td>
                    <td className="p-3 text-emerald-600 font-semibold">3 to 5 Years Warranty</td>
                    <td className="p-3">Asus, Gigabyte, MSI, Zotac, Inno3D, Sapphire</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">RAM / Memory</td>
                    <td className="p-3 text-emerald-600 font-semibold">3 to 10 Years / Limited Lifetime</td>
                    <td className="p-3">Corsair, G.Skill, Kingston, Adata, XPG</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">SSDs & Hard Drives</td>
                    <td className="p-3 text-emerald-600 font-semibold">3 to 5 Years Warranty</td>
                    <td className="p-3">Samsung, Western Digital, Crucial, Seagate, Kingston</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Power Supplies (PSUs)</td>
                    <td className="p-3 text-emerald-600 font-semibold">3 to 10 Years Warranty</td>
                    <td className="p-3">Corsair, Deepcool, Cooler Master, Ant Esports</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Laptops & Monitors</td>
                    <td className="p-3 text-emerald-600 font-semibold">1 to 3 Years Brand On-Site</td>
                    <td className="p-3">HP, Dell, Lenovo, Asus, Acer, LG, Samsung, BenQ</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">CCTV & Surveillance</td>
                    <td className="p-3 text-emerald-600 font-semibold">1 to 2 Years Warranty</td>
                    <td className="p-3">CP Plus, Hikvision, Dahua</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: How to Claim */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              2. How to Claim Warranty (Simple Steps)
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Option A — Direct Brand Service Center:</strong> You can carry the defective component along with your Jijau Computers GST bill to any nearest official brand authorized service center for instant RMA registration.
              </li>
              <li>
                <strong>Option B — Walk into Jijau Computers:</strong> If there is no authorized service center near you, bring the product to our store. We will log the ticket, test the device, ship it to the manufacturer’s regional RMA hub, and provide you with a replacement upon receipt.
              </li>
              <li>
                <strong>Option C — Laptop On-Site Support:</strong> For laptops with On-Site Brand Warranty, you can call the brand toll-free number (HP, Dell, Lenovo, Asus) and a certified brand engineer will visit your home/office directly.
              </li>
            </ol>
          </section>

          {/* Section 3: What is NOT covered */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              3. What is NOT Covered Under Warranty
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Physical damage, broken pins, burnt ICs, cracked PCB boards, or bent CPU socket pins.</li>
              <li>Liquid spillage, moisture corrosion, insect infestation, or rust.</li>
              <li>Tampered, removed, or illegible serial number stickers / warranty seal labels.</li>
              <li>Damage caused by severe electrical power surges or unauthorized third-party repairs.</li>
            </ul>
          </section>

          {/* Section 4: Chip-Level Repairs */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              4. In-House Chip-Level Repair Warranty
            </h2>
            <p>
              For out-of-warranty laptop motherboard, screen, or GPU chip-level repairs completed at Jijau Computers Service Labs, we provide a <strong>30-Day In-House Testing Warranty</strong> on the specific replaced component / repaired circuitry.
            </p>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Have questions about your warranty or serial number?</h3>
            <p className="text-xs text-slate-400">
              Our service desk is active 6 days a week to assist you with RMA tracking and diagnostics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/track-service"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              Track Repair Ticket
            </Link>
            <a
              href="https://wa.me/918805607908?text=Hello%20Jijau%20Computers,%20I%20need%20help%20with%20warranty%20claim"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
