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
    const message = `*Order / Buy on WhatsApp*\n\nProduct: *${product.name}*\nPrice: *${formatPrice(
      price
    )}*\nLink: ${productUrl}\n\nHi Jijau Computers (+91 ${settings.whatsapp || "8805607908"}), I want to buy this product. Please share payment and delivery details!`;
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

            {/* Buy on WhatsApp */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full py-2 px-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              title={`Buy directly on WhatsApp from Jijau Computers (+91 ${settings.whatsapp || "8805607908"})`}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.07-2.125-.522-1.829-.759-3.003-2.628-3.094-2.75-.09-.12-0.749-.998-.749-1.905 0-.907.474-1.353.643-1.537.17-.184.372-.23.496-.23.125 0 .25.002.359.006.115.006.27-.044.422.321.157.38.536 1.309.584 1.405.048.096.08.209.016.337-.064.128-.096.208-.192.32-.096.112-.204.25-.291.336-.098.096-.2.201-.086.397.114.195.508.839 1.09 1.357.75.669 1.383.876 1.579.972.196.096.312.08.428-.052.116-.133.496-.578.628-.777.133-.2.266-.167.449-.099.183.068 1.164.549 1.365.65.201.101.335.151.384.234.049.083.049.48-.095.885z" />
              </svg>
              <span className="truncate">Buy on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
