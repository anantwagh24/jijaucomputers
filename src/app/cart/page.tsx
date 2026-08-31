"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { settings } = useSettings();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setInputCoupon("");
  };

  const handleWhatsAppOrder = () => {
    const storeNumber = settings.whatsapp || "918805607908";
    const itemsText = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatPrice(
            (item.product.salePrice ?? item.product.price) * item.quantity
          )}`
      )
      .join("\n");

    const message = `*Cart Order Inquiry from Jijau Computers*\n\n${itemsText}\n\n*Subtotal:* ${formatPrice(
      subtotal
    )}${discount > 0 ? `\n*Coupon (${couponCode}):* -${formatPrice(discount)}` : ""}\n*Total:* ${formatPrice(
      total
    )}\n\nPlease let me know if these are ready for pickup/delivery!`;

    window.open(generateWhatsAppUrl(storeNumber, message), "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">
          Shopping Cart ({cart.length} items)
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Your shopping cart is empty
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Looks like you haven't added any products or custom PC parts yet.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors inline-block"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Product Details
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {cart.map((item) => {
                  const price = item.product.salePrice ?? item.product.price;
                  const itemTotal = price * item.quantity;
                  const img =
                    item.product.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80";

                  return (
                    <div
                      key={item.product.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={img}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {formatPrice(price)} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity modifier and price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-slate-600 hover:text-blue-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-slate-600 hover:text-blue-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-black text-slate-900 w-24 text-right">
                          {formatPrice(itemTotal)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Order Summary Box */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900">
                Order Summary
              </h3>

              {/* Coupon Code Field */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                {couponCode ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <Tag className="w-4 h-4" />
                      Coupon {couponCode} active
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-blue-600 uppercase font-semibold bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 font-semibold ${
                      couponMsg.success ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Taxes</span>
                  <span className="text-slate-500">Included (18% / 28%)</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Final Total</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>

              {/* Reassurances */}
              <div className="space-y-2 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Authorized Tax Invoice with Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Same-Day Pune Store Pickup / Express Courier</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
