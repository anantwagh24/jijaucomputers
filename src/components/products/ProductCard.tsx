"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, calculateDiscount, generateWhatsAppUrl } from "@/lib/utils";
import {
  ShoppingCart,
  Heart,
  Eye,
  MessageCircle,
  Check,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
}) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();
  const [isAdded, setIsAdded] = useState(false);

  const price = product.salePrice ?? product.price;
  const originalPrice = product.price;
  const discount = calculateDiscount(originalPrice, product.salePrice ?? 0);
  const inWish = isInWishlist(product.id);

  const primaryImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const storeNumber = settings.whatsapp || "918805607908";
    const productUrl = `${window.location.origin}/products/${product.slug}`;
    const message = `*Inquiry about ${product.name}*\n\nPrice: ${formatPrice(
      price
    )}\nProduct Link: ${productUrl}\n\nHi Jijau Computers, is this available in stock? What is the best price offer?`;
    window.open(generateWhatsAppUrl(storeNumber, message), "_blank");
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* 1. BADGES */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discount > 0 && (
          <span className="tech-badge bg-rose-600 text-white shadow-sm">
            {discount}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="tech-badge bg-blue-600 text-white shadow-sm">
            FEATURED
          </span>
        )}
        {product.isGamingDeal && (
          <span className="tech-badge bg-amber-500 text-slate-950 font-bold shadow-sm">
            GAMING RIG
          </span>
        )}
      </div>

      {/* 2. WISHLIST & QUICK ACTIONS */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all ${
            inWish
              ? "bg-rose-50 text-rose-500 shadow-md"
              : "bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white shadow-sm"
          }`}
          title={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWish ? "fill-rose-500" : ""}`} />
        </button>

        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-blue-600 hover:bg-white shadow-sm transition-all"
            title="Quick preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. PRODUCT IMAGE */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square p-6 bg-slate-50/50 flex items-center justify-center overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* 4. DETAILS CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span>{product.brand?.name || "Jijau Certified"}</span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-600 truncate max-w-[120px]">
              {product.category?.name}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Specs / Highlights */}
          {product.shortDesc && (
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {product.shortDesc}
            </p>
          )}
        </div>

        {/* 5. PRICE & ACTIONS */}
        <div className="pt-3 mt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatPrice(price)}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            {/* WhatsApp 1-Click Enquiry */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-emerald-200"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
