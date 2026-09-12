"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, ShoppingBag, PhoneCall } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin-slow" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Temporary Connection Glitch
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          We are updating our store catalog. Please tap reload or explore our featured products.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Storefront
          </Link>

          <Link
            href="/devices"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Laptops & Devices
          </Link>
        </div>
      </div>
    </div>
  );
}
