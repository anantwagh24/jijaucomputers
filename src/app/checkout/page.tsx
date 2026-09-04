"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MessageSquare,
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  MapPin,
  QrCode,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart, subtotal, discount, couponCode } = useCart();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "Pune",
    pincode: "411005",
    notes: "",
    paymentMode: "UPI_WHATSAPP", // Default to Instant UPI for seamless Indian checkout
  });

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Auto-scroll to top when order is placed so customer immediately sees the success card
  useEffect(() => {
    if (placedOrder && typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [placedOrder]);

  const total = Math.max(0, subtotal - discount);

  const upiId = settings.upiId || "8805607908@ybl";
  const upiName = settings.upiName || "Jijau Computers";

  // Build standard UPI Intent URL
  const buildUpiUrl = (orderNum?: string) => {
    const note = orderNum ? `Order_${orderNum}` : "JijauComputers_Order";
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Specific App Intent URLs (Opens GPay, PhonePe, Paytm directly on mobile / tablets)
  const gpayUrl = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=JijauComputers`;
  const phonepeUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=JijauComputers`;
  const paytmUrl = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=JijauComputers`;
  const genericUpiUrl = buildUpiUrl();

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleLaunchUpi = (appUrl: string) => {
    // Fallback to standard UPI url if specific scheme is not supported
    try {
      window.location.href = appUrl;
      setTimeout(() => {
        // Fallback generic UPI intent
        window.location.href = genericUpiUrl;
      }, 500);
    } catch {
      window.location.href = genericUpiUrl;
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setLoading(true);
      const orderPayloadItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          notes: formData.notes,
          paymentMode: formData.paymentMode,
          subtotal,
          discount,
          tax: 0,
          total,
          items: orderPayloadItems,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const finalItems = (data.items && data.items.length > 0) ? data.items : orderPayloadItems;
        setOrderedItems(finalItems);
        setPlacedOrder(data);
        clearCart();

        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });

        // If user chose UPI, auto-trigger UPI intent on mobile
        if (formData.paymentMode === "UPI_WHATSAPP" && typeof window !== "undefined") {
          const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
          if (isMobile) {
            window.location.href = buildUpiUrl(data.orderNumber);
          }
        }
      }
    } catch (e) {
      console.error("Order placement failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppNotify = () => {
    if (!placedOrder) return;
    const storeNumber = settings.whatsapp || "918805607908";

    const itemsToDisplay =
      (placedOrder.items && placedOrder.items.length > 0)
        ? placedOrder.items
        : orderedItems;

    // Format products list
    const itemsList =
      itemsToDisplay && itemsToDisplay.length > 0
        ? itemsToDisplay
            .map(
              (i: any, idx: number) =>
                `${idx + 1}. *${i.name}* (Qty: ${i.quantity}) - ${formatPrice(
                  (i.price || 0) * (i.quantity || 1)
                )}`
            )
            .join("\n")
        : "1. Hardware & Components";

    const msg = `*Order Placed Online #${placedOrder.orderNumber}*

*Customer:* ${placedOrder.customerName}
*Phone:* ${placedOrder.phone}
*Address:* ${placedOrder.address}, ${placedOrder.city} - ${placedOrder.pincode}

*Ordered Products:*
${itemsList}

*Total Amount:* ${formatPrice(placedOrder.total)}
*Payment Method:* ${placedOrder.paymentMode}

Hi Jijau Computers team, I have placed this order on your website. Please share dispatch update!`;

    window.open(generateWhatsAppUrl(storeNumber, msg), "_blank");
  };

  if (placedOrder) {
    const orderUpiUrl = buildUpiUrl(placedOrder.orderNumber);
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderUpiUrl)}`;

    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Header />
        <WhatsAppFloating />

        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 text-center w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="tech-badge bg-emerald-100 text-emerald-800 mb-2">
                Order Placed Successfully
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Thank You for Choosing Jijau Computers!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-mono">
                Order Number: <span className="font-bold text-slate-900">{placedOrder.orderNumber}</span>
              </p>
            </div>

            {/* Instant UPI Payment Launchers & QR (If UPI Chosen) */}
            {placedOrder.paymentMode === "UPI_WHATSAPP" && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white border border-slate-800 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" />
                    <span>Instant UPI Payment ({formatPrice(placedOrder.total)})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Zero Extra Fee
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Tap below to launch your preferred UPI app directly on your phone, or scan the QR code:
                </p>

                {/* Direct App Launchers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleLaunchUpi(gpayUrl)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
                  >
                    <span>Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchUpi(phonepeUrl)}
                    className="py-2.5 px-3 rounded-xl bg-[#5f259f] hover:bg-[#4d1e82] text-white flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
                  >
                    <span>PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchUpi(paytmUrl)}
                    className="py-2.5 px-3 rounded-xl bg-[#002970] hover:bg-[#001f57] text-white flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
                  >
                    <span>Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchUpi(genericUpiUrl)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
                  >
                    <span>Any UPI App</span>
                  </button>
                </div>

                {/* QR Code & VPA ID Details */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 border-t border-slate-800">
                  <div className="bg-white p-2 rounded-xl border border-slate-700 shrink-0">
                    <img
                      src={qrCodeApiUrl}
                      alt="UPI QR Code"
                      className="w-28 h-28 object-contain"
                    />
                  </div>
                  <div className="text-xs space-y-1.5">
                    <span className="text-slate-400 block text-[11px]">Pay directly to Store UPI ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {upiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 block">Payee: {upiName}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">{placedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-bold text-slate-800">{placedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="text-slate-800 font-medium text-right max-w-[220px]">
                  {placedOrder.address}, {placedOrder.city} - {placedOrder.pincode}
                </span>
              </div>
              {(() => {
                const displayItems = (placedOrder.items && placedOrder.items.length > 0) ? placedOrder.items : orderedItems;
                if (!displayItems || displayItems.length === 0) return null;
                return (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block font-bold mb-1">Items Ordered ({displayItems.length}):</span>
                    <div className="space-y-1">
                      {displayItems.map((item: any) => (
                        <div key={item.id || item.name} className="flex justify-between text-[11px]">
                          <span className="text-slate-700 font-medium truncate max-w-[200px]" title={item.name}>
                            • {item.name}
                          </span>
                          <span className="text-slate-500 font-mono">
                            x{item.quantity} ({formatPrice((item.price || 0) * (item.quantity || 1))})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Total Amount:</span>
                <span className="font-black text-blue-600 text-sm">{formatPrice(placedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Option:</span>
                <span className="font-semibold text-slate-800">{placedOrder.paymentMode}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppNotify}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm Order on WhatsApp</span>
              </button>

              <Link
                href="/products"
                className="block w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">
          Checkout & Shipping
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Please add products to your cart before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Customer Information & Delivery Address */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  1. Contact & Shipping Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="e.g. Ramesh Shinde"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    placeholder="name@email.com"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Delivery Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    placeholder="Flat/House No., Building Name, Street / Landmark..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / Region</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Order Notes (Optional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    placeholder="Special instructions, delivery timings..."
                  />
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  2. Choose Payment Method
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Instant UPI Option */}
                  <label
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMode === "UPI_WHATSAPP"
                        ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-100"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="UPI_WHATSAPP"
                        checked={formData.paymentMode === "UPI_WHATSAPP"}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900 block text-sm">
                            Instant UPI App (GPay / PhonePe / Paytm / BHIM)
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <span className="text-slate-500 block mt-0.5">
                          Directly triggers Google Pay, PhonePe, or Paytm app on your phone.
                        </span>
                      </div>
                    </div>

                    {formData.paymentMode === "UPI_WHATSAPP" && (
                      <div className="mt-4 pt-3 border-t border-emerald-200/70 space-y-2 animate-in fade-in">
                        <span className="font-bold text-slate-700 block text-[11px]">
                          Quick Launch UPI App on Phone:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => handleLaunchUpi(gpayUrl)}
                            className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 flex items-center justify-center gap-1 shadow-sm"
                          >
                            <span>Google Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLaunchUpi(phonepeUrl)}
                            className="py-2 px-2.5 rounded-xl bg-[#5f259f] hover:bg-[#4d1e82] text-white flex items-center justify-center gap-1 shadow-sm"
                          >
                            <span>PhonePe</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLaunchUpi(paytmUrl)}
                            className="py-2 px-2.5 rounded-xl bg-[#002970] hover:bg-[#001f57] text-white flex items-center justify-center gap-1 shadow-sm"
                          >
                            <span>Paytm</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLaunchUpi(genericUpiUrl)}
                            className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-sm"
                          >
                            <span>Other UPI</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMode === "CASH_ON_DELIVERY"
                        ? "bg-blue-50/70 border-blue-600 ring-2 ring-blue-100"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={formData.paymentMode === "CASH_ON_DELIVERY"}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">Cash on Delivery / Store Pickup</span>
                      <span className="text-slate-500">Pay cash or scan QR when collecting items or upon delivery</span>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMode === "BANK_TRANSFER"
                        ? "bg-purple-50/70 border-purple-600 ring-2 ring-purple-100"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="BANK_TRANSFER"
                      checked={formData.paymentMode === "BANK_TRANSFER"}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">NEFT / RTGS / Corporate Bank Transfer</span>
                      <span className="text-slate-500">For companies & business accounts requiring GST invoice</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-base font-black text-slate-900">
                Order Review ({cart.length} items)
              </h3>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const price = item.product.salePrice ?? item.product.price;
                  return (
                    <div key={item.product.id} className="flex justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 line-clamp-1">{item.product.name}</span>
                        <span className="text-slate-400">Qty: {item.quantity} × {formatPrice(price)}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery in Pune</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <PackageCheck className="w-5 h-5" />
                <span>{loading ? "Placing Order..." : "Confirm & Place Order"}</span>
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 text-center">
                <p>🔒 100% Secure Checkout with Original GST Bill</p>
                <p>Direct Dealer Warranty Supported across India</p>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
