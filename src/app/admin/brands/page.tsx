"use client";

import React, { useState, useEffect } from "react";
import { Tags, Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    isActive: true,
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/brands");
      const data = await res.json();
      if (Array.isArray(data)) setBrands(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", logoUrl: "", isActive: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingId(b.id);
    setFormData({
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl || "",
      isActive: b.isActive,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch("/api/brands", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        if (res.ok) {
          await fetchBrands();
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await fetchBrands();
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
            <Tags className="w-6 h-6 text-emerald-500" />
            Brand Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage authorized hardware partner logos, names, and storefront filter badges.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          <p className="text-slate-500 text-xs col-span-full py-8 text-center">Loading brands...</p>
        ) : (
          brands.map((b) => (
            <div
              key={b.id}
              className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between items-center text-center space-y-3"
            >
              <div className="w-16 h-12 rounded-xl bg-white p-2 flex items-center justify-center border border-slate-700">
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-bold text-xs text-slate-800">{b.name}</span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-white text-xs">{b.name}</h4>
                <span className="text-[10px] text-slate-500">{b._count?.products ?? 0} Products</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-900 w-full justify-center">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1 rounded-lg bg-slate-900 hover:bg-rose-900/40 text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
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
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 max-w-sm w-full shadow-2xl z-10">
            <h3 className="text-base font-black text-white mb-4">
              {editingId ? "Edit Brand" : "Add Hardware Brand"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ASUS, Intel, NVIDIA"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Brand Logo Image URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
