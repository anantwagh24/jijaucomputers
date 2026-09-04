"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Package,
} from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [starFilter, setStarFilter] = useState<number | 0>(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?all=true");
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !currentStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved: !currentStatus } : r))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this customer review?")) return;
    try {
      setActionLoading(id);
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics
  const totalCount = reviews.length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const verifiedCount = reviews.filter((r) => r.isVerifiedBuyer).length;
  const avgRating =
    totalCount > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
      : "5.0";

  // Filtering
  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      (r.product?.name && r.product.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "APPROVED" && r.isApproved) ||
      (statusFilter === "PENDING" && !r.isApproved);

    const matchesStar = starFilter === 0 || r.rating === starFilter;

    return matchesSearch && matchesStatus && matchesStar;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            <span>Product Reviews & Customer Ratings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Moderate verified buyer feedback, star ratings, and display genuine customer reviews.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Reviews</span>
          <span className="text-2xl font-black text-white mt-1">{totalCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Average Score
          </span>
          <span className="text-2xl font-black text-amber-300 mt-1 font-mono">
            {avgRating} <span className="text-xs text-amber-400/70 font-sans">/ 5.0</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Buyers
          </span>
          <span className="text-2xl font-black text-emerald-300 mt-1">{verifiedCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved Live
          </span>
          <span className="text-2xl font-black text-blue-300 mt-1">{approvedCount}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search reviews by customer name, product title, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-500 hover:text-slate-300 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status & Star Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "ALL"
                  ? "bg-white text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setStatusFilter("APPROVED")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "APPROVED"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "PENDING"
                  ? "bg-amber-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hidden ({totalCount - approvedCount})
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStarFilter(0)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                starFilter === 0 ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All Stars
            </button>
            {[5, 4, 3, 2, 1].map((st) => (
              <button
                key={st}
                onClick={() => setStarFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  starFilter === st
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>{st}</span>
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
            <p className="text-slate-400 text-xs">Loading customer reviews...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No reviews found</h3>
            <p className="text-xs text-slate-500">
              Customer reviews will appear here once submitted on product pages.
            </p>
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className={`bg-slate-950 rounded-3xl p-5 border transition-all text-xs space-y-3 shadow-xl ${
                rev.isApproved ? "border-slate-800 hover:border-slate-700" : "border-amber-500/30 bg-amber-950/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black text-xs">
                    {rev.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.customerName}</span>
                      {rev.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                      {!rev.isApproved && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {rev.customerPhone ? `Phone: ${rev.customerPhone} • ` : ""}
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                    <span className="ml-1 font-mono font-bold text-xs text-white">{rev.rating}.0</span>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                    disabled={actionLoading === rev.id}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                      rev.isApproved
                        ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                    }`}
                  >
                    {rev.isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{rev.isApproved ? "Hide" : "Approve"}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    disabled={actionLoading === rev.id}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Info & Review Content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                {rev.product && (
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
                    {rev.product.images?.[0]?.url ? (
                      <img
                        src={rev.product.images[0].url}
                        alt={rev.product.name}
                        className="w-10 h-10 object-contain rounded-lg bg-white p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Product:</span>
                      <Link
                        href={`/products/${rev.product.slug}`}
                        target="_blank"
                        className="text-white font-bold hover:text-blue-400 truncate block text-xs"
                      >
                        {rev.product.name}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="md:col-span-3 p-3 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
                  <h4 className="font-bold text-white text-xs">{rev.title}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
