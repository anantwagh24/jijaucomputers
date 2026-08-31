import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.websiteSetting.findUnique({
      where: { id: "default" },
    });

    return {
      title: settings?.metaTitle || "Jijau Computers - Computer & Laptop Store Pune",
      description: settings?.metaDescription || "Shop gaming PCs, laptops, components and repair services at Jijau Computers.",
      keywords: settings?.metaKeywords || "computer store, gaming pc, laptops, pc repair pune",
    };
  } catch (e) {
    return {
      title: "Jijau Computers - Computer & Laptop Store Pune",
      description: "Shop gaming PCs, laptops, components and repair services at Jijau Computers.",
    };
  }
}

import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialSettings = null;
  try {
    initialSettings = await prisma.websiteSetting.findUnique({
      where: { id: "default" },
    });
  } catch (e) {
    console.error("Error loading initial settings for RootLayout:", e);
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc]">
        <SettingsProvider initialSettings={initialSettings as any}>
          <CartProvider>
            <WishlistProvider>
              <div className="flex-1 pb-16 md:pb-0 flex flex-col min-h-screen">
                {children}
              </div>
              <MobileBottomNav />
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
