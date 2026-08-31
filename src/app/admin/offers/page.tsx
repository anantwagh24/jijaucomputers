"use client";

import React, { useState, useEffect } from "react";
import { Flame, Plus, Edit2, Trash2, Tag, Check, X } from "lucide-react";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    badge: "FESTIVAL SPECIAL",
    description: "",
    bannerUrl: "",
    discountPct: "15",
    couponCode: "",
    isActive: true,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/offers");
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      badge: "LIMITED TIME",
      description: "",
      bannerUrl: "",
      discountPct: "15",
      couponCode: "JIJAUDEAL",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (o: any) => {
    setEditingId(o.id);
    setFormData({
      title: o.title,
      badge: o.badge || "LIMITED TIME",
      description: o.description,
      bannerUrl: o.bannerUrl || "",
      discountPct: o.discountPct ? String(o.discountPct) : "",
      couponCode: o.couponCode || "",
      isActive: o.isActive,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/offers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch("/api/offers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        if (res.ok) {
          await fetchOffers();
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await fetchOffers();
          setModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" />
            Offers & Coupons CMS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure promotional discount cards, coupon codes, and festival campaign deals.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Offer</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 text-xs py-8 text-center col-span-full">Loading offers...</p>
        ) : (
          offers.map((o) => (
            <div
              key={o.id}
              className="bg-slate-950 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded text-[10px] uppercase">
                    {o.badge}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    o.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                  }`}>
                    {o.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <h3 className="text-base font-black text-white">{o.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{o.description}</p>
              </div>

              {o.couponCode && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono font-black">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{o.couponCode}</span>
                  </div>
                  {o.discountPct && (
                    <span className="text-[11px] font-bold text-emerald-400">
                      {o.discountPct}% OFF
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                <button
                  onClick={() => handleOpenEdit(o)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(o.id)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-900/40 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl z-10">
            <h3 className="text-base font-black text-white mb-4">
              {editingId ? "Edit Offer" : "Create Promo Offer"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diwali Mega Sale"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. LIMITED OFFER"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPct}
                    onChange={(e) => setFormData({ ...formData, discountPct: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. JIJAUFEST"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold outline-none focus:border-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Offer Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Offer Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="text-slate-300 font-bold">Active and Visible on Store</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
