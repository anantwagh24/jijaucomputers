import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (!salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function generateWhatsAppUrl(phone: string = "918805607908", text: string = ""): string {
  const cleanPhone = (phone || "918805607908").replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(text || "");
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateTicketId(prefix: string = "JC-SRV"): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `JC-ORD-${date}-${randomNum}`;
}

export function generateQuoteNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `JC-QTE-${randomNum}`;
}

export function generatePcReqNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `JC-RIG-${randomNum}`;
}
