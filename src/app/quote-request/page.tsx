"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useSettings } from "@/context/SettingsContext";
import { generateWhatsAppUrl } from "@/lib/utils";
import {
  FileText,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  MessageSquare,
  ShieldCheck,
  Award,
  Truck,
} from "lucide-react";

export default function QuoteRequestPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: "",
    companyName: "",
    phone: "",
    email: "",
    type: "Bulk Order (10+ Systems)",
    itemsSummary: "",
    message: "",
  });

  const [submittedQuoteNo, setSubmittedQuoteNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedQuoteNo(data.quoteNumber || "JC-QTE-OK");
      }
    } catch (e) {
      console.error("Quote request failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppQuote = () => {
    const storeNumber = settings.whatsapp || "918805607908";
    const text = `*Bulk / Corporate Quotation Request*\n\n*Name:* ${formData.customerName}\n*Company / GST:* ${formData.companyName || "N/A"}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Requirement Type:* ${formData.type}\n\n*Items / Requirements:*\n${formData.itemsSummary}\n\n*Notes:* ${formData.message || "Please provide best commercial quote with GST invoice."}`;
    window.open(generateWhatsAppUrl(storeNumber, text), "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Building className="w-3.5 h-3.5" />
            <span>Corporate B2B & Bulk Computer Supply</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Request an Official Quotation
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Get authorized commercial pricing with GST bill, bulk discounts, and express delivery for companies, schools, institutions, and labs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            {submittedQuoteNo ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black">
                  Quotation Request #{submittedQuoteNo} Received!
                </h3>
                <p className="text-sm max-w-md mx-auto">
                  Our corporate sales representative will review your item requirements and prepare an official GST quotation with special bulk discounting.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSubmittedQuoteNo(null);
                      setFormData({
                        companyName: "",
                        contactPerson: "",
                        email: "",
                        phone: "",
                        gstNumber: "",
                        deliveryPincode: "",
                        itemsRequirement: "",
                        targetBudget: "",
                        urgency: "Standard (2-3 Days)",
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Submit Another Quote Request
                  </button>
                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Back to Store
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Company / Organization / School Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Infotech Solutions Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="purchase@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Quotation Requirement Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option>Bulk Order (10+ Systems)</option>
                    <option>Corporate Office IT Setup</option>
                    <option>School / College Computer Lab Setup</option>
                    <option>CCTV Surveillance Multi-Camera Project</option>
                    <option>Single High-Value Hardware Quote</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Items & Configuration Summary *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.itemsSummary}
                    onChange={(e) => setFormData({ ...formData, itemsSummary: e.target.value })}
                    placeholder="List required items, processor specs, RAM/storage amounts, monitors, and quantities needed..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Location & Special Notes</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Delivery required within 3-5 business days, need on-site setup..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Submitting..." : "Submit Quotation Request"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppQuote}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Trust Points */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white">
                Why Jijau Computers for Corporate B2B?
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>GST Registered with 100% Tax Credit compliant invoicing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Direct Authorized tier-1 vendor distributor pricing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free On-Site delivery, network setup & OS deployment.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-200 text-xs text-blue-900 space-y-2">
              <h4 className="font-bold text-sm">Need Urgent Same-Day Quotation?</h4>
              <p>
                Call our direct corporate billing manager:
              </p>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                className="font-black text-sm text-blue-700 block hover:underline"
              >
                {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
