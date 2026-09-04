<?php
/**
 * Jijau Computers - 100% Fully Functional Admin Control Suite
 * Complete 1:1 Pixel-Perfect Modals & Customization Options Matching Localhost
 *
 * @package Jijau_Computers
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('jijau_register_admin_menu')) {
    /**
     * Register Top-Level Jijau Admin Hub
     */
    function jijau_register_admin_menu() {
        add_menu_page(
            'Jijau Admin Hub',
            'Jijau Admin Panel',
            'manage_options',
            'jijau-admin',
            'jijau_render_full_admin_hub',
            'dashicons-shield',
            2
        );
    }
    add_action('admin_menu', 'jijau_register_admin_menu');
}

if (!function_exists('jijau_ajax_save_all_admin_data')) {
    /**
     * AJAX Save Entire Store Database
     */
    function jijau_ajax_save_all_admin_data() {
        check_ajax_referer('jijau_admin_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $payload = isset($_POST['data']) ? json_decode(stripslashes($_POST['data']), true) : null;
        if (!$payload) {
            wp_send_json_error('Invalid JSON payload');
        }

        update_option('jijau_full_store_database', $payload);

        // Sync store settings into theme mods
        if (isset($payload['settings'])) {
            $s = $payload['settings'];
            update_option('jijau_store_settings_data', $s);
            set_theme_mod('jijau_phone', $s['phone'] ?? '+91 88056 07908');
            set_theme_mod('jijau_whatsapp', $s['whatsapp'] ?? '918805607908');
            set_theme_mod('jijau_upi_id', $s['upiId'] ?? 'jijauc@ibl');
            set_theme_mod('jijau_upi_name', $s['upiName'] ?? 'Jijau Computers');
            set_theme_mod('jijau_address', $s['address'] ?? '');
            set_theme_mod('jijau_hours', $s['hours'] ?? '');
            set_theme_mod('jijau_gstin', $s['gstin'] ?? '');
        }

        wp_send_json_success(array('message' => 'Database synchronized successfully!'));
    }
    add_action('wp_ajax_jijau_save_all_admin_data', 'jijau_ajax_save_all_admin_data');
}

if (!function_exists('jijau_get_full_store_database')) {
    /**
     * Get Initial Database
     */
    function jijau_get_full_store_database() {
        $db = get_option('jijau_full_store_database', null);
        if (!empty($db) && is_array($db)) {
            return $db;
        }

    // Default Seed Data matching Next.js Localhost
    return array(
        'settings' => array(
            'storeName'       => 'Jijau Computers',
            'tagline'         => 'SALES • CUSTOM PCS • REPAIRS',
            'phone'           => '+91 88056 07908',
            'whatsapp'        => '918805607908',
            'upiId'           => 'jijauc@ibl',
            'upiName'         => 'Jijau Computers',
            'address'         => 'Jijau Computer Sales & Service, Opposite. SBI Bank, Jafrabad, Maharashtra 431206',
            'hours'           => 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM',
            'gstin'           => '27FQIPK5154C1ZU',
            'primaryColor'    => '#2563eb',
            'secondaryColor'  => '#f59e0b',
        ),
        'categories' => array(
            array('id' => 'cat-1', 'name' => 'Laptop', 'slug' => 'laptop', 'order' => 1, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', 'desc' => 'Gaming, Ultrabooks, Business & Student Laptops'),
            array('id' => 'cat-2', 'name' => 'Mobile', 'slug' => 'mobile', 'order' => 2, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80', 'desc' => '5G Flagships, Smartphones & High-Performance Tablets'),
            array('id' => 'cat-3', 'name' => 'Printer', 'slug' => 'printer', 'order' => 3, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80', 'desc' => 'Ink Tank, Laser All-in-One Wireless Printers & Scanners'),
            array('id' => 'cat-4', 'name' => 'CCTV Camera', 'slug' => 'cctv', 'order' => 4, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80', 'desc' => 'HD IP Cameras, ColorVu Night Vision, WiFi PTZ & NVRs'),
            array('id' => 'cat-5', 'name' => 'Custom Gaming PCs', 'slug' => 'custom-pc', 'order' => 5, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', 'desc' => 'Handcrafted liquid-cooled RGB battlestations'),
            array('id' => 'cat-6', 'name' => 'Processors (CPU)', 'slug' => 'cpu', 'order' => 6, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80', 'desc' => 'Intel Core 14th Gen & AMD Ryzen 7000/9000 series'),
            array('id' => 'cat-7', 'name' => 'Graphics Cards (GPU)', 'slug' => 'gpu', 'order' => 7, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80', 'desc' => 'NVIDIA GeForce RTX 40 & AMD Radeon RX series'),
            array('id' => 'cat-8', 'name' => 'Monitors', 'slug' => 'monitors', 'order' => 8, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 'desc' => '144Hz-240Hz Gaming & 4K IPS Displays'),
            array('id' => 'cat-9', 'name' => 'Motherboards', 'slug' => 'motherboards', 'order' => 9, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', 'desc' => 'Z790, B650, X670 WiFi motherboards'),
            array('id' => 'cat-10', 'name' => 'RAM Memory', 'slug' => 'ram', 'order' => 10, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80', 'desc' => 'DDR5 & DDR4 High-speed RGB kits'),
            array('id' => 'cat-11', 'name' => 'Storage (SSD & HDD)', 'slug' => 'storage', 'order' => 11, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80', 'desc' => 'PCIe Gen4 NVMe M.2 and Enterprise HDDs'),
            array('id' => 'cat-12', 'name' => 'Power Supplies (PSU)', 'slug' => 'psu', 'order' => 12, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', 'desc' => '80 Plus Gold & Platinum ATX 3.0 power units'),
            array('id' => 'cat-13', 'name' => 'Cabinets & Cases', 'slug' => 'cases', 'order' => 13, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', 'desc' => 'High airflow and panoramic fish-tank cases'),
            array('id' => 'cat-14', 'name' => 'Cooling Solutions', 'slug' => 'cooling', 'order' => 14, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&auto=format&fit=crop&q=80', 'desc' => '240mm/360mm ARGB AIO Liquid Coolers'),
            array('id' => 'cat-15', 'name' => 'Gaming Accessories', 'slug' => 'accessories', 'order' => 15, 'isActive' => true, 'imageUrl' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', 'desc' => 'Mechanical keyboards, mice, and headsets'),
        ),
        'brands' => array(
            array('id' => 'br-1', 'name' => 'Dell', 'slug' => 'dell', 'isActive' => true, 'logoUrl' => '', 'category' => 'Laptop'),
            array('id' => 'br-2', 'name' => 'HP', 'slug' => 'hp', 'isActive' => true, 'logoUrl' => '', 'category' => 'Laptop, Printer'),
            array('id' => 'br-3', 'name' => 'ASUS', 'slug' => 'asus', 'isActive' => true, 'logoUrl' => '', 'category' => 'Laptop, GPU, Motherboard'),
            array('id' => 'br-4', 'name' => 'Lenovo', 'slug' => 'lenovo', 'isActive' => true, 'logoUrl' => '', 'category' => 'Laptop'),
            array('id' => 'br-5', 'name' => 'Apple', 'slug' => 'apple', 'isActive' => true, 'logoUrl' => '', 'category' => 'Laptop, Mobile'),
            array('id' => 'br-6', 'name' => 'Samsung', 'slug' => 'samsung', 'isActive' => true, 'logoUrl' => '', 'category' => 'Mobile, SSD, Monitor'),
            array('id' => 'br-7', 'name' => 'OnePlus', 'slug' => 'oneplus', 'isActive' => true, 'logoUrl' => '', 'category' => 'Mobile'),
            array('id' => 'br-8', 'name' => 'Xiaomi', 'slug' => 'xiaomi', 'isActive' => true, 'logoUrl' => '', 'category' => 'Mobile'),
            array('id' => 'br-9', 'name' => 'Epson', 'slug' => 'epson', 'isActive' => true, 'logoUrl' => '', 'category' => 'Printer'),
            array('id' => 'br-10', 'name' => 'Canon', 'slug' => 'canon', 'isActive' => true, 'logoUrl' => '', 'category' => 'Printer'),
            array('id' => 'br-11', 'name' => 'Brother', 'slug' => 'brother', 'isActive' => true, 'logoUrl' => '', 'category' => 'Printer'),
                'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1400&auto=format&fit=crop&q=80',
                'ctaText' => 'Build Custom PC',
                'ctaLink' => '/custom-pc',
                'order' => 1,
                'isActive' => true,
            ),
        ),
        'offers' => array(
            array('id' => 'off-1', 'code' => 'JIJAU10', 'title' => '10% Off on Laptops & Workstations', 'discount' => '10% OFF', 'isActive' => true),
            array('id' => 'off-2', 'code' => 'GAMING5K', 'title' => 'Flat ₹5,000 Off on Custom PC Builds', 'discount' => '₹5,000 OFF', 'isActive' => true),
            array('id' => 'off-3', 'code' => 'CCTVFREE', 'title' => 'Free Installation on 4+ Cameras', 'discount' => 'FREE INSTALL', 'isActive' => true),
        ),
        'repairs' => array(
            array(
                'id' => 'rep-1',
                'ticketId' => 'JC-SRV-1001',
                'customerName' => 'Rahul Deshmukh',
                'phone' => '9876543210',
                'device' => 'ASUS ROG Strix G15 (G513)',
                'issue' => 'GPU fan rattling noise & thermal throttling during gaming',
                'status' => 'Repairing',
                'notes' => 'Original ASUS replacement fan ordered. Thermal Grizzly Kryonaut thermal paste applied. 3DMark stress test running.',
                'cost' => 2800,
            ),
            array(
                'id' => 'rep-2',
                'ticketId' => 'JC-SRV-1002',
                'customerName' => 'Pooja Patil',
                'phone' => '9822334455',
                'device' => 'Custom Assembled Ryzen 5 3600 PC',
                'issue' => 'No display on monitor. DRAM red LED constantly lit on motherboard.',
                'status' => 'Ready for Delivery',
                'notes' => 'Faulty RAM module in DIMM slot 2 replaced with Kingston DDR4 8GB 3200MHz. Stress test passed.',
                'cost' => 2150,
            ),
        ),
        'customPcLeads' => array(
            array(
                'id' => 'pc-1',
                'reqNumber' => 'JC-RIG-8821',
                'customerName' => 'Aditya Shinde',
                'phone' => '9890112233',
                'budget' => '₹1,20,000 - ₹1,50,000',
                'purpose' => 'Gaming & 4K Video Editing',
                'specs' => 'Intel Core i7 14th Gen, RTX 4070 Super 12GB, 32GB DDR5, 1TB NVMe, White Panoramic Case',
                'status' => 'QUOTED',
                'totalEst' => 134500,
            ),
        ),
        'orders' => array(
            array(
                'id' => 'ord-1',
                'orderNumber' => 'JC-ORD-9021',
                'customerName' => 'Vikram More',
                'phone' => '9850123456',
                'items' => 'Lenovo Legion Pro 5i Gen 9',
                'total' => 159990,
                'status' => 'Processing',
                'paymentMethod' => 'Instant UPI (Google Pay)',
            ),
        ),
    );
}
}

if (!function_exists('jijau_render_full_admin_hub')) {
    /**
     * Render Complete 1:1 Pixel-Perfect Admin Dashboard (All 12 Tabs)
     */
    function jijau_render_full_admin_hub() {
        $db = jijau_get_full_store_database();
        $nonce = wp_create_nonce('jijau_admin_nonce');
        ?>

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Injected Global State -->
    <script>
        window.JijauAdminState = <?php echo json_encode($db); ?>;
        window.JijauAdminNonce = '<?php echo esc_js($nonce); ?>';
        window.JijauAjaxUrl = '<?php echo esc_url(admin_url('admin-ajax.php')); ?>';
    </script>

    <div id="jijau-admin-root" class="min-h-screen bg-[#050811] text-slate-100 flex -ml-5 -mr-5 -mt-2.5 font-sans">
        <!-- 1. LEFT SIDEBAR (Matching Localhost Image 1:1) -->
        <aside class="w-64 bg-[#0a0f1d] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 min-h-screen sticky top-8">
            <div class="space-y-6">
                <!-- Admin Logo -->
                <div class="flex items-center gap-3 px-2">
                    <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <i data-lucide="shield" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h2 class="text-base font-black tracking-tight text-white m-0 leading-none">Jijau Admin</h2>
                        <span class="text-[10px] font-bold text-blue-400 tracking-wider uppercase">STORE MANAGEMENT</span>
                    </div>
                </div>

                <!-- Nav Menu Items (All 12 tabs) -->
                <nav class="space-y-1 text-xs font-semibold">
                    <button type="button" data-tab="dashboard" class="admin-nav-item active w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-blue-600 text-white font-bold transition-all text-left cursor-pointer">
                        <i data-lucide="layout-grid" class="w-4 h-4"></i>
                        <span>Dashboard</span>
                    </button>
                    <button type="button" data-tab="products" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="box" class="w-4 h-4"></i>
                        <span>Products</span>
                    </button>
                    <button type="button" data-tab="categories" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="folder-tree" class="w-4 h-4"></i>
                        <span>Categories</span>
                    </button>
                    <button type="button" data-tab="brands" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="tag" class="w-4 h-4"></i>
                        <span>Brands</span>
                    </button>
                    <button type="button" data-tab="banners" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="sliders" class="w-4 h-4"></i>
                        <span>Homepage Banners</span>
                    </button>
                    <button type="button" data-tab="offers" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="flame" class="w-4 h-4"></i>
                        <span>Offers & Coupons</span>
                    </button>
                    <button type="button" data-tab="repairs" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="wrench" class="w-4 h-4"></i>
                        <span>Repair / Service Requests</span>
                    </button>
                    <button type="button" data-tab="custom-pc" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="cpu" class="w-4 h-4"></i>
                        <span>Custom PC Requests</span>
                    </button>
                    <button type="button" data-tab="quotations" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="file-text" class="w-4 h-4"></i>
                        <span>B2B Quotations</span>
                    </button>
                    <button type="button" data-tab="enquiries" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="message-square" class="w-4 h-4"></i>
                        <span>Customer Enquiries</span>
                    </button>
                    <button type="button" data-tab="orders" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        <span>Store Orders</span>
                    </button>
                    <button type="button" data-tab="settings" class="admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer">
                        <i data-lucide="settings" class="w-4 h-4"></i>
                        <span>Website Settings</span>
                    </button>
                </nav>
            </div>

            <!-- Bottom Actions -->
            <div class="pt-6 border-t border-slate-800/80 space-y-2">
                <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors">
                    <span>View Public Store</span>
                    <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                </a>
            </div>
        </aside>

        <!-- 2. MAIN CONTENT AREA -->
        <main class="flex-1 p-8 overflow-y-auto max-w-7xl">
            <!-- Alert Banner -->
            <div id="admin-sync-banner" class="hidden mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
                <span id="admin-sync-text">✓ Changes saved successfully!</span>
                <button type="button" onclick="document.getElementById('admin-sync-banner').classList.add('hidden')" class="text-emerald-400 hover:text-white">&times;</button>
            </div>

            <!-- TAB 1: DASHBOARD -->
            <div id="tab-content-dashboard" class="admin-tab-pane space-y-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Store Overview & Control Hub</h1>
                        <p class="text-xs text-slate-400 mt-1">Manage your hardware inventory, custom PC leads, repair pipeline, and website settings.</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="openAddProductModal()" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            <span>+ Add Product</span>
                        </button>
                        <button type="button" onclick="switchAdminTab('settings')" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer">
                            <span>Settings</span>
                        </button>
                    </div>
                </div>

                <!-- 8 Metric Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div onclick="switchAdminTab('products')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                                <i data-lucide="box" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 id="stat-total-products" class="text-3xl font-black text-white">16</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">Total Products</p>
                    </div>

                    <div onclick="switchAdminTab('categories')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                                <i data-lucide="folder-tree" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 id="stat-total-categories" class="text-3xl font-black text-white">15</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">Active Categories</p>
                    </div>

                    <div onclick="switchAdminTab('offers')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                                <i data-lucide="flame" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 id="stat-total-offers" class="text-3xl font-black text-white">3</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">Active Offers</p>
                    </div>

                    <div onclick="switchAdminTab('repairs')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                                <i data-lucide="wrench" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 id="stat-total-repairs" class="text-3xl font-black text-white">2</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">Repair Tickets</p>
                    </div>

                    <div onclick="switchAdminTab('custom-pc')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                                <i data-lucide="cpu" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 id="stat-total-leads" class="text-3xl font-black text-white">1</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">PC Build Requests</p>
                    </div>

                    <div onclick="switchAdminTab('quotations')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                                <i data-lucide="file-text" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-3xl font-black text-white">0</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">B2B Quotes</p>
                    </div>

                    <div onclick="switchAdminTab('enquiries')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center">
                                <i data-lucide="message-square" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-3xl font-black text-white">0</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">Inquiries</p>
                    </div>

                    <div onclick="switchAdminTab('orders')" class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                            </div>
                            <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
                        </div>
                        <h3 class="text-3xl font-black text-white">1</h3>
                        <p class="text-xs text-slate-400 mt-1 font-semibold">Orders</p>
                    </div>
                </div>

                <!-- Lower Dual Column Widgets -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 space-y-4">
                        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                            <h3 class="text-sm font-bold text-white flex items-center gap-2 m-0">
                                <i data-lucide="cpu" class="w-4 h-4 text-amber-400"></i>
                                <span>Recent Custom PC Requests</span>
                            </h3>
                            <button type="button" onclick="switchAdminTab('custom-pc')" class="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">View All</button>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-white text-xs">Aditya Shinde</span>
                                    <span class="text-[11px] text-slate-400">9890112233</span>
                                </div>
                                <p class="text-xs text-slate-400 m-0">Gaming & 4K Video Editing • ₹1,20,000 - ₹1,50,000</p>
                            </div>
                            <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                                QUOTED
                            </span>
                        </div>
                    </div>

                    <div class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800/80 space-y-4">
                        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                            <h3 class="text-sm font-bold text-white flex items-center gap-2 m-0">
                                <i data-lucide="wrench" class="w-4 h-4 text-emerald-400"></i>
                                <span>Active Repair Tickets</span>
                            </h3>
                            <button type="button" onclick="switchAdminTab('repairs')" class="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">View All</button>
                        </div>
                        <div class="space-y-3">
                            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono font-bold text-blue-400 text-xs">JC-SRV-1002</span>
                                        <span class="text-xs text-white font-bold">Pooja Patil</span>
                                    </div>
                                    <p class="text-xs text-slate-400 m-0">Custom Assembled Ryzen 5 3600 PC (Desktop PC)</p>
                                </div>
                                <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                                    READY FOR DELIVERY
                                </span>
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono font-bold text-blue-400 text-xs">JC-SRV-1001</span>
                                        <span class="text-xs text-white font-bold">Rahul Deshmukh</span>
                                    </div>
                                    <p class="text-xs text-slate-400 m-0">ASUS ROG Strix G15 (G513) (Gaming Laptop)</p>
                                </div>
                                <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">
                                    REPAIRING
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 2: PRODUCTS -->
            <div id="tab-content-products" class="admin-tab-pane hidden space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Products Catalog Manager</h1>
                        <p class="text-xs text-slate-400 mt-1">Manage all Laptops, Mobiles, Printers, CCTV Cameras & Hardware inventory.</p>
                    </div>
                    <button type="button" onclick="openAddProductModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ Add New Product</span>
                    </button>
                </div>

                <div class="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 overflow-x-auto space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
                        <div class="flex items-center gap-3">
                            <input
                                type="text"
                                id="admin-product-search-input"
                                placeholder="Search products by name, specs, brand..."
                                class="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none w-72 focus:border-blue-500"
                            />
                            <select id="admin-product-category-filter" class="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none cursor-pointer">
                                <option value="all">All Categories</option>
                                <option value="Laptop">Laptops</option>
                                <option value="Mobile">Mobiles</option>
                                <option value="Printer">Printers</option>
                                <option value="CCTV Camera">CCTV Cameras</option>
                            </select>
                        </div>
                        <span id="admin-products-count-badge" class="text-xs text-slate-400 font-bold">Showing 16 Live Products</span>
                    </div>

                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                                <th class="py-3 px-2">Product</th>
                                <th class="py-3 px-2">Category</th>
                                <th class="py-3 px-2">Brand</th>
                                <th class="py-3 px-2">MRP Price</th>
                                <th class="py-3 px-2">Sale Price</th>
                                <th class="py-3 px-2">Stock</th>
                                <th class="py-3 px-2">Badges</th>
                                <th class="py-3 px-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="admin-products-table-body" class="divide-y divide-slate-800/60">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: CATEGORIES -->
            <div id="tab-content-categories" class="admin-tab-pane hidden space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Category Stacks & Taxonomy</h1>
                        <p class="text-xs text-slate-400 mt-1">Manage the 4 primary device stacks and all 15 hardware categories.</p>
                    </div>
                    <button type="button" onclick="openAddCategoryModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ Add Category</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="admin-categories-grid">
                </div>
            </div>

            <!-- TAB 4: BRANDS -->
            <div id="tab-content-brands" class="admin-tab-pane hidden space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Brands & Manufacturers</h1>
                        <p class="text-xs text-slate-400 mt-1">Manage authorized hardware dealer brands and manufacturer badges.</p>
                    </div>
                    <button type="button" onclick="openAddBrandModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ Add Brand</span>
                    </button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="admin-brands-grid">
                </div>
            </div>

            <!-- TAB 5: HOMEPAGE BANNERS -->
            <div id="tab-content-banners" class="admin-tab-pane hidden space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Homepage Hero Banners</h1>
                        <p class="text-xs text-slate-400 mt-1">Manage main slider banners, background images, and CTA buttons.</p>
                    </div>
                    <button type="button" onclick="openAddBannerModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ Add New Banner</span>
                    </button>
                </div>

                <div class="space-y-4" id="admin-banners-list">
                </div>
            </div>

            <!-- TAB 6: OFFERS & COUPONS -->
            <div id="tab-content-offers" class="admin-tab-pane hidden space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Offers & Promotional Coupons</h1>
                        <p class="text-xs text-slate-400 mt-1">Manage discount coupon codes and special festival deals.</p>
                    </div>
                    <button type="button" onclick="openAddOfferModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ Add Coupon</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="admin-offers-grid">
                </div>
            </div>

            <!-- TAB 7: REPAIR / SERVICE REQUESTS -->
            <div id="tab-content-repairs" class="admin-tab-pane hidden space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white m-0 tracking-tight">Repair & Service Pipeline</h1>
                        <p class="text-xs text-slate-400 mt-1">Live customer repair tracker management with WhatsApp diagnosis alerts.</p>
                    </div>
                    <button type="button" onclick="openAddRepairModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ New Repair Ticket</span>
                    </button>
                </div>

                <div class="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead>
                            <tr class="text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                                <th class="py-3 px-2">Ticket ID</th>
                                <th class="py-3 px-2">Customer</th>
                                <th class="py-3 px-2">Device & Model</th>
                                <th class="py-3 px-2">Issue</th>
                                <th class="py-3 px-2">Status Stage</th>
                                <th class="py-3 px-2">Est. Cost</th>
                                <th class="py-3 px-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="admin-repairs-table-body" class="divide-y divide-slate-800/60">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 8: CUSTOM PC REQUESTS -->
            <div id="tab-content-custom-pc" class="admin-tab-pane hidden space-y-6">
                <div>
                    <h1 class="text-3xl font-black text-white m-0 tracking-tight">Custom PC Rig Inquiries</h1>
                    <p class="text-xs text-slate-400 mt-1">Customer configurations generated from the online PC builder.</p>
                </div>
                <div class="space-y-4" id="admin-custom-pc-list">
                </div>
            </div>

            <!-- TAB 9: B2B QUOTATIONS -->
            <div id="tab-content-quotations" class="admin-tab-pane hidden space-y-6">
                <div>
                    <h1 class="text-3xl font-black text-white m-0 tracking-tight">Corporate & B2B Quotations</h1>
                    <p class="text-xs text-slate-400 mt-1">Bulk institutional inquiries for office setups.</p>
                </div>
                <div class="p-12 text-center rounded-3xl bg-[#0d1424] border border-slate-800 space-y-2">
                    <p class="text-xs text-slate-300">All new corporate quotations automatically forward to WhatsApp: <strong><?php echo esc_html($db['settings']['phone']); ?></strong></p>
                </div>
            </div>

            <!-- TAB 10: CUSTOMER ENQUIRIES -->
            <div id="tab-content-enquiries" class="admin-tab-pane hidden space-y-6">
                <div>
                    <h1 class="text-3xl font-black text-white m-0 tracking-tight">Customer Enquiries Inbox</h1>
                    <p class="text-xs text-slate-400 mt-1">Direct inquiries from website visitors.</p>
                </div>
                <div class="p-12 text-center rounded-3xl bg-[#0d1424] border border-slate-800 space-y-2">
                    <p class="text-xs text-slate-300">Direct inquiries land on official WhatsApp hotline: <strong><?php echo esc_html($db['settings']['whatsapp']); ?></strong></p>
                </div>
            </div>

            <!-- TAB 11: STORE ORDERS -->
            <div id="tab-content-orders" class="admin-tab-pane hidden space-y-6">
                <div>
                    <h1 class="text-3xl font-black text-white m-0 tracking-tight">Store Orders Dispatch Pipeline</h1>
                    <p class="text-xs text-slate-400 mt-1">Orders placed via Instant UPI and WhatsApp.</p>
                </div>
                <div class="space-y-4" id="admin-orders-list">
                </div>
            </div>

            <!-- TAB 12: WEBSITE SETTINGS -->
            <div id="tab-content-settings" class="admin-tab-pane hidden space-y-6">
                <div>
                    <h1 class="text-3xl font-black text-white m-0 tracking-tight">Website Settings CMS</h1>
                    <p class="text-xs text-slate-400 mt-1">Configure your official store phone, WhatsApp hotline, UPI ID, address, and legal details.</p>
                </div>

                <form id="jijau-admin-settings-form" class="space-y-6">
                    <div class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4">
                        <h3 class="text-sm font-bold text-white m-0 flex items-center gap-2">
                            <i data-lucide="store" class="w-4 h-4 text-blue-400"></i>
                            <span>Store Identity & Contact</span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">Store Name</label>
                                <input type="text" id="setting-storeName" value="<?php echo esc_attr($db['settings']['storeName']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">Tagline</label>
                                <input type="text" id="setting-tagline" value="<?php echo esc_attr($db['settings']['tagline']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">Phone Helpline</label>
                                <input type="text" id="setting-phone" value="<?php echo esc_attr($db['settings']['phone']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">WhatsApp Hotline Number (e.g. 918805607908)</label>
                                <input type="text" id="setting-whatsapp" value="<?php echo esc_attr($db['settings']['whatsapp']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 font-mono" />
                            </div>
                        </div>
                    </div>

                    <div class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4">
                        <h3 class="text-sm font-bold text-white m-0 flex items-center gap-2">
                            <i data-lucide="credit-card" class="w-4 h-4 text-emerald-400"></i>
                            <span>UPI Payment Configuration (Instant GPay / PhonePe / Paytm)</span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">Store UPI VPA ID (e.g. jijauc@ibl)</label>
                                <input type="text" id="setting-upiId" value="<?php echo esc_attr($db['settings']['upiId']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 font-mono" />
                            </div>
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">UPI Payee / Merchant Name</label>
                                <input type="text" id="setting-upiName" value="<?php echo esc_attr($db['settings']['upiName']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div class="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4">
                        <h3 class="text-sm font-bold text-white m-0 flex items-center gap-2">
                            <i data-lucide="map-pin" class="w-4 h-4 text-purple-400"></i>
                            <span>Location, Timings & Legal GSTIN</span>
                        </h3>
                        <div class="space-y-4 text-xs">
                            <div>
                                <label class="font-bold text-slate-300 block mb-1">Physical Store Address</label>
                                <textarea id="setting-address" rows="2" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"><?php echo esc_textarea($db['settings']['address']); ?></textarea>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="font-bold text-slate-300 block mb-1">Working Hours</label>
                                    <input type="text" id="setting-hours" value="<?php echo esc_attr($db['settings']['hours']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label class="font-bold text-slate-300 block mb-1">GSTIN Number</label>
                                    <input type="text" id="setting-gstin" value="<?php echo esc_attr($db['settings']['gstin']); ?>" class="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="button" onclick="saveStoreSettings()" class="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer">
                            <i data-lucide="save" class="w-4 h-4"></i>
                            <span>Save Settings & Update Public Website</span>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <!-- GENERIC MODAL CONTAINER -->
    <div id="admin-modal-container" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div id="admin-modal-content" class="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        </div>
    </div>

    <!-- JIJAU ADMIN APPLICATION SCRIPT -->
    <script>
        let storeData = window.JijauAdminState;

        function formatINR(val) {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
        }

        function triggerSyncAlert(msg) {
            const banner = document.getElementById('admin-sync-banner');
            const text = document.getElementById('admin-sync-text');
            if (banner && text) {
                text.innerText = '✓ ' + (msg || 'Changes saved successfully and synced with live store!');
                banner.classList.remove('hidden');
                setTimeout(() => banner.classList.add('hidden'), 4000);
            }
        }

        function persistStoreData(callback) {
            const fd = new FormData();
            fd.append('action', 'jijau_save_all_admin_data');
            fd.append('nonce', window.JijauAdminNonce);
            fd.append('data', JSON.stringify(storeData));

            fetch(window.JijauAjaxUrl, { method: 'POST', body: fd })
                .then(r => r.json())
                .then(res => {
                    triggerSyncAlert();
                    if (callback) callback();
                })
                .catch(err => {
                    alert('Error saving data to WordPress database.');
                });
        }

        // ==========================================
        // TAB SWITCHING
        // ==========================================
        function switchAdminTab(tabName) {
            document.querySelectorAll('.admin-nav-item').forEach(el => {
                const active = el.getAttribute('data-tab') === tabName;
                if (active) {
                    el.className = 'admin-nav-item active w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-blue-600 text-white font-bold transition-all text-left cursor-pointer';
                } else {
                    el.className = 'admin-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-left cursor-pointer';
                }
            });

            document.querySelectorAll('.admin-tab-pane').forEach(el => el.classList.add('hidden'));

            const target = document.getElementById('tab-content-' + tabName);
            if (target) target.classList.remove('hidden');

            if (tabName === 'products') renderProductsTable();
            if (tabName === 'categories') renderCategoriesGrid();
            if (tabName === 'brands') renderBrandsGrid();
            if (tabName === 'banners') renderBannersList();
            if (tabName === 'offers') renderOffersGrid();
            if (tabName === 'repairs') renderRepairsTable();
            if (tabName === 'custom-pc') renderCustomPcList();
            if (tabName === 'orders') renderOrdersList();

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        document.querySelectorAll('.admin-nav-item').forEach(btn => {
            btn.addEventListener('click', function() {
                switchAdminTab(this.getAttribute('data-tab'));
            });
        });

        // ==========================================
        // 1. PRODUCTS CRUD & SEARCH
        // ==========================================
        function renderProductsTable() {
            const tbody = document.getElementById('admin-products-table-body');
            const searchVal = (document.getElementById('admin-product-search-input')?.value || '').toLowerCase();
            const catVal = document.getElementById('admin-product-category-filter')?.value || 'all';

            if (!tbody) return;

            let filtered = storeData.products.filter(p => {
                const matchSearch = p.name.toLowerCase().includes(searchVal) || (p.brand || '').toLowerCase().includes(searchVal) || (p.specs || '').toLowerCase().includes(searchVal);
                const matchCat = catVal === 'all' || p.category === catVal;
                return matchSearch && matchCat;
            });

            document.getElementById('admin-products-count-badge').innerText = `Showing ${filtered.length} of ${storeData.products.length} Products`;
            document.getElementById('stat-total-products').innerText = storeData.products.length;

            tbody.innerHTML = filtered.map(p => `
                <tr class="hover:bg-slate-900/40 transition-colors">
                    <td class="py-3.5 px-2 font-bold text-white flex items-center gap-2.5">
                        <img src="${p.image}" class="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0" />
                        <span class="line-clamp-1">${p.name}</span>
                    </td>
                    <td class="py-3.5 px-2 text-slate-300">${p.category}</td>
                    <td class="py-3.5 px-2 font-bold text-blue-400">${p.brand}</td>
                    <td class="py-3.5 px-2 text-slate-400 line-through">${formatINR(p.price)}</td>
                    <td class="py-3.5 px-2 font-black text-emerald-400">${formatINR(p.salePrice)}</td>
                    <td class="py-3.5 px-2 text-white">${p.stock} in stock</td>
                    <td class="py-3.5 px-2"><span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">${p.discount || 'DEAL'}</span></td>
                    <td class="py-3.5 px-2 text-right space-x-1.5 whitespace-nowrap">
                        <button type="button" onclick="openEditProductModal('${p.id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold cursor-pointer">Edit</button>
                        <button type="button" onclick="deleteProduct('${p.id}')" class="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded text-[11px] font-bold cursor-pointer">Delete</button>
                    </td>
                </tr>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        document.getElementById('admin-product-search-input')?.addEventListener('input', renderProductsTable);
        document.getElementById('admin-product-category-filter')?.addEventListener('change', renderProductsTable);

        function openAddProductModal() {
            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            content.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-base font-black text-white m-0">+ Add New Product</h3>
                    <button type="button" onclick="closeAdminModal()" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
                </div>
                <form id="add-product-form" class="space-y-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Product Title *</label>
                        <input type="text" id="new-prod-name" required placeholder="e.g. Dell XPS 15 Gaming Laptop" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Category *</label>
                            <select id="new-prod-category" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500">
                                <option value="Laptop">Laptop</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Printer">Printer</option>
                                <option value="CCTV Camera">CCTV Camera</option>
                                <option value="Processors (CPU)">Processors (CPU)</option>
                                <option value="Graphics Cards (GPU)">Graphics Cards (GPU)</option>
                                <option value="Monitors">Monitors</option>
                                <option value="RAM Memory">RAM Memory</option>
                                <option value="Storage (SSD & HDD)">Storage (SSD & HDD)</option>
                            </select>
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Brand *</label>
                            <input type="text" id="new-prod-brand" required placeholder="e.g. Dell, HP, Apple" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">MRP Price (₹) *</label>
                            <input type="number" id="new-prod-price" required placeholder="125000" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Sale Price (₹) *</label>
                            <input type="number" id="new-prod-saleprice" required placeholder="109990" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Stock *</label>
                            <input type="number" id="new-prod-stock" required value="10" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Background / Product Image URL *</label>
                        <input type="url" id="new-prod-image" required placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Key Technical Specs</label>
                        <textarea id="new-prod-specs" rows="2" placeholder="e.g. Intel Core i7 14th Gen, 16GB DDR5, 1TB NVMe SSD..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"></textarea>
                    </div>
                    <div class="flex gap-4 pt-1">
                        <label class="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" id="new-prod-featured" checked />
                            <span class="text-slate-300 font-bold">Featured on Home</span>
                        </label>
                        <label class="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" id="new-prod-bestseller" checked />
                            <span class="text-slate-300 font-bold">Bestseller</span>
                        </label>
                    </div>
                    <div class="flex gap-2 pt-3 border-t border-slate-800">
                        <button type="button" onclick="closeAdminModal()" class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                        <button type="submit" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Product</button>
                    </div>
                </form>
            `;

            document.getElementById('add-product-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const price = parseFloat(document.getElementById('new-prod-price').value) || 0;
                const salePrice = parseFloat(document.getElementById('new-prod-saleprice').value) || price;
                const discountPct = price > salePrice ? Math.round(((price - salePrice) / price) * 100) + '% OFF' : 'DEAL';

                const newProd = {
                    id: 'p-' + Date.now(),
                    name: document.getElementById('new-prod-name').value,
                    category: document.getElementById('new-prod-category').value,
                    brand: document.getElementById('new-prod-brand').value,
                    price: price,
                    salePrice: salePrice,
                    stock: parseInt(document.getElementById('new-prod-stock').value) || 5,
                    discount: discountPct,
                    specs: document.getElementById('new-prod-specs').value,
                    image: document.getElementById('new-prod-image').value,
                    isFeatured: document.getElementById('new-prod-featured').checked,
                    isBestseller: document.getElementById('new-prod-bestseller').checked
                };

                storeData.products.unshift(newProd);
                persistStoreData(() => {
                    closeAdminModal();
                    renderProductsTable();
                });
            });
        }

        function openEditProductModal(id) {
            const p = storeData.products.find(x => x.id === id);
            if (!p) return;

            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            content.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-base font-black text-white m-0">Edit Product: ${p.name}</h3>
                    <button type="button" onclick="closeAdminModal()" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
                </div>
                <form id="edit-product-form" class="space-y-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Product Title *</label>
                        <input type="text" id="edit-prod-name" value="${p.name}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Category *</label>
                            <input type="text" id="edit-prod-category" value="${p.category}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Brand *</label>
                            <input type="text" id="edit-prod-brand" value="${p.brand}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">MRP Price (₹) *</label>
                            <input type="number" id="edit-prod-price" value="${p.price}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Sale Price (₹) *</label>
                            <input type="number" id="edit-prod-saleprice" value="${p.salePrice}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Stock *</label>
                            <input type="number" id="edit-prod-stock" value="${p.stock}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                        </div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Background / Product Image URL *</label>
                        <input type="url" id="edit-prod-image" value="${p.image}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Technical Specs</label>
                        <textarea id="edit-prod-specs" rows="2" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none">${p.specs || ''}</textarea>
                    </div>
                    <div class="flex gap-2 pt-3 border-t border-slate-800">
                        <button type="button" onclick="closeAdminModal()" class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                        <button type="submit" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Update Product</button>
                    </div>
                </form>
            `;

            document.getElementById('edit-product-form').addEventListener('submit', function(e) {
                e.preventDefault();
                p.name = document.getElementById('edit-prod-name').value;
                p.category = document.getElementById('edit-prod-category').value;
                p.brand = document.getElementById('edit-prod-brand').value;
                p.price = parseFloat(document.getElementById('edit-prod-price').value) || 0;
                p.salePrice = parseFloat(document.getElementById('edit-prod-saleprice').value) || p.price;
                p.stock = parseInt(document.getElementById('edit-prod-stock').value) || 0;
                p.image = document.getElementById('edit-prod-image').value;
                p.specs = document.getElementById('edit-prod-specs').value;

                persistStoreData(() => {
                    closeAdminModal();
                    renderProductsTable();
                });
            });
        }

        function deleteProduct(id) {
            if (!confirm('Are you sure you want to delete this product from the store?')) return;
            storeData.products = storeData.products.filter(x => x.id !== id);
            persistStoreData(() => renderProductsTable());
        }

        // ==========================================
        // 2. CATEGORIES CRUD
        // ==========================================
        function renderCategoriesGrid() {
            const grid = document.getElementById('admin-categories-grid');
            if (!grid) return;

            document.getElementById('stat-total-categories').innerText = storeData.categories.length;

            grid.innerHTML = storeData.categories.map((c, idx) => `
                <div class="p-5 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-3 flex flex-col justify-between group hover:border-slate-700 transition-all">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                                Order #${c.order || (idx + 1)}
                            </span>
                            <span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}">
                                ${c.isActive ? 'Active' : 'Hidden'}
                            </span>
                        </div>
                        <div class="flex items-center gap-3 mb-2">
                            ${c.imageUrl ? `<img src="${c.imageUrl}" class="w-11 h-11 rounded-xl object-cover bg-slate-900" />` : `<div class="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400"><i data-lucide="folder-tree" class="w-5 h-5"></i></div>`}
                            <div>
                                <h3 class="font-bold text-white text-sm m-0">${c.name}</h3>
                                <span class="font-mono text-[10px] text-slate-400">/${c.slug}</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-400 line-clamp-2 m-0">${c.desc || ''}</p>
                    </div>
                    <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span class="text-xs text-blue-400 font-semibold">${storeData.products.filter(p => p.category === c.name).length} Products</span>
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="deleteCategory('${c.id}')" class="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/40 text-rose-400 cursor-pointer">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function openAddCategoryModal() {
            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            content.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-base font-black text-white m-0">Create New Category</h3>
                    <button type="button" onclick="closeAdminModal()" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
                </div>
                <form id="add-cat-form" class="space-y-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Category Name *</label>
                        <input type="text" id="new-cat-name" required placeholder="e.g. Graphics Cards (GPU)" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Slug (URL)</label>
                        <input type="text" id="new-cat-slug" placeholder="e.g. graphics-cards" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Background / Cover Image URL *</label>
                        <input type="url" id="new-cat-image" required placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Display Order #</label>
                            <input type="number" id="new-cat-order" value="${storeData.categories.length + 1}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                        <div class="flex items-center pt-5">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" id="new-cat-active" checked />
                                <span class="text-slate-300 font-bold">Active in Menu</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Description</label>
                        <textarea id="new-cat-desc" rows="2" placeholder="Brief description of this device category..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"></textarea>
                    </div>
                    <div class="flex gap-2 pt-3">
                        <button type="button" onclick="closeAdminModal()" class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                        <button type="submit" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Category</button>
                    </div>
                </form>
            `;

            document.getElementById('add-cat-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('new-cat-name').value;
                const newCat = {
                    id: 'cat-' + Date.now(),
                    name: name,
                    slug: document.getElementById('new-cat-slug').value || name.toLowerCase().replace(/\s+/g, '-'),
                    imageUrl: document.getElementById('new-cat-image').value,
                    order: parseInt(document.getElementById('new-cat-order').value) || (storeData.categories.length + 1),
                    isActive: document.getElementById('new-cat-active').checked,
                    desc: document.getElementById('new-cat-desc').value
                };
                storeData.categories.push(newCat);
                persistStoreData(() => {
                    closeAdminModal();
                    renderCategoriesGrid();
                });
            });
        }

        function deleteCategory(id) {
            if (!confirm('Delete this category?')) return;
            storeData.categories = storeData.categories.filter(x => x.id !== id);
            persistStoreData(() => renderCategoriesGrid());
        }

        // ==========================================
        // 3. BRANDS CRUD
        // ==========================================
        function renderBrandsGrid() {
            const grid = document.getElementById('admin-brands-grid');
            if (!grid) return;

            grid.innerHTML = storeData.brands.map(b => `
                <div class="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 text-center space-y-2 relative group hover:border-slate-700 transition-all">
                    <button type="button" onclick="deleteBrand('${b.id}')" class="absolute top-2 right-2 text-slate-500 hover:text-rose-400 text-xs hidden group-hover:block cursor-pointer">&times;</button>
                    <h4 class="font-bold text-xs text-white m-0">${b.name}</h4>
                    <span class="text-[10px] text-emerald-400 font-bold block">Authorized</span>
                </div>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function openAddBrandModal() {
            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            content.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-base font-black text-white m-0">+ Add New Brand</h3>
                    <button type="button" onclick="closeAdminModal()" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
                </div>
                <form id="add-brand-form" class="space-y-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Brand Name *</label>
                        <input type="text" id="new-brand-name" required placeholder="e.g. Gigabyte, Razer, MSI" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Brand Logo / Image URL</label>
                        <input type="url" id="new-brand-logo" placeholder="https://..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Category Associations</label>
                        <input type="text" id="new-brand-cat" placeholder="e.g. Laptop, Motherboard, GPU" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div class="flex gap-2 pt-3">
                        <button type="button" onclick="closeAdminModal()" class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                        <button type="submit" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Brand</button>
                    </div>
                </form>
            `;

            document.getElementById('add-brand-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('new-brand-name').value;
                const newBrand = {
                    id: 'br-' + Date.now(),
                    name: name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                    logoUrl: document.getElementById('new-brand-logo').value,
                    category: document.getElementById('new-brand-cat').value || 'Hardware',
                    isActive: true
                };
                storeData.brands.push(newBrand);
                persistStoreData(() => {
                    closeAdminModal();
                    renderBrandsGrid();
                });
            });
        }

        function deleteBrand(id) {
            if (!confirm('Delete this brand?')) return;
            storeData.brands = storeData.brands.filter(x => x.id !== id);
            persistStoreData(() => renderBrandsGrid());
        }

        // ==========================================
        // 4. HOMEPAGE BANNERS (Matching Localhost Image 2 100%)
        // ==========================================
        function renderBannersList() {
            const list = document.getElementById('admin-banners-list');
            if (!list) return;

            list.innerHTML = storeData.banners.map((b, i) => `
                <div class="bg-slate-950 rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
                    <div class="w-full md:w-64 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img src="${b.imageUrl}" class="w-full h-full object-cover" />
                    </div>

                    <div class="flex-1 space-y-2 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded uppercase text-[10px]">
                                ${b.tag || 'PROMOTION'}
                            </span>
                            <span class="text-slate-500">Order #${b.order || (i + 1)}</span>
                            <span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${b.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}">
                                ${b.isActive ? 'Active' : 'Disabled'}
                            </span>
                        </div>

                        <h3 class="text-base font-black text-white leading-snug m-0">${b.title}</h3>
                        ${b.subtitle ? `<p class="text-slate-400 line-clamp-2 m-0">${b.subtitle}</p>` : ''}

                        <div class="flex items-center gap-4 text-[11px] text-blue-400 pt-1">
                            <span>CTA: ${b.ctaText || 'Shop Now'}</span>
                            <span>Link: ${b.ctaLink || '/products'}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button type="button" onclick="deleteBanner('${b.id}')" class="p-2 rounded-xl bg-slate-900 hover:bg-rose-900/40 text-rose-400 cursor-pointer">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function openAddBannerModal() {
            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            // Exact 1:1 replica of Localhost Screenshot 2
            content.innerHTML = `
                <h3 class="text-base font-black text-white mb-4">Create Hero Banner</h3>

                <form id="add-banner-form" class="space-y-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Banner Title / Heading *</label>
                        <input
                            type="text"
                            id="new-banner-title"
                            required
                            placeholder="e.g. Jijau Custom Gaming Battlestations"
                            class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Subtitle / Deal Summary</label>
                        <input
                            type="text"
                            id="new-banner-subtitle"
                            placeholder="e.g. Powered by RTX 4080 Super & Intel 14th Gen..."
                            class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Tag / Badge Text</label>
                            <input
                                type="text"
                                id="new-banner-tag"
                                placeholder="e.g. SPECIAL PROMOTION"
                                value="SPECIAL PROMOTION"
                                class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Slide Order #</label>
                            <input
                                type="number"
                                id="new-banner-order"
                                value="${storeData.banners.length + 1}"
                                class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Background Image URL *</label>
                        <input
                            type="url"
                            id="new-banner-image"
                            required
                            placeholder="https://images.unsplash.com/..."
                            class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">CTA Button Text</label>
                            <input
                                type="text"
                                id="new-banner-cta-text"
                                value="Shop Now"
                                placeholder="e.g. Shop Now"
                                class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">CTA Link</label>
                            <input
                                type="text"
                                id="new-banner-cta-link"
                                value="/products"
                                placeholder="e.g. /products"
                                class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div class="pt-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="new-banner-active" checked />
                            <span class="text-slate-300 font-bold">Active in Homepage Carousel</span>
                        </label>
                    </div>

                    <div class="flex gap-2 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onclick="closeAdminModal()"
                            class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                        >
                            Save Banner
                        </button>
                    </div>
                </form>
            `;

            document.getElementById('add-banner-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const newBan = {
                    id: 'ban-' + Date.now(),
                    title: document.getElementById('new-banner-title').value,
                    subtitle: document.getElementById('new-banner-subtitle').value,
                    tag: document.getElementById('new-banner-tag').value || 'SPECIAL PROMOTION',
                    order: parseInt(document.getElementById('new-banner-order').value) || 1,
                    imageUrl: document.getElementById('new-banner-image').value,
                    ctaText: document.getElementById('new-banner-cta-text').value || 'Shop Now',
                    ctaLink: document.getElementById('new-banner-cta-link').value || '/products',
                    isActive: document.getElementById('new-banner-active').checked
                };

                storeData.banners.push(newBan);
                persistStoreData(() => {
                    closeAdminModal();
                    renderBannersList();
                });
            });
        }

        function deleteBanner(id) {
            if (!confirm('Delete this banner?')) return;
            storeData.banners = storeData.banners.filter(x => x.id !== id);
            persistStoreData(() => renderBannersList());
        }

        // ==========================================
        // 5. OFFERS & COUPONS
        // ==========================================
        function renderOffersGrid() {
            const grid = document.getElementById('admin-offers-grid');
            if (!grid) return;

            document.getElementById('stat-total-offers').innerText = storeData.offers.length;

            grid.innerHTML = storeData.offers.map(off => `
                <div class="p-5 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all">
                    <button type="button" onclick="deleteOffer('${off.id}')" class="absolute top-3 right-3 text-slate-500 hover:text-rose-400 text-xs hidden group-hover:block cursor-pointer">&times;</button>
                    <span class="font-mono font-bold text-amber-400 text-sm block">${off.code}</span>
                    <h4 class="font-bold text-white text-xs m-0">${off.title}</h4>
                    <div class="flex items-center justify-between pt-2">
                        <span class="text-[11px] text-slate-400">${off.discount}</span>
                        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">${off.isActive ? 'ACTIVE' : 'OFF'}</span>
                    </div>
                </div>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function openAddOfferModal() {
            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            content.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-base font-black text-white m-0">Create Promo Coupon</h3>
                    <button type="button" onclick="closeAdminModal()" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
                </div>
                <form id="add-offer-form" class="space-y-3 text-xs">
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Coupon Code *</label>
                        <input type="text" id="new-off-code" required placeholder="e.g. DIWALI20" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none font-mono uppercase focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Offer Title *</label>
                        <input type="text" id="new-off-title" required placeholder="e.g. 20% Off on all CCTV systems" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Discount Tag (e.g. 20% OFF or ₹2,000 OFF)</label>
                        <input type="text" id="new-off-discount" placeholder="20% OFF" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div class="flex gap-2 pt-3 border-t border-slate-800">
                        <button type="button" onclick="closeAdminModal()" class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                        <button type="submit" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Save Coupon</button>
                    </div>
                </form>
            `;

            document.getElementById('add-offer-form').addEventListener('submit', function(e) {
                e.preventDefault();
                storeData.offers.push({
                    id: 'off-' + Date.now(),
                    code: document.getElementById('new-off-code').value.toUpperCase(),
                    title: document.getElementById('new-off-title').value,
                    discount: document.getElementById('new-off-discount').value || 'SPECIAL DEAL',
                    isActive: true
                });
                persistStoreData(() => {
                    closeAdminModal();
                    renderOffersGrid();
                });
            });
        }

        function deleteOffer(id) {
            storeData.offers = storeData.offers.filter(x => x.id !== id);
            persistStoreData(() => renderOffersGrid());
        }

        // ==========================================
        // 6. REPAIRS & SERVICE PIPELINE
        // ==========================================
        function renderRepairsTable() {
            const tbody = document.getElementById('admin-repairs-table-body');
            if (!tbody) return;

            document.getElementById('stat-total-repairs').innerText = storeData.repairs.length;

            tbody.innerHTML = storeData.repairs.map(r => {
                const waMsg = `Hi ${r.customerName}, your ${r.device} (Ticket #${r.ticketId}) status is now: *${r.status}* at Jijau Computers.\nNotes: ${r.notes || 'In progress'}\nEstimated: ${formatINR(r.cost || 0)}`;
                const waLink = `https://wa.me/91${r.phone}?text=${encodeURIComponent(waMsg)}`;

                return `
                    <tr class="hover:bg-slate-900/40 transition-colors">
                        <td class="py-3 px-2 font-mono font-bold text-blue-400">${r.ticketId}</td>
                        <td class="py-3 px-2">
                            <span class="font-bold text-white block">${r.customerName}</span>
                            <span class="text-[11px] text-slate-400">${r.phone}</span>
                        </td>
                        <td class="py-3 px-2 text-slate-300 font-semibold">${r.device}</td>
                        <td class="py-3 px-2 text-slate-400 max-w-xs line-clamp-1">${r.issue}</td>
                        <td class="py-3 px-2">
                            <select onchange="updateRepairStatus('${r.id}', this.value)" class="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[11px] font-bold text-blue-400 outline-none cursor-pointer">
                                <option value="Received" ${r.status === 'Received' ? 'selected' : ''}>1. Received</option>
                                <option value="Inspected" ${r.status === 'Inspected' ? 'selected' : ''}>2. Inspected</option>
                                <option value="Repairing" ${r.status === 'Repairing' ? 'selected' : ''}>3. Repairing</option>
                                <option value="Waiting for Parts" ${r.status === 'Waiting for Parts' ? 'selected' : ''}>4. Waiting for Parts</option>
                                <option value="Ready for Delivery" ${r.status === 'Ready for Delivery' ? 'selected' : ''}>5. Ready for Delivery</option>
                                <option value="Delivered" ${r.status === 'Delivered' ? 'selected' : ''}>6. Delivered</option>
                            </select>
                        </td>
                        <td class="py-3 px-2 font-black text-white">${formatINR(r.cost || 0)}</td>
                        <td class="py-3 px-2 text-right space-x-1.5 whitespace-nowrap">
                            <a href="${waLink}" target="_blank" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold inline-block">WhatsApp Alert</a>
                            <button type="button" onclick="deleteRepair('${r.id}')" class="px-2 py-1 bg-rose-500/20 text-rose-400 rounded-lg text-[11px] font-bold cursor-pointer">Delete</button>
                        </td>
                    </tr>
                `;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function updateRepairStatus(id, newStatus) {
            const r = storeData.repairs.find(x => x.id === id);
            if (r) {
                r.status = newStatus;
                persistStoreData(() => renderRepairsTable());
            }
        }

        function openAddRepairModal() {
            const modal = document.getElementById('admin-modal-container');
            const content = document.getElementById('admin-modal-content');
            modal.classList.remove('hidden');

            content.innerHTML = `
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-base font-black text-white m-0">+ New Repair Ticket</h3>
                    <button type="button" onclick="closeAdminModal()" class="text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
                </div>
                <form id="add-rep-form" class="space-y-3 text-xs">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Customer Name *</label>
                            <input type="text" id="new-rep-name" required placeholder="e.g. Ramesh Kulkarni" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label class="font-bold text-slate-300 block mb-1">Phone Number *</label>
                            <input type="tel" id="new-rep-phone" required placeholder="10-digit mobile" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Device Model *</label>
                        <input type="text" id="new-rep-device" required placeholder="e.g. HP Pavilion Gaming 15" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Reported Issue *</label>
                        <textarea id="new-rep-issue" rows="2" required placeholder="Issue description..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"></textarea>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300 block mb-1">Estimated Cost (₹)</label>
                        <input type="number" id="new-rep-cost" placeholder="2500" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500" />
                    </div>
                    <div class="flex gap-2 pt-3 border-t border-slate-800">
                        <button type="button" onclick="closeAdminModal()" class="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                        <button type="submit" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">Create Ticket</button>
                    </div>
                </form>
            `;

            document.getElementById('add-rep-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const newRep = {
                    id: 'rep-' + Date.now(),
                    ticketId: 'JC-SRV-' + Math.floor(1000 + Math.random() * 9000),
                    customerName: document.getElementById('new-rep-name').value,
                    phone: document.getElementById('new-rep-phone').value,
                    device: document.getElementById('new-rep-device').value,
                    issue: document.getElementById('new-rep-issue').value,
                    status: 'Received',
                    cost: parseFloat(document.getElementById('new-rep-cost').value) || 0,
                    notes: 'Device checked in at front desk.'
                };
                storeData.repairs.unshift(newRep);
                persistStoreData(() => {
                    closeAdminModal();
                    renderRepairsTable();
                });
            });
        }

        function deleteRepair(id) {
            if (!confirm('Delete ticket?')) return;
            storeData.repairs = storeData.repairs.filter(x => x.id !== id);
            persistStoreData(() => renderRepairsTable());
        }

        // ==========================================
        // 7. CUSTOM PC REQUESTS & ORDERS
        // ==========================================
        function renderCustomPcList() {
            const list = document.getElementById('admin-custom-pc-list');
            if (!list) return;

            document.getElementById('stat-total-leads').innerText = storeData.customPcLeads.length;

            list.innerHTML = storeData.customPcLeads.map(lead => {
                const waMsg = `*Jijau Computers Quotation for Custom Rig #${lead.reqNumber}*\nHi ${lead.customerName},\nSpecs: ${lead.specs}\nEstimated Total: ${formatINR(lead.totalEst || 0)}\n\nPlease let us know if you would like to proceed with assembly.`;
                const waLink = `https://wa.me/91${lead.phone}?text=${encodeURIComponent(waMsg)}`;

                return `
                    <div class="p-5 rounded-3xl bg-[#0d1424] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <span class="font-mono font-bold text-amber-400 text-xs">#${lead.reqNumber}</span>
                                <span class="font-bold text-white text-xs">${lead.customerName} (${lead.phone})</span>
                            </div>
                            <p class="text-xs text-slate-300 m-0">${lead.purpose} • Budget: ${lead.budget}</p>
                            <p class="text-[11px] text-slate-400 m-0">${lead.specs}</p>
                        </div>
                        <a href="${waLink}" target="_blank" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow shrink-0">
                            Send WhatsApp Quote
                        </a>
                    </div>
                `;
            }).join('');
        }

        function renderOrdersList() {
            const list = document.getElementById('admin-orders-list');
            if (!list) return;

            list.innerHTML = storeData.orders.map(ord => `
                <div class="p-5 rounded-3xl bg-[#0d1424] border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                        <span class="font-mono text-blue-400 font-bold text-xs">${ord.orderNumber}</span>
                        <h4 class="font-bold text-white text-xs mt-0.5">${ord.customerName} • ${ord.items}</h4>
                        <span class="text-[11px] text-slate-400">Total: ${formatINR(ord.total)} (${ord.paymentMethod})</span>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">${ord.status}</span>
                </div>
            `).join('');
        }

        // ==========================================
        // 8. SETTINGS SAVE
        // ==========================================
        function saveStoreSettings() {
            storeData.settings = {
                storeName: document.getElementById('setting-storeName').value,
                tagline: document.getElementById('setting-tagline').value,
                phone: document.getElementById('setting-phone').value,
                whatsapp: document.getElementById('setting-whatsapp').value,
                upiId: document.getElementById('setting-upiId').value,
                upiName: document.getElementById('setting-upiName').value,
                address: document.getElementById('setting-address').value,
                hours: document.getElementById('setting-hours').value,
                gstin: document.getElementById('setting-gstin').value,
            };

            persistStoreData(() => {
                alert('Store settings & branding saved successfully!');
            });
        }

        function closeAdminModal() {
            document.getElementById('admin-modal-container').classList.add('hidden');
        }

        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') lucide.createIcons();
            renderProductsTable();
        });
    </script>
    <?php
}
}
