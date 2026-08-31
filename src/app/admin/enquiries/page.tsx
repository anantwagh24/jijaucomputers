"use client";

import React, { useState, useEffect } from "react";
import { generateWhatsAppUrl } from "@/lib/utils";
import { MessageSquare, Check, X, Phone, Mail, Clock } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (Array.isArray(data)) setEnquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-500" />
          Customer Enquiries Inbox
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          General contact form submissions, hardware questions, and direct messages.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 text-xs py-8 text-center">Loading inquiries...</p>
        ) : enquiries.length === 0 ? (
          <p className="text-slate-500 text-xs py-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
            No customer inquiries yet.
          </p>
        ) : (
          enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 text-xs shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{enq.name}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      enq.status === "RESOLVED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-cyan-500/20 text-cyan-400"
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Received on {new Date(enq.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateWhatsAppUrl(
                      enq.phone,
                      `Hello ${enq.name}, this is Jijau Computers replying to your enquiry about ${enq.subject}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {enq.status !== "RESOLVED" ? (
                    <button
                      onClick={() => handleUpdateStatus(enq.id, "RESOLVED")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(enq.id, "NEW")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs"
                    >
                      Re-open
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Contact</span>
                  <span className="text-white">{enq.phone}</span> {enq.email && <span>• {enq.email}</span>}
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Subject</span>
                  <span className="text-cyan-400 font-bold">{enq.subject}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-850">
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Message</span>
                <p className="text-slate-200 leading-relaxed">{enq.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
