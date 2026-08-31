import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  FolderTree,
  Flame,
  Wrench,
  Cpu,
  FileText,
  MessageSquare,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalCategories,
    totalOffers,
    serviceRequests,
    customPcRequests,
    quotations,
    enquiries,
    orders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.offer.count({ where: { isActive: true } }),
    prisma.serviceRequest.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.customPcRequest.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.quotationRequest.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const totalOrdersAmount = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    { label: "Total Products", count: totalProducts, icon: Package, href: "/admin/products", color: "from-blue-600 to-blue-700" },
    { label: "Active Categories", count: totalCategories, icon: FolderTree, href: "/admin/categories", color: "from-indigo-600 to-indigo-700" },
    { label: "Active Offers", count: totalOffers, icon: Flame, href: "/admin/offers", color: "from-rose-600 to-rose-700" },
    { label: "Repair Tickets", count: serviceRequests.length, icon: Wrench, href: "/admin/service-requests", color: "from-emerald-600 to-emerald-700" },
    { label: "PC Build Requests", count: customPcRequests.length, icon: Cpu, href: "/admin/custom-pc", color: "from-amber-600 to-amber-700" },
    { label: "B2B Quotes", count: quotations.length, icon: FileText, href: "/admin/quotations", color: "from-purple-600 to-purple-700" },
    { label: "Inquiries", count: enquiries.length, icon: MessageSquare, href: "/admin/enquiries", color: "from-cyan-600 to-cyan-700" },
    { label: "Orders", count: orders.length, icon: ShoppingBag, href: "/admin/orders", color: "from-sky-600 to-sky-700" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Store Overview & Control Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your hardware inventory, custom PC leads, repair pipeline, and website settings.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <Link
              key={st.label}
              href={st.href}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <span className="text-2xl font-black text-white block">{st.count}</span>
              <span className="text-xs font-semibold text-slate-400 mt-1 block truncate">
                {st.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Tables: Custom PC Requests & Service Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Custom PC Build Inquiries */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              Recent Custom PC Requests
            </h3>
            <Link href="/admin/custom-pc" className="text-xs text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {customPcRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No PC requests yet.</p>
            ) : (
              customPcRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{req.customerName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{req.phone}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {req.purpose} • {req.budget}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase shrink-0 ${
                    req.status === "QUOTED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Service / Repair Tickets */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-500" />
              Active Repair Tickets
            </h3>
            <Link href="/admin/service-requests" className="text-xs text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {serviceRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No repair requests logged.</p>
            ) : (
              serviceRequests.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-white">{rep.ticketId}</span>
                      <span className="text-slate-400 truncate">{rep.customerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {rep.brand} {rep.model} ({rep.deviceType})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase shrink-0 bg-blue-500/20 text-blue-400">
                    {rep.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Orders */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              Recent Store Orders
            </h3>
            <Link href="/admin/orders" className="text-xs text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No customer orders placed yet.</p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {ord.customerName} • {ord.city}
                    </p>
                  </div>
                  <span className="font-black text-emerald-400">
                    {formatPrice(ord.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Corporate Quotation Requests */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Corporate Quotation Inquiries
            </h3>
            <Link href="/admin/quotations" className="text-xs text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {quotations.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No quotation requests yet.</p>
            ) : (
              quotations.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-white truncate">{q.customerName} {q.companyName ? `(${q.companyName})` : ""}</span>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {q.type}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase shrink-0 bg-purple-500/20 text-purple-400">
                    {q.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
