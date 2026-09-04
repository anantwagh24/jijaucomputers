"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Wrench,
  Cpu,
  Flame,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Shield,
  Laptop,
  Monitor,
  Tv,
  Layers,
  HardDrive,
  Headphones,
  Check,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function Header() {
  const { settings } = useSettings();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.warn("Categories fetch note:", err));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const url = `/products?search=${encodeURIComponent(searchQuery.trim())}${
      selectedCategory !== "all" ? `&category=${selectedCategory}` : ""
    }`;
    router.push(url);
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "laptops": return <Laptop className="w-4 h-4 text-blue-600" />;
      case "desktop-pcs": return <Monitor className="w-4 h-4 text-indigo-600" />;
      case "custom-gaming-pcs": return <Cpu className="w-4 h-4 text-amber-500" />;
      case "processors": return <Cpu className="w-4 h-4 text-sky-600" />;
      case "graphics-cards": return <Tv className="w-4 h-4 text-emerald-600" />;
      case "motherboards": return <Layers className="w-4 h-4 text-purple-600" />;
      case "ram-memory":
      case "storage": return <HardDrive className="w-4 h-4 text-cyan-600" />;
      case "gaming-accessories": return <Headphones className="w-4 h-4 text-rose-500" />;
      default: return <Monitor className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. TOP ANNOUNCEMENT / CONTACT BAR (Hidden on mobile for clean mobile-first view) */}
      <div className="hidden md:block bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Store Timing & Location */}
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-0.5">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Authorized Computer & Hardware Dealer in Pune
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {settings.openingHours || "10:00 AM - 9:00 PM"}
            </span>
          </div>

          {/* Right: Quick Action Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/track-service"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <Wrench className="w-3.5 h-3.5" />
              Track Repair / Service
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/quote-request"
              className="hover:text-white transition-colors"
            >
              Request Quote
            </Link>
            <span className="text-slate-600">|</span>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Search, Logo, Cart, Wishlist, Account) */}
      <div className={`glass-nav border-b border-slate-200 shadow-sm transition-all duration-300 ${
        isScrolled ? "py-2.5" : "py-3.5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none shrink-0"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="relative shrink-0 flex items-center justify-center">
                <img
                  src={settings.logoUrl || "/images/jijau-logo.jpg"}
                  alt={settings.storeName || "Jijau Computers"}
                  className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-full object-cover shrink-0 ring-2 ring-amber-400/90 shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 leading-tight truncate">
                  {settings.storeName || "Jijau Computers"}
                </span>
                <span className="hidden sm:block text-[9px] sm:text-xs font-semibold text-blue-600 tracking-wider uppercase truncate">
                  Sales • Custom PCs • Repairs
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar with Category Dropdown */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-blue-600/30 hover:border-blue-600 focus-within:border-blue-600 rounded-full bg-white shadow-sm overflow-hidden transition-all"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs font-medium py-2.5 px-3 border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search laptops, RTX 4070, Intel i7, monitors, RAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="px-5 py-2.5 text-white font-medium text-sm flex items-center gap-1.5 transition-colors"
              style={{ backgroundColor: settings.primaryColor || "#2563eb" }}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Right Action Icons (Custom PC Rig, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Custom PC Builder CTA Button */}
            <Link
              href="/custom-pc"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all hover:scale-105"
            >
              <Cpu className="w-4 h-4" />
              <span>PC Builder</span>
              <span className="bg-slate-900 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                Rig
              </span>
            </Link>

            {/* Wishlist (Visible on tablet & desktop, accessible via account/bottom nav on mobile) */}
            <Link
              href="/account?tab=wishlist"
              className="hidden sm:flex relative p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full text-slate-800 hover:bg-blue-50 border border-slate-200 transition-colors"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Cart</span>
                <span className="text-xs font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
            </button>

            {/* User Account / Sign In */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-slate-900 transition-colors"
                title="My Account"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-[11px] flex items-center justify-center shadow-sm shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline text-xs font-bold truncate max-w-[90px] text-purple-950">
                  {user.name ? user.name.split(" ")[0] : "Account"}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all hover:scale-105 shadow-sm"
                title="Sign In / Register"
              >
                <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Admin Access (Desktop & Tablet) */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              title="Admin CMS"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border border-slate-300 rounded-lg bg-white shadow-sm overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search computers, laptops, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-slate-800 outline-none"
            />
            <button
              type="submit"
              className="p-2 text-white"
              style={{ backgroundColor: settings.primaryColor || "#2563eb" }}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. CATEGORY & MEGA MENU NAVIGATION BAR */}
      <nav className="hidden lg:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* All Categories Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="flex items-center gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider text-white"
              style={{ backgroundColor: settings.primaryColor || "#2563eb" }}
            >
              <Menu className="w-4 h-4" />
              <span>Browse Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Menu Dropdown */}
            {megaMenuOpen && (
              <div
                onMouseLeave={() => setMegaMenuOpen(false)}
                className="absolute top-full left-0 w-72 bg-white rounded-b-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}`}
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(c.slug)}
                      <span>{c.name}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-1 font-semibold text-xs text-slate-700">
            <Link
              href="/devices"
              className="px-3 py-3 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 font-black bg-blue-50/80 rounded-lg my-1 border border-blue-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Devices Hub (Laptop, Mobile, Printer, CCTV)</span>
            </Link>
            <Link
              href="/products"
              className="px-3 py-3 hover:text-blue-600 transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/products?category=laptops"
              className="px-3 py-3 hover:text-blue-600 transition-colors"
            >
              Laptops
            </Link>
            <Link
              href="/custom-pc"
              className="px-3 py-3 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 font-bold"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              Custom PC Builder
            </Link>
            <Link
              href="/products?category=graphics-cards"
              className="px-3 py-3 hover:text-blue-600 transition-colors"
            >
              Graphics Cards
            </Link>
            <Link
              href="/products?category=processors"
              className="px-3 py-3 hover:text-blue-600 transition-colors"
            >
              Processors
            </Link>
            <Link
              href="/offers"
              className="px-3 py-3 text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 font-bold"
            >
              <Flame className="w-3.5 h-3.5" />
              Special Offers
            </Link>
            <Link
              href="/track-service"
              className="px-3 py-3 text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" />
              Repair Tracker
            </Link>
            <Link
              href="/about"
              className="px-3 py-3 hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="px-3 py-3 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* WhatsApp Direct Chat Hotline */}
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              "Hello Jijau Computers, I would like to buy / inquire about computer hardware products."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs hover:text-emerald-800 transition-all py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
            title={`Jijau Computers Official WhatsApp (+91 ${settings.whatsapp})`}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-emerald-600 shrink-0">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.07-2.125-.522-1.829-.759-3.003-2.628-3.094-2.75-.09-.12-0.749-.998-.749-1.905 0-.907.474-1.353.643-1.537.17-.184.372-.23.496-.23.125 0 .25.002.359.006.115.006.27-.044.422.321.157.38.536 1.309.584 1.405.048.096.08.209.016.337-.064.128-.096.208-.192.32-.096.112-.204.25-.291.336-.098.096-.2.201-.086.397.114.195.508.839 1.09 1.357.75.669 1.383.876 1.579.972.196.096.312.08.428-.052.116-.133.496-.578.628-.777.133-.2.266-.167.449-.099.183.068 1.164.549 1.365.65.201.101.335.151.384.234.049.083.049.48-.095.885z" />
            </svg>
            <span>Buy on WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 overflow-y-auto">
            {/* Mobile Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-6 h-6 text-amber-400" />
                <span className="font-bold text-lg">{settings.storeName}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="p-4 space-y-3 flex-1">
              <Link
                href="/devices"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-blue-600 font-bold text-white shadow-sm"
              >
                <span className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Devices (Laptop, Mobile, Printer, CCTV)
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase font-black">
                  Explore
                </span>
              </Link>

              <Link
                href="/custom-pc"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-400 font-bold text-slate-950 shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Custom PC Builder
                </span>
                <span className="text-xs bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full uppercase">
                  Configure
                </span>
              </Link>

              <Link
                href="/offers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 font-bold"
              >
                <Flame className="w-5 h-5" />
                Special Offers & Deals
              </Link>

              <Link
                href="/track-service"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold"
              >
                <Wrench className="w-5 h-5" />
                Track Repair / Service Request
              </Link>

              <div className="border-t border-slate-200 pt-3">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Product Categories
                </span>
                <div className="mt-2 space-y-1">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-3 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      {getCategoryIcon(c.slug)}
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-sm text-slate-600">
                <Link
                  href="/quote-request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 px-3 hover:text-blue-600"
                >
                  Request Bulk Quotation
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 px-3 hover:text-blue-600"
                >
                  About Jijau Computers
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 px-3 hover:text-blue-600"
                >
                  Store Location & Timings
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-blue-600 font-bold bg-blue-50 rounded-lg mt-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel Login
                </Link>
              </div>
            </div>

            {/* Mobile Footer Contact */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="truncate">{settings.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
