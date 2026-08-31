"use client";

import React, { useState, useEffect } from "react";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import { ShoppingBag, CheckCircle2, Truck, Clock, MessageSquare, Search } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-sky-500" />
          Store Customer Orders
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View customer delivery addresses, purchased items, and dispatch status.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by order number (JC-ORD-...), customer name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 text-xs py-8 text-center">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-xs py-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
            No customer orders placed yet.
          </p>
        ) : (
          filtered.map((ord) => (
            <div
              key={ord.id}
              className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 text-xs shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-white text-base">
                    {ord.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    ord.status === "DELIVERED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : ord.status === "SHIPPED"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {ord.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateWhatsAppUrl(
                      ord.phone,
                      `Hello ${ord.customerName}, this is Jijau Computers regarding your order #${ord.orderNumber}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Customer & Delivery</span>
                  <span className="font-bold text-white block mt-0.5">{ord.customerName}</span>
                  <span className="text-slate-400 block">{ord.address}, {ord.city} - {ord.pincode}</span>
                  <span className="text-slate-400 block">{ord.phone}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Payment & Total</span>
                  <span className="text-emerald-400 font-black text-sm block mt-0.5">
                    {formatPrice(ord.total)}
                  </span>
                  <span className="text-slate-400">{ord.paymentMode}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Ordered Items ({ord.items?.length || 0})</span>
                  <div className="mt-1 space-y-1">
                    {ord.items?.map((item: any) => (
                      <p key={item.id} className="text-slate-300 truncate">
                        • {item.name} <span className="text-slate-500">(Qty: {item.quantity})</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
