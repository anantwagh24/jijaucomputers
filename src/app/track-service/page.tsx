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
      </main>

      <Footer />
    </div>
  );
}
