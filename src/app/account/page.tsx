"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import ProductCard from "@/components/products/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  Heart,
  FileText,
  Package,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Lock,
  Printer,
  Download,
} from "lucide-react";
import GstInvoiceModal from "@/components/invoice/GstInvoiceModal";

export default function AccountDashboardPage() {
  const { user, logout, openAuthModal } = useAuth();
  const { wishlist } = useWishlist();

  const [activeHub, setActiveHub] = useState<"orders" | "quotes" | "wishlist">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

  useEffect(() => {
    // Check if query tab parameter exists
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam === "orders" || tabParam === "wishlist" || tabParam === "quotes") {
        setActiveHub(tabParam);
      }
    }

    // Fetch orders
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // If user logged in, match by email or phone or show user orders
          if (user) {
            const userOrders = data.filter(
              (o) =>
                (user.email && o.email?.toLowerCase() === user.email.toLowerCase()) ||
                (user.phone && o.phone?.replace(/\D/g, "").includes(user.phone.replace(/\D/g, "")))
            );
            setOrders(userOrders.length > 0 ? userOrders : data.slice(0, 5));
          } else {
            setOrders(data.slice(0, 5));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch quotations
    fetch("/api/quotations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuotes(data);
      })
      .catch(console.error);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c16] text-white">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
        {/* Not Logged In Prompt Banner */}
        {!user ? (
          <div className="rounded-3xl bg-gradient-to-br from-[#111728] to-[#0c101d] border border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Lock className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Sign In to Your Account</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Log in via Mobile Number or Email to view your active orders, instant GST estimates, and saved hardware wishlist.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          /* Profile Banner (Matching Micron Screenshot 3) */
          <div className="rounded-3xl bg-gradient-to-r from-[#12192c] via-[#0e1424] to-[#12192c] border border-slate-800/90 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-5">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-lg shadow-purple-600/20">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#161f36] rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                  {user.isVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-[9px] uppercase tracking-wider">
                      VERIFIED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {user.email} • +91 {user.phone}
                </p>
              </div>
            </div>

            {/* Log Out Button */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-bold transition-all self-start md:self-center"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* 3 Quick Action Hub Cards (Matching Micron Screenshot 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: My Orders */}
          <div
            onClick={() => setActiveHub("orders")}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
              activeHub === "orders"
                ? "bg-[#141d33] border-purple-500/60 shadow-lg shadow-purple-950/40"
                : "bg-[#0d1424] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">My Orders</h3>
                <p className="text-xs text-slate-400 mt-0.5">{orders.length} orders placed</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 2: My Quotations */}
          <div
            onClick={() => setActiveHub("quotes")}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
              activeHub === "quotes"
                ? "bg-[#141d33] border-purple-500/60 shadow-lg shadow-purple-950/40"
                : "bg-[#0d1424] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">My Quotations</h3>
                <p className="text-xs text-slate-400 mt-0.5">{quotes.length} saved GST estimates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 3: My Wishlist */}
          <div
            onClick={() => setActiveHub("wishlist")}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
              activeHub === "wishlist"
                ? "bg-[#141d33] border-purple-500/60 shadow-lg shadow-purple-950/40"
                : "bg-[#0d1424] border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">My Wishlist</h3>
                <p className="text-xs text-slate-400 mt-0.5">{wishlist.length} saved items</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Recent Orders Section (Matching Micron Screenshot 3) */}
        {activeHub === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Recent Orders</h2>
                  <p className="text-xs text-slate-400">
                    Track shipments, download invoices, and reorder
                  </p>
                </div>
              </div>

              <Link
                href="/products"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>View Full Catalog Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              /* Empty State (Matching Micron Screenshot 3) */
              <div className="rounded-3xl bg-gradient-to-b from-[#0e1424] to-[#0a0f1b] border border-slate-800/80 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">No orders placed yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Discover gaming laptops, processors, GPUs, and custom PC peripherals.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                >
                  <span>Browse Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              /* Orders List */
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-purple-400 font-bold text-xs">{ord.orderNumber}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-black text-[10px] uppercase">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} • Mode: {ord.paymentMode}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-emerald-400">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>

                    {ord.items && ord.items.length > 0 && (
                      <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                        {ord.items.map((item: any) => (
                          <div key={item.id || item.name} className="flex justify-between text-xs text-slate-300">
                            <span>• {item.name}</span>
                            <span className="text-slate-400 font-mono">
                              Qty: {item.quantity} ({formatPrice(item.price * item.quantity)})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Order Action Row: GST Invoice & Live Tracking */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForInvoice(ord)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Save GST Invoice</span>
                      </button>

                      <Link
                        href={`/track-service?q=${encodeURIComponent(ord.orderNumber)}`}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Section */}
        {activeHub === "wishlist" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Saved Wishlist ({wishlist.length} items)</span>
            </h2>

            {wishlist.length === 0 ? (
              <div className="rounded-3xl bg-[#0e1424] border border-slate-800 p-12 text-center space-y-4">
                <Heart className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-black text-white">Your wishlist is empty</h3>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {wishlist.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotations Section */}
        {activeHub === "quotes" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>GST Estimates & Quotations ({quotes.length})</span>
            </h2>

            {quotes.length === 0 ? (
              <div className="rounded-3xl bg-[#0e1424] border border-slate-800 p-12 text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-black text-white">No saved quotations yet</h3>
                <Link
                  href="/quote-request"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase"
                >
                  Generate Bulk Quote
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-[#0d1424] border border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-mono text-purple-400 font-bold text-xs">{q.quoteNumber}</span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{q.customerName}</h4>
                      <p className="text-xs text-slate-400">{q.itemsSummary}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] uppercase">
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GST Tax Invoice Modal */}
        <GstInvoiceModal
          isOpen={Boolean(selectedOrderForInvoice)}
          onClose={() => setSelectedOrderForInvoice(null)}
          order={selectedOrderForInvoice}
        />
      </main>

      <Footer />
    </div>
  );
}
