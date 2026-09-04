"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, calculateDiscount, generateWhatsAppUrl } from "@/lib/utils";
import {
  X,
  ShoppingCart,
  Heart,
  MessageCircle,
  Check,
  ShieldCheck,
  Truck,
  ExternalLink,
} from "lucide-react";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductItem | null;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const price = product.salePrice ?? product.price;
  const originalPrice = product.price;
  const discount = calculateDiscount(originalPrice, product.salePrice ?? 0);
  const images = product.images?.length
    ? product.images
    : [{ id: "1", url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80", isPrimary: true, order: 0 }];

  let parsedSpecs: Record<string, string> = {};
  if (product.specsJson) {
    try {
      parsedSpecs = JSON.parse(product.specsJson);
    } catch (e) {
      console.error(e);
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsApp = () => {
    const storeNumber = settings.whatsapp || "918805607908";
    const productUrl = `${window.location.origin}/products/${product.slug}`;
    const message = `*Quick Inquiry for ${product.name}*\nPrice: ${formatPrice(price)}\nLink: ${productUrl}\n\nHi Jijau Computers team, please share best quote and availability.`;
    window.open(generateWhatsAppUrl(storeNumber, message), "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Thumbnails */}
          <div className="p-6 bg-slate-50 flex flex-col items-center justify-center border-r border-slate-100">
            <div className="w-full aspect-square relative p-4 flex items-center justify-center">
              <img
                src={images[selectedImgIndex]?.url || images[0].url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setSelectedImgIndex(i)}
                    className={`w-14 h-14 rounded-lg bg-white border-2 p-1 overflow-hidden transition-all ${
                      selectedImgIndex === i ? "border-blue-600" : "border-slate-200"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Action */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600">
                <span>{product.brand?.name || "Official"}</span>
                <span>•</span>
                <span>{product.category?.name}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {product.name}
              </h3>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(price)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="tech-badge bg-rose-600 text-white">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Key Specs */}
              {Object.keys(parsedSpecs).length > 0 ? (
                <div className="my-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto">
                  {Object.entries(parsedSpecs).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="font-semibold text-slate-700 shrink-0">{k}:</span>
                      <span className="text-slate-600 text-right truncate">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600 my-3 line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Stock and Warranty */}
              <div className="space-y-1 text-xs text-slate-600 my-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>{product.inStock ? "In Stock & Ready for Dispatch" : "Out of Stock"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{product.warranty || "1 Year Genuine Brand Warranty"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Buy on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.07-2.125-.522-1.829-.759-3.003-2.628-3.094-2.75-.09-.12-0.749-.998-.749-1.905 0-.907.474-1.353.643-1.537.17-.184.372-.23.496-.23.125 0 .25.002.359.006.115.006.27-.044.422.321.157.38.536 1.309.584 1.405.048.096.08.209.016.337-.064.128-.096.208-.192.32-.096.112-.204.25-.291.336-.098.096-.2.201-.086.397.114.195.508.839 1.09 1.357.75.669 1.383.876 1.579.972.196.096.312.08.428-.052.116-.133.496-.578.628-.777.133-.2.266-.167.449-.099.183.068 1.164.549 1.365.65.201.101.335.151.384.234.049.083.049.48-.095.885z" />
                  </svg>
                  <span>Buy on WhatsApp</span>
                </button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Full Technical Specifications & Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
