<?php
/**
 * Template Name: Interactive Custom PC Builder
 *
 * @package Jijau_Computers
 */

get_header();

$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
?>

<main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div class="text-center space-y-2 max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
            <span>Interactive Custom PC Configurator</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Build Your Custom Rig
        </h1>
        <p class="text-xs sm:text-sm text-slate-600">
            Pick your hardware components with real-time wattage compatibility check and 1-Click WhatsApp quote generator.
        </p>
    </div>

    <!-- Interactive Configurator Container -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Components Selector -->
        <div class="lg:col-span-8 space-y-6">
            <!-- CPU Section -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <i data-lucide="cpu" class="w-4 h-4 text-blue-600"></i>
                    1. Processor (CPU)
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label class="p-3.5 rounded-2xl border border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 flex items-center justify-between cursor-pointer">
                        <div>
                            <span class="font-bold text-slate-900 block">Intel Core i7-14700K</span>
                            <span class="text-slate-500">20 Cores, up to 5.6 GHz</span>
                        </div>
                        <span class="font-black text-blue-600">₹35,990</span>
                    </label>
                    <label class="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer">
                        <div>
                            <span class="font-bold text-slate-900 block">AMD Ryzen 7 7800X3D</span>
                            <span class="text-slate-500">8 Cores, 104MB 3D V-Cache</span>
                        </div>
                        <span class="font-black text-slate-900">₹38,990</span>
                    </label>
                </div>
            </div>

            <!-- GPU Section -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <i data-lucide="tv" class="w-4 h-4 text-emerald-600"></i>
                    2. Graphics Card (GPU)
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label class="p-3.5 rounded-2xl border border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-100 flex items-center justify-between cursor-pointer">
                        <div>
                            <span class="font-bold text-slate-900 block">NVIDIA RTX 4070 Super 12GB</span>
                            <span class="text-slate-500">DLSS 3.5, 4K Gaming</span>
                        </div>
                        <span class="font-black text-emerald-600">₹62,990</span>
                    </label>
                    <label class="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer">
                        <div>
                            <span class="font-bold text-slate-900 block">NVIDIA RTX 4080 Super 16GB</span>
                            <span class="text-slate-500">Extreme 4K High FPS</span>
                        </div>
                        <span class="font-black text-slate-900">₹1,02,000</span>
                    </label>
                </div>
            </div>

            <!-- RAM Section -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <i data-lucide="hard-drive" class="w-4 h-4 text-purple-600"></i>
                    3. RAM & Storage
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                        <span class="font-bold text-slate-900 block">32GB (2x16GB) DDR5 6000MHz RGB</span>
                        <span class="font-black text-blue-600 mt-1 block">₹10,890</span>
                    </div>
                    <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                        <span class="font-bold text-slate-900 block">Samsung 990 PRO 2TB NVMe Gen4 SSD</span>
                        <span class="font-black text-blue-600 mt-1 block">₹17,490</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right: Summary Sidebar -->
        <div class="lg:col-span-4 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 sticky top-24 shadow-2xl">
            <h3 class="font-black text-lg">Build Summary</h3>
            <div class="space-y-3 text-xs border-b border-slate-800 pb-4">
                <div class="flex justify-between">
                    <span class="text-slate-400">Estimated Total:</span>
                    <span class="font-black text-amber-400 text-base">₹1,27,360</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Estimated Power Draw:</span>
                    <span class="text-emerald-400 font-bold">~550W (Recommended PSU: 750W Gold)</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Warranty:</span>
                    <span class="text-slate-200 font-bold">3 Years Official Warranty</span>
                </div>
            </div>

            <!-- WhatsApp Export Button -->
            <a
                href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('*Custom PC Build Quote Request*\n• CPU: Intel i7-14700K\n• GPU: RTX 4070 Super 12GB\n• RAM: 32GB DDR5 6000MHz\n• Storage: 2TB NVMe SSD\n*Estimated Total:* ₹1,27,360\n\nHi Jijau Computers, please confirm stock and send official quotation with GST.'); ?>"
                target="_blank"
                class="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
                <i data-lucide="message-square" class="w-4 h-4"></i>
                <span>Get Instant WhatsApp Quote</span>
            </a>
        </div>
    </div>
</main>

<?php
get_footer();
