<?php
/**
 * Front Page Template for Jijau Computers WordPress Theme
 * Replicates the Next.js Localhost Homepage 1:1
 *
 * @package Jijau_Computers
 */

get_header();

$phone = get_theme_mod('jijau_phone', '+91 88056 07908');
$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
?>

<main class="flex-1">
    <!-- 1. HERO SLIDER BANNER (Matching Next.js HeroSlider) -->
    <section class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-16 lg:py-24 overflow-hidden border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div class="lg:col-span-7 space-y-6">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                    <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                    <span>FLAGSHIP CUSTOM PC BUILDS & HARDWARE</span>
                </div>
                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                    Jijau Custom Gaming Battlestations.
                </h1>
                <p class="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                    Unleash Ultimate Power with Intel 14th Gen & RTX 4080 Super | Custom Liquid Cooling, Cable Sleeving & Professional Hardware Tuning.
                </p>
                <div class="flex flex-wrap gap-3 pt-2">
                    <a href="<?php echo esc_url(home_url('/devices')); ?>" class="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105">
                        <i data-lucide="sparkles" class="w-4 h-4 text-amber-300"></i>
                        <span>Explore Device Stack & Brands</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                    <a href="<?php echo esc_url(home_url('/custom-pc')); ?>" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105">
                        <i data-lucide="cpu" class="w-4 h-4"></i>
                        <span>Build Custom PC</span>
                    </a>
                </div>
            </div>
            <div class="lg:col-span-5">
                <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 p-2 group">
                    <img
                        src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80"
                        alt="Jijau Custom Gaming PC"
                        class="rounded-2xl w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div class="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-amber-400">Master Craftsmanship</span>
                            <h4 class="font-black text-xs text-white">Apex Titan RTX 4080 Super Build</h4>
                        </div>
                        <span class="text-xs font-black text-emerald-400">₹2,29,990</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 2. STACKED DEVICE EXPLORER CALLOUT BANNER (Matching Next.js Section 2.5) -->
    <section class="py-8 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                <div class="space-y-2 text-center md:text-left">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                        <span>Interactive Brand Filter</span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-black tracking-tight text-white">
                        Shop by Device Stack: Laptop, Mobile, Printer & CCTV
                    </h3>
                    <p class="text-xs sm:text-sm text-slate-300 max-w-xl">
                        Pick any category and filter instantly by leading brands like <strong class="text-amber-400">Dell, HP, ASUS, Apple, Samsung, CP PLUS & Hikvision</strong>.
                    </p>
                </div>

                <a
                    href="<?php echo esc_url(home_url('/devices')); ?>"
                    class="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
                >
                    <span>Open Device & Brand Hub</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 3. 4 MAIN CATEGORY STACK CARDS -->
    <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                <div>
                    <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                        Explore Hardware Catalogs
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Browse by 4 Main Stacks
                    </h2>
                </div>
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <span>View All Categories</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Stack 1: Laptop -->
                <a href="<?php echo esc_url(home_url('/devices?cat=laptop')); ?>" class="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <i data-lucide="laptop" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[10px] font-black text-blue-600 uppercase block mb-1">1. LAPTOPS</span>
                    <h3 class="text-lg font-black text-slate-900">Laptops</h3>
                    <p class="text-xs text-slate-500 mt-1">Dell, HP, ASUS, Lenovo, Apple</p>
                    <div class="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>6 Models</span>
                        <span class="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-blue-600">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </a>

                <!-- Stack 2: Mobile -->
                <a href="<?php echo esc_url(home_url('/devices?cat=mobile')); ?>" class="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <i data-lucide="smartphone" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[10px] font-black text-amber-600 uppercase block mb-1">2. MOBILES</span>
                    <h3 class="text-lg font-black text-slate-900">Mobiles</h3>
                    <p class="text-xs text-slate-500 mt-1">Apple, Samsung, OnePlus, Xiaomi</p>
                    <div class="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>3 Models</span>
                        <span class="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-amber-600">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </a>

                <!-- Stack 3: Printer -->
                <a href="<?php echo esc_url(home_url('/devices?cat=printer')); ?>" class="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <i data-lucide="printer" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[10px] font-black text-emerald-600 uppercase block mb-1">3. PRINTERS</span>
                    <h3 class="text-lg font-black text-slate-900">Printers</h3>
                    <p class="text-xs text-slate-500 mt-1">HP, Epson, Canon, Brother</p>
                    <div class="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>4 Models</span>
                        <span class="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-emerald-600">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </a>

                <!-- Stack 4: CCTV Camera -->
                <a href="<?php echo esc_url(home_url('/devices?cat=cctv')); ?>" class="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <i data-lucide="camera" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[10px] font-black text-purple-600 uppercase block mb-1">4. CCTV CAMERAS</span>
                    <h3 class="text-lg font-black text-slate-900">CCTV Cameras</h3>
                    <p class="text-xs text-slate-500 mt-1">CP PLUS, Hikvision, TP-Link</p>
                    <div class="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>3 Models</span>
                        <span class="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-purple-600">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                </a>
            </div>
        </div>
    </section>

    <!-- 3.5 FEATURED PRODUCTS & HARDWARE (Matching Next.js Localhost Image 2 100%) -->
    <section class="py-12 bg-slate-50 border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                <div>
                    <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                        HAND-PICKED RECOMMENDATIONS
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Featured Products & Hardware
                    </h2>
                </div>
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <span>View All Featured</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>

            <!-- Direct PHP Database Render for 100% Reliability & Instant Sync with Admin Panel -->
            <div id="home-featured-products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <?php
                $liveDb = function_exists('jijau_get_full_store_database') ? jijau_get_full_store_database() : array();
                $allProds = $liveDb['products'] ?? array();
                $featuredProds = array_slice($allProds, 0, 8);

                foreach ($featuredProds as $p) :
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
                            <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px] uppercase">FEATURED</span>
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
                                <span class="text-[11px] font-bold text-slate-500 uppercase"><?php echo esc_html($p['brand'] ?? 'Jijau'); ?> • <?php echo esc_html($p['category'] ?? 'Hardware'); ?></span>
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
                                        <i data-lucide="message-square" class="w-3.5 h-3.5 text-emerald-600"></i>
                                        <span>Buy on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- 4. CUSTOM RIG BUILDER CALLOUT (Matching Next.js CustomPcBanner) -->
    <section class="py-12 bg-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
            <div class="space-y-2 text-center md:text-left">
                <span class="text-amber-400 font-bold text-xs uppercase tracking-wider block">Custom Rig Builder</span>
                <h3 class="text-2xl font-black">Configure Your Dream Gaming / 4K Editing Rig</h3>
                <p class="text-slate-400 text-xs max-w-xl leading-relaxed">
                    Pick your CPU, GPU, RAM, liquid cooler, and cabinet with real-time wattage compatibility and 1-Click WhatsApp quote generator.
                </p>
            </div>
            <a href="<?php echo esc_url(home_url('/custom-pc')); ?>" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105 shrink-0">
                Launch Configurator
            </a>
        </div>
    </section>
</main>

<?php
get_footer();
