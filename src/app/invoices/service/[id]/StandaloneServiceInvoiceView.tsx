"use client";

import React, { useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Printer, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

function numberToWordsINR(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Zero Rupees Only";

  const single = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertSection(n: number): string {
    let str = "";
    if (n > 99) {
      str += single[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + " " + single[n % 10] + " ";
    } else if (n > 0) {
      str += single[n] + " ";
    }
    return str.trim();
  }

  let num = rounded;
  let words = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  if (crore > 0) words += convertSection(crore) + " Crore ";
  if (lakh > 0) words += convertSection(lakh) + " Lakh ";
  if (thousand > 0) words += convertSection(thousand) + " Thousand ";
  if (hundred > 0) words += convertSection(hundred) + " ";

  return ("Rupees " + words.trim() + " Only").replace(/\s+/g, " ");
}

export default function StandaloneServiceInvoiceView({
  service,
  settings,
}: {
  service: any;
  settings: any;
}) {
  const invoiceNo = `SRV-INV-${service.ticketId?.replace(/[^a-zA-Z0-9]/g, "") || "2001"}`;
  const invoiceDate = new Date(service.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const grandTotal = Number(service.estimatedCost) || 0;
  const taxableTotal = grandTotal > 0 ? Number((grandTotal / 1.18).toFixed(2)) : 0;
  const totalTax = grandTotal - taxableTotal;
  const cgst = Number((totalTax / 2).toFixed(2));
  const sgst = Number((totalTax / 2).toFixed(2));

  // Auto-print if ?print=true parameter is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("print") === "true") {
        setTimeout(() => {
          window.print();
        }, 300);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-3 sm:py-5 print:p-0 print:m-0 print:bg-white text-slate-900 font-sans print:min-h-0">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 4mm 6mm 4mm 6mm !important;
              }
              html, body {
                background: #ffffff !important;
                margin: 0 !important;
                padding: 0 !important;
                height: 100% !important;
                max-height: 100% !important;
                overflow: hidden !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-size: 9px !important;
              }
              .no-print, header, footer, nav, aside, button, [role="navigation"], [class*="MobileBottomNav"] {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
              }
              .invoice-card {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 100% !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                overflow: hidden !important;
              }
            }
          `,
        }}
      />

      {/* Top Controls Bar */}
      <div className="max-w-3xl mx-auto px-3 mb-2 flex items-center justify-between no-print print:hidden">
        <Link
          href="/track-service"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tracker</span>
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save 1-Page PDF</span>
        </button>
      </div>

      {/* 1-Page Compact Service Invoice Sheet */}
      <div className="invoice-card max-w-3xl mx-auto bg-white p-4 rounded-xl border border-slate-200 shadow-lg print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full print:p-0 space-y-2 text-[10px] leading-tight">
        {/* Header: Logo & Store Info */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-300 pb-2">
          <div className="flex items-start gap-2.5">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center p-0.5">
              <img
                src={settings.logoUrl || "/images/jijau-logo.jpg"}
                alt={settings.storeName || "Jijau Computers"}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-none">
                {settings.storeName || "JIJAU COMPUTERS"}
              </h1>
              <p className="text-[9px] font-bold text-blue-700 uppercase tracking-wide">
                {settings.tagline || "Your Tech Partner"}
              </p>
              <p className="text-[9px] text-slate-600 max-w-sm leading-snug">
                {settings.address || "Shop No. 12 & 13, Jijau Plaza, Shivajinagar, Pune, Maharashtra 411005"}
              </p>
              <p className="text-[9px] text-slate-600 font-mono">
                Phone: {settings.phone || "+91 88056 07908"} | Email: {settings.email || "sales@jijaucomputers.in"}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-0.5 sm:shrink-0 bg-slate-50 sm:bg-transparent p-1.5 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[9px] uppercase tracking-wider">
              SERVICE TAX BILL (ORIGINAL)
            </span>
            <p className="font-mono text-xs font-black text-slate-950 mt-0.5">#{invoiceNo}</p>
            <p className="text-[9px] text-slate-600 font-semibold">Date: {invoiceDate}</p>
            <p className="text-[9px] text-slate-900 font-bold font-mono">
              GSTIN: <span className="text-blue-700">{settings.gstin || "27FQIPK5154C1ZU"}</span>
            </p>
            <p className="text-[8.5px] text-slate-600">State: Maharashtra (Code: 27)</p>
          </div>
        </div>

        {/* Customer / Billed To Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">
              Customer Details:
            </span>
            <p className="text-[11px] font-black text-slate-900">{service.customerName}</p>
            <p className="text-[9px] text-slate-600 font-mono">
              Phone: {service.phone} {service.email ? `| Email: ${service.email}` : ""}
            </p>
          </div>

          <div className="sm:text-right space-y-0.5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">
              Service Ticket Reference:
            </span>
            <p className="text-[9px] text-slate-700 font-semibold">
              Ticket ID: <span className="font-mono font-bold text-slate-900">{service.ticketId}</span>
            </p>
            <p className="text-[9px] text-slate-700 font-semibold">
              Device: <span className="font-bold text-slate-900">{service.brand} {service.model}</span>
            </p>
            <p className="text-[9px] text-slate-700 font-semibold">
              Place of Supply: <span className="font-bold text-slate-900">Pune, Maharashtra (27)</span>
            </p>
          </div>
        </div>

        {/* Items Table with GST Breakup */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-[9px] border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[8px]">
                <th className="py-1 px-2 w-5 text-center">#</th>
                <th className="py-1 px-2">Repair & Diagnosis Description</th>
                <th className="py-1 px-2 text-center">SAC Code</th>
                <th className="py-1 px-2 text-center">Qty</th>
                <th className="py-1 px-2 text-right">Taxable (₹)</th>
                <th className="py-1 px-2 text-right">CGST (9%)</th>
                <th className="py-1 px-2 text-right">SGST (9%)</th>
                <th className="py-1 px-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50/50">
                <td className="py-1 px-2 text-center font-mono text-slate-500">1</td>
                <td className="py-1 px-2">
                  <p className="font-bold text-slate-950 leading-tight">
                    {service.deviceType} Repair: {service.brand} {service.model} ({service.issueDesc})
                  </p>
                  <p className="text-[8px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Warranty: 90 Days Service Warranty</span>
                  </p>
                </td>
                <td className="py-1 px-2 text-center font-mono text-slate-600">998713</td>
                <td className="py-1 px-2 text-center font-bold text-slate-900">1</td>
                <td className="py-1 px-2 text-right font-mono text-slate-700">₹{taxableTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="py-1 px-2 text-right font-mono text-slate-600">₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="py-1 px-2 text-right font-mono text-slate-600">₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="py-1 px-2 text-right font-mono font-black text-slate-950">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Summary & Grand Total */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          <div className="space-y-1.5">
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">
                Amount in Words:
              </span>
              <p className="text-[9px] font-bold text-slate-900 italic leading-tight">
                {numberToWordsINR(grandTotal)}
              </p>
            </div>

            <div className="p-1.5 bg-blue-50/60 rounded-lg border border-blue-100 space-y-0.5 text-[8.5px]">
              <span className="text-[8px] font-black text-blue-900 uppercase tracking-wider block">
                Bank & UPI Payment Details:
              </span>
              <p className="text-slate-700 font-mono text-[8.5px] leading-tight">
                {settings.invoiceBankDetails || "Bank: HDFC Bank Ltd | A/C: 50200012345678 | IFSC: HDFC0001234 | Branch: Station Road, Pune"}
              </p>
              <p className="text-slate-700 font-mono font-bold text-[8.5px]">
                UPI VPA: <span className="text-blue-700">{settings.upiId || "jijauc@ibl"}</span> ({settings.upiName || "Jijau Computers"})
              </p>
            </div>
          </div>

          <div className="space-y-0.5 text-[9px] bg-slate-50 p-2 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-600 pb-0.5 border-b border-slate-200">
              <span>Taxable Amount:</span>
              <span className="font-mono font-bold text-slate-800">₹{taxableTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600 pb-0.5 border-b border-slate-200">
              <span>CGST (9%):</span>
              <span className="font-mono font-bold text-slate-800">₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600 pb-0.5 border-b border-slate-200">
              <span>SGST (9%):</span>
              <span className="font-mono font-bold text-slate-800">₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-0.5 text-slate-950 font-black">
              <span>Grand Total (Incl. 18% GST):</span>
              <span className="font-mono text-xs text-blue-700">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Terms, Conditions & Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200">
          <div className="sm:col-span-2 space-y-0.5">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-wider block">
              Service Terms & Warranty Conditions:
            </span>
            <div className="text-[8px] text-slate-500 whitespace-pre-line leading-tight">
              {settings.invoiceTerms ||
                "1. Warranty valid only with official serial number and intact warranty seals.\n2. Goods once sold are subject to manufacturer standard warranty policy.\n3. Physical damage, liquid spillage, or unauthorized modifications are not covered under warranty.\n4. Disputes subject to Pune Jurisdiction only."}
            </div>
            <p className="text-[7.5px] text-slate-400 italic">
              {settings.invoiceNotes || "Thank you for choosing Jijau Computers Pune - Your Trusted Tech Partner!"}
            </p>
          </div>

          <div className="flex flex-col justify-between items-center sm:items-end text-center sm:text-right pt-1 sm:pt-0">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-wider">
              For {settings.storeName || "JIJAU COMPUTERS"}
            </span>
            <div className="my-1 border-b border-slate-400 w-24 text-center">
              <span className="text-[7.5px] text-slate-400 uppercase italic">Authorized Signatory</span>
            </div>
            <p className="text-[7.5px] text-slate-500 font-mono">Computer Generated Bill</p>
          </div>
        </div>
      </div>
    </div>
  );
}
