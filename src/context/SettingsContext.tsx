"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WebsiteSettingsData } from "@/lib/types";

const defaultBranches = [
  {
    id: "branch-1",
    name: "Head Office & Main Branch (Jafrabad)",
    address: "Jijau Computer Sales & Service, Opposite SBI Bank, Main Road, Jafrabad, Dist. Jalna, Maharashtra - 431206",
    phone: "+91 88056 07908",
    whatsapp: "918805607908",
    email: "sales@jijaucomputers.in",
    mapUrl: "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA",
    isMain: true,
    timings: "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM",
  },
  {
    id: "branch-2",
    name: "Branch 2 - Laptop & Service Hub",
    address: "Jijau Computers Branch 2, Near Bus Stand, Market Yard Road, Maharashtra",
    phone: "+91 88056 07908",
    whatsapp: "918805607908",
    email: "support@jijaucomputers.in",
    mapUrl: "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA",
    isMain: false,
    timings: "Mon - Sat: 10:00 AM - 8:30 PM",
  },
  {
    id: "branch-3",
    name: "Branch 3 - CCTV & Gaming Experience Center",
    address: "Jijau Tech Center, Shivaji Chowk, Commercial Complex, Maharashtra",
    phone: "+91 88056 07908",
    whatsapp: "918805607908",
    email: "gaming@jijaucomputers.in",
    mapUrl: "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA",
    isMain: false,
    timings: "Mon - Sat: 10:00 AM - 9:00 PM",
  },
];

const defaultSettings: WebsiteSettingsData = {
  id: "default",
  storeName: "Jijau Computers",
  tagline: "Your Tech Partner",
  logoUrl: "/images/jijau-logo.jpg",
  darkLogoUrl: "/images/jijau-logo.jpg",
  faviconUrl: "/favicon.png",
  primaryColor: "#2563eb",
  secondaryColor: "#f59e0b",
  phone: "+91 88056 07908",
  whatsapp: "918805607908",
  email: "sales@jijaucomputers.in",
  address: "Jijau Computer Sales & Service, Opposite SBI Bank, Main Road, Jafrabad, Maharashtra - 431206",
  googleMapsUrl: "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA",
  openingHours: "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM",
  gstin: "27AABCJ1234F1Z9",
  upiId: "jijauc@ibl",
  upiName: "Jijau Computers",
  facebookUrl: "https://facebook.com/jijaucomputers",
  instagramUrl: "https://www.instagram.com/jijau_computers_jafrabad",
  youtubeUrl: "https://www.youtube.com/@Pavan_Kad_JAFRBAD",
  linkedinUrl: "https://linkedin.com/company/jijaucomputers",
  metaTitle: "Jijau Computers - Premium Laptops, Gaming PCs & Hardware Store",
  metaDescription: "Explore the best deals on custom gaming PCs, laptops, graphics cards, processors, CCTV, and repair services at Jijau Computers.",
  metaKeywords: "jijau computers, gaming pc build, custom pc quote, laptops shop, computer repair",
  branchesJson: JSON.stringify(defaultBranches),
  invoiceTerms: "1. Warranty valid only with official serial number and intact warranty seals.\n2. Goods once sold are subject to manufacturer standard warranty policy.\n3. Physical damage, liquid spillage, or unauthorized modifications are not covered under warranty.\n4. Disputes subject to legal jurisdiction only.",
  invoiceBankDetails: "Bank: HDFC Bank Ltd | A/C No: 50200012345678 | IFSC: HDFC0001234 | Branch: Jafrabad",
  invoiceHsnCode: "84713010",
  invoiceNotes: "Thank you for choosing Jijau Computers - Your Trusted Tech Partner!",
};

interface SettingsContextType {
  settings: WebsiteSettingsData;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
  loading: false,
});

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: WebsiteSettingsData | null;
}) {
  const [settings, setSettings] = useState<WebsiteSettingsData>(
    initialSettings || defaultSettings
  );
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data && data.storeName) {
          setSettings(data);
        }
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialSettings) {
      fetchSettings();
    }
  }, [initialSettings]);

  useEffect(() => {
    if (typeof document !== "undefined" && settings.primaryColor) {
      document.documentElement.style.setProperty("--primary", settings.primaryColor);
    }
    if (typeof document !== "undefined" && settings.secondaryColor) {
      document.documentElement.style.setProperty("--secondary", settings.secondaryColor);
    }
  }, [settings.primaryColor, settings.secondaryColor]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
