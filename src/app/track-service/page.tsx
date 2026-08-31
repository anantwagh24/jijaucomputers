"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/utils";
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
} from "lucide-react";

interface ServiceTicket {
  id: string;
  ticketId: string;
  customerName: string;
  phone: string;
  email?: string | null;
  deviceType: string;
  brand: string;
  model: string;
  serialNo?: string | null;
  issueDesc: string;
  status: string;
  adminNotes?: string | null;
  estimatedCost?: number | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_STAGES = [
  { key: "Received", label: "Device Received", desc: "Logged into service queue" },
  { key: "Under Inspection", label: "Diagnostic Check", desc: "Hardware & motherboard testing" },
  { key: "Repairing", label: "Active Repair", desc: "Chip-level work or component fix" },
  { key: "Waiting for Parts", label: "Waiting for Parts", desc: "OEM part in transit" },
  { key: "Ready for Delivery", label: "Ready for Pickup", desc: "Passed all post-repair QC tests" },
  { key: "Completed", label: "Delivered & Closed", desc: "Delivered with repair warranty" },
];

export default function ServiceTrackerPage() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<ServiceTicket | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // New Request Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    deviceType: "Gaming Laptop",
    brand: "",
    model: "",
    serialNo: "",
    issueDesc: "",
  });
  const [newTicketCreated, setNewTicketCreated] = useState<ServiceTicket | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setTicket(null);

      const res = await fetch(`/api/service-requests?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setTicket(data[0]);
      } else {
        setErrorMsg(`No service records found for "${searchQuery}". Please verify your ticket ID (e.g. JC-SRV-1001) or 10-digit phone number.`);
      }
    } catch (e) {
      setErrorMsg("Failed to connect to service server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const created = await res.json();
        setNewTicketCreated(created);
        setTicket(created);
      }
    } catch (e) {
      console.error("Create request error:", e);
    } finally {
      setCreating(false);
    }
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case "Received": return 0;
      case "Under Inspection": return 1;
      case "Repairing": return 2;
      case "Waiting for Parts": return 3;
      case "Ready for Delivery": return 4;
      case "Completed": return 5;
      default: return 0;
    }
  };

  const currentStageIndex = ticket ? getStageIndex(ticket.status) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>Jijau Tech Care & Service Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Track Laptop & PC Repair Status
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Enter your Service Ticket ID or Registered Mobile Number to check real-time diagnosis, parts updates, and pickup availability.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. JC-SRV-1001) or Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-medium transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "Track Status"}
            </button>
          </form>

          {/* Quick Demo Search Hint */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Demo tickets: <button type="button" onClick={() => setSearchQuery("JC-SRV-1001")} className="font-mono text-blue-600 hover:underline">JC-SRV-1001</button> or <button type="button" onClick={() => setSearchQuery("9876543210")} className="font-mono text-blue-600 hover:underline">9876543210</button></span>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Book New Repair
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Live Ticket Details & Visual Timeline */}
        {ticket && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in fade-in duration-300">
            {/* Top Ticket Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                    {ticket.ticketId}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    ticket.status === "Ready for Delivery" || ticket.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : ticket.status === "Repairing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Logged on {new Date(ticket.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>

              {ticket.estimatedCost && (
                <div className="sm:text-right">
                  <span className="text-xs text-slate-500 block font-medium">Estimated Repair Cost</span>
                  <span className="text-2xl font-black text-slate-900">
                    {formatPrice(ticket.estimatedCost)}
                  </span>
                </div>
              )}
            </div>

            {/* Visual Timeline Progress Bar */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                Live Repair Progress Timeline
              </h3>

              <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {STATUS_STAGES.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-100 shadow-sm"
                            : isDone
                            ? "bg-emerald-50/60 border-emerald-300"
                            : "bg-slate-50/50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-xs ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isDone ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {stage.label}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          {stage.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Device & Issue Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  Device Information
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Name:</span>
                    <span className="font-bold text-slate-800">{ticket.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered Phone:</span>
                    <span className="font-bold text-slate-800">{ticket.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device Type:</span>
                    <span className="font-semibold text-slate-800">{ticket.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Brand & Model:</span>
                    <span className="font-semibold text-slate-800">{ticket.brand} {ticket.model}</span>
                  </div>
                  {ticket.serialNo && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Serial Number:</span>
                      <span className="font-mono text-slate-800">{ticket.serialNo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  Issue & Technician Notes
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Reported Problem:</span>
                    <p className="font-medium text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                      {ticket.issueDesc}
                    </p>
                  </div>

                  {ticket.adminNotes && (
                    <div>
                      <span className="text-blue-600 font-bold block mb-0.5">Technician's Diagnostic Update:</span>
                      <p className="font-medium text-slate-800 bg-blue-50/70 p-2.5 rounded-xl border border-blue-200">
                        {ticket.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Need Direct Assistance Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Have questions about your repair?</h4>
                  <p className="text-[11px] text-slate-400">Speak directly with our service center desk.</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hi Jijau Service Desk, I am inquiring about my service ticket ${ticket.ticketId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
              >
                Chat with Technician
              </a>
            </div>
          </div>
        )}

        {/* Optional Book New Repair Form */}
        {isFormOpen && (
          <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Book a Repair / Service Drop-off
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Generate an instant Service Ticket ID before visiting our Shivajinagar service center.
            </p>

            {newTicketCreated ? (
              <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg">Service Ticket #{newTicketCreated.ticketId} Created!</h4>
                <p className="text-xs">
                  Please bring your device to Jijau Computers. You can track status anytime using ticket ID <span className="font-bold">{newTicketCreated.ticketId}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Device Type</label>
                    <select
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600 bg-white"
                    >
                      <option>Gaming Laptop</option>
                      <option>Workstation / Desktop PC</option>
                      <option>Motherboard / GPU</option>
                      <option>Printer / Scanner</option>
                      <option>CCTV DVR / NVR</option>
                      <option>MacBook / Ultrabook</option>
                      <option>Other Device</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand (ASUS, HP, Dell...) *</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="e.g. ASUS"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Model Name / Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="e.g. ROG Strix G15"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Describe Issue in Detail *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.issueDesc}
                    onChange={(e) => setFormData({ ...formData, issueDesc: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    placeholder="e.g. No display, overheating, blue screen of death, liquid spill, broken screen..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow transition-colors disabled:opacity-50"
                  >
                    {creating ? "Generating Ticket..." : "Generate Service Ticket"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
