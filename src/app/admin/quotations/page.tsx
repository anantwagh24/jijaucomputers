"use client";

import React, { useState, useEffect } from "react";
import { generateWhatsAppUrl } from "@/lib/utils";
import { FileText, Edit2, MessageSquare, Check, X } from "lucide-react";

export default function AdminQuotationsPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("PENDING");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quotations");
      const data = await res.json();
      if (Array.isArray(data)) setQuotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleOpenEdit = (q: any) => {
    setSelectedQuote(q);
    setStatus(q.status);
    setAdminNotes(q.adminNotes || "");
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    try {
      const res = await fetch("/api/quotations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedQuote.id,
          status,
          adminNotes,
        }),
      });

      if (res.ok) {
        await fetchQuotes();
        setModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-500" />
          B2B & Bulk Quotation Inquiries
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage corporate procurement requests, lab setups, and bulk hardware quotes.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 text-xs py-8 text-center">Loading quotations...</p>
        ) : quotes.length === 0 ? (
          <p className="text-slate-500 text-xs py-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
            No quotation requests yet.
          </p>
        ) : (
          quotes.map((q) => (
            <div
              key={q.id}
              className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-white text-base">
                    {q.quoteNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    q.status === "QUOTED" || q.status === "CLOSED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {q.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateWhatsAppUrl(
                      q.phone,
                      `Hello ${q.customerName}, this is Jijau Computers regarding your quotation request #${q.quoteNumber}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Customer & Company</span>
                  <span className="font-bold text-white block mt-0.5">{q.customerName}</span>
                  <span className="text-slate-400">{q.companyName || "Individual Client"}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Contact Details</span>
                  <span className="text-white block mt-0.5">{q.phone}</span>
                  <span className="text-slate-400 truncate block">{q.email}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Requirement Type</span>
                  <span className="font-bold text-purple-400 block mt-0.5">{q.type}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Bill of Materials / Items:</span>
                <p className="text-slate-200">{q.itemsSummary}</p>
                {q.message && <p className="text-slate-400 mt-1 italic">Note: {q.message}</p>}
              </div>

              {q.adminNotes && (
                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-900/60 text-purple-300">
                  <span className="font-bold block">Internal Admin Notes:</span>
                  <p className="mt-0.5">{q.adminNotes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-white">
              Update Quote #{selectedQuote.quoteNumber}
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                >
                  <option>PENDING</option>
                  <option>PROCESSING</option>
                  <option>QUOTED</option>
                  <option>CLOSED</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Admin Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Quotation email sent with 18% GST invoice breakdown..."
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
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
