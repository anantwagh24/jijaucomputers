"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WebsiteSettingsData } from "@/lib/types";

const defaultSettings: WebsiteSettingsData = {
  id: "default",
  storeName: "Jijau Computers",
  tagline: "Pune's #1 Destination for Laptops, Custom Gaming PCs & Computer Hardware",
  logoUrl: "/images/jijau-logo.jpg",
  darkLogoUrl: "/images/jijau-logo.jpg",
  faviconUrl: "/favicon.png",
  primaryColor: "#2563eb",
  secondaryColor: "#f59e0b",
  phone: "+91 88056 07908",
  whatsapp: "918805607908",
  email: "sales@jijaucomputers.in",
  address: "Shop No. 12 & 13, Jijau Plaza, Near Railway Station, Shivajinagar, Pune, Maharashtra 411005",
  googleMapsUrl: "https://maps.google.com/?q=Shivajinagar,Pune,Maharashtra",
  openingHours: "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM",
  gstin: "27AABCJ1234F1Z9",
  upiId: "jijauc@ibl",
  upiName: "Jijau Computers",
  facebookUrl: "https://facebook.com/jijaucomputers",
  instagramUrl: "https://instagram.com/jijaucomputers",
  youtubeUrl: "https://youtube.com/jijaucomputers",
  linkedinUrl: "https://linkedin.com/company/jijaucomputers",
  metaTitle: "Jijau Computers - Premium Laptops, Gaming PCs & Hardware Store in Pune",
  metaDescription: "Explore the best deals on custom gaming PCs, laptops, graphics cards, processors, CCTV, and same-day repair services at Jijau Computers Pune.",
  metaKeywords: "jijau computers pune, gaming pc build pune, custom pc quote, laptops shop pune",
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
