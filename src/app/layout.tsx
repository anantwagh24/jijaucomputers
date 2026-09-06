import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
      title: settings?.metaTitle || "Jijau Computers - Computer & Laptop Store",
      description: settings?.metaDescription || "Shop gaming PCs, laptops, components and repair services at Jijau Computers.",
      keywords: settings?.metaKeywords || "computer store, gaming pc, laptops, pc repair, computer accessories",
      icons: {
        icon: "/favicon.png",
        apple: "/favicon.png",
      },
    };
  } catch (e) {
    return {
      title: "Jijau Computers - Computer & Laptop Store",
      description: "Shop gaming PCs, laptops, components and repair services at Jijau Computers.",
      icons: {
        icon: "/favicon.png",
        apple: "/favicon.png",
      },
    };
  }
}

import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import VisitorTracker from "@/components/common/VisitorTracker";

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
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc]">
        <SettingsProvider initialSettings={initialSettings as any}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <VisitorTracker />
                <div className="flex-1 pb-16 md:pb-0 flex flex-col min-h-screen">
                  {children}
                </div>
                <AuthModal />
                <MobileBottomNav />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
