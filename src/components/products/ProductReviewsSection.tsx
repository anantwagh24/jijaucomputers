"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, ShieldCheck, MessageSquare, Send, ThumbsUp, Sparkles, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ReviewItem } from "@/lib/types";

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export default function ProductReviewsSection({
  productId,
  productName,
}: ProductReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<{
    totalReviews: number;
    averageRating: number;
    ratingCounts: Record<number, number>;
    ratingPercentages: Record<number, number>;
  }>({
    totalReviews: 0,
    averageRating: 5.0,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    ratingPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    hoverRating: 0,
    customerName: "",
    customerPhone: "",
    title: "",
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.error("Failed to fetch product reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerPhone: user.phone || prev.customerPhone,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.customerName.trim() || !formData.title.trim() || !formData.comment.trim()) {
      setErrorMsg("Please fill in your name, review headline, and comments.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          userId: user?.id || null,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(
          data.isVerifiedBuyer
            ? "Thank you! Your verified customer review has been posted successfully."
            : "Thank you! Your review has been submitted."
        );
        setFormData({
          rating: 5,
          hoverRating: 0,
          customerName: user?.name || "",
          customerPhone: user?.phone || "",
          title: "",
          comment: "",
        });
        setShowForm(false);
        fetchReviews();
      } else {
        setErrorMsg(data.error || "Failed to submit review. Please try again.");
      }
    } catch (e) {
      setErrorMsg("Network error submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  const RATING_LABELS: Record<number, string> = {
    5: "5 Stars - Exceptional & Highly Recommended",
    4: "4 Stars - Great Hardware & Value",
    3: "3 Stars - Good & Meets Expectations",
    2: "2 Stars - Needs Improvement",
    1: "1 Star - Unsatisfactory",
  };

  return (
    <section className="mt-16 pt-12 border-t border-slate-200" id="reviews-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            Customer Feedback & Performance Ratings
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Verified Customer Reviews</span>
            <span className="text-sm font-bold text-slate-500 font-mono">
              ({stats.totalReviews})
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 self-start md:self-auto cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Rating Breakdown & Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl mb-8">
        {/* Left: Big Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-800 space-y-2">
          <div className="text-5xl font-black text-amber-400 font-mono">
            {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : "5.0"}
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.totalReviews > 0 ? stats.averageRating : 5)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Based on {stats.totalReviews} verified {stats.totalReviews === 1 ? "review" : "reviews"}
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Genuine Tech Reviews</span>
          </div>
        </div>

        {/* Right: 5-Star Distribution Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingCounts[star] || 0;
            const pct = stats.ratingPercentages[star] || (stats.totalReviews === 0 && star === 5 ? 100 : 0);

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-300 font-bold flex items-center gap-1">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-slate-400 text-[11px]">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 text-xs text-slate-800 animate-in slide-in-from-top-4"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              Write a Review for {productName}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Share your hardware benchmarks, thermals, performance, or overall satisfaction.
            </p>
          </div>

          {errorMsg && (
            <p className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
              {errorMsg}
            </p>
          )}

          {/* Star Rating Selector */}
          <div>
            <label className="font-black text-slate-900 block mb-2">
              Select Your Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled =
                  (formData.hoverRating || formData.rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setFormData({ ...formData, hoverRating: star })}
                    onMouseLeave={() => setFormData({ ...formData, hoverRating: 0 })}
                    className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs font-bold text-amber-600">
                {RATING_LABELS[formData.hoverRating || formData.rating]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-black text-slate-900 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Rahul Patil"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="font-black text-slate-900 block mb-1">
                Phone Number (For Verified Buyer Check)
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                If you previously purchased this item, a "Verified Buyer ✓" badge will be attached.
              </span>
            </div>
          </div>

          <div>
            <label className="font-black text-slate-900 block mb-1">Review Headline / Summary *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Beast performance for 1440p gaming & Premiere Pro rendering!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="font-black text-slate-900 block mb-1">Detailed Review *</label>
            <textarea
              rows={4}
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Describe your user experience, build quality, thermals, packaging, or customer service from Jijau Computers Pune..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Posting Review..." : "Submit Review"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs font-semibold">
            Loading customer reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-blue-600" />
            </div>
            <h3 className="text-base font-black text-slate-900">Be the first to review this product!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Have you bought or tested this hardware? Share your honest feedback with fellow PC enthusiasts in Pune.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                    {rev.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{rev.customerName}</span>
                      {rev.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{rev.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
