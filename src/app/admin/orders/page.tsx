"use client";

import React, { useState, useEffect } from "react";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  ShoppingBag,
  CheckCircle2,
  Truck,
  Clock,
  MessageSquare,
  Search,
  Sparkles,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Send,
  Check,
  Package,
  FileText,
  Printer,
  RefreshCw,
} from "lucide-react";
import GstInvoiceModal from "@/components/invoice/GstInvoiceModal";

// Color mappings and prefilled WhatsApp templates for each status
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeClass: string;
    selectClass: string;
    dotColor: string;
    icon: any;
    getWaMessage: (order: any) => string;
  }
> = {
  PENDING: {
    label: "PENDING",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/30",
    badgeClass: "bg-amber-500/15 text-amber-300 border border-amber-500/40",
    selectClass: "border-amber-500/50 text-amber-300 focus:ring-amber-500",
    dotColor: "bg-amber-400",
    icon: Clock,
    getWaMessage: (ord) =>
      `Hello *${ord.customerName}*,\n\nYour order *#${ord.orderNumber}* for *${formatPrice(
        ord.total
      )}* has been received at *Jijau Computers Pune* and is currently *PENDING* verification.\n\n📦 *Items:* ${ord.items
        ?.map((i: any) => `${i.name} (Qty: ${i.quantity})`)
        .join(", ")}\n\n🔍 *Live Tracking:* https://jijaucomputers.in/track-service?q=${encodeURIComponent(ord.orderNumber)}\n\nThank you for choosing Jijau Computers!`,
  },
  CONFIRMED: {
    label: "CONFIRMED",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
    badgeClass: "bg-blue-500/15 text-blue-300 border border-blue-500/40",
    selectClass: "border-blue-500/50 text-blue-300 focus:ring-blue-500",
    dotColor: "bg-blue-400",
    icon: CheckCircle2,
    getWaMessage: (ord) =>
      `Hello *${ord.customerName}*,\n\nGreat news! Your order *#${ord.orderNumber}* has been *CONFIRMED* by *Jijau Computers Pune*.\n\n📦 *Ordered Items:* ${ord.items
        ?.map((i: any) => `${i.name} (x${i.quantity})`)
        .join(", ")}\n💰 *Total Amount:* ${formatPrice(ord.total)} (${ord.paymentMode})\n📍 *Delivery To:* ${ord.address}, ${ord.city} - ${ord.pincode}\n\n🔍 *Live Tracking:* https://jijaucomputers.in/track-service?q=${encodeURIComponent(ord.orderNumber)}\n\nOur team is currently preparing and testing your hardware. Thank you!`,
  },
  PROCESSING: {
    label: "PROCESSING",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/30",
    badgeClass: "bg-purple-500/15 text-purple-300 border border-purple-500/40",
    selectClass: "border-purple-500/50 text-purple-300 focus:ring-purple-500",
    dotColor: "bg-purple-400",
    icon: Sparkles,
    getWaMessage: (ord) =>
      `Hello *${ord.customerName}*,\n\nYour order *#${ord.orderNumber}* is now being *PACKED & QUALITY TESTED* at Jijau Computers.\n\nOur technicians are verifying the items and warranty stamps before dispatch.\n\n🔍 *Live Tracking:* https://jijaucomputers.in/track-service?q=${encodeURIComponent(ord.orderNumber)}\n\nThank you for your patience!`,
  },
  SHIPPED: {
    label: "SHIPPED",
    bgClass: "bg-sky-500/10",
    textClass: "text-sky-400",
    borderClass: "border-sky-500/30",
    badgeClass: "bg-sky-500/15 text-sky-300 border border-sky-500/40",
    selectClass: "border-sky-500/50 text-sky-300 focus:ring-sky-500",
    dotColor: "bg-sky-400",
    icon: Truck,
    getWaMessage: (ord) =>
      `Hello *${ord.customerName}*,\n\n🚀 Your order *#${ord.orderNumber}* has been *SHIPPED / DISPATCHED*!\n\n📍 *Destination:* ${ord.address}, ${ord.city} - ${ord.pincode}\n💰 *Amount to Pay:* ${formatPrice(ord.total)} (${ord.paymentMode})\n\n🔍 *Live Courier & Order Tracking:* https://jijaucomputers.in/track-service?q=${encodeURIComponent(ord.orderNumber)}\n\nPlease ensure someone is available at the delivery address. For assistance, reply to this WhatsApp message anytime.\n\n*Jijau Computers Pune*`,
  },
  DELIVERED: {
    label: "DELIVERED",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",
    selectClass: "border-emerald-500/50 text-emerald-300 focus:ring-emerald-500",
    dotColor: "bg-emerald-400",
    icon: CheckCircle2,
    getWaMessage: (ord) =>
      `Dear *${ord.customerName}*,\n\n🎉 Your order *#${ord.orderNumber}* has been successfully *DELIVERED*!\n\nWe hope you love your new hardware. All items are backed by official manufacturer warranty.\n\n🔍 *View & Download Tax Invoice:* https://jijaucomputers.in/track-service?q=${encodeURIComponent(ord.orderNumber)}\n\nIf you ever need technical support, component upgrades, or servicing in Pune, Jijau Computers is always here to assist you!\n\nHave a wonderful day! ⭐`,
  },
  CANCELLED: {
    label: "CANCELLED",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/30",
    badgeClass: "bg-rose-500/15 text-rose-300 border border-rose-500/40",
    selectClass: "border-rose-500/50 text-rose-300 focus:ring-rose-500",
    dotColor: "bg-rose-400",
    icon: XCircle,
    getWaMessage: (ord) =>
      `Hello *${ord.customerName}*,\n\nYour order *#${ord.orderNumber}* at Jijau Computers has been *CANCELLED*.\n\nIf this was a mistake or you wish to change your configuration/items, please reply to this WhatsApp message or call our support team.`,
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [justUpdatedOrder, setJustUpdatedOrder] = useState<{
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    status: string;
    total: number;
    items: any[];
    address: string;
    city: string;
    pincode: string;
    paymentMode: string;
  } | null>(null);

  // Modal for custom WhatsApp message
  const [customWaModal, setCustomWaModal] = useState<{
    isOpen: boolean;
    order: any;
    status: string;
    message: string;
  } | null>(null);

  // Modal for GST Tax Invoice
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        const orderObj = orders.find((o) => o.id === id);
        if (orderObj) {
          const updated = { ...orderObj, status: newStatus };
          setJustUpdatedOrder(updated);
        }
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openWhatsAppModal = (ord: any, statusToNotify?: string) => {
    const targetStatus = statusToNotify || ord.status;
    const config = STATUS_CONFIG[targetStatus] || STATUS_CONFIG.PENDING;
    const msg = config.getWaMessage({ ...ord, status: targetStatus });

    setCustomWaModal({
      isOpen: true,
      order: ord,
      status: targetStatus,
      message: msg,
    });
  };

  const sendWhatsAppDirect = (phone: string, message: string) => {
    const url = generateWhatsAppUrl(phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const processingCount = orders.filter((o) => o.status === "PROCESSING").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + (o.total || 0), 0);

  // Filtering
  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      (o.city && o.city.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === "ALL" || o.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-sky-500" />
            <span>Store Customer Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer delivery orders, status lifecycles, and send 1-click WhatsApp updates.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
          <span className="text-xl font-black text-white mt-1">{totalOrdersCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </span>
          <span className="text-xl font-black text-amber-300 mt-1">{pendingCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
          <span className="text-xl font-black text-blue-300 mt-1">{confirmedCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
            <Truck className="w-3 h-3" /> Shipped
          </span>
          <span className="text-xl font-black text-sky-300 mt-1">{shippedCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
          <span className="text-xl font-black text-emerald-300 mt-1">{deliveredCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Sales</span>
          <span className="text-base sm:text-lg font-black text-emerald-400 mt-1 truncate">
            {formatPrice(totalRevenue)}
          </span>
        </div>
      </div>

      {/* Instant WhatsApp Notification Banner (After Status Update) */}
      {justUpdatedOrder && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Order <span className="font-mono text-emerald-300">#{justUpdatedOrder.orderNumber}</span> updated to{" "}
                <span className={`px-2 py-0.5 rounded-md font-black text-[11px] uppercase ${STATUS_CONFIG[justUpdatedOrder.status]?.badgeClass}`}>
                  {justUpdatedOrder.status}
                </span>
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Notify customer <span className="font-semibold text-white">{justUpdatedOrder.customerName}</span> ({justUpdatedOrder.phone}) on WhatsApp?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const conf = STATUS_CONFIG[justUpdatedOrder.status] || STATUS_CONFIG.PENDING;
                sendWhatsAppDirect(
                  justUpdatedOrder.phone,
                  conf.getWaMessage(justUpdatedOrder)
                );
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp Now</span>
            </button>
            <button
              onClick={() => setJustUpdatedOrder(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by order number (#JC-ORD-...), customer name, phone number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-500 hover:text-slate-300 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedStatusFilter === "ALL"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Orders ({orders.length})
          </button>

          {Object.keys(STATUS_CONFIG).map((st) => {
            const conf = STATUS_CONFIG[st];
            const isSelected = selectedStatusFilter === st;
            const count = orders.filter((o) => o.status === st).length;

            return (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? conf.badgeClass + " shadow-md"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${conf.dotColor}`} />
                <span>{conf.label}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
            <RefreshCw className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
            <p className="text-slate-400 text-xs">Loading orders from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
            <Package className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No matching orders found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or filter status.
            </p>
          </div>
        ) : (
          filtered.map((ord) => {
            const currentConfig = STATUS_CONFIG[ord.status] || STATUS_CONFIG.PENDING;
            const StatusIcon = currentConfig.icon;

            return (
              <div
                key={ord.id}
                className={`bg-slate-950 rounded-3xl p-5 sm:p-6 border transition-all duration-200 space-y-4 text-xs shadow-xl hover:border-slate-700 ${currentConfig.borderClass}`}
              >
                {/* Header: Order Number, Date, Status Badge, Status Dropdown & WhatsApp Action */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-black text-white text-base sm:text-lg tracking-tight">
                      {ord.orderNumber}
                    </span>

                    {/* Rich Color Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[11px] uppercase shadow-sm ${currentConfig.badgeClass}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{ord.status}</span>
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ord.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Actions: Status Dropdown & WhatsApp Notify Button */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Select with Matching Color Styling */}
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase pl-2">
                        Status:
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`px-3 py-1.5 bg-slate-950 border rounded-lg font-black text-xs outline-none cursor-pointer transition-all ${currentConfig.selectClass}`}
                      >
                        <option value="PENDING" className="bg-slate-900 text-amber-300">
                          🟡 PENDING
                        </option>
                        <option value="CONFIRMED" className="bg-slate-900 text-blue-300">
                          🔵 CONFIRMED
                        </option>
                        <option value="PROCESSING" className="bg-slate-900 text-purple-300">
                          🟣 PROCESSING
                        </option>
                        <option value="SHIPPED" className="bg-slate-900 text-sky-300">
                          🚀 SHIPPED
                        </option>
                        <option value="DELIVERED" className="bg-slate-900 text-emerald-300">
                          🟢 DELIVERED
                        </option>
                        <option value="CANCELLED" className="bg-slate-900 text-rose-300">
                          🔴 CANCELLED
                        </option>
                      </select>
                    </div>

                    {/* GST Tax Invoice Button */}
                    <button
                      onClick={() => setInvoiceOrder(ord)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                      title="View, generate, and print official GST Tax Invoice PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>GST Invoice</span>
                    </button>

                    {/* WhatsApp Notification Button */}
                    <button
                      onClick={() => openWhatsAppModal(ord, ord.status)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      title="Open WhatsApp Notification with tailored status message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Notify via WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Customer & Address */}
                  <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-1.5">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
                      Customer & Shipping Address
                    </span>
                    <span className="font-bold text-white text-sm block">
                      {ord.customerName}
                    </span>
                    <p className="text-slate-400 text-xs flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>
                        {ord.address}, {ord.city} - {ord.pincode}
                      </span>
                    </p>
                    <p className="text-slate-300 text-xs flex items-center gap-1.5 font-mono">
                      <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{ord.phone}</span>
                    </p>
                    {ord.notes && (
                      <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mt-1">
                        Note: {ord.notes}
                      </p>
                    )}
                  </div>

                  {/* Payment & Financials */}
                  <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-1.5">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
                      Payment & Billing
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Total Amount:</span>
                      <span className="text-emerald-400 font-black text-base">
                        {formatPrice(ord.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Payment Method:</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-sky-400" />
                        {ord.paymentMode || "Cash on Delivery"}
                      </span>
                    </div>
                    {ord.discount > 0 && (
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Discount Applied:</span>
                        <span className="text-emerald-400">-{formatPrice(ord.discount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-1.5">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
                      Ordered Products ({ord.items?.length || 0})
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {ord.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs py-1 border-b border-slate-800 last:border-0"
                        >
                          <span className="text-slate-200 font-medium truncate max-w-[170px]" title={item.name}>
                            • {item.name}
                          </span>
                          <span className="text-slate-400 shrink-0 font-mono">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* WhatsApp Message Preview & Customizer Modal */}
      {customWaModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Send WhatsApp Update to Customer
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    To: {customWaModal.order.customerName} ({customWaModal.order.phone})
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCustomWaModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Message Switcher */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Switch Notification Template:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.keys(STATUS_CONFIG).map((st) => {
                  const isCur = customWaModal.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        const newMsg = STATUS_CONFIG[st].getWaMessage({
                          ...customWaModal.order,
                          status: st,
                        });
                        setCustomWaModal({
                          ...customWaModal,
                          status: st,
                          message: newMsg,
                        });
                      }}
                      className={`px-2 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer border ${
                        isCur
                          ? STATUS_CONFIG[st].badgeClass
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Body Editor */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                WhatsApp Message Content (Editable):
              </label>
              <textarea
                rows={6}
                value={customWaModal.message}
                onChange={(e) =>
                  setCustomWaModal({ ...customWaModal, message: e.target.value })
                }
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCustomWaModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  sendWhatsAppDirect(
                    customWaModal.order.phone,
                    customWaModal.message
                  );
                  setCustomWaModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open WhatsApp & Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GST Tax Invoice Modal */}
      <GstInvoiceModal
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
      />
    </div>
  );
}

