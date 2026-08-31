"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  CheckCircle2,
  Sparkles,
  Flame,
  Tv,
  Cpu,
  Layers,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    categoryId: "",
    brandId: "",
    price: "",
    salePrice: "",
    stock: "10",
    inStock: true,
    warranty: "1 Year Brand Warranty",
    shortDesc: "",
    description: "",
    imageUrl: "",
    images: [] as string[],
    specsJson: "",
    videoUrl: "",
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    isTrending: false,
    isGamingDeal: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      const [pData, cData, bData] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        brandRes.json(),
      ]);

      if (Array.isArray(pData)) setProducts(pData);
      if (Array.isArray(cData)) setCategories(cData);
      if (Array.isArray(bData)) setBrands(bData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [uploading, setUploading] = useState(false);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      sku: "",
      categoryId: categories[0]?.id || "",
      brandId: brands[0]?.id || "",
      price: "",
      salePrice: "",
      stock: "10",
      inStock: true,
      warranty: "1 Year Brand Warranty",
      shortDesc: "",
      description: "",
      imageUrl: "",
      images: [] as string[],
      specsJson: "",
      videoUrl: "",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
      isTrending: false,
      isGamingDeal: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    const existingImages = p.images && p.images.length > 0 
      ? p.images.map((img: any) => img.url) 
      : (p.imageUrl ? [p.imageUrl] : []);

    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku || "",
      categoryId: p.categoryId,
      brandId: p.brandId || "",
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : "",
      stock: String(p.stock),
      inStock: p.inStock,
      warranty: p.warranty || "1 Year Brand Warranty",
      shortDesc: p.shortDesc || "",
      description: p.description || "",
      imageUrl: existingImages[0] || "",
      images: existingImages,
      specsJson: p.specsJson || "",
      videoUrl: p.videoUrl || "",
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      isNewArrival: p.isNewArrival,
      isTrending: p.isTrending,
      isGamingDeal: p.isGamingDeal,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploading(true);
      const form = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        form.append("files", e.target.files[i]);
      }
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.urls && Array.isArray(data.urls)) {
        setFormData((prev: any) => {
          const updated = [...(prev.images || []), ...data.urls];
          return {
            ...prev,
            images: updated,
            imageUrl: prev.imageUrl || updated[0],
          };
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev: any) => {
      const updated = prev.images.filter((_: any, i: number) => i !== indexToRemove);
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || "",
      };
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allImages = formData.images && formData.images.length > 0
      ? formData.images
      : (formData.imageUrl ? [formData.imageUrl] : []);

    const payload = {
      ...formData,
      images: allImages,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchData();
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchData();
          setModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            Product Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your hardware inventory, pricing, specifications, and promotional badges.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by title, category, or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Sale Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const img = p.images?.[0]?.url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100&auto=format&fit=crop&q=80";

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-white line-clamp-1 block">
                              {p.name}
                            </span>
                            {p.sku && <span className="font-mono text-[10px] text-slate-400">SKU: {p.sku}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {p.category?.name}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {p.brand?.name || "—"}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-200">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {p.salePrice ? formatPrice(p.salePrice) : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.inStock ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        }`}>
                          {p.inStock ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Featured</span>}
                          {p.isBestseller && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400">Bestseller</span>}
                          {p.isGamingDeal && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400">Gaming</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-3xl w-full shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-black text-white">
                {editingId ? "Edit Product" : "Add New Hardware Product"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Brand</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select Brand (Optional)</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">SKU / Model Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. ROG-RTX4070TI-16G"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Original MRP Price (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 78500"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sale / Offer Price (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="e.g. 71990"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Product Images Section (Multi-Image & Local Upload Support) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 block text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Product Images Gallery (Local Folder & URLs)</span>
                  </label>
                  <span className="text-[10px] text-blue-400 font-mono">
                    {formData.images?.length || 0} image(s) attached
                  </span>
                </div>

                {/* Local File Upload Button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? "Uploading Images..." : "Upload from Device / Folder"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">or enter image URL below</span>
                </div>

                {/* Direct Image URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Paste external image URL (e.g. https://...)"
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.imageUrl && !formData.images?.includes(formData.imageUrl)) {
                        setFormData({
                          ...formData,
                          images: [...(formData.images || []), formData.imageUrl],
                        });
                      }
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                  >
                    Add URL
                  </button>
                </div>

                {/* Attached Images Thumbnail Grid */}
                {formData.images && formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-800/80">
                    {formData.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className={`group relative w-16 h-16 rounded-xl bg-slate-950 border p-1 flex items-center justify-center overflow-hidden ${
                          idx === 0 ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-800"
                        }`}
                      >
                        <img src={img} alt={`Product ${idx}`} className="max-h-full max-w-full object-contain" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[8px] font-bold text-center py-0.5">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1 flex items-center justify-between">
                  <span>Product Video URL (YouTube / Instagram Reel)</span>
                  <span className="text-[10px] text-rose-400 font-mono font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://instagram.com/reel/..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Short Description / Bullet Highlights</label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="e.g. 16GB GDDR6X, DLSS 3.5, 2655 MHz Boost Clock, Triple Fan Design"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Complete product details, warranty coverage, packaging contents..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Specifications (JSON format)</label>
                <textarea
                  rows={3}
                  value={formData.specsJson}
                  onChange={(e) => setFormData({ ...formData, specsJson: e.target.value })}
                  placeholder='{"Processor": "Intel i7", "RAM": "16GB DDR5", "GPU": "RTX 4070"}'
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 font-mono outline-none focus:border-blue-500"
                />
              </div>

              {/* Promotional Flags */}
              <div className="pt-2">
                <span className="font-bold text-slate-300 block mb-2">Display Badges & Sections</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span className="text-slate-300 font-semibold">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    />
                    <span className="text-slate-300 font-semibold">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isGamingDeal}
                      onChange={(e) => setFormData({ ...formData, isGamingDeal: e.target.checked })}
                    />
                    <span className="text-slate-300 font-semibold">Gaming Deal</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <span className="text-emerald-400 font-semibold">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow transition-colors"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
