"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import ProductCard from "@/components/products/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  Heart,
  Wrench,
  FileText,
  Clock,
  ShieldCheck,
  Package,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function AccountDashboardPage() {
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "repairs" | "quotes">("wishlist");
  const [orders, setOrders] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if query tab parameter exists
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam === "orders" || tabParam === "wishlist" || tabParam === "repairs" || tabParam === "quotes") {
        setActiveTab(tabParam);
      }
    }

    // Fetch recent orders
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(console.error);

    // Fetch recent repairs
    fetch("/api/service-requests")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRepairs(data);
      })
      .catch(console.error);

    // Fetch recent quotations
    fetch("/api/quotations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuotes(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {/* Top Profile Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">Customer Hub</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your saved hardware, order receipts, and service repair tickets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/track-service"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
            >
              Track Repair Ticket
            </Link>
            <Link
              href="/custom-pc"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition-colors"
            >
              PC Builder
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "wishlist"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("repairs")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "repairs"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Repair Tickets ({repairs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("quotes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "quotes"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotations ({quotes.length})</span>
          </button>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="text-xs text-slate-500 my-2">
                  Save your favorite laptops, graphics cards, and PC components here.
                </p>
                <Link
                  href="/products"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow inline-block mt-3"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {wishlist.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
                <p className="text-xs text-slate-500 my-2">
                  Your purchases and store receipts will appear here.
                </p>
                <Link
                  href="/products"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow inline-block mt-3"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="tech-badge bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                    <p className="text-xs text-slate-700">
                      Deliver to: <span className="font-semibold">{order.customerName}</span> ({order.city} - {order.pincode})
                    </p>
                  </div>

                  <div className="md:text-right flex flex-col justify-between">
                    <span className="text-lg font-black text-slate-900">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Mode: {order.paymentMode}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Repairs */}
        {activeTab === "repairs" && (
          <div className="space-y-4">
            {repairs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
                <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No active repair tickets</h3>
                <Link
                  href="/track-service"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow inline-block mt-3"
                >
                  Track or Book Repair
                </Link>
              </div>
            ) : (
              repairs.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {rep.ticketId}
                      </span>
                      <span className="tech-badge bg-emerald-100 text-emerald-800">
                        {rep.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {rep.brand} {rep.model} ({rep.deviceType})
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md">
                      Issue: {rep.issueDesc}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between md:text-right gap-2">
                    <Link
                      href={`/track-service`}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 text-center"
                    >
                      View Live Tracker
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Quotes */}
        {activeTab === "quotes" && (
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No quotation requests</h3>
                <Link
                  href="/quote-request"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow inline-block mt-3"
                >
                  Request Bulk Quote
                </Link>
              </div>
            ) : (
              quotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {q.quoteNumber}
                      </span>
                      <span className="tech-badge bg-amber-100 text-amber-800">
                        {q.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {q.type} - {q.customerName} {q.companyName ? `(${q.companyName})` : ""}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md">
                      {q.itemsSummary}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
