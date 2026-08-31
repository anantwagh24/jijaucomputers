"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Copy, Check, Tag, Sparkles, Clock, ArrowRight } from "lucide-react";

interface OfferItem {
  id: string;
  title: string;
  badge?: string | null;
  description: string;
  bannerUrl?: string | null;
  discountPct?: number | null;
  couponCode?: string | null;
}

export default function OffersClient({ offers }: { offers: OfferItem[] }) {
  const { applyCoupon, setIsCartOpen } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="group relative flex flex-col justify-between bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Background image preview if available */}
          {offer.bannerUrl && (
            <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 border border-slate-100">
              <img
                src={offer.bannerUrl}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div>
            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="tech-badge bg-amber-500 text-slate-950 font-bold">
                {offer.badge || "LIMITED OFFER"}
              </span>
              {offer.discountPct && (
                <span className="text-xs font-black text-rose-600">
                  Up to {offer.discountPct}% OFF
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-slate-900 leading-snug mb-2">
              {offer.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {offer.description}
            </p>
          </div>

          {/* Coupon Code Action Box */}
          {offer.couponCode && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-dashed border-blue-400">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="font-mono font-black text-sm text-slate-900">
                    {offer.couponCode}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(offer.couponCode!)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                    copiedCode === offer.couponCode
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow"
                  }`}
                >
                  {copiedCode === offer.couponCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied & Applied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Apply Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
