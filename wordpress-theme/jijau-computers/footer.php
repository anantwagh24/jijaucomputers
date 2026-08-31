<?php
$phone = get_theme_mod('jijau_phone', '+91 88056 07908');
$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
$address = get_theme_mod('jijau_address', 'Jijau Computer Sales & Service, Opposite. SBI Bank, Jafrabad, Maharashtra 431206');
$hours = get_theme_mod('jijau_hours', 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM');
$gstin = get_theme_mod('jijau_gstin', '27FQIPK5154C1ZU');
?>

<!-- 4 TRUST & VALUE PROPOSITIONS (Matching Localhost Image 2) -->
<section class="bg-slate-950 text-white py-8 border-t border-slate-800 mt-12">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Badge 1 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="font-bold text-sm text-white">100% Genuine Hardware</h4>
                <p class="text-xs text-slate-400 mt-0.5">Direct Brand Warranty & GST Bill</p>
            </div>
        </div>

        <!-- Badge 2 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="font-bold text-sm text-white">Expert Custom PC Builds</h4>
                <p class="text-xs text-slate-400 mt-0.5">Stress-Tested & Cable Managed</p>
            </div>
        </div>

        <!-- Badge 3 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <i data-lucide="truck" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="font-bold text-sm text-white">Fast & Safe Delivery</h4>
                <p class="text-xs text-slate-400 mt-0.5">Same-Day Pickup in Pune</p>
            </div>
        </div>

        <!-- Badge 4 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <i data-lucide="headphones" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="font-bold text-sm text-white">Dedicated Tech Support</h4>
                <p class="text-xs text-slate-400 mt-0.5">WhatsApp & Phone Assistance</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN FOOTER -->
<footer class="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Col 1: Store Bio -->
        <div class="space-y-4">
            <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
                    <i data-lucide="cpu" class="w-6 h-6"></i>
                </div>
                <span class="text-xl font-black tracking-tight text-white">Jijau Computers</span>
            </div>
            <p class="text-slate-400 text-xs leading-relaxed">
                Pune's #1 Destination for Laptops, Custom Gaming PCs & Computer Hardware.
            </p>
            <div class="space-y-2 text-xs text-slate-400">
                <p class="flex items-start gap-2">
                    <i data-lucide="map-pin" class="w-4 h-4 text-blue-400 shrink-0 mt-0.5"></i>
                    <span><?php echo esc_html($address); ?></span>
                </p>
                <p class="flex items-center gap-2">
                    <i data-lucide="phone" class="w-4 h-4 text-blue-400 shrink-0"></i>
                    <span><?php echo esc_html($phone); ?></span>
                </p>
                <p class="flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-amber-400 shrink-0"></i>
                    <span><?php echo esc_html($hours); ?></span>
                </p>
            </div>
            <p class="font-mono text-[11px] text-slate-400">
                GSTIN: <span class="text-slate-200 font-bold"><?php echo esc_html($gstin); ?></span>
            </p>
        </div>

        <!-- Col 2: Top Categories -->
        <div class="space-y-3">
            <h4 class="text-white font-bold text-sm uppercase tracking-wider">Top Categories</h4>
            <ul class="space-y-2 text-xs">
                <li><a href="<?php echo esc_url(home_url('/devices?cat=laptop')); ?>" class="hover:text-white transition-colors">Gaming Laptops</a></li>
                <li><a href="<?php echo esc_url(home_url('/custom-pc')); ?>" class="hover:text-amber-400 text-amber-400 font-bold transition-colors">Custom PC Builder</a></li>
                <li><a href="<?php echo esc_url(home_url('/devices?cat=laptop')); ?>" class="hover:text-white transition-colors">RTX 40-Series GPUs</a></li>
                <li><a href="<?php echo esc_url(home_url('/devices?cat=laptop')); ?>" class="hover:text-white transition-colors">Intel & AMD Processors</a></li>
                <li><a href="<?php echo esc_url(home_url('/devices?cat=printer')); ?>" class="hover:text-white transition-colors">Ink Tank Printers</a></li>
                <li><a href="<?php echo esc_url(home_url('/devices?cat=cctv')); ?>" class="hover:text-white transition-colors">CCTV & Surveillance</a></li>
            </ul>
        </div>

        <!-- Col 3: Customer Services -->
        <div class="space-y-3">
            <h4 class="text-white font-bold text-sm uppercase tracking-wider">Customer Services</h4>
            <ul class="space-y-2 text-xs">
                <li><a href="<?php echo esc_url(home_url('/track-service')); ?>" class="hover:text-emerald-400 text-emerald-400 font-bold transition-colors">Track Laptop/PC Repair</a></li>
                <li><a href="<?php echo esc_url(home_url('/quote-request')); ?>" class="hover:text-white transition-colors">Request Bulk/B2B Quotation</a></li>
                <li><a href="<?php echo esc_url(home_url('/devices')); ?>" class="hover:text-white transition-colors">Festive Deals & Coupons</a></li>
                <li><a href="<?php echo esc_url(home_url('/devices')); ?>" class="hover:text-white transition-colors">Store Directions & Map</a></li>
                <li><a href="<?php echo esc_url(admin_url()); ?>" class="hover:text-white text-slate-500 transition-colors">Admin Login</a></li>
            </ul>
        </div>

        <!-- Col 4: Visit Store & WhatsApp CTA -->
        <div class="space-y-4">
            <h4 class="text-white font-bold text-sm uppercase tracking-wider">Visit Store</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
                Walk-in to experience live demo setups and speak with our PC hardware specialists in person.
            </p>
            <a
                href="https://maps.google.com/?q=Shivajinagar+Pune"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 hover:text-white transition-colors"
            >
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500"></i>
                <span>Open in Google Maps</span>
                <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
            <div class="pt-2">
                <span class="text-[11px] text-slate-500 uppercase block mb-1 font-bold">Need Immediate Help?</span>
                <a
                    href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('Hi Jijau Computers, I would like to place an order or enquire about available hardware stock.'); ?>"
                    target="_blank"
                    class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                    <span>Chat on WhatsApp</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-slate-900 py-5 text-center text-slate-500 text-[11px]">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; <?php echo date('Y'); ?> <strong>Jijau Computers</strong>. All rights reserved.</span>
            <div class="flex items-center gap-4 text-slate-400">
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="hover:text-white">Terms & Conditions</a>
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="hover:text-white">Privacy Policy</a>
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="hover:text-white">Warranty Guidelines</a>
                <a href="<?php echo esc_url(home_url('/devices')); ?>" class="hover:text-white">Sitemap</a>
            </div>
        </div>
    </div>
</footer>

<!-- FLOATING WHATSAPP BUTTON (Matching Localhost Image 3) -->
<a
    href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('Hi Jijau Computers, I am browsing your online store and would like to chat with an expert.'); ?>"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-20 md:bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl transition-all hover:scale-110 flex items-center gap-2 font-black text-xs group"
    aria-label="Chat on WhatsApp"
>
    <i data-lucide="message-square" class="w-5 h-5 fill-current"></i>
    <span>WhatsApp Us</span>
</a>

<!-- MOBILE BOTTOM NAVIGATION (1-Thumb navigation) -->
<div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around safe-area-pb">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-blue-600">
        <i data-lucide="home" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5 font-medium">Home</span>
    </a>
    <a href="<?php echo esc_url(home_url('/devices')); ?>" class="flex flex-col items-center justify-center py-1 px-2.5 text-blue-600 font-bold">
        <i data-lucide="grid" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5">Devices</span>
    </a>
    <a href="<?php echo esc_url(home_url('/custom-pc')); ?>" class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-blue-600">
        <i data-lucide="cpu" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5 font-medium">Build PC</span>
    </a>
    <a href="<?php echo esc_url(home_url('/track-service')); ?>" class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-blue-600">
        <i data-lucide="wrench" class="w-5 h-5"></i>
        <span class="text-[10px] mt-0.5 font-medium">Repairs</span>
    </a>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
</script>

<?php wp_footer(); ?>
</body>
</html>
