"use client";

import React, { useState, useEffect } from "react";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  Wrench,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  MessageSquare,
  FileText,
  Send,
  Sparkles,
  Printer,
  ShieldCheck,
} from "lucide-react";
import GstInvoiceModal from "@/components/invoice/GstInvoiceModal";

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("Received");
  const [adminNotes, setAdminNotes] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  // Create New Service Ticket Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    deviceType: "Laptop",
    brand: "Dell",
    model: "",
    serialNo: "",
    issueDesc: "",
    status: "Received",
    estimatedCost: "",
    adminNotes: "",
  });

  // Invoice modal state
  const [selectedInvoiceService, setSelectedInvoiceService] = useState<any | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/service-requests");
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    const cleanPhone = createForm.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setCreateError("Please enter a valid 10-digit customer mobile number.");
      return;
    }

    try {
      setCreateLoading(true);
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchRequests();
        setIsCreateOpen(false);
        setCreateForm({
          customerName: "",
          phone: "",
          email: "",
          deviceType: "Laptop",
          brand: "Dell",
          model: "",
          serialNo: "",
          issueDesc: "",
          status: "Received",
          estimatedCost: "",
          adminNotes: "",
        });
      } else {
        setCreateError(data.error || "Failed to create service ticket.");
      }
    } catch (err) {
      setCreateError("Network error while creating ticket.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (req: any) => {
    setSelectedReq(req);
    setStatus(req.status);
    setAdminNotes(req.adminNotes || "");
    setEstimatedCost(req.estimatedCost ? String(req.estimatedCost) : "");
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      const res = await fetch("/api/service-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReq.id,
          status,
          adminNotes,
          estimatedCost,
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

  const handleSendWhatsApp = (req: any) => {
    const costText = req.estimatedCost ? `\n💰 *Estimated Cost:* ${formatPrice(req.estimatedCost)}` : "";
    const notesText = req.adminNotes ? `\n📝 *Technician Remarks:* ${req.adminNotes}` : "";

    const message = `Hello *${req.customerName}*,\n\nUpdate on your service ticket *#${req.ticketId}* at *Jijau Computers*:\n\n📱 *Device:* ${req.brand} ${req.model} (${req.deviceType})\n🔧 *Current Status:* *${req.status.toUpperCase()}*${costText}${notesText}\n\n🔍 *Live Status & Warranty Tracking:* https://jijaucomputers.in/track-service?q=${encodeURIComponent(req.ticketId)}\n\nFor assistance, reply directly to this message or visit our service center.\n\n*Jijau Computers*`;

    const url = generateWhatsAppUrl(req.phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filtered = requests.filter(
    (r) =>
      r.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) ||
      r.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-emerald-500" />
            Laptop & Hardware Repair Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update repair statuses, assign technician remarks, send WhatsApp updates, and generate GST service bills.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreateError("");
            setIsCreateOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Wrench className="w-4 h-4" />
          <span>+ New Service Ticket / Check-in Device</span>
        </button>
      </div>

      <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by ticket ID (JC-SRV-...), customer name, or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Device Info</th>
                <th className="py-3.5 px-4">Reported Issue</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Est. Cost</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading repair tickets...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No repair requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {req.ticketId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{req.customerName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{req.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-300 block">{req.brand} {req.model}</span>
                      <span className="text-[10px] text-blue-400">{req.deviceType}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-400 truncate">
                      {req.issueDesc}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          req.status === "Completed" || req.status === "Ready for Delivery"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : req.status === "Repairing"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                      {req.estimatedCost ? formatPrice(req.estimatedCost) : "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* GST Service Bill Button */}
                        <button
                          onClick={() => setSelectedInvoiceService(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white font-bold text-[11px] border border-slate-700 flex items-center gap-1 cursor-pointer"
                          title="Generate GST Service & Warranty Invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Bill</span>
                        </button>

                        {/* WhatsApp Notify Button */}
                        <button
                          onClick={() => handleSendWhatsApp(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Send instant WhatsApp status update to customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Update Status Button */}
                        <button
                          onClick={() => handleOpenEdit(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {modalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-white">
              Update Repair Ticket: <span className="text-blue-400 font-mono">{selectedReq.ticketId}</span>
            </h3>

            <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1">
              <p><span className="text-slate-400">Customer:</span> {selectedReq.customerName} ({selectedReq.phone})</p>
              <p><span className="text-slate-400">Device:</span> {selectedReq.brand} {selectedReq.model}</p>
              <p><span className="text-slate-400">Issue:</span> {selectedReq.issueDesc}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Pipeline Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-semibold"
                >
                  <option>Received</option>
                  <option>Under Inspection</option>
                  <option>Repairing</option>
                  <option>Waiting for Parts</option>
                  <option>Ready for Delivery</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="e.g. 2800"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Technician Diagnosis / Customer Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Fan replaced and Kryonaut thermal paste applied. Tested on Furmark for 2 hours."
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Service Ticket / Walk-in Check-in Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-500" />
                <span>Check-in Device / New Service Ticket</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                ⚠️ {createError}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Shinde"
                    value={createForm.customerName}
                    onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Device Type *</label>
                  <select
                    value={createForm.deviceType}
                    onChange={(e) => setCreateForm({ ...createForm, deviceType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
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
                  <label className="font-bold text-slate-300 block mb-1">Brand *</label>
                  <select
                    value={createForm.brand}
                    onChange={(e) => setCreateForm({ ...createForm, brand: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
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
                    <option value="Hikvision">Hikvision</option>
                    <option value="CP PLUS">CP PLUS</option>
                    <option value="Other">Other Brand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Model Name / Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. Latitude 3420"
                    value={createForm.model}
                    onChange={(e) => setCreateForm({ ...createForm, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Serial / Service Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-8921"
                    value={createForm.serialNo}
                    onChange={(e) => setCreateForm({ ...createForm, serialNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Reported Issue / Symptoms *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Screen flickering, battery not charging, liquid spill damage..."
                  value={createForm.issueDesc}
                  onChange={(e) => setCreateForm({ ...createForm, issueDesc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Initial Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option>Received</option>
                    <option>Under Inspection</option>
                    <option>Repairing</option>
                    <option>Waiting for Parts</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Est. Cost (₹, optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={createForm.estimatedCost}
                    onChange={(e) => setCreateForm({ ...createForm, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Technician / Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Adapter & bag submitted with device"
                  value={createForm.adminNotes}
                  onChange={(e) => setCreateForm({ ...createForm, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{createLoading ? "Creating..." : "Check-in & Create Ticket"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GST Service Bill Modal */}
      <GstInvoiceModal
        isOpen={Boolean(selectedInvoiceService)}
        onClose={() => setSelectedInvoiceService(null)}
        service={selectedInvoiceService}
      />
    </div>
  );
}
