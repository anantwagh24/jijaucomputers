import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { ShieldCheck, Lock, UserCheck, Eye, Database, FileCheck, Mail } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Jijau Computers",
  description: "Learn how Jijau Computers safeguards your personal data, order information, and contact details with strict data privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Customer Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            Your privacy is of utmost importance to us. Here is how Jijau Computers collects, secures, and handles your information.
          </p>
          <p className="text-xs text-slate-400">Effective Date: September 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              1. Information We Collect
            </h2>
            <p>
              When you purchase hardware, create an account, request a service repair ticket, or enquire on WhatsApp, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, phone number, WhatsApp contact, and email address.</li>
              <li><strong>Delivery Details:</strong> Shipping address, landmark, town/village, and postal PIN code.</li>
              <li><strong>Billing Data:</strong> GST number (for B2B/business invoices), item serial numbers, and invoice records.</li>
              <li><strong>Device Repair Information:</strong> Laptop/PC serial number, brand, model, and diagnostic notes.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>To fulfill hardware orders, dispatch deliveries, and generate official GST tax invoices.</li>
              <li>To provide WhatsApp status updates on custom PC builds and repair tickets.</li>
              <li>To assist with official brand warranty claims and serial number validations.</li>
              <li>To provide customer support and notify you of exclusive store discounts and seasonal offers.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              3. Data Protection & Zero Spam Policy
            </h2>
            <p>
              <strong>We never sell, rent, or trade your personal data to third parties or telemarketers.</strong> Your data is stored on secure, encrypted servers and is accessible only to authorized Jijau Computers administrative staff for order processing.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
              4. Payment Security & UPI Safety
            </h2>
            <p>
              We do not store your bank account passwords, card CVVs, or UPI PINs. All electronic transactions occur directly through certified banking apps or official UPI payment rails (PhonePe, Google Pay, BHIM).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              5. Contact Our Privacy Officer
            </h2>
            <p>
              If you wish to update your details or have questions regarding your data privacy, please contact us at{" "}
              <a href="mailto:sales@jijaucomputers.in" className="text-blue-600 font-bold hover:underline">
                sales@jijaucomputers.in
              </a>{" "}
              or call our store helpline at{" "}
              <a href="tel:+918805607908" className="text-blue-600 font-bold hover:underline">
                +91 88056 07908
              </a>.
            </p>
          </section>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link href="/warranty" className="text-blue-600 hover:underline">
            Warranty Guidelines
          </Link>
          <span>•</span>
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
