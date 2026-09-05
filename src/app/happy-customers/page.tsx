"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import {
  Users,
  MapPin,
  Sparkles,
  Star,
  CheckCircle2,
  Search,
  Filter,
  X,
  Share2,
  Laptop,
  Cpu,
  ShieldCheck,
  Calendar,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface HappyCustomer {
  id: string;
  name: string;
  city: string;
  village?: string | null;
  district: string;
  phone?: string | null;
  productName: string;
  photoUrl: string;
  review?: string | null;
  rating: number;
  purchaseDate?: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

export default function HappyCustomersPage() {
  const [customers, setCustomers] = useState<HappyCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<HappyCustomer | null>(null);

  // Read URL params on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCity = params.get("city");
      const urlDistrict = params.get("district");
      if (urlCity) setSelectedCity(urlCity);
      if (urlDistrict) setSelectedDistrict(urlDistrict);
    }
  }, []);

  // Fetch customers from API
  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedDistrict !== "All") queryParams.append("district", selectedDistrict);
        if (selectedCity !== "All") queryParams.append("city", selectedCity);
        if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

        const res = await fetch(`/api/happy-customers?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setCustomers(data.customers || []);
          if (data.filters) {
            setDistricts(["All", ...(data.filters.districts || [])]);
            setCities(["All", ...(data.filters.cities || [])]);
          }
        }
      } catch (err) {
        console.error("Error fetching happy customers:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchCustomers();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedDistrict, selectedCity, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-400 font-bold">Happy Customers & Deliveries</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Real Deliveries & Customer Smiles Across Maharashtra</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Our <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Happy Customers</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Explore authentic photos of happy customers who assembled custom gaming rigs, bought laptops, and upgraded tech with Jijau Computers Pune.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-400">150+</div>
                <div className="text-[11px] text-slate-400 font-semibold">Setups Delivered</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-blue-400">100%</div>
                <div className="text-[11px] text-slate-400 font-semibold">Brand Genuine</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">12+</div>
                <div className="text-[11px] text-slate-400 font-semibold">Cities & Districts</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-purple-400">5.0 ★</div>
                <div className="text-[11px] text-slate-400 font-semibold">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar Controls */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80 space-y-4">
            
            {/* Search + Clear Row */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer name, village, city, product (e.g. RTX 4080, MacBook, Baramati)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {(selectedDistrict !== "All" || selectedCity !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDistrict("All");
                    setSelectedCity("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            {/* District Filter Pills */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter by District:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {districts.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => {
                      setSelectedDistrict(dist);
                      setSelectedCity("All");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedDistrict === dist
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {dist === "All" ? "All Districts" : dist}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter by City / Town:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCity === city
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {city === "All" ? "All Cities" : city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Happy Customers Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Customer Gallery ({customers.length})
              </h2>
              <p className="text-xs text-slate-500">
                {selectedDistrict !== "All" ? `Showing customers from ${selectedDistrict} district` : "Showing all verified customer deliveries across Maharashtra"}
              </p>
            </div>

            <a
              href="https://wa.me/918805607908?text=Hello%20Jijau%20Computers!%20I%20want%20to%20share%20my%20customer%20photo%20and%20review%20for%20the%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Share Your Story</span>
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse space-y-4">
                  <div className="w-full h-56 bg-slate-200 rounded-2xl" />
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-12 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                📸
              </div>
              <h3 className="text-lg font-bold text-slate-900">No customer photos found for this filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search term or choosing a different city/district.
              </p>
              <button
                onClick={() => {
                  setSelectedDistrict("All");
                  setSelectedCity("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
              >
                View All Customers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map((c) => (
                <div
                  key={c.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Image Container with Zoom & Click Preview */}
                  <div
                    onClick={() => setSelectedPhoto(c)}
                    className="relative w-full h-64 bg-slate-950 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-[11px] font-black shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{c.village ? `${c.village}, ` : ""}{c.city}</span>
                    </div>

                    {/* Verified Buyer Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black tracking-wide uppercase shadow-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </div>

                    {/* Date on photo bottom */}
                    {c.purchaseDate && (
                      <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-300 bg-slate-900/70 px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{c.purchaseDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {c.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(c.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Product Tag */}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-950 text-xs font-bold">
                        <Laptop className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{c.productName}</span>
                      </div>

                      {/* Review Quote */}
                      {c.review && (
                        <p className="text-xs text-slate-600 italic leading-relaxed pt-1">
                          "{c.review}"
                        </p>
                      )}
                    </div>

                    {/* Location Details Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-semibold">
                        <span>District:</span>
                        <span className="text-slate-800 font-bold">{c.district}</span>
                      </div>

                      <button
                        onClick={() => setSelectedPhoto(c)}
                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                      >
                        View Full Photo →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Submission Banner at Bottom */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black">
                Purchased a PC or Laptop from Jijau Computers?
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
                Send us your setup photo on WhatsApp and get featured on our official website along with an exclusive loyalty discount on your next upgrade!
              </p>
            </div>

            <a
              href="https://wa.me/918805607908?text=Hello%20Jijau%20Computers!%20I%20want%20to%20submit%20my%20photo%20for%20the%20Happy%20Customers%20gallery."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Send Photo on WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black">
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 text-white space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-black text-white">{selectedPhoto.name}</h3>
                  <div className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedPhoto.village ? `${selectedPhoto.village}, ` : ""}{selectedPhoto.city}, {selectedPhoto.district}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(selectedPhoto.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 text-xs font-bold text-slate-200">
                Purchased: {selectedPhoto.productName}
              </div>

              {selectedPhoto.review && (
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{selectedPhoto.review}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
