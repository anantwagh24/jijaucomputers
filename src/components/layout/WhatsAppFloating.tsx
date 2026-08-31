"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloating() {
  const { settings } = useSettings();

  if (!settings.whatsapp) return null;

  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hello Jijau Computers! I am interested in purchasing computer hardware / laptop / PC build."
  )}`;

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jijau Computers on WhatsApp"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 animate-soft-pulse focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          WhatsApp Us
        </span>
      </a>
      <span className="sr-only">Chat with Jijau Computers on WhatsApp</span>
    </aside>
  );
}
