<!DOCTYPE html>
<html <?php language_attributes(); ?> class="h-full">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <?php wp_head(); ?>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .glass-nav {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
        }
        .safe-area-pb {
            padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
    </style>
</head>
<body <?php body_class('min-h-full flex flex-col bg-[#f8fafc] text-slate-900 pb-16 md:pb-0'); ?>>
<?php wp_body_open(); ?>

<?php
$phone = get_theme_mod('jijau_phone', '+91 88056 07908');
$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
$hours = get_theme_mod('jijau_hours', 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM');
$clean_phone = preg_replace('/[^0-9+]/', '', $phone);
$current_url = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
?>

<!-- 1. TOP ANNOUNCEMENT BAR -->
<div class="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div class="flex items-center gap-4 text-[11px] sm:text-xs">
            <span class="flex items-center gap-1.5 font-medium text-amber-400">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                Authorized Computer & Hardware Dealer in Pune
            </span>
            <span class="hidden md:inline text-slate-700">|</span>
            <span class="hidden md:flex items-center gap-1.5 text-slate-400">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-400"></i>
                <?php echo esc_html($hours); ?>
            </span>
        </div>

        <div class="flex items-center gap-4 text-xs">
            <a href="<?php echo esc_url(home_url('/track-service')); ?>" class="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                Track Repair / Service
            </a>
            <span class="text-slate-700">|</span>
            <a href="<?php echo esc_url(home_url('/quote-request')); ?>" class="text-slate-300 hover:text-white">
                Request Quote
            </a>
            <span class="text-slate-700">|</span>
            <a href="tel:<?php echo esc_attr($clean_phone); ?>" class="flex items-center gap-1.5 text-white font-bold">
                <i data-lucide="phone" class="w-3.5 h-3.5 text-blue-400"></i>
                <span><?php echo esc_html($phone); ?></span>
            </a>
        </div>
    </div>
</div>

<!-- 2. MAIN HEADER (Search, Logo, Cart, Wishlist, Admin) -->
<header class="glass-nav sticky top-0 z-40 border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Logo -->
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center gap-2.5 group shrink-0">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <i data-lucide="cpu" class="w-6 h-6"></i>
            </div>
            <div class="flex flex-col">
                <span class="text-xl font-black tracking-tight text-slate-900 leading-none">
                    Jijau Computers
                </span>
                <span class="text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">
                    SALES • CUSTOM PCS • REPAIRS
                </span>
            </div>
        </a>

        <!-- Search Bar with Category Select -->
        <form action="<?php echo esc_url(home_url('/devices')); ?>" method="GET" class="hidden md:flex flex-1 max-w-2xl items-center border-2 border-blue-600/30 hover:border-blue-600 focus-within:border-blue-600 rounded-full bg-white shadow-sm overflow-hidden transition-all">
            <select name="cat" class="bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-3 border-r border-slate-200 outline-none cursor-pointer">
                <option value="all">All Categories</option>
                <option value="laptop">Laptops</option>
                <option value="mobile">Mobiles</option>
                <option value="printer">Printers</option>
                <option value="cctv">CCTV Cameras</option>
            </select>
            <input
                type="text"
                name="s"
                placeholder="Search laptops, RTX 4070, Intel i7, CP PLUS, Printers..."
                class="flex-1 px-4 py-2 text-xs text-slate-800 outline-none"
            />
            <button type="submit" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                <i data-lucide="search" class="w-3.5 h-3.5"></i>
                <span>Search</span>
            </button>
        </form>

        <!-- Right Header Actions -->
        <div class="flex items-center gap-2.5">
            <!-- Custom PC Builder Gold CTA -->
            <a href="<?php echo esc_url(home_url('/custom-pc')); ?>" class="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105">
                <i data-lucide="cpu" class="w-4 h-4"></i>
                <span>PC Builder</span>
                <span class="text-[9px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">RIG</span>
            </a>

            <!-- Wishlist Heart -->
            <a href="<?php echo esc_url(home_url('/devices')); ?>" class="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-rose-600 transition-colors" title="Wishlist">
                <i data-lucide="heart" class="w-5 h-5"></i>
            </a>

            <!-- Cart Trigger -->
            <a href="<?php echo esc_url(home_url('/devices')); ?>" class="flex items-center gap-2 p-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors">
                <div class="relative">
                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                    <span class="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                        0
                    </span>
                </div>
                <div class="hidden md:flex flex-col text-left text-[10px] leading-tight">
                    <span class="text-slate-500 font-normal">CART</span>
                    <span class="font-bold">₹0</span>
                </div>
            </a>

            <!-- Admin Access -->
            <a href="<?php echo esc_url(admin_url()); ?>" class="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors" title="Admin Portal">
                <i data-lucide="shield" class="w-3.5 h-3.5 text-blue-400"></i>
                <span>Admin Panel</span>
            </a>
        </div>
    </div>

    <!-- 3. SUB-NAVIGATION ROW -->
    <nav class="border-t border-slate-100 bg-white hidden md:block">
        <div class="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-1 font-semibold text-slate-700 py-1">
                <!-- Categories Dropdown Trigger -->
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="flex items-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-wider text-[11px] mr-2">
                    <i data-lucide="menu" class="w-3.5 h-3.5"></i>
                    <span>BROWSE CATEGORIES</span>
                    <i data-lucide="chevron-down" class="w-3 h-3"></i>
                </a>

                <!-- Devices Hub Active Badge Link -->
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="px-3 py-2 text-blue-600 bg-blue-50 border border-blue-200/80 rounded-lg flex items-center gap-1.5 font-black hover:bg-blue-100 transition-colors">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-600"></i>
                    <span>Devices Hub (Laptop, Mobile, Printer, CCTV)</span>
                </a>

                <a href="<?php echo esc_url(home_url('/devices?cat=laptop')); ?>" class="px-3 py-2 hover:text-blue-600 transition-colors">
                    Laptops
                </a>
                <a href="<?php echo esc_url(home_url('/custom-pc')); ?>" class="px-3 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold">
                    <i data-lucide="cpu" class="w-3.5 h-3.5 text-amber-500"></i>
                    Custom PC Builder
                </a>
                <a href="<?php echo esc_url(home_url('/devices?cat=cctv')); ?>" class="px-3 py-2 hover:text-blue-600 transition-colors">
                    CCTV Cameras
                </a>
                <a href="<?php echo esc_url(home_url('/devices?cat=printer')); ?>" class="px-3 py-2 hover:text-blue-600 transition-colors">
                    Printers
                </a>
                <a href="<?php echo esc_url(home_url('/track-service')); ?>" class="px-3 py-2 text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-bold">
                    <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                    Repair Tracker
                </a>
                <a href="<?php echo esc_url(home_url('/quote-request')); ?>" class="px-3 py-2 hover:text-blue-600 transition-colors">
                    B2B Quotes
                </a>
            </div>

            <!-- WhatsApp Direct Help -->
            <a href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('Hi Jijau Computers, I would like to enquire about hardware products, laptops, or custom PC builds available at your store.'); ?>" target="_blank" class="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 transition-colors">
                <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                <span>WhatsApp Enquiry</span>
            </a>
        </div>
    </nav>
</header>
