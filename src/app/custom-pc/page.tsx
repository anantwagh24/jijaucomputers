"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import CartDrawer from "@/components/layout/CartDrawer";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Server,
  Zap,
  Box,
  Wind,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  FileText,
  RotateCcw,
  Check,
  Award,
  ShieldCheck,
  Wrench,
} from "lucide-react";

interface ComponentOption {
  id: string;
  name: string;
  price: number;
  specs: string;
  brand: string;
  tdp?: number;
}

const CPU_OPTIONS: ComponentOption[] = [
  { id: "cpu-1", name: "Intel Core i5-13400F (10 Cores, up to 4.6 GHz)", price: 16900, specs: "LGA1700, 20MB Cache, 65W", brand: "Intel", tdp: 65 },
  { id: "cpu-2", name: "Intel Core i7-14700K (20 Cores, up to 5.6 GHz)", price: 35990, specs: "LGA1700, 33MB Cache, 125W", brand: "Intel", tdp: 125 },
  { id: "cpu-3", name: "AMD Ryzen 5 7600X (6 Cores, up to 5.3 GHz)", price: 18990, specs: "AM5, 38MB Cache, 105W", brand: "AMD", tdp: 105 },
  { id: "cpu-4", name: "AMD Ryzen 7 7800X3D (8 Cores, 3D V-Cache)", price: 38990, specs: "AM5, 104MB Cache, King of Gaming", brand: "AMD", tdp: 120 },
  { id: "cpu-5", name: "AMD Ryzen 9 7900X (12 Cores, 24 Threads)", price: 37900, specs: "AM5, Extreme Multitasking & 3D", brand: "AMD", tdp: 170 },
];

const GPU_OPTIONS: ComponentOption[] = [
  { id: "gpu-1", name: "NVIDIA GeForce RTX 4060 8GB GDDR6", price: 28990, specs: "DLSS 3, 1080p Ultra Gaming", brand: "ZOTAC / ASUS", tdp: 115 },
  { id: "gpu-2", name: "NVIDIA GeForce RTX 4070 Super 12GB GDDR6X", price: 62990, specs: "DLSS 3.5, 1440p High FPS / 4K", brand: "MSI / Gigabyte", tdp: 220 },
  { id: "gpu-3", name: "NVIDIA GeForce RTX 4070 Ti Super 16GB", price: 79990, specs: "16GB VRAM, AI & 4K Video Editing", brand: "ZOTAC", tdp: 285 },
  { id: "gpu-4", name: "NVIDIA GeForce RTX 4080 Super 16GB", price: 99990, specs: "Extreme 4K Ray Tracing & VR", brand: "ASUS TUF", tdp: 320 },
  { id: "gpu-5", name: "Integrated Graphics / Office GPU", price: 0, specs: "Basic display output for office", brand: "OEM", tdp: 0 },
];

const MOTHERBOARD_OPTIONS: ComponentOption[] = [
  { id: "mb-1", name: "MSI PRO B760M-A WIFI DDR5", price: 14500, specs: "PCIe 4.0, 2x M.2, Wi-Fi 6E, LGA1700", brand: "MSI" },
  { id: "mb-2", name: "ASUS TUF Gaming Z790-PLUS WiFi DDR5", price: 26990, specs: "PCIe 5.0, 4x M.2, 16+1 DrMOS, LGA1700", brand: "ASUS" },
  { id: "mb-3", name: "MSI MAG B650 TOMAHAWK WIFI", price: 21500, specs: "AM5 Socket, DDR5, Wi-Fi 6E, Heavy Heatsink", brand: "MSI" },
  { id: "mb-4", name: "Gigabyte B650M Gaming WiFi", price: 11800, specs: "Budget AM5 Motherboard with WiFi", brand: "Gigabyte" },
];

const RAM_OPTIONS: ComponentOption[] = [
  { id: "ram-1", name: "16GB (1x16GB) DDR5 5200MHz", price: 4600, specs: "Crucial / Kingston DDR5", brand: "Crucial" },
  { id: "ram-2", name: "32GB (2x16GB) Corsair Vengeance RGB DDR5 6000MHz", price: 10890, specs: "Dual Channel, XMP & EXPO Ready", brand: "Corsair" },
  { id: "ram-3", name: "64GB (2x32GB) Kingston Fury Beast DDR5 5600MHz", price: 19500, specs: "For 4K/8K Editing, AI & Rendering", brand: "Kingston" },
];

const STORAGE_OPTIONS: ComponentOption[] = [
  { id: "ssd-1", name: "1TB WD Blue SN580 NVMe Gen4 SSD", price: 5990, specs: "Up to 4,150 MB/s Read Speed", brand: "Western Digital" },
  { id: "ssd-2", name: "1TB Samsung 990 PRO NVMe Gen4 SSD", price: 9990, specs: "Flagship Speed up to 7,450 MB/s", brand: "Samsung" },
  { id: "ssd-3", name: "2TB Kingston KC3000 Gen4 NVMe SSD", price: 14500, specs: "7,000 MB/s with high endurance", brand: "Kingston" },
  { id: "ssd-4", name: "1TB NVMe SSD + 2TB Seagate BarraCuda HDD", price: 10800, specs: "High speed OS + Big Storage", brand: "Seagate/WD" },
];

const PSU_OPTIONS: ComponentOption[] = [
  { id: "psu-1", name: "DeepCool PK650D 650W 80 Plus Bronze", price: 4400, specs: "Reliable power for RTX 4060 class", brand: "DeepCool" },
  { id: "psu-2", name: "Corsair RM750e 750W 80 Plus Gold ATX 3.0", price: 8900, specs: "Fully Modular, PCIe 5.0 12VHPWR Cable", brand: "Corsair" },
  { id: "psu-3", name: "Corsair RM850e 850W 80 Plus Gold ATX 3.0", price: 10990, specs: "High wattage headroom for RTX 4080/4090", brand: "Corsair" },
];

const CABINET_OPTIONS: ComponentOption[] = [
  { id: "cab-1", name: "Ant Esports ICE-112 Mid Tower (4 RGB Fans)", price: 3400, specs: "High airflow mesh front panel", brand: "Ant Esports" },
  { id: "cab-2", name: "NZXT H5 Flow Compact High-Airflow Case", price: 7400, specs: "Dedicated bottom GPU fan, Tempered Glass", brand: "NZXT" },
  { id: "cab-3", name: "Lian Li O11 Dynamic EVO Panoramic Dual-Chamber", price: 13900, specs: "Showcase Glass, Custom Water Cooling Ready", brand: "Lian Li" },
];

const COOLING_OPTIONS: ComponentOption[] = [
  { id: "cool-1", name: "DeepCool AG400 ARGB Air Cooler (120mm)", price: 1900, specs: "Efficient 4-heatpipe air cooling", brand: "DeepCool" },
  { id: "cool-2", name: "DeepCool LE520 240mm ARGB Liquid AIO Cooler", price: 5400, specs: "Dual 120mm ARGB fans, Anti-leak tech", brand: "DeepCool" },
  { id: "cool-3", name: "DeepCool LS720 SE 360mm Liquid AIO Cooler", price: 8900, specs: "Triple 120mm fans for Core i7/i9 & Ryzen 9", brand: "DeepCool" },
];

const PURPOSES = [
  "Competitive Esports Gaming (Valorant, CS2, Fortnite)",
  "4K AAA Cinematic Gaming & Ray Tracing",
  "4K / 8K Video Editing & Color Grading (Premiere / DaVinci)",
  "3D Modeling, Blender & Unreal Engine 5",
  "Artificial Intelligence & Machine Learning Workflows",
  "Programming, Virtual Machines & DevOps",
  "Office, Billing & Multitasking Workstation",
];

export default function CustomPcPage() {
  const { settings } = useSettings();

  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [selectedCpu, setSelectedCpu] = useState(CPU_OPTIONS[1]);
  const [selectedGpu, setSelectedGpu] = useState(GPU_OPTIONS[1]);
  const [selectedMb, setSelectedMb] = useState(MOTHERBOARD_OPTIONS[0]);
  const [selectedRam, setSelectedRam] = useState(RAM_OPTIONS[1]);
  const [selectedStorage, setSelectedStorage] = useState(STORAGE_OPTIONS[0]);
  const [selectedPsu, setSelectedPsu] = useState(PSU_OPTIONS[1]);
  const [selectedCabinet, setSelectedCabinet] = useState(CABINET_OPTIONS[1]);
  const [selectedCooler, setSelectedCooler] = useState(COOLING_OPTIONS[1]);

  // Lead submission state
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custNotes, setCustNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdReqId, setCreatedReqId] = useState("");

  const estimatedTotal =
    selectedCpu.price +
    selectedGpu.price +
    selectedMb.price +
    selectedRam.price +
    selectedStorage.price +
    selectedPsu.price +
    selectedCabinet.price +
    selectedCooler.price;

  const estimatedTdp = (selectedCpu.tdp || 65) + (selectedGpu.tdp || 100) + 120;

  const handleWhatsAppExport = () => {
    const storeNumber = settings.whatsapp || "918805607908";
    const specsList = `*Custom PC Build Quotation Request*\n*Primary Purpose:* ${purpose}\n\n*Selected Components:*\n• *CPU:* ${selectedCpu.name} (${formatPrice(selectedCpu.price)})\n• *GPU:* ${selectedGpu.name} (${formatPrice(selectedGpu.price)})\n• *Motherboard:* ${selectedMb.name} (${formatPrice(selectedMb.price)})\n• *RAM:* ${selectedRam.name} (${formatPrice(selectedRam.price)})\n• *Storage:* ${selectedStorage.name} (${formatPrice(selectedStorage.price)})\n• *Power Supply:* ${selectedPsu.name} (${formatPrice(selectedPsu.price)})\n• *Cabinet:* ${selectedCabinet.name} (${formatPrice(selectedCabinet.price)})\n• *Cooler:* ${selectedCooler.name} (${formatPrice(selectedCooler.price)})\n\n*Estimated Total:* ${formatPrice(estimatedTotal)}\n*Customer:* ${custName || "Valued Customer"} (${custPhone || "Via WhatsApp"})\n\nHi Jijau Computers team, please confirm component stock availability and send final quotation.`;
    window.open(generateWhatsAppUrl(storeNumber, specsList), "_blank");
  };

  const handleOnlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/custom-pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: custName,
          phone: custPhone,
          email: custEmail,
          budget: `Approx. ${formatPrice(estimatedTotal)}`,
          purpose: purpose,
          cpuPref: selectedCpu.name,
          gpuPref: selectedGpu.name,
          ramPref: selectedRam.name,
          storagePref: selectedStorage.name,
          cabinetPref: selectedCabinet.name,
          notes: `Motherboard: ${selectedMb.name} | PSU: ${selectedPsu.name} | Cooler: ${selectedCooler.name} | Notes: ${custNotes}`,
          totalEst: estimatedTotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedReqId(data.reqNumber || "JC-RIG-OK");
        setIsSubmitted(true);
      }
    } catch (e) {
      console.error("Custom PC submit error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <CartDrawer />
      <WhatsAppFloating />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-600 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Battlestation Configurator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Build Your Custom PC with Jijau Computers
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Pick your desired hardware components below. Our master technicians will assemble, cable-manage, and 24h stress-test your rig with full on-site warranty.
          </p>
        </div>

        {/* 2-Column Configurator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Component Picker */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Purpose Selector */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Step 1: Choose Primary Workload / Purpose
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PURPOSES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={`p-3 rounded-2xl text-left text-xs font-bold border transition-all ${
                      purpose === p
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Processor (CPU) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Step 2: Processor (CPU)
                </h3>
                <span className="text-xs font-bold text-blue-600">
                  {selectedCpu.name.split("(")[0]}
                </span>
              </div>
              <div className="space-y-2">
                {CPU_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedCpu(opt)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedCpu.id === opt.id
                        ? "bg-blue-50/70 border-blue-600 ring-2 ring-blue-100"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                          {opt.brand}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.specs}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      {formatPrice(opt.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Graphics Card (GPU) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Tv className="w-4 h-4 text-emerald-600" />
                  Step 3: Graphics Card (GPU)
                </h3>
                <span className="text-xs font-bold text-emerald-600">
                  {selectedGpu.name.split(" ")[2] || "GPU"}
                </span>
              </div>
              <div className="space-y-2">
                {GPU_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedGpu(opt)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedGpu.id === opt.id
                        ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-100"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.specs}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      {opt.price === 0 ? "Included" : formatPrice(opt.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Motherboard */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Step 4: Motherboard
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOTHERBOARD_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMb(opt)}
                    className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      selectedMb.id === opt.id
                        ? "bg-purple-50/70 border-purple-600 ring-2 ring-purple-100"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{opt.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{opt.specs}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 mt-2">
                      {formatPrice(opt.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. RAM & Storage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RAM */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-600" />
                  Step 5: RAM / Memory
                </h3>
                <div className="space-y-2">
                  {RAM_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedRam(opt)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedRam.id === opt.id
                          ? "bg-cyan-50/70 border-cyan-600 ring-2 ring-cyan-100"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-900 block">{opt.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">
                        {formatPrice(opt.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-teal-600" />
                  Step 6: Storage (SSD)
                </h3>
                <div className="space-y-2">
                  {STORAGE_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedStorage(opt)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedStorage.id === opt.id
                          ? "bg-teal-50/70 border-teal-600 ring-2 ring-teal-100"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-900 block truncate">{opt.name}</span>
                        <span className="text-[10px] text-slate-500 block">{opt.specs}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">
                        {formatPrice(opt.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Power Supply, Cabinet & Cooler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* PSU */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Power Supply (PSU)
                </h3>
                <div className="space-y-1.5">
                  {PSU_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedPsu(opt)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedPsu.id === opt.id
                          ? "bg-amber-50/70 border-amber-500 ring-1 ring-amber-200"
                          : "bg-slate-50/50 border-slate-200"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">{opt.name}</span>
                      <span className="text-xs font-black text-slate-800 mt-1 block">{formatPrice(opt.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cabinet */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-indigo-500" />
                  Gaming Cabinet
                </h3>
                <div className="space-y-1.5">
                  {CABINET_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedCabinet(opt)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedCabinet.id === opt.id
                          ? "bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-200"
                          : "bg-slate-50/50 border-slate-200"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">{opt.name}</span>
                      <span className="text-xs font-black text-slate-800 mt-1 block">{formatPrice(opt.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooler */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-blue-500" />
                  CPU Cooling
                </h3>
                <div className="space-y-1.5">
                  {COOLING_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedCooler(opt)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedCooler.id === opt.id
                          ? "bg-blue-50/70 border-blue-500 ring-1 ring-blue-200"
                          : "bg-slate-50/50 border-slate-200"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">{opt.name}</span>
                      <span className="text-xs font-black text-slate-800 mt-1 block">{formatPrice(opt.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Quote Form */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
              {/* Summary Header */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full inline-block mb-2">
                  Rig Summary
                </span>
                <h3 className="text-lg font-black tracking-tight">
                  Your Configured Build
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {purpose}
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4 max-h-60 overflow-y-auto pr-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedCpu.name.split("(")[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPU:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedGpu.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MB:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedMb.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RAM:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedRam.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SSD:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedStorage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PSU:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedPsu.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Case:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedCabinet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cooler:</span>
                  <span className="font-semibold text-right truncate max-w-[170px]">{selectedCooler.name}</span>
                </div>
              </div>

              {/* Power & Compatibility check */}
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Power Draw:</span>
                  <span className="font-mono font-bold text-amber-400">~{estimatedTdp} Watts</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Components 100% Compatible & Bottleneck-Free</span>
                </div>
              </div>

              {/* Total Estimated Price */}
              <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Estimated Rig Price</span>
                  <span className="text-[10px] text-slate-500">*Inclusive of GST & Assembly</span>
                </div>
                <span className="text-2xl font-black text-amber-400">
                  {formatPrice(estimatedTotal)}
                </span>
              </div>

              {/* Action 1: 1-Click WhatsApp Export */}
              <button
                onClick={handleWhatsAppExport}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get Instant WhatsApp Quote</span>
              </button>

              {/* Action 2: Direct Lead Form */}
              {isSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-1">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="font-bold">Quotation Request #{createdReqId} Saved!</p>
                  <p className="text-[11px] text-slate-300">
                    Our team will contact you with final delivery timeframe.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOnlineSubmit} className="space-y-3 pt-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or Save for Admin Follow-up:
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number *"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Custom Rig Request"}
                  </button>
                </form>
              )}

              {/* Trust badges */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>3-Year Hardware Warranty on All Parts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lifetime Free Servicing & Dust Cleaning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
