import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import {
  Filter,
  SlidersHorizontal,
  Search,
  Grid,
  List,
  Sparkles,
  Laptop,
  Monitor,
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Headphones,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    featured?: string;
    bestseller?: string;
    newArrival?: string;
    gaming?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, brand, search, sort, minPrice, maxPrice, inStockOnly, featured, bestseller, newArrival, gaming } = params;

  // Build filter query
  const where: any = {};
  if (category) where.category = { slug: category };
  if (brand) where.brand = { slug: brand };
  if (featured === "true") where.isFeatured = true;
  if (bestseller === "true") where.isBestseller = true;
  if (newArrival === "true") where.isNewArrival = true;
  if (gaming === "true") where.isGamingDeal = true;
  if (inStockOnly === "true") where.inStock = true;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { shortDesc: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  else if (sort === "price-high") orderBy = { price: "desc" };
  else if (sort === "popular") orderBy = { isBestseller: "desc" };

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        brand: true,
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;
  const activeBrandName = brands.find((b) => b.slug === brand)?.name;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            {category && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-semibold">{activeCategoryName || category}</span>
              </>
            )}
            {brand && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-semibold">{activeBrandName || brand}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activeCategoryName
                  ? activeCategoryName
                  : activeBrandName
                  ? `${activeBrandName} Hardware`
                  : search
                  ? `Search Results for "${search}"`
                  : "All Computer Hardware & Laptops"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing <span className="font-bold text-slate-800">{products.length}</span> authentic products with manufacturer warranty
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Sort by:</span>
              <form method="GET" action="/products">
                {category && <input type="hidden" name="category" value={category} />}
                {brand && <input type="hidden" name="brand" value={brand} />}
                {search && <input type="hidden" name="search" value={search} />}
                <select
                  name="sort"
                  defaultValue={sort || "newest"}
                  // Automatically submit on select change
                  className="text-xs font-semibold bg-white border border-slate-300 rounded-lg py-2 px-3 outline-none focus:border-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="popular">Most Popular / Bestsellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </form>
            </div>
          </div>
        </div>

        {/* 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Sidebar */}
          <aside className="space-y-6">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  Filters
                </span>
                {(category || brand || search || minPrice || maxPrice || inStockOnly) && (
                  <Link
                    href="/products"
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </Link>
                )}
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <Link
                    href="/products"
                    className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors ${
                      !category ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>All Departments</span>
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}${brand ? `&brand=${brand}` : ""}`}
                      className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors ${
                        category === c.slug
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {c._count?.products ?? 0}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Brands
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/products?brand=${b.slug}${category ? `&category=${category}` : ""}`}
                      className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors ${
                        brand === b.slug
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{b.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Ranges Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Price Range
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <Link
                    href={`/products?${category ? `category=${category}&` : ""}maxPrice=25000`}
                    className="block py-1 px-2 hover:bg-slate-50 rounded"
                  >
                    Under ₹25,000
                  </Link>
                  <Link
                    href={`/products?${category ? `category=${category}&` : ""}minPrice=25000&maxPrice=60000`}
                    className="block py-1 px-2 hover:bg-slate-50 rounded"
                  >
                    ₹25,000 - ₹60,000
                  </Link>
                  <Link
                    href={`/products?${category ? `category=${category}&` : ""}minPrice=60000&maxPrice=120000`}
                    className="block py-1 px-2 hover:bg-slate-50 rounded"
                  >
                    ₹60,000 - ₹1,20,000
                  </Link>
                  <Link
                    href={`/products?${category ? `category=${category}&` : ""}minPrice=120000`}
                    className="block py-1 px-2 hover:bg-slate-50 rounded font-semibold text-blue-600"
                  >
                    Above ₹1,20,000 (Enthusiast / Workstation)
                  </Link>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/products?${category ? `category=${category}&` : ""}${
                    inStockOnly === "true" ? "" : "inStockOnly=true"
                  }`}
                  className={`flex items-center justify-between text-xs p-2 rounded-xl border transition-colors ${
                    inStockOnly === "true"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>In-Stock Only</span>
                  <span className={`w-2 h-2 rounded-full ${inStockOnly === "true" ? "bg-emerald-500" : "bg-slate-300"}`} />
                </Link>
              </div>
            </div>

            {/* Custom PC Promo in Sidebar */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full inline-block">
                Custom Configurator
              </span>
              <h4 className="text-sm font-bold leading-snug">
                Need a tailored PC setup for your budget?
              </h4>
              <p className="text-xs text-slate-300">
                Use our interactive builder to select CPU, GPU, RAM and get a direct quote.
              </p>
              <Link
                href="/custom-pc"
                className="block w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs text-center transition-colors shadow"
              >
                Launch PC Builder
              </Link>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No products matched your criteria
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Try adjusting your filters, clearing search keywords, or contacting our team over WhatsApp for special orders.
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow inline-block"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
