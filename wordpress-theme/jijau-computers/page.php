<?php
/**
 * Universal Page Template for Jijau Computers WordPress Theme
 * Automatically detects page slugs (devices, custom-pc, track-service, quote-request)
 * and renders the corresponding full interactive feature, or standard page content.
 *
 * @package Jijau_Computers
 */

get_header();

global $post;
$slug = isset($post->post_name) ? $post->post_name : '';
$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
$phone = get_theme_mod('jijau_phone', '+91 88056 07908');

// 1. If page is /devices or /categories -> Render 4-Stack Device & Brand Explorer
if ($slug === 'devices' || $slug === 'categories') :
?>
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <!-- Header -->
        <div class="text-center space-y-3 max-w-3xl mx-auto mb-8">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                <span>INTERACTIVE CATEGORY & BRAND EXPLORER</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Select a Device Stack & Browse by Brand
            </h1>
            <p class="text-xs sm:text-sm text-slate-600">
                Pick your preferred category below (<strong class="text-slate-800">Laptop, Mobile, Printer, or CCTV Camera</strong>), then click any brand (<strong class="text-slate-800">Dell, HP, ASUS, Apple, Samsung, CP PLUS, etc.</strong>) to view exact matching models with official warranty.
            </p>
        </div>

        <!-- 4 STACKED CATEGORIES (Ordered: 1. Laptop, 2. Mobile, 3. Printer, 4. CCTV Camera) -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-3 px-1">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    CHOOSE CATEGORY STACK:
                </span>
                <span class="text-xs text-blue-600 font-bold">
                    Showing 4 Main Device Categories
                </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="category-stacks-container">
                <!-- 1. Laptop Stack -->
                <button
                    type="button"
                    data-category="laptop"
                    class="category-stack-btn active text-left p-5 rounded-3xl border border-transparent bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl ring-4 ring-blue-500/20 scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                    <div class="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80')"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="cat-icon-box w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-md">
                                <i data-lucide="laptop" class="w-6 h-6"></i>
                            </div>
                            <span class="cat-badge text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white text-slate-900 shadow-sm">
                                1. LAPTOPS
                            </span>
                        </div>
                        <h3 class="text-xl font-black tracking-tight">Laptop</h3>
                        <p class="cat-subtitle text-xs text-white/80 mt-1">Gaming, Ultrabooks, Business & Student Laptops</p>
                    </div>
                    <div class="cat-footer relative z-10 pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                        <span>6 Available Models</span>
                        <span class="flex items-center gap-1">Active View <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </button>

                <!-- 2. Mobile Stack -->
                <button
                    type="button"
                    data-category="mobile"
                    class="category-stack-btn text-left p-5 rounded-3xl border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                    <div class="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80')"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="cat-icon-box w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-sm">
                                <i data-lucide="smartphone" class="w-6 h-6"></i>
                            </div>
                            <span class="cat-badge text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                2. MOBILES
                            </span>
                        </div>
                        <h3 class="text-xl font-black tracking-tight">Mobile</h3>
                        <p class="cat-subtitle text-xs text-slate-500 mt-1">5G Flagships, Smartphones & High-Performance Tablets</p>
                    </div>
                    <div class="cat-footer relative z-10 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>3 Available Models</span>
                        <span class="flex items-center gap-1">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </button>

                <!-- 3. Printer Stack -->
                <button
                    type="button"
                    data-category="printer"
                    class="category-stack-btn text-left p-5 rounded-3xl border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                    <div class="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80')"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="cat-icon-box w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-sm">
                                <i data-lucide="printer" class="w-6 h-6"></i>
                            </div>
                            <span class="cat-badge text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                3. PRINTERS
                            </span>
                        </div>
                        <h3 class="text-xl font-black tracking-tight">Printer</h3>
                        <p class="cat-subtitle text-xs text-slate-500 mt-1">Ink Tank, Laser All-in-One Wireless Printers & Scanners</p>
                    </div>
                    <div class="cat-footer relative z-10 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>4 Available Models</span>
                        <span class="flex items-center gap-1">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </button>

                <!-- 4. CCTV Camera Stack -->
                <button
                    type="button"
                    data-category="cctv"
                    class="category-stack-btn text-left p-5 rounded-3xl border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                    <div class="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80')"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="cat-icon-box w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-sm">
                                <i data-lucide="camera" class="w-6 h-6"></i>
                            </div>
                            <span class="cat-badge text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                4. CCTV CAMERAS
                            </span>
                        </div>
                        <h3 class="text-xl font-black tracking-tight">CCTV Camera</h3>
                        <p class="cat-subtitle text-xs text-slate-500 mt-1">HD IP Cameras, ColorVu Night Vision, WiFi PTZ & NVRs</p>
                    </div>
                    <div class="cat-footer relative z-10 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>3 Available Models</span>
                        <span class="flex items-center gap-1">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </button>
            </div>
        </div>

        <!-- DYNAMIC BRAND FILTER BAR -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                    <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                        STEP 2: FILTER BY MANUFACTURER / BRAND
                    </span>
                    <h2 class="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
                        <span id="active-category-title">Laptop Brands:</span>
                        <span class="text-slate-500 font-normal text-xs">(Click any brand to filter)</span>
                    </h2>
                </div>

                <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs w-full sm:w-72">
                    <i data-lucide="search" class="w-4 h-4 text-slate-400 shrink-0"></i>
                    <input
                        type="text"
                        id="brand-product-search"
                        placeholder="Search Laptop models, specs..."
                        class="bg-transparent text-slate-800 outline-none w-full placeholder:text-slate-400"
                    />
                </div>
            </div>

            <!-- Brand Filter Pills Container -->
            <div id="brand-pills-container" class="flex items-center gap-2.5 flex-wrap">
                <!-- Populated by main.js with live counts -->
            </div>
        </div>

        <!-- RESULTS HEADER & SORTING -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h3 id="results-count-label" class="text-base font-black text-slate-900">
                    All Laptops (6 products found)
                </h3>
            </div>

            <div class="flex items-center gap-2 text-xs">
                <span class="text-slate-500 font-bold">Sort By:</span>
                <select
                    id="product-sort-select"
                    class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-semibold outline-none focus:border-blue-600 shadow-sm cursor-pointer"
                >
                    <option value="featured">Featured Deals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>
        </div>

        <!-- PRODUCT DISPLAY GRID -->
        <div id="devices-products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Rendered dynamically by JavaScript with Red Discount Badges, Wishlist Heart, Add to Cart & Enquire -->
        </div>
    </main>

<?php
// 2. If page is /custom-pc -> Render Custom PC Builder
elseif ($slug === 'custom-pc' || $slug === 'pc-builder') :
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

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div class="lg:col-span-8 space-y-6">
                <!-- CPU Section -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <i data-lucide="cpu" class="w-4 h-4 text-blue-600"></i>
                        1. Processor (CPU)
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div class="p-3.5 rounded-2xl border border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 flex items-center justify-between cursor-pointer">
                            <div>
                                <span class="font-bold text-slate-900 block">Intel Core i7-14700K</span>
                                <span class="text-slate-500">20 Cores, up to 5.6 GHz</span>
                            </div>
                            <span class="font-black text-blue-600">₹35,990</span>
                        </div>
                        <div class="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer">
                            <div>
                                <span class="font-bold text-slate-900 block">AMD Ryzen 7 7800X3D</span>
                                <span class="text-slate-500">8 Cores, 104MB 3D V-Cache</span>
                            </div>
                            <span class="font-black text-slate-900">₹38,990</span>
                        </div>
                    </div>
                </div>

                <!-- GPU Section -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <i data-lucide="tv" class="w-4 h-4 text-emerald-600"></i>
                        2. Graphics Card (GPU)
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div class="p-3.5 rounded-2xl border border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-100 flex items-center justify-between cursor-pointer">
                            <div>
                                <span class="font-bold text-slate-900 block">NVIDIA RTX 4070 Super 12GB</span>
                                <span class="text-slate-500">DLSS 3.5, 4K Gaming</span>
                            </div>
                            <span class="font-black text-emerald-600">₹62,990</span>
                        </div>
                        <div class="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer">
                            <div>
                                <span class="font-bold text-slate-900 block">NVIDIA RTX 4080 Super 16GB</span>
                                <span class="text-slate-500">Extreme 4K High FPS</span>
                            </div>
                            <span class="font-black text-slate-900">₹1,02,000</span>
                        </div>
                    </div>
                </div>

                <!-- RAM & Storage -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <i data-lucide="hard-drive" class="w-4 h-4 text-purple-600"></i>
                        3. RAM & Fast NVMe Storage
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                            <span class="font-bold text-slate-900 block">Corsair RGB 32GB (2x16GB) DDR5 6000MHz</span>
                            <span class="font-black text-blue-600 mt-1 block">₹10,890</span>
                        </div>
                        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                            <span class="font-bold text-slate-900 block">Samsung 990 PRO 2TB Gen4 SSD (7450 MB/s)</span>
                            <span class="font-black text-blue-600 mt-1 block">₹17,490</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Summary -->
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
                        <span class="text-slate-200 font-bold">3 Years Comprehensive Hardware</span>
                    </div>
                </div>

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
// 3. If page is /track-service -> Render Repair Tracker
elseif ($slug === 'track-service' || $slug === 'repairs') :
?>
    <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div class="text-center space-y-2 max-w-2xl mx-auto mb-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                <span>Live Repair Progress Tracker</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Track Your Laptop & PC Repair
            </h1>
            <p class="text-xs sm:text-sm text-slate-600">
                Enter your Service Ticket ID (e.g. <strong>JC-SRV-1001</strong>) or registered phone number to check diagnosis and repair timeline.
            </p>
        </div>

        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 mb-8">
            <div class="flex flex-col sm:flex-row items-center gap-3">
                <div class="relative flex-1 w-full">
                    <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                    <input
                        type="text"
                        value="JC-SRV-1001"
                        placeholder="Enter Ticket ID (JC-SRV-1001)..."
                        class="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-2xl text-xs sm:text-sm outline-none focus:border-blue-600 font-mono"
                    />
                </div>
                <button
                    type="button"
                    class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow transition-colors"
                >
                    Search Ticket
                </button>
            </div>
        </div>

        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                    <span class="text-xs font-mono font-bold text-blue-600">JC-SRV-1001</span>
                    <h3 class="text-lg font-black text-slate-900">ASUS ROG Strix G15 (GPU Fan & Repasting)</h3>
                    <span class="text-xs text-slate-500">Customer: Rahul Deshmukh</span>
                </div>
                <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase self-start">
                    Status: Repairing
                </span>
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Pipeline</h4>
                <div class="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
                    <div class="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">1. Received</div>
                    <div class="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">2. Inspected</div>
                    <div class="p-2.5 rounded-xl bg-blue-600 text-white ring-2 ring-blue-300">3. Repairing</div>
                    <div class="p-2.5 rounded-xl bg-slate-100 text-slate-500">4. Parts Wait</div>
                    <div class="p-2.5 rounded-xl bg-slate-100 text-slate-500">5. Ready</div>
                    <div class="p-2.5 rounded-xl bg-slate-100 text-slate-500">6. Delivered</div>
                </div>
            </div>

            <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs space-y-1 text-slate-800">
                <span class="font-bold text-blue-900 block">Technician Diagnostic Notes:</span>
                <p>Original ASUS replacement cooling fan installed. Thermal Grizzly Kryonaut thermal paste applied. 3DMark stress test running.</p>
            </div>

            <div class="flex justify-end pt-2">
                <a
                    href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('Hi Jijau Computers team, checking for an update on my repair ticket #JC-SRV-1001.'); ?>"
                    target="_blank"
                    class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
                >
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                    <span>Chat with Service Technician on WhatsApp</span>
                </a>
            </div>
        </div>
    </main>

<?php
// 4. If page is /quote-request -> Render B2B Quote
elseif ($slug === 'quote-request' || $slug === 'quotations') :
?>
    <main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div class="text-center space-y-2 mb-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                <span>Corporate B2B & Bulk Inquiries</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Request Official Commercial Quotation
            </h1>
            <p class="text-xs sm:text-sm text-slate-600">
                For IT companies, schools, universities, cyber cafes, and office setups requiring GST invoicing.
            </p>
        </div>

        <form class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Contact Name *</label>
                    <input type="text" required placeholder="e.g. Anand Kulkarni" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
                </div>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Company / Institution Name</label>
                    <input type="text" placeholder="e.g. Infotech Solutions" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Mobile / WhatsApp *</label>
                    <input type="tel" required placeholder="10-digit mobile" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
                </div>
                <div>
                    <label class="font-bold text-slate-700 block mb-1">Official Email</label>
                    <input type="email" placeholder="purchase@company.com" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
                </div>
            </div>

            <div>
                <label class="font-bold text-slate-700 block mb-1">Required Items / Bill of Materials *</label>
                <textarea rows="4" required placeholder="List the quantities, required laptops, processor models, monitors, CCTV cameras or custom PC specs..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"></textarea>
            </div>

            <div class="pt-2">
                <a
                    href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('*Corporate B2B Quotation Request*\nHi Jijau Computers team, I would like to request an official GST quotation for our office setup.'); ?>"
                    target="_blank"
                    class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                    <span>Send Quotation Request via WhatsApp</span>
                </a>
            </div>
        </form>
    </main>

<?php
// 5. Default Generic Page Template (Renders WordPress standard post/page content)
else :
?>
    <main class="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <?php while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6'); ?>>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight">
                    <?php the_title(); ?>
                </h1>
                <div class="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </main>
<?php
endif;

get_footer();
