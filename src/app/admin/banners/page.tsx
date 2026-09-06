"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sliders, Plus, Edit2, Trash2, CheckCircle2, XCircle, X, Upload, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tag: "Special Promotion",
    imageUrl: "",
    ctaText: "Shop Now",
    ctaLink: "/products",
    order: "0",
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banners", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (Array.isArray(data)) setBanners(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      subtitle: "",
      tag: "FEATURED DEAL",
      imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80",
      ctaText: "Explore Now",
      ctaLink: "/happy-customers",
      order: String(banners.length + 1),
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingId(b.id);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || "",
      tag: b.tag || "Special Promotion",
      imageUrl: b.imageUrl,
      ctaText: b.ctaText || "Explore Now",
      ctaLink: b.ctaLink || "/products",
      order: String(b.order),
      isActive: b.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (b: any) => {
    try {
      const newStatus = !b.isActive;
      // Optimistic update
      setBanners((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, isActive: newStatus } : item))
      );

      await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, isActive: newStatus }),
      });
      fetchBanners();
    } catch (e) {
      console.error("Toggle error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch("/api/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        if (res.ok) {
          await fetchBanners();
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await fetchBanners();
          setModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-500" />
            Hero Banner Slider CMS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure homepage promotional banners, direct click destination links, enable/disable status, and display order.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 text-xs py-8 text-center">Loading banners...</p>
        ) : banners.length === 0 ? (
          <div className="bg-slate-950 rounded-3xl p-12 text-center border border-slate-800 text-slate-400 space-y-3">
            <div className="text-3xl">🖼️</div>
            <div className="text-sm font-bold text-white">No homepage banners found</div>
            <p className="text-xs">Click "Add New Banner" above to create one.</p>
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className={`bg-slate-950 rounded-3xl p-6 border transition-all flex flex-col md:flex-row items-center gap-6 ${
                b.isActive ? "border-slate-800" : "border-slate-800/40 opacity-70"
              }`}
            >
              {/* Thumbnail with Fallback */}
              <div className="w-full md:w-64 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative">
                <img
                  src={b.imageUrl || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80"}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2 text-xs w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded uppercase text-[10px]">
                    {b.tag || "PROMOTION"}
                  </span>
                  <span className="text-slate-500 text-[11px]">Order #{b.order}</span>

                  {/* Enable / Disable 1-Click Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(b)}
                    className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      b.isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {b.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{b.isActive ? "Active on Home" : "Disabled (Hidden)"}</span>
                  </button>
                </div>

                <h3 className="text-base font-black text-white leading-snug">{b.title}</h3>
                {b.subtitle && <p className="text-slate-400 line-clamp-2">{b.subtitle}</p>}

                <div className="flex items-center gap-4 text-[11px] text-blue-400 pt-1 flex-wrap">
                  <span>CTA Text: <strong>{b.ctaText || "Explore Now"}</strong></span>
                  <span>Destination: <strong className="text-slate-300 font-mono">{b.ctaLink || "/products"}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 transition-colors"
                  title="Edit Banner"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {editingId ? "Edit Hero Banner" : "Create Hero Banner"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Banner Title / Main Heading *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Our Happy Customers from Your City"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. 150+ Custom Rigs & Laptops Delivered Across Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Top Badge / Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. REAL STORIES"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Display Order #</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Banner Background Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  </button>
                </div>
              </div>

              {/* Clickable Destination & CTA Button */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g. See Happy Customers"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Clickable Link Destination *</label>
                  <input
                    type="text"
                    required
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="e.g. /happy-customers or /custom-pc"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerActiveCheckbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-800"
                />
                <label htmlFor="bannerActiveCheckbox" className="text-slate-300 font-bold cursor-pointer">
                  Active (Show on homepage carousel)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  {editingId ? "Update Banner" : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
