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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <img
            src={settings.logoUrl || "/images/jijau-logo.jpg"}
            alt="Jijau Computers"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/80 shadow"
          />
          <span className="font-bold text-white text-sm">Jijau Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Store Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <img
                src={settings.logoUrl || "/images/jijau-logo.jpg"}
                alt="Jijau Computers"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
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

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar text-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action: View Live Storefront & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 text-xs font-bold transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("jijau_admin_session");
                document.cookie = "jijau_admin_auth=; path=/; max-age=0";
                window.location.href = "/admin/login";
              }
            }}
            className="flex items-center justify-center gap-2 w-full py-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <div className="pt-1 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
              <span>Built with ❤️ by</span>
              <img
                src="/images/tech-sprout-logo.png"
                alt="Tech Sprout"
                className="w-3.5 h-3.5 rounded object-contain"
              />
              <span className="font-extrabold text-orange-400">Tech Sprout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-900 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
