import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { Shield, FileText, CheckCircle2, AlertCircle, Scale, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Jijau Computers",
  description: "Read the official terms and conditions for computer sales, custom PC builds, warranty claims, and repairs at Jijau Computers.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal & Purchase Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-600">
            Please read these terms carefully before purchasing products, ordering custom PC builds, or submitting devices for repair at Jijau Computers.
          </p>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              1. General Overview & Agreement
            </h2>
            <p>
              Welcome to <strong>Jijau Computers</strong>. By accessing our website, placing an order, requesting a quotation, or purchasing goods and services at any of our branches, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <p>
              These terms apply to all visitors, registered users, and retail/B2B customers of Jijau Computers and its affiliated branches.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              2. Product Authenticity & Pricing
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>100% Genuine Products:</strong> All components, laptops, desktops, and accessories sold by Jijau Computers are brand new, original, and sourced directly from authorized Indian brand distributors (Intel, AMD, Nvidia/Asus/Gigabyte/MSI, HP, Dell, Lenovo, Acer, etc.).
              </li>
              <li>
                <strong>GST Compliant Invoicing:</strong> Every purchase includes an official GST Tax Invoice specifying individual serial numbers and HSN codes.
              </li>
              <li>
                <strong>Pricing & Availability:</strong> Prices displayed on the website are subject to market changes in component costs. We reserve the right to correct typographical pricing errors before order fulfillment.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              3. Custom Gaming PC & Workstation Orders
            </h2>
            <p>
              When commissioning a custom-built computer from Jijau Computers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                All parts are unboxed, professionally assembled, cable-managed, BIOS-updated, and stress-tested (CPU/GPU load testing) before dispatch or hand-over.
              </li>
              <li>
                Original retail component boxes and manufacturer documentation are packed and handed over with the PC.
              </li>
              <li>
                Custom build advance deposits are utilized to reserve hardware and initiate assembly immediately.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              4. Payment Methods & Verification
            </h2>
            <p>
              We accept payments via <strong>UPI (PhonePe, Google Pay, Paytm, BHIM)</strong>, Direct IMPS/NEFT/RTGS Bank Transfer, Debit/Credit Cards, and Store Cash. For online orders, orders are confirmed once transaction verification is complete.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-600" />
              5. Cancellation & Replacement Policy
            </h2>
            <p>
              Products delivered with transit damage or Dead-on-Arrival (DOA) within 48 hours of receipt are eligible for immediate replacement upon inspection with intact original packaging and serial numbers. Please refer to our{" "}
              <Link href="/warranty" className="text-blue-600 font-bold hover:underline">
                Warranty Guidelines
              </Link>{" "}
              for complete claim procedures.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              6. Limitation of Liability & Legal Jurisdiction
            </h2>
            <p>
              Jijau Computers shall not be held liable for indirect, incidental, or consequential damages resulting from improper user overclocking, physical liquid damage, third-party software corruption, or electricity voltage spikes. All disputes are subject to local district court jurisdiction in Maharashtra, India.
            </p>
          </section>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
          <span>Need further clarification?</span>
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Support Desk
          </Link>
          <span>•</span>
          <Link href="/warranty" className="text-blue-600 hover:underline">
            Warranty Guidelines
          </Link>
          <span>•</span>
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
