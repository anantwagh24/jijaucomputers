"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Trash2,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Laptop,
} from "lucide-react";

interface VisitorLogItem {
  id: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  os: string;
  page: string;
  referrer: string;
  userAgent?: string;
  createdAt: string;
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorLogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [range, setRange] = useState("7d");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    desktopPct: 0,
    mobilePct: 0,
  });

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/visitors?range=${range}&search=${encodeURIComponent(
          search
        )}&page=${page}&limit=50`
      );
      const data = await res.json();
      if (res.ok) {
        setVisitors(data.visitors || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to load visitors:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [range, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVisitors();
  };

  const handleClearOldRecords = async () => {
    if (!confirm("Are you sure you want to clear visitor logs older than 30 days?")) {
      return;
    }
    setClearing(true);
    try {
      const res = await fetch("/api/admin/visitors", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Old logs cleared successfully!");
        fetchVisitors();
      }
    } catch (e) {
      alert("Failed to clear old logs.");
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Visitors & Traffic Monitor
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live Tracking
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer IP addresses, geographical locations, devices, browsers, and visited store paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchVisitors}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Total Visits</span>
            <h3 className="text-2xl font-black text-white mt-1">{stats.totalVisits}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Unique Visitors</span>
            <h3 className="text-2xl font-black text-purple-400 mt-1">{stats.uniqueVisitors}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Mobile Traffic</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.mobilePct}%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Desktop Traffic</span>
            <h3 className="text-2xl font-black text-sky-400 mt-1">{stats.desktopPct}%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
            <Monitor className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card (Matching Screenshot) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        {/* Controls & Filter Bar (Matching Screenshot Header) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Dropdown */}
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold outline-none cursor-pointer focus:border-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by IP, location, page..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 sm:w-64 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-colors cursor-pointer"
              >
                Filter
              </button>
            </form>
          </div>

          {/* Clear Records Button */}
          <button
            type="button"
            onClick={handleClearOldRecords}
            disabled={clearing}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{clearing ? "Clearing..." : "Clear records older than 30 days"}</span>
          </button>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            <strong className="text-white">{totalCount}</strong> record(s) found • Page {page} of{" "}
            {totalPages}
          </span>
        </div>

        {/* Visitors Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-100/10 text-amber-200 border-b border-slate-800 font-bold">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">IP</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Browser</th>
                <th className="py-3 px-4">OS</th>
                <th className="py-3 px-4">Page</th>
                <th className="py-3 px-4">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                    <span>Loading visitor logs...</span>
                  </td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No visitor logs found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/60 transition-colors">
                    {/* Time */}
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-medium">
                      {formatDate(v.createdAt)}
                    </td>

                    {/* IP */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 font-mono text-[11px] border border-amber-500/30">
                        {v.ip}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{v.location}</span>
                      </div>
                    </td>

                    {/* Device */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${
                          v.device === "Mobile"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {v.device}
                      </span>
                    </td>

                    {/* Browser */}
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{v.browser}</td>

                    {/* OS */}
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{v.os}</td>

                    {/* Page */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link
                        href={v.page}
                        target="_blank"
                        className="font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                      >
                        <span>{v.page}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </td>

                    {/* Referrer */}
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap truncate max-w-[140px]">
                      {v.referrer !== "—" ? (
                        <a
                          href={v.referrer}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:underline truncate block"
                        >
                          {v.referrer}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400">
              Page <strong className="text-white">{page}</strong> of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
