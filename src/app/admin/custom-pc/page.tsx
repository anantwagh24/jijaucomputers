"use client";

import React, { useState, useEffect } from "react";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import { Cpu, Edit2, MessageSquare, Check, X, Search, Phone } from "lucide-react";

export default function AdminCustomPcPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [adminNotes, setAdminNotes] = useState("");
  const [totalEst, setTotalEst] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/custom-pc");
      const data = await res.json();
      if (Array.isArray(data)) setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenEdit = (req: any) => {
    setSelectedReq(req);
    setStatus(req.status);
    setAdminNotes(req.adminNotes || "");
    setTotalEst(req.totalEst ? String(req.totalEst) : "");
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      const res = await fetch("/api/custom-pc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReq.id,
          status,
          adminNotes,
          totalEst,
        }),
      });

      if (res.ok) {
        await fetchRequests();
        setModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-6 h-6 text-amber-500" />
          Custom PC Build Requests
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review customer hardware preferences, send WhatsApp quotations, and update request statuses.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 text-xs py-8 text-center">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-500 text-xs py-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
            No custom PC requests received yet.
          </p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-white text-base">
                    {req.reqNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    req.status === "COMPLETED" || req.status === "QUOTED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateWhatsAppUrl(
                      req.phone,
                      `Hello ${req.customerName}, this is Jijau Computers regarding your Custom PC configuration request ${req.reqNumber}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>

                  <button
                    onClick={() => handleOpenEdit(req)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Customer</span>
                  <span className="font-bold text-white block mt-0.5">{req.customerName}</span>
                  <span className="text-slate-400">{req.phone}</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Purpose & Budget</span>
                  <span className="font-bold text-amber-400 block mt-0.5">{req.purpose}</span>
                  <span className="text-slate-300 font-semibold">{req.budget}</span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 md:col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase">Selected Hardware</span>
                  <p className="text-slate-300 mt-0.5 line-clamp-2">
                    <span className="font-semibold">CPU:</span> {req.cpuPref || "Standard"} | <span className="font-semibold">GPU:</span> {req.gpuPref || "Standard"} | <span className="font-semibold">RAM:</span> {req.ramPref || "Standard"}
                  </p>
                </div>
              </div>

              {req.adminNotes && (
                <div className="p-3 bg-blue-950/40 rounded-2xl border border-blue-900/60 text-xs text-blue-300">
                  <span className="font-bold text-blue-400 block">Admin / Quotation Notes:</span>
                  <p className="mt-0.5">{req.adminNotes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-white">
              Update Request: <span className="font-mono text-amber-400">{selectedReq.reqNumber}</span>
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-semibold"
                >
                  <option>PENDING</option>
                  <option>REVIEWING</option>
                  <option>QUOTED</option>
                  <option>ACCEPTED</option>
                  <option>COMPLETED</option>
                  <option>CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Estimated / Quoted Total (₹)</label>
                <input
                  type="number"
                  value={totalEst}
                  onChange={(e) => setTotalEst(e.target.value)}
                  placeholder="e.g. 135000"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Internal Notes / Quotation Details</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Quotation sent over WhatsApp for ₹1,35,000 with 3 years onsite warranty..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
