"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Tag,
  Check,
  ShieldCheck,
} from "lucide-react";

export default function CartDrawer() {
  const pathname = usePathname();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { settings } = useSettings();

  // Automatically close cart drawer whenever user navigates or route changes
  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname, setIsCartOpen]);

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setInputCoupon("");
  };

  // WhatsApp Order payload
  const itemsText = cart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatPrice(
          (item.product.salePrice ?? item.product.price) * item.quantity
        )}`
    )
    .join("\n");

  const whatsappOrderMsg = `*New Order Enquiry from Jijau Computers Website*\n\n*Cart Items:*\n${itemsText}\n\n*Subtotal:* ${formatPrice(
    subtotal
  )}${discount > 0 ? `\n*Discount (${couponCode}):* -${formatPrice(discount)}` : ""}\n*Estimated Total:* ${formatPrice(
    total
  )}\n\nPlease confirm availability and payment/delivery options.`;

  const whatsappCheckoutUrl = generateWhatsAppUrl(
    settings.whatsapp || "918805607908",
    whatsappOrderMsg
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base">Your Shopping Cart</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">Your cart is empty</h4>
              <p className="text-sm text-slate-500 mb-6">
                Explore our catalog of custom PCs, laptops, and computer components.
              </p>
              <Link
                href="/products"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                const img = item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&auto=format&fit=crop&q=80";

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200 p-1 flex items-center justify-center">
                      <img
                        src={img}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-blue-600">
                          {formatPrice(price)}
                        </span>
                        {item.product.salePrice && item.product.salePrice < item.product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:text-blue-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-600 hover:text-blue-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon Code Section */}
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                {couponCode ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon applied: {couponCode}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-500 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. JIJAUFIRST)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500 uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 font-medium ${
                      couponMsg.success ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Drawer Footer & Checkout Buttons */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-base text-blue-600">{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  *Inclusive of all GST taxes & warranty bill
                </p>
              </div>

              {/* Action 1: Standard Online Checkout Page */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Action 2: WhatsApp Instant Order Confirmation */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Instantly on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
