<?php
/**
 * Template Name: 4-Category Device & Brand Stack Explorer
 *
 * @package Jijau_Computers
 */

get_header();
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

    <!-- PRODUCT DISPLAY GRID (Pre-rendered in PHP for 100% Reliability & Live Interactive Filtering) -->
    <div id="devices-products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <?php
        $liveDb = function_exists('jijau_get_full_store_database') ? jijau_get_full_store_database() : array();
        $products = $liveDb['products'] ?? array();
        $whatsapp = get_theme_mod('jijau_whatsapp', $liveDb['settings']['whatsapp'] ?? '918805607908');

        $laptopProds = array_filter($products, function($p) {
            return stripos($p['category'] ?? '', 'laptop') !== false;
        });

        foreach ($laptopProds as $p) :
            $price = (float)($p['price'] ?? 0);
            $salePrice = (float)($p['salePrice'] ?? $price);
            $discount = $p['discount'] ?? ($price > $salePrice ? round((($price - $salePrice) / $price) * 100) . '% OFF' : 'DEAL');
            $waMsg = 'Hi Jijau Computers, I am interested in *' . ($p['name'] ?? '') . '* (Price: ₹' . number_format($salePrice) . '). Is this available in stock?';
            $waLink = 'https://wa.me/' . esc_attr($whatsapp) . '?text=' . urlencode($waMsg);
        ?>
            <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
                <!-- Badges -->
                <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow uppercase"><?php echo esc_html($discount); ?></span>
                </div>

                <!-- Wishlist -->
                <button type="button" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors">
                    <i data-lucide="heart" class="w-4 h-4"></i>
                </button>

                <!-- Image -->
                <div class="h-48 overflow-hidden bg-slate-50 relative p-4 flex items-center justify-center">
                    <img src="<?php echo esc_url($p['image']); ?>" alt="<?php echo esc_attr($p['name']); ?>" class="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>

                <!-- Content -->
                <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div class="space-y-1">
                        <span class="text-[11px] font-bold text-slate-500 uppercase"><?php echo esc_html($p['brand'] ?? 'Hardware'); ?> • <?php echo esc_html($p['category'] ?? 'Device'); ?></span>
                        <h3 class="font-black text-slate-900 text-sm leading-snug line-clamp-2 m-0"><?php echo esc_html($p['name']); ?></h3>
                        <p class="text-slate-500 text-xs line-clamp-2 leading-relaxed m-0"><?php echo esc_html($p['specs'] ?? ''); ?></p>
                    </div>

                    <!-- Price & Actions -->
                    <div class="pt-3 border-t border-slate-100 space-y-3">
                        <div class="flex items-baseline gap-2">
                            <span class="text-base font-black text-slate-900">₹<?php echo number_format($salePrice); ?></span>
                            <?php if ($price > $salePrice) : ?>
                                <span class="text-xs text-slate-400 line-through">₹<?php echo number_format($price); ?></span>
                            <?php endif; ?>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <button type="button" onclick="addToCart('<?php echo esc_js($p['id']); ?>')" class="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer">
                                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                                <span>Add</span>
                            </button>
                            <a href="<?php echo esc_url($waLink); ?>" target="_blank" class="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors">
                                <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                                <span>Enquire</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</main>

<?php
get_footer();
