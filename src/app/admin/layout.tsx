"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  Sliders,
  Flame,
  Wrench,
  Cpu,
  FileText,
  MessageSquare,
  ShoppingBag,
  Settings,
  ExternalLink,
  Menu,
  X,
  Shield,
  LogOut,
  Users,
  Star,
  HeartHandshake,
  UserCheck,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Registered Users", href: "/admin/users", icon: UserCheck },
  { label: "Happy Customers", href: "/admin/happy-customers", icon: HeartHandshake },
  { label: "Visitors", href: "/admin/visitors", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Product Reviews", href: "/admin/reviews", icon: Star },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Brands", href: "/admin/brands", icon: Tags },
  { label: "Homepage Banners", href: "/admin/banners", icon: Sliders },
  { label: "Offers & Coupons", href: "/admin/offers", icon: Flame },
  { label: "Repair / Service Requests", href: "/admin/service-requests", icon: Wrench },
  { label: "Custom PC Requests", href: "/admin/custom-pc", icon: Cpu },
  { label: "B2B Quotations", href: "/admin/quotations", icon: FileText },
  { label: "Customer Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Store Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Website Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("jijau_admin_session");
      window.location.href = "/admin/login";
    }
  };

  // Find active nav title
  const activeItem = NAV_ITEMS.find((item) => item.href === pathname) || {
    label: "Admin Panel",
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-3.5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src={settings.logoUrl || "/images/jijau-logo.jpg"}
            alt="Jijau Computers"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/80 shadow"
          />
          <span className="font-bold text-white text-sm">Jijau Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header - Fixed Height */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950">
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src={settings.logoUrl || "/images/jijau-logo.jpg"}
              alt="Jijau Computers"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
            />
            <div>
              <span className="font-black text-sm text-white block tracking-tight">
                Jijau Admin
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Store Management
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Scrollable container filling remaining vertical space */}
        <nav className="flex-1 min-h-0 p-2.5 space-y-1 overflow-y-auto text-xs scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions - Fixed at bottom of sidebar */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 shrink-0 bg-slate-950">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 text-xs font-semibold transition-colors"
              title="View Public Store"
            >
              <span>Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="text-center pt-0.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[9px] text-slate-400">
              <span>Built with ❤️ by</span>
              <img
                src="/images/tech-sprout-logo.png"
                alt="Tech Sprout"
                className="w-3 h-3 rounded object-contain"
              />
              <span className="font-extrabold text-orange-400">Tech Sprout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <div className="flex-1 min-w-0 flex flex-col bg-slate-900">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 bg-slate-950/60 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Admin</span>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-xs font-bold text-white">{activeItem.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            >
              <span>View Public Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

