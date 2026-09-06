"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useSettings } from "@/context/SettingsContext";
import { generateWhatsAppUrl } from "@/lib/utils";
import { StoreBranch } from "@/lib/types";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Building2,
  Navigation,
} from "lucide-react";

export default function ContactPage() {
  const { settings } = useSettings();

  let branches: StoreBranch[] = [];
  if (settings.branchesJson) {
    try {
      const parsed = JSON.parse(settings.branchesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        branches = parsed;
      }
    } catch (e) {
      // ignore
    }
  }

  if (branches.length === 0) {
    branches = [
      {
        id: "main",
        name: "Head Office & Main Store",
        address: settings.address,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        mapUrl: settings.googleMapsUrl || "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA",
        isMain: true,
        timings: settings.openingHours,
      },
    ];
  }

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const storeNumber = settings.whatsapp || "918805607908";
    const msg = `*Contact Enquiry from ${formData.name || "Customer"}*\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message || "Hello Jijau Computers, I need assistance with computer hardware/repair."}`;
    window.open(generateWhatsAppUrl(storeNumber, msg), "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>{branches.length} Branches & Service Centers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Get in Touch with Jijau Computers
          </h1>
          <p className="text-sm text-slate-600">
            Visit any of our retail store branches, call our support desk, or send an instant enquiry through the form below.
          </p>
        </div>

        {/* 3+ Branches Showcase Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Our Store Branches & Service Locations
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {branches.length} Locations Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch, idx) => (
              <div
                key={branch.id || idx}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                  branch.isMain
                    ? "bg-white border-blue-200 shadow-md ring-2 ring-blue-500/20"
                    : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Branch #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {branch.name}
                      </h3>
                    </div>
                    {branch.isMain && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-bold shrink-0">
                        Main Head Office
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {branch.address}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a
                        href={`tel:${(branch.phone || settings.phone).replace(/[^0-9+]/g, "")}`}
                        className="hover:text-blue-600 font-semibold"
                      >
                        {branch.phone || settings.phone}
                      </a>
                    </div>
                    {branch.timings && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{branch.timings}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={branch.mapUrl || settings.googleMapsUrl || "https://maps.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                  <a
                    href={`https://wa.me/${(branch.whatsapp || settings.whatsapp || "918805607908").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello Jijau Computers, I am contacting you regarding your ${branch.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center"
                    title="WhatsApp Branch"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900">
                Central Customer Helpline
              </h2>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Store Helpline</span>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-slate-700 font-semibold hover:text-blue-600 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Email Support</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-700 font-semibold hover:text-blue-600 transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Working Hours</span>
                    <p className="text-slate-600 mt-0.5">{settings.openingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-base font-black">Need Quick Help on WhatsApp?</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Connect directly with our store sales manager for instant price checks and stock verification across all branches.
              </p>
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full py-3 rounded-xl bg-white text-emerald-800 font-black text-xs shadow hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Start WhatsApp Chat</span>
              </button>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-1">
              Send us an Enquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and we will respond via WhatsApp or Email promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", phone: "", email: "", subject: "General Enquiry", message: "" });
                  }}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Joshi"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.name@gmail.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600 bg-white"
                    >
                      <option>General Product Inquiry</option>
                      <option>Custom Gaming PC Build Consultation</option>
                      <option>Laptop / Desktop Repair Status</option>
                      <option>Corporate / Bulk Orders</option>
                      <option>CCTV & Networking Setup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe what you are looking for, specific budget, or hardware models..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending..." : "Submit Enquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Map Interactive Location Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Find Us on Google Maps
          </h3>
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.999999999999!2d73.8475!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTAnNTEuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jijau Computers Location Map"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
