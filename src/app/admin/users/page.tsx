"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  IndianRupee,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Lock,
  RefreshCw,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalSpendAll: 0,
    totalOrdersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit / Create Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    password: "",
    isVerified: true,
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to load users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      password: "",
      isVerified: true,
    });
    setFormError("");
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      pincode: user.pincode || "",
      password: "",
      isVerified: user.isVerified ?? true,
    });
    setFormError("");
    setIsEditOpen(true);
  };

  const handleOpenView = (user: any) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      setFormLoading(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchUsers();
        setIsCreateOpen(false);
      } else {
        setFormError(data.error || "Failed to create customer.");
      }
    } catch (err: any) {
      setFormError("Network error while creating customer.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError("");

    try {
      setFormLoading(true);
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchUsers();
        setIsEditOpen(false);
      } else {
        setFormError(data.error || "Failed to update customer.");
      }
    } catch (err: any) {
      setFormError("Network error while updating customer.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchUsers();
      } else {
        alert("Failed to delete user profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  };

  const handleSendWhatsApp = (user: any) => {
    const msg = `Hello ${user.name},\n\nGreetings from Jijau Computers! Thank you for being our valued customer. If you need any assistance with computer hardware, laptops, or repairs, feel free to reply to this message.`;
    const url = generateWhatsAppUrl(user.phone, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search) ||
      u.city?.toLowerCase().includes(search.toLowerCase()) ||
      u.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Registered Customers & User Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View customer profiles, email IDs, order volumes, spend metrics, and direct WhatsApp contact channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register New Customer</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.totalUsers}</div>
          <span className="text-[11px] text-slate-500 block">Registered user profiles</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Verified Accounts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{stats.verifiedUsers}</div>
          <span className="text-[11px] text-emerald-500/80 block">Phone & SMS verified</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Customer Orders</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">{stats.totalOrdersCount}</div>
          <span className="text-[11px] text-slate-500 block">Orders linked to profiles</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lifetime Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{formatPrice(stats.totalSpendAll)}</div>
          <span className="text-[11px] text-slate-500 block">From registered members</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by customer name, email ID, 10-digit phone, city, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Location / Address</th>
                <th className="py-3.5 px-4">Orders & Spend</th>
                <th className="py-3.5 px-4">Registered On</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                    <span>Loading registered users...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No registered customers found matching "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black text-xs flex items-center justify-center shadow">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{user.name}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{user.isVerified ? "Verified Member" : "Unverified"}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                        <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[200px]" title={user.email}>
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">{user.city || "—"}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[180px]" title={user.address}>
                        {user.address ? `${user.address} ${user.pincode ? "- " + user.pincode : ""}` : "No address logged"}
                      </div>
                    </td>

                    {/* Orders & Spend */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                        <span>{formatPrice(user.totalSpent)}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {user.ordersCount} {user.ordersCount === 1 ? "order" : "orders"} placed
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenView(user)}
                          title="View Profile & Orders"
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(user)}
                          title="Contact on WhatsApp"
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          title="Edit Customer Details"
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title="Delete User"
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* View Customer Details Modal */}
      {isViewOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow">
                  {selectedUser.name ? selectedUser.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedUser.name}</h3>
                  <span className="text-xs text-emerald-400 font-medium">Verified Customer Profile</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3.5 rounded-2xl border border-slate-850">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Mobile</span>
                  <span className="font-bold text-white font-mono">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Email</span>
                  <span className="font-bold text-white truncate block">{selectedUser.email}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-500 block text-[10px] uppercase">City</span>
                  <span className="font-bold text-white">{selectedUser.city || "—"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-500 block text-[10px] uppercase">Pincode</span>
                  <span className="font-bold text-white font-mono">{selectedUser.pincode || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Delivery Address</span>
                <p className="p-3 bg-slate-900 rounded-xl text-slate-300 border border-slate-850">
                  {selectedUser.address || "No default address saved yet."}
                </p>
              </div>

              {/* Order History */}
              <div className="pt-2">
                <h4 className="font-bold text-white mb-2 flex items-center justify-between">
                  <span>Recent Orders ({selectedUser.recentOrders?.length || 0})</span>
                  <span className="text-amber-400 font-mono text-xs">Total Spend: {formatPrice(selectedUser.totalSpent)}</span>
                </h4>
                {selectedUser.recentOrders && selectedUser.recentOrders.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedUser.recentOrders.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-blue-400 font-mono">{ord.orderNumber}</span>
                          <span className="text-slate-500 block text-[10px]">
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white">{formatPrice(ord.total)}</span>
                          <span className="block text-[10px] text-emerald-400 font-semibold">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs">No orders placed by this customer yet.</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSendWhatsApp(selectedUser)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Customer Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{isCreateOpen ? "Register New Customer" : "Edit Customer Profile"}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shinde"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  placeholder="Flat/House No., Street, Landmark..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="Enter city or district"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 411001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isCreateOpen ? "Account Password (Default is phone number)" : "Reset Password (Optional)"}
                </label>
                <input
                  type="password"
                  placeholder={isCreateOpen ? "Leave blank to use phone number" : "Enter new password if resetting"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : isCreateOpen ? "Create Customer" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
