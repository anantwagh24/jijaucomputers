"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  FileText,
  Building2,
  RefreshCw,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

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
    invoiceTerms: "",
    invoiceBankDetails: "",
    invoiceHsnCode: "84713010",
    invoiceNotes: "",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
        logoUrl: settings.logoUrl || "/images/jijau-logo.jpg",
        darkLogoUrl: settings.darkLogoUrl || "/images/jijau-logo.jpg",
        faviconUrl: settings.faviconUrl || "/favicon.png",
        primaryColor: settings.primaryColor || "#2563eb",
        secondaryColor: settings.secondaryColor || "#f59e0b",
        phone: settings.phone || "+91 88056 07908",
        whatsapp: settings.whatsapp || "918805607908",
        email: settings.email || "sales@jijaucomputers.in",
        address: settings.address || "",
        googleMapsUrl: settings.googleMapsUrl || "",
        openingHours: settings.openingHours || "",
        gstin: settings.gstin || "27AABCJ1234F1Z9",
        upiId: settings.upiId || "jijauc@ibl",
        upiName: settings.upiName || "Jijau Computers",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
        youtubeUrl: settings.youtubeUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",
        invoiceTerms:
          settings.invoiceTerms ||
          "1. Warranty valid only with official serial number and intact warranty seals.\n2. Goods once sold are subject to manufacturer standard warranty policy.\n3. Physical damage, liquid spillage, or unauthorized modifications are not covered under warranty.\n4. Disputes subject to Pune Jurisdiction only.",
        invoiceBankDetails:
          settings.invoiceBankDetails ||
          "Bank: HDFC Bank Ltd | A/C No: 50200012345678 | IFSC: HDFC0001234 | Branch: Station Road, Pune",
        invoiceHsnCode: settings.invoiceHsnCode || "84713010",
        invoiceNotes:
          settings.invoiceNotes ||
          "Thank you for choosing Jijau Computers Pune - Your Trusted Tech Partner!",
      });
    }
  }, [settings]);

  // Handle direct file upload for Store Logo
  const handleFileUpload = async (file: File, isFavicon = false) => {
    try {
      if (isFavicon) setUploadingFavicon(true);
      else setUploadingLogo(true);
      setUploadFeedback("");

      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (isFavicon) {
          setFormData((prev) => ({ ...prev, faviconUrl: data.url }));
          setUploadFeedback("Favicon uploaded successfully!");
        } else {
          setFormData((prev) => ({
            ...prev,
            logoUrl: data.url,
            darkLogoUrl: data.url,
          }));
          setUploadFeedback("Store Logo uploaded and preview updated! Click 'Save Website Settings' to make live.");
        }
      } else {
        setUploadFeedback(data.error || "Failed to upload image. (Max 5MB, JPG/PNG/WebP only)");
      }
    } catch (e) {
      setUploadFeedback("Network error uploading file.");
    } finally {
      setUploadingLogo(false);
      setUploadingFavicon(false);
    }
  };

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
        setTimeout(() => setSuccessMsg(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Website Branding & Store Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your site logo, brand identity, GST invoice parameters, contact hotlines, and SEO.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved & Applied Live Across Site!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. STORE LOGO & BRAND IDENTITY */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                1. Official Store Logo & Visual Branding
              </h2>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Live Everywhere
            </span>
          </div>

          {/* Logo Uploader & Live Preview Studio */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black text-white">Store Logo Uploader</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Upload high-res PNG, JPG, or WebP logo. Automatically updates Store Header, Footer, Login, Favicon, and Invoices.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], false);
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingLogo}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-bounce" : ""}`} />
                  <span>{uploadingLogo ? "Uploading Logo..." : "Upload New Logo"}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      logoUrl: "/images/jijau-logo.jpg",
                      darkLogoUrl: "/images/jijau-logo.jpg",
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                  title="Reset to official Jijau golden emblem logo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Upload Feedback */}
            {uploadFeedback && (
              <p
                className={`text-xs font-bold ${
                  uploadFeedback.includes("successfully")
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {uploadFeedback}
              </p>
            )}

            {/* Live Dual-Surface Contrast Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Light Surface Preview */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <img
                    src={formData.logoUrl || "/images/jijau-logo.jpg"}
                    alt="Logo Preview Light"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Light Background (Invoices/Header)</span>
                  <span className="font-black text-slate-900 text-sm">{formData.storeName || "Jijau Computers"}</span>
                  <p className="text-[10px] text-blue-600 font-bold">{formData.tagline || "Your Tech Partner"}</p>
                </div>
              </div>

              {/* Dark Surface Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <img
                    src={formData.darkLogoUrl || formData.logoUrl || "/images/jijau-logo.jpg"}
                    alt="Logo Preview Dark"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dark Background (Admin / Account)</span>
                  <span className="font-black text-white text-sm">{formData.storeName || "Jijau Computers"}</span>
                  <p className="text-[10px] text-amber-400 font-bold">{formData.tagline || "Your Tech Partner"}</p>
                </div>
              </div>
            </div>

            {/* Direct URL Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Logo URL (Light)</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="/images/jijau-logo.jpg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Dark Mode Logo URL</label>
                <input
                  type="text"
                  value={formData.darkLogoUrl}
                  onChange={(e) => setFormData({ ...formData, darkLogoUrl: e.target.value })}
                  placeholder="/images/jijau-logo.jpg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Favicon URL</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formData.faviconUrl}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="/favicon.png"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] outline-none focus:border-blue-500"
                  />
                  <input
                    type="file"
                    ref={faviconInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], true);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-[10px]"
                    title="Upload Favicon"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
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
              <label className="font-bold text-slate-300 block mb-1">Tagline / Official Slogan</label>
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
        </div>

        {/* 2. GST TAX INVOICE & WARRANTY CONFIGURATION */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                2. GST Tax Invoice & Warranty Certificate Settings
              </h2>
            </div>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Pune / Maharashtra GST
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Store GSTIN Number *</label>
              <input
                type="text"
                required
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                placeholder="27AABCJ1234F1Z9"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono uppercase font-bold outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Standard 15-digit Maharashtra GSTIN (starts with state code 27).
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Default Hardware HSN Code *</label>
              <input
                type="text"
                required
                value={formData.invoiceHsnCode}
                onChange={(e) => setFormData({ ...formData, invoiceHsnCode: e.target.value })}
                placeholder="84713010"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-blue-500 font-semibold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                HSN code for Computers, Laptops, Processors & Peripherals (8471).
              </span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">
              Official Bank & Payment Details (Printed on Invoices) *
            </label>
            <input
              type="text"
              required
              value={formData.invoiceBankDetails}
              onChange={(e) => setFormData({ ...formData, invoiceBankDetails: e.target.value })}
              placeholder="Bank: HDFC Bank Ltd | A/C No: 50200012345678 | IFSC: HDFC0001234 | Branch: Station Road, Pune"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">
              Invoice Terms, Conditions & Warranty Policy *
            </label>
            <textarea
              rows={4}
              required
              value={formData.invoiceTerms}
              onChange={(e) => setFormData({ ...formData, invoiceTerms: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Printed on the bottom-left of every generated PDF invoice.
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Invoice Footer Note / Slogan</label>
            <input
              type="text"
              value={formData.invoiceNotes}
              onChange={(e) => setFormData({ ...formData, invoiceNotes: e.target.value })}
              placeholder="Thank you for choosing Jijau Computers Pune - Your Trusted Tech Partner!"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 3. CONTACT INFORMATION & ADDRESS */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              3. Contact Information, Hotline & Store Location
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

            {/* UPI Merchant Configuration */}
            <div>
              <label className="font-bold text-emerald-400 block mb-1">Store UPI VPA ID *</label>
              <input
                type="text"
                required
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. jijauc@ibl"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-300 font-mono font-bold outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 4. SOCIAL MEDIA & SEO */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-sky-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              4. Social Media Links & SEO
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <input
                type="text"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
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
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">New Secure Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 py-4 sticky bottom-4 z-20">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Website Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
