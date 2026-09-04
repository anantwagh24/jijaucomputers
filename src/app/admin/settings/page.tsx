"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  Settings,
  Save,
  CheckCircle2,
  Palette,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Globe,
  Share2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    storeName: "",
    tagline: "",
    logoUrl: "",
    darkLogoUrl: "",
    faviconUrl: "",
    primaryColor: "#2563eb",
    secondaryColor: "#f59e0b",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    googleMapsUrl: "",
    openingHours: "",
    gstin: "",
    upiId: "jijauc@ibl",
    upiName: "Jijau Computers",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    linkedinUrl: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState("");

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordStatus("Please fill in both current and new password.");
      return;
    }
    try {
      setPasswordStatus("Updating password...");
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        setPasswordStatus(data.error || "Failed to update password.");
      }
    } catch {
      setPasswordStatus("Network error updating password.");
    }
  };

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "Jijau Computers",
        tagline: settings.tagline || "",
        logoUrl: settings.logoUrl || "",
        darkLogoUrl: settings.darkLogoUrl || "",
        faviconUrl: settings.faviconUrl || "",
        primaryColor: settings.primaryColor || "#2563eb",
        secondaryColor: settings.secondaryColor || "#f59e0b",
        phone: settings.phone || "+91 88056 07908",
        whatsapp: settings.whatsapp || "918805607908",
        email: settings.email || "sales@jijaucomputers.in",
        address: settings.address || "",
        googleMapsUrl: settings.googleMapsUrl || "",
        openingHours: settings.openingHours || "",
        gstin: settings.gstin || "",
        upiId: settings.upiId || "jijauc@ibl",
        upiName: settings.upiName || "Jijau Computers",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
        youtubeUrl: settings.youtubeUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await refreshSettings();
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Website Branding & Store Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure entire website branding, contact hotline, colors, address, and SEO without modifying any code.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved & Applied Live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. BRAND IDENTITY & THEME COLORS */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Palette className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              1. Brand Identity & Theme Colors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Store / Business Name *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Tagline / Slogan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Primary Brand Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Secondary / Accent Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Store Logo Image URL</label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Dark Mode Logo URL</label>
              <input
                type="url"
                value={formData.darkLogoUrl}
                onChange={(e) => setFormData({ ...formData, darkLogoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Favicon URL</label>
              <input
                type="url"
                value={formData.faviconUrl}
                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. CONTACT INFORMATION & ADDRESS */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              2. Contact Information, Hotline & Store Location
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">WhatsApp Number (with country code) *</label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Store Address (Displayed on Website & Footer) *</label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Business Timings / Opening Hours *</label>
              <textarea
                rows={2}
                required
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Google Maps Direct / Location URL</label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">GSTIN Number (for invoices)</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono uppercase outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* UPI Merchant Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <label className="font-bold text-emerald-400 block mb-1">Store UPI VPA ID (For Instant GPay/PhonePe/Paytm Payments) *</label>
              <input
                type="text"
                required
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. jijauc@ibl or yourupi@okhdfcbank"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-mono font-bold outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">This UPI ID is used for generating live QR codes & opening Google Pay, PhonePe, and Paytm on customers' mobile phones.</span>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">UPI Payee / Merchant Name *</label>
              <input
                type="text"
                required
                value={formData.upiName}
                onChange={(e) => setFormData({ ...formData, upiName: e.target.value })}
                placeholder="e.g. Jijau Computers"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 3. SOCIAL MEDIA LINKS */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Share2 className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              3. Social Media Links
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 4. SEO & META TAGS */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-sky-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              4. SEO & Search Engine Optimization
            </h2>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Default Meta Title</label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Meta Keywords (Comma separated)</label>
            <input
              type="text"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 5. ADMIN ACCOUNT SECURITY & PASSWORD CHANGE */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              5. Admin Security & Password Protection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Current Admin Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">New Secure Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {passwordStatus && (
            <p className={`text-xs font-bold ${passwordStatus.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>
              {passwordStatus}
            </p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleChangePassword}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 py-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Website Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
