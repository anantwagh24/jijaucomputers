"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  Wrench,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ShieldCheck,
  Laptop,
  Check,
  ChevronRight,
  PlusCircle,
  PhoneCall,
  Calendar,
  ShoppingBag,
  Cpu,
  FileText,
  Package,
  MapPin,
  RefreshCw,
  Printer,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import GstInvoiceModal from "@/components/invoice/GstInvoiceModal";

export default function UniversalTrackerPage() {
  const { settings } = useSettings();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Results state
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "repairs" | "customPc" | "quotes">("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [customPcRequests, setCustomPcRequests] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<{
    order?: any;
    service?: any;
  } | null>(null);

  // New Service Request Modal State
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newReqSubmitting, setNewReqSubmitting] = useState(false);
  const [newReqSuccess, setNewReqSuccess] = useState<any | null>(null);
  const [newReqError, setNewReqError] = useState("");
  const [newReqForm, setNewReqForm] = useState({
    customerName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    deviceType: "Laptop",
    brand: "Dell",
    model: "",
    serialNo: "",
    issueDesc: "",
  });

  // Pre-fill user data if auth loads
  useEffect(() => {
    if (user) {
      setNewReqForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Auto-search if user is logged in
  useEffect(() => {
    if (user && user.phone) {
      setSearchQuery(user.phone);
      performSearch(user.phone);
    }
  }, [user]);

  const performSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setHasSearched(true);

      const res = await fetch(`/api/track?query=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
        setServiceRequests(data.serviceRequests || []);
        setCustomPcRequests(data.customPcRequests || []);
        setQuotations(data.quotations || []);

        if (data.totalCount === 0) {
          setErrorMsg(`No active orders, repair tickets, or requests found for "${q}". Please check the phone number or reference ID.`);
        }
      } else {
        setErrorMsg(data.error || "Failed to retrieve tracking details.");
      }
    } catch (err: any) {
      setErrorMsg("Unable to connect to tracking server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewReqError("");

    const rawDigits = newReqForm.phone.replace(/\D/g, "");
    const cleanPhone = rawDigits.length === 11 && rawDigits.startsWith("0") 
      ? rawDigits.slice(1) 
      : (rawDigits.length > 10 ? rawDigits.slice(-10) : rawDigits);

    if (!cleanPhone || cleanPhone.length < 10) {
      setNewReqError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setNewReqSubmitting(true);
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReqForm,
          phone: cleanPhone,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.id) {
        setNewReqSuccess(data);
        // Refresh and search for this newly created ticket
        setSearchQuery(cleanPhone);
        performSearch(cleanPhone);
      } else {
        setNewReqError(data?.error || "Failed to submit repair request. Please try again.");
      }
    } catch (err: any) {
      setNewReqError(err?.message || "Network connection error. Please try again.");
    } finally {
      setNewReqSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const totalResults = orders.length + serviceRequests.length + customPcRequests.length + quotations.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unified Order & Service Tracker</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Track Orders, Repairs & Custom PC Builds
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Enter your registered 10-digit mobile number, Order #, or Ticket ID to check real-time dispatch status, diagnostics updates, and invoices in one place.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setNewReqSuccess(null);
                setNewReqError("");
                setIsNewRequestOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Wrench className="w-4 h-4" />
              <span>+ Book a Repair / Check-in Device</span>
            </button>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Enter 10-Digit Mobile, Order # (JC-ORD-...), or Ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Everything</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Click Search Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Quick Demo:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("9876543210");
                  performSearch("9876543210");
                }}
                className="font-mono text-blue-600 font-bold hover:underline"
              >
                9876543210
              </button>
              <span>or</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("8805607908");
                  performSearch("8805607908");
                }}
                className="font-mono text-blue-600 font-bold hover:underline"
              >
                8805607908
              </button>
            </div>
            <a
              href="/custom-pc"
              className="text-amber-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>+ Custom PC Quote</span>
            </a>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Search Results Display */}
        {hasSearched && totalResults > 0 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Category Filter Tabs */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-slate-900 text-white shadow"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                All Activity ({totalResults})
              </button>
              {orders.length > 0 && (
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "orders"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders ({orders.length})</span>
                </button>
              )}
              {serviceRequests.length > 0 && (
                <button
                  onClick={() => setActiveTab("repairs")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "repairs"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Repairs ({serviceRequests.length})</span>
                </button>
              )}
              {customPcRequests.length > 0 && (
                <button
                  onClick={() => setActiveTab("customPc")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "customPc"
                      ? "bg-amber-600 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Custom PCs ({customPcRequests.length})</span>
                </button>
              )}
              {quotations.length > 0 && (
                <button
                  onClick={() => setActiveTab("quotes")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "quotes"
                      ? "bg-purple-600 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Quotes ({quotations.length})</span>
                </button>
              )}
            </div>

            {/* Results Grid / List */}
            <div className="space-y-6">
              {/* 1. ORDERS SECTION */}
              {(activeTab === "all" || activeTab === "orders") && orders.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span>Store Orders ({orders.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Order ID</span>
                            <span className="font-black text-slate-900 text-base font-mono">{ord.orderNumber}</span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "CANCELLED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        {/* Order Timeline Visualizer */}
                        <div className="pt-2 pb-1">
                          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                            <div className="space-y-1">
                              <div className="h-1.5 rounded-full bg-blue-600" />
                              <span className="text-blue-600">Placed</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`h-1.5 rounded-full ${ord.status !== "PENDING" ? "bg-blue-600" : "bg-slate-200"}`} />
                              <span className={ord.status !== "PENDING" ? "text-blue-600" : "text-slate-400"}>Confirmed</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`h-1.5 rounded-full ${ord.status === "DISPATCHED" || ord.status === "DELIVERED" ? "bg-blue-600" : "bg-slate-200"}`} />
                              <span className={ord.status === "DISPATCHED" || ord.status === "DELIVERED" ? "text-blue-600" : "text-slate-400"}>Dispatched</span>
                            </div>
                            <div className="space-y-1">
                              <div className={`h-1.5 rounded-full ${ord.status === "DELIVERED" ? "bg-emerald-600" : "bg-slate-200"}`} />
                              <span className={ord.status === "DELIVERED" ? "text-emerald-600 font-bold" : "text-slate-400"}>Delivered</span>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                          {ord.items && ord.items.map((it: any) => (
                            <div key={it.id} className="flex justify-between items-center text-slate-700">
                              <span className="font-semibold line-clamp-1">{it.name} (x{it.quantity})</span>
                              <span className="font-mono text-slate-900 font-bold">{formatPrice(it.price * it.quantity)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                            <span>Total Payable:</span>
                            <span className="text-blue-600">{formatPrice(ord.total)}</span>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="text-xs text-slate-500 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{ord.address}, {ord.city} - {ord.pincode}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceData({ order: ord })}
                            className="flex-1 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200/80"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>GST Invoice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const storeNo = settings.whatsapp || "918805607908";
                              const msg = `Hi Jijau Computers, I am tracking my order #${ord.orderNumber}. Please share the current dispatch status!`;
                              window.open(generateWhatsAppUrl(storeNo, msg), "_blank");
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200/80"
                          >
                            <span>WhatsApp Support</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. REPAIR TICKETS SECTION */}
              {(activeTab === "all" || activeTab === "repairs") && serviceRequests.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Repair & Service Tickets ({serviceRequests.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceRequests.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Ticket No.</span>
                            <span className="font-black text-slate-900 text-base font-mono">{srv.ticketId}</span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              srv.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : srv.status === "Ready for Delivery"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {srv.status}
                          </span>
                        </div>

                        {/* Device Info */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Device:</span>
                            <span className="font-bold text-slate-900">{srv.brand} {srv.model} ({srv.deviceType})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Reported Issue:</span>
                            <span className="font-semibold text-slate-800">{srv.issueDesc}</span>
                          </div>
                          {srv.estimatedCost && (
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-emerald-700 font-bold">
                              <span>Estimated Cost:</span>
                              <span>{formatPrice(srv.estimatedCost)}</span>
                            </div>
                          )}
                        </div>

                        {/* Admin Notes */}
                        {srv.adminNotes && (
                          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                            <span className="font-bold block text-[10px] uppercase text-blue-600 tracking-wider">
                              Technician Update
                            </span>
                            <p>{srv.adminNotes}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceData({ service: srv })}
                            className="flex-1 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200/80"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>GST Service Bill</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const storeNo = settings.whatsapp || "918805607908";
                              const msg = `Hi Jijau Computers, I am tracking my repair ticket #${srv.ticketId} for ${srv.brand} ${srv.model}. Please share repair progress!`;
                              window.open(generateWhatsAppUrl(storeNo, msg), "_blank");
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <span>WhatsApp Support</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. CUSTOM PC REQUESTS SECTION */}
              {(activeTab === "all" || activeTab === "customPc") && customPcRequests.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-600" />
                    <span>Custom PC Build Quotes ({customPcRequests.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customPcRequests.map((pc) => (
                      <div
                        key={pc.id}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-amber-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Rig Purpose</span>
                            <span className="font-black text-slate-900 text-base">{pc.purpose} Gaming PC</span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            {pc.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Budget:</span>
                            <span className="font-mono font-bold text-slate-900">{pc.budget}</span>
                          </div>
                          {pc.cpuPref && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">CPU Preference:</span>
                              <span className="font-semibold text-slate-800">{pc.cpuPref}</span>
                            </div>
                          )}
                          {pc.gpuPref && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">GPU Preference:</span>
                              <span className="font-semibold text-slate-800">{pc.gpuPref}</span>
                            </div>
                          )}
                          {pc.totalEst && (
                            <div className="flex justify-between pt-1 border-t border-slate-200 text-blue-600 font-bold">
                              <span>Estimated Total:</span>
                              <span>{formatPrice(pc.totalEst)}</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const storeNo = settings.whatsapp || "918805607908";
                            const msg = `Hi Jijau Computers, I would like an update on my Custom PC Rig request (${pc.purpose}, budget ${pc.budget}).`;
                            window.open(generateWhatsAppUrl(storeNo, msg), "_blank");
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <span>Chat with PC Architect on WhatsApp</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. QUOTATIONS SECTION */}
              {(activeTab === "all" || activeTab === "quotes") && quotations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>B2B Quotations ({quotations.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quotations.map((qte) => (
                      <div
                        key={qte.id}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Quote No.</span>
                            <span className="font-black text-slate-900 text-base font-mono">{qte.quoteNumber}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                            {qte.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                          <p className="text-slate-700 font-medium">Type: {qte.type}</p>
                          <p className="text-slate-500 line-clamp-2">{qte.itemsSummary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GST Tax Invoice Modal */}
        <GstInvoiceModal
          isOpen={Boolean(selectedInvoiceData)}
          onClose={() => setSelectedInvoiceData(null)}
          order={selectedInvoiceData?.order}
          service={selectedInvoiceData?.service}
        />

        {/* Book a Repair / Service Request Modal */}
        {isNewRequestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Book Repair / Check-in Device</h3>
                    <p className="text-xs text-slate-500">Jijau Computers Hardware Diagnostics & Service</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {newReqSuccess ? (
                <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      TICKET RAISED SUCCESSFULLY
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 mt-2">
                      Ticket #{newReqSuccess.ticketId}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Your repair request for <strong>{newReqSuccess.brand} {newReqSuccess.model}</strong> has been logged. You can track real-time progress using your phone number <strong>{newReqSuccess.phone}</strong>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const storeNumber = settings.whatsapp || "918805607908";
                        const msg = `*New Hardware Repair Ticket #${newReqSuccess.ticketId}*\n\n*Customer:* ${newReqSuccess.customerName}\n*Phone:* ${newReqSuccess.phone}\n*Device:* ${newReqSuccess.brand} ${newReqSuccess.model} (${newReqSuccess.deviceType})\n*Issue:* ${newReqSuccess.issueDesc}\n\nHi Jijau Computers team, I have registered my device for repair. Please confirm intake!`;
                        window.open(generateWhatsAppUrl(storeNumber, msg), "_blank");
                      }}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Details on WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsNewRequestOpen(false)}
                      className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      <span>View in Tracker</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateServiceRequest} className="space-y-4">
                  {newReqError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                      ⚠️ {newReqError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Shinde"
                        value={newReqForm.customerName}
                        onChange={(e) => setNewReqForm({ ...newReqForm, customerName: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={newReqForm.phone}
                        onChange={(e) => setNewReqForm({ ...newReqForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={newReqForm.email}
                      onChange={(e) => setNewReqForm({ ...newReqForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Device Category *</label>
                      <select
                        value={newReqForm.deviceType}
                        onChange={(e) => setNewReqForm({ ...newReqForm, deviceType: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600 bg-white"
                      >
                        <option value="Laptop">Laptop (Windows / Linux)</option>
                        <option value="MacBook / Apple Mac">Apple MacBook / iMac</option>
                        <option value="Desktop / Custom PC">Desktop / Gaming PC</option>
                        <option value="Printer / Scanner">Printer / Scanner</option>
                        <option value="CCTV System / DVR">CCTV Camera / DVR</option>
                        <option value="GPU / Graphics Card">GPU / Graphics Card</option>
                        <option value="Motherboard / Component">Motherboard / Hardware Part</option>
                        <option value="Other">Other Electronic Device</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Brand / Make *</label>
                      <select
                        value={newReqForm.brand}
                        onChange={(e) => setNewReqForm({ ...newReqForm, brand: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600 bg-white"
                      >
                        <option value="Dell">Dell</option>
                        <option value="HP">HP</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Apple">Apple</option>
                        <option value="ASUS">ASUS</option>
                        <option value="Acer">Acer</option>
                        <option value="MSI">MSI</option>
                        <option value="Epson">Epson</option>
                        <option value="Canon">Canon</option>
                        <option value="Hikvision">Hikvision (CCTV)</option>
                        <option value="CP PLUS">CP PLUS (CCTV)</option>
                        <option value="Other">Other Brand</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Model Name / Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Inspiron 15 3520 / ROG Strix"
                        value={newReqForm.model}
                        onChange={(e) => setNewReqForm({ ...newReqForm, model: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Serial Number / Service Tag (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 7XG9B42"
                        value={newReqForm.serialNo}
                        onChange={(e) => setNewReqForm({ ...newReqForm, serialNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold text-slate-700 block mb-1">Issue / Problem Description *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the issue (e.g. Not turning on, screen flickering, heating issue, liquid spill, Windows corrupted...)"
                      value={newReqForm.issueDesc}
                      onChange={(e) => setNewReqForm({ ...newReqForm, issueDesc: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsNewRequestOpen(false)}
                      className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={newReqSubmitting}
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>{newReqSubmitting ? "Creating Ticket..." : "Submit Repair Request"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
