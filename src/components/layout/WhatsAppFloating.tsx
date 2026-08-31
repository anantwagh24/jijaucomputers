"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { MessageCircle, X, Sparkles } from "lucide-react";

export default function WhatsAppFloating() {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  if (!settings.whatsapp) return null;

  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hello Jijau Computers! I am interested in purchasing computer hardware / laptop / PC build."
  )}`;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end group">
      {/* Optional Interactive Floating Tooltip */}
      {showTooltip && (
        <div className="mb-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/95 text-white text-[11px] font-bold shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>Need Help? Chat on WhatsApp</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jijau Computers on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#4eed8a] text-white shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.7)] transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
      >
        {/* Pulse Radar Rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white stroke-none drop-shadow-md" />
      </a>
    </div>
  );
}
