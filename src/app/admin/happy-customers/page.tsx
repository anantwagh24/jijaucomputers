"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  HeartHandshake,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  MapPin,
  Laptop,
  Star,
  Calendar,
  Phone,
  Filter,
} from "lucide-react";

interface HappyCustomer {
  id: string;
  name: string;
  city: string;
  village?: string | null;
  district: string;
  phone?: string | null;
  productName: string;
  photoUrl: string;
  review?: string | null;
  rating: number;
  purchaseDate?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function AdminHappyCustomersPage() {
  const [customers, setCustomers] = useState<HappyCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<HappyCustomer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<HappyCustomer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    village: "",
    district: "Jalna",
    phone: "",
    productName: "",
    photoUrl: "",
    review: "",
    rating: 5,
    purchaseDate: "",
    isFeatured: true,
    isActive: true,
  });

  const districtsList = [
    "Jalna",
    "Chhatrapati Sambhajinagar",
    "Buldhana",
    "Parbhani",
    "Beed",
    "Nanded",
    "Hingoli",
    "Nashik",
    "Ahmednagar",
    "Pune",
    "Satara",
    "Solapur",
    "Kolhapur",
    "Sangli",
    "Thane",
    "Mumbai City",
    "Mumbai Suburban",
    "Raigad",
    "Ratnagiri",
    "Sindhudurg",
    "Nagpur",
    "Amravati",
    "Akola",
    "Yavatmal",
    "Wardha",
    "Washim",
    "Latur",
    "Dharashiv",
    "Dhule",
    "Nandurbar",
    "Jalgaon",
    "Gondia",
    "Bhandara",
    "Chandrapur",
    "Gadchiroli",
    "Other",
  ];

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/happy-customers?search=${encodeURIComponent(search)}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      city: "",
      village: "",
      district: "Jalna",
      phone: "",
      productName: "",
      photoUrl: "",
      review: "",
      rating: 5,
      purchaseDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      isFeatured: true,
      isActive: true,
    });
    setError("");
    setUploadSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (c: HappyCustomer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      city: c.city,
      village: c.village || "",
      district: c.district && c.district !== "Maharashtra" ? c.district : "Jalna",
      phone: c.phone || "",
      productName: c.productName,
      photoUrl: c.photoUrl,
      review: c.review || "",
      rating: c.rating || 5,
      purchaseDate: c.purchaseDate || "",
      isFeatured: c.isFeatured,
      isActive: c.isActive,
    });
    setError("");
    setUploadSuccess("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingPhoto(true);
    setError("");
    setUploadSuccess("");

    // Try server upload first
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok && (data.url || (data.urls && data.urls.length > 0))) {
        const finalUrl = data.url || data.urls[0];
        setFormData((prev) => ({ ...prev, photoUrl: finalUrl }));
        setUploadSuccess(`Photo uploaded successfully! (${file.name})`);
        setUploadingPhoto(false);
        return;
      }
    } catch {
      // Fallback silently to client-side conversion
    }

    // Client-side fallback to Base64 Data URL (guarantees upload never fails even on read-only hosting)
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          setFormData((prev) => ({ ...prev, photoUrl: base64 }));
          setUploadSuccess(`Photo attached from device! (${file.name})`);
        }
        setUploadingPhoto(false);
      };
      reader.onerror = () => {
        setError("Failed to read image file from device.");
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Unable to process image file.");
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.city || !formData.productName || !formData.photoUrl) {
      setError("Please fill in Customer Name, City, Product Name, and choose/upload a Photo.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCustomer) {
        // Update
        const res = await fetch(`/api/admin/happy-customers/${editingCustomer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsModalOpen(false);
          await fetchCustomers();
        } else {
          setError(data.error || "Failed to update record.");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/happy-customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsModalOpen(false);
          await fetchCustomers();
        } else {
          setError(data.error || "Failed to create record.");
        }
      }
    } catch {
      setError("Network error saving customer story.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteConfirm = (c: HappyCustomer) => {
    setCustomerToDelete(c);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/happy-customers/${customerToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        // Optimistically remove
        setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
        fetchCustomers();
      } else {
        alert("Failed to delete customer story.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting customer story.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (c: HappyCustomer) => {
    const updatedStatus = !c.isActive;
    // Optimistically update
    setCustomers((prev) =>
      prev.map((item) => (item.id === c.id ? { ...item, isActive: updatedStatus } : item))
    );

    try {
      const res = await fetch(`/api/admin/happy-customers/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      if (!res.ok) {
        // revert on failure
        fetchCustomers();
      }
    } catch (err) {
      console.error("Toggle error:", err);
      fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (districtFilter !== "All" && c.district !== districtFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Happy Customers Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage authentic customer delivery photos, city & district tags, and testimonials for the public gallery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer Photo</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400">Total Customer Stories</div>
          <div className="text-2xl font-black text-white mt-1">{customers.length}</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400">Active Public Stories</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {customers.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400">Districts Represented</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {new Set(customers.map((c) => c.district)).size}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, city, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="All">All Districts</option>
            {districtsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading customer stories...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="text-3xl">📸</div>
            <div className="text-sm font-bold text-white">No Happy Customer entries found</div>
            <p className="text-xs">Click "Add New Customer Photo" above to create your first entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Customer Photo</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Product Purchased</th>
                  <th className="p-4">Rating & Review</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img
                          src={c.photoUrl}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      {c.phone && (
                        <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                      {c.purchaseDate && (
                        <div className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{c.purchaseDate}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-amber-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{c.city}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {c.village ? `${c.village}, ` : ""}{c.district}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5 max-w-xs">
                        <Laptop className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{c.productName}</span>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                        {[...Array(c.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      {c.review && (
                        <div className="text-slate-400 text-[11px] truncate italic">
                          "{c.review}"
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-500 border border-slate-700"
                        }`}
                      >
                        {c.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{c.isActive ? "Active" : "Hidden"}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(c)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Permanently Delete Story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-slate-950 rounded-3xl border border-rose-500/30 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400 border-b border-slate-800 pb-3">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Permanently Delete Story?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Are you sure you want to delete the Happy Customer photo and story for{" "}
                <span className="font-bold text-white">{customerToDelete.name}</span> ({customerToDelete.city})?
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div>• This customer story will be permanently removed from the public website.</div>
                <div>• It will no longer appear in the customer gallery or homepage banner.</div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCustomerToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmPermanentDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  {editingCustomer ? "Edit Customer Story" : "Add Happy Customer Photo"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-bold">
                ⚠️ {error}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-bold">
                ✓ {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Patil"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Mobile Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {districtsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Jafrabad, Jalna"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Village / Locality</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Main Market, Temblai"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Product Purchased */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Product Purchased *</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Jijau Custom RTX 4080 Gaming Rig / Apple MacBook Air M3 / Dell Core i5 Laptop"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Customer Photo Upload (Local file or URL) */}
              <div className="space-y-2 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                <label className="font-bold text-white block">Customer Photo *</label>
                
                {/* 1. Direct Local File Upload Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingPhoto ? "Uploading Image..." : "📁 Choose Image from Computer / Phone"}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 text-center sm:text-left">
                    {formData.photoUrl ? "Image ready!" : "Or paste image URL below"}
                  </span>
                </div>

                {/* 2. Direct text / relative path input */}
                <div>
                  <input
                    type="text"
                    required
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="e.g. /uploads/products/xyz.png or https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>

                {formData.photoUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/50 shadow">
                      <img
                        src={formData.photoUrl}
                        alt="Customer Photo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">✓ Photo Selected</span>
                      <span className="text-[10px] text-slate-400 font-mono break-all line-clamp-1">{formData.photoUrl}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Review / Testimonial */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Customer Feedback / Review (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="e.g. Assembled my dream gaming PC with full brand warranty and same-day delivery in Jafrabad."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Rating & Purchase Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Purchase Date (Month & Year)</label>
                  <input
                    type="text"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    placeholder="e.g. Sep 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-800"
                />
                <label htmlFor="isActiveToggle" className="text-slate-300 font-bold cursor-pointer">
                  Display publicly on website (Homepage & Customer Gallery)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCustomer ? "Update Customer Story" : "Save Customer Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
