"use client";

import React, { useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { Printer, Download, XCircle, ShieldCheck, CheckCircle2, Building2, ExternalLink } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface GstInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
  service?: any;
}

// Convert numbers to Indian Rupees Words
function numberToWordsINR(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Zero Rupees Only";

  const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
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

export default function GstInvoiceModal({
  isOpen,
  onClose,
  order,
  service,
}: GstInvoiceModalProps) {
  const { settings } = useSettings();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || (!order && !service)) return null;

  const isOrder = Boolean(order);
  const invoiceNo = isOrder
    ? `INV-${order.orderNumber?.replace(/[^a-zA-Z0-9]/g, "") || "1001"}`
    : `SRV-INV-${service.ticketId?.replace(/[^a-zA-Z0-9]/g, "") || "2001"}`;

  const invoiceDate = new Date(
    isOrder ? order.createdAt || Date.now() : service.createdAt || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const customerName = isOrder ? order.customerName : service.customerName;
  const customerPhone = isOrder ? order.phone : service.phone;
  const customerEmail = isOrder ? order.email : service.email;
  const address = isOrder ? `${order.address}, ${order.city} - ${order.pincode}` : "Pune, Maharashtra";

  // Calculate totals and 18% GST breakup (9% CGST + 9% SGST for Maharashtra Intra-state)
  const grandTotal = isOrder ? Number(order.total) || 0 : Number(service.estimatedCost) || 0;
  const taxableTotal = grandTotal > 0 ? Number((grandTotal / 1.18).toFixed(2)) : 0;
  const totalTax = grandTotal - taxableTotal;
  const cgst = Number((totalTax / 2).toFixed(2));
  const sgst = Number((totalTax / 2).toFixed(2));

  const items = isOrder
    ? (order.items || []).map((item: any) => {
        const itemTotal = Number(item.price) * Number(item.quantity);
        const itemTaxable = Number((itemTotal / 1.18).toFixed(2));
        const itemCgst = Number(((itemTotal - itemTaxable) / 2).toFixed(2));
        const itemSgst = Number(((itemTotal - itemTaxable) / 2).toFixed(2));
        return {
          name: item.name,
          warranty: item.product?.warranty || "1 Year Brand Warranty",
          hsn: settings.invoiceHsnCode || "84713010",
          qty: item.quantity,
          unitPrice: (Number(item.price) / 1.18).toFixed(2),
          taxable: itemTaxable,
          cgst: itemCgst,
          sgst: itemSgst,
          total: itemTotal,
        };
      })
    : [
        {
          name: `${service.deviceType} Repair & Servicing: ${service.brand} ${service.model} (${service.issueDesc})`,
          warranty: "90 Days Service Warranty",
          hsn: "998713", // SAC code for computer repair services
          qty: 1,
          unitPrice: taxableTotal.toFixed(2),
          taxable: taxableTotal,
          cgst: cgst,
          sgst: sgst,
          total: grandTotal,
        },
      ];

  const handlePrint = () => {
    const url = isOrder
      ? `/invoices/order/${order.orderNumber}?print=true`
      : `/invoices/service/${service.ticketId}?print=true`;
    const printWindow = window.open(url, "_blank");
    if (!printWindow || printWindow.closed || typeof printWindow.closed === "undefined") {
      window.location.href = url;
    }
  };

  const standaloneUrl = isOrder
    ? `/invoices/order/${order.orderNumber}`
    : `/invoices/service/${service.ticketId}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:hidden no-print">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold tracking-tight">
              GST Tax Invoice & Warranty Certificate • {invoiceNo}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Standalone (1-Page)</span>
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save 1-Page PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-gst-invoice" ref={printRef} className="p-6 sm:p-8 space-y-4 text-xs bg-white text-slate-800 max-h-[80vh] overflow-y-auto">
          {/* Header Row: Official Logo & Store Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-300 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center p-1">
                <img
                  src={settings.logoUrl || "/images/jijau-logo.jpg"}
                  alt={settings.storeName || "Jijau Computers"}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {settings.storeName || "JIJAU COMPUTERS"}
                </h1>
                <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  {settings.tagline || "Your Tech Partner"}
                </p>
                <p className="text-[11px] text-slate-600 max-w-sm leading-relaxed">
                  {settings.address || "Station Road, Shivajinagar, Pune, Maharashtra 411005"}
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  Phone: {settings.phone || "+91 88056 07908"} | Email: {settings.email || "sales@jijaucomputers.in"}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 sm:shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
              <span className="inline-block px-3 py-1 rounded-md bg-blue-100 text-blue-900 font-black text-[11px] uppercase tracking-wider">
                TAX INVOICE (ORIGINAL)
              </span>
              <p className="font-mono text-sm font-black text-slate-950 mt-1">#{invoiceNo}</p>
              <p className="text-[11px] text-slate-600 font-semibold">Date: {invoiceDate}</p>
              <p className="text-[11px] text-slate-900 font-bold font-mono">
                GSTIN: <span className="text-blue-700">{settings.gstin || "27AABCJ1234F1Z9"}</span>
              </p>
              <p className="text-[11px] text-slate-600">State: Maharashtra (Code: 27)</p>
            </div>
          </div>

          {/* Customer / Billed To Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                Billed & Shipped To:
              </span>
              <p className="text-sm font-black text-slate-900">{customerName}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{address}</p>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                Phone: {customerPhone} {customerEmail ? `| Email: ${customerEmail}` : ""}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                Order & Payment Info:
              </span>
              <p className="text-[11px] text-slate-700 font-semibold">
                Reference ID: <span className="font-mono font-bold text-slate-900">{isOrder ? order.orderNumber : service.ticketId}</span>
              </p>
              <p className="text-[11px] text-slate-700 font-semibold">
                Payment Mode: <span className="font-bold text-slate-900">{isOrder ? order.paymentMode : "Direct UPI / Cash"}</span>
              </p>
              <p className="text-[11px] text-slate-700 font-semibold">
                Place of Supply: <span className="font-bold text-slate-900">Pune, Maharashtra (27)</span>
              </p>
            </div>
          </div>

          {/* Items Table with GST Breakup */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3 w-8 text-center">#</th>
                  <th className="p-3">Item Description & Warranty</th>
                  <th className="p-3 text-center">HSN/SAC</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Taxable (₹)</th>
                  <th className="p-3 text-right">CGST (9%)</th>
                  <th className="p-3 text-right">SGST (9%)</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-950">{item.name}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Warranty: {item.warranty}</span>
                      </p>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600">{item.hsn}</td>
                    <td className="p-3 text-center font-bold text-slate-900">{item.qty}</td>
                    <td className="p-3 text-right font-mono text-slate-700">₹{item.taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono text-slate-600">₹{item.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono text-slate-600">₹{item.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono font-black text-slate-950">₹{item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Summary & Grand Total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Amount in Words:
                </span>
                <p className="text-xs font-bold text-slate-900 italic">
                  {numberToWordsINR(grandTotal)}
                </p>
              </div>

              {/* Bank & UPI Details */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1 text-[11px]">
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider block">
                  Official Bank & UPI Payment Details:
                </span>
                <p className="text-slate-700 font-mono">
                  {settings.invoiceBankDetails || "Bank: HDFC Bank Ltd | A/C: 50200012345678 | IFSC: HDFC0001234 | Pune"}
                </p>
                <p className="text-slate-700 font-mono font-bold">
                  UPI VPA: <span className="text-blue-700">{settings.upiId || "jijauc@ibl"}</span> ({settings.upiName || "Jijau Computers"})
                </p>
              </div>
            </div>

            <div className="space-y-2 text-[11px] bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-slate-600 pb-1 border-b border-slate-200">
                <span>Total Taxable Amount:</span>
                <span className="font-mono font-bold text-slate-800">₹{taxableTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-1 border-b border-slate-200">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono font-bold text-slate-800">₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-1 border-b border-slate-200">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono font-bold text-slate-800">₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 text-slate-950 font-black">
                <span>Grand Total (Incl. 18% GST):</span>
                <span className="font-mono text-base text-blue-700">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Terms, Conditions & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">
                Terms & Warranty Conditions:
              </span>
              <div className="text-[10px] text-slate-500 space-y-1 whitespace-pre-line leading-relaxed">
                {settings.invoiceTerms ||
                  "1. Warranty valid only with official serial number and intact warranty seals.\n2. Goods once sold are subject to manufacturer standard warranty policy.\n3. Physical damage, liquid spillage, or unauthorized modifications are not covered under warranty.\n4. Disputes subject to Pune Jurisdiction only."}
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1">
                {settings.invoiceNotes || "Thank you for choosing Jijau Computers Pune - Your Trusted Tech Partner!"}
              </p>
            </div>

            <div className="flex flex-col justify-between items-center sm:items-end text-center sm:text-right pt-6 sm:pt-0">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                For {settings.storeName || "JIJAU COMPUTERS"}
              </span>
              <div className="my-6 border-b border-slate-400 w-36 text-center">
                <span className="text-[9px] text-slate-400 uppercase italic">Authorized Signatory</span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono">Computer Generated Invoice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
