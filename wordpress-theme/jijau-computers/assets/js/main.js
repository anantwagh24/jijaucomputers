/**
 * Jijau Computers - Complete Interactive Front-End Engine
 * Live WordPress Data Synchronization, Featured Products Grid, 4-Stack Hub & E2E Cart Checkout with Instant UPI
 *
 * @package Jijau_Computers
 */

document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const liveDb = (typeof jijauSettings !== 'undefined' && jijauSettings.liveDb) || {};
    const whatsappNumber = (typeof jijauSettings !== 'undefined' && jijauSettings.whatsapp) || '918805607908';
    const storeUpiId = (typeof jijauSettings !== 'undefined' && jijauSettings.upiId) || '8805607908@ybl';
    const storeUpiName = (typeof jijauSettings !== 'undefined' && jijauSettings.upiName) || 'Jijau Computers';
    const ajaxUrl = (typeof jijauSettings !== 'undefined' && jijauSettings.ajaxUrl) || '/wp-admin/admin-ajax.php';

    const allProducts = liveDb.products || [];
    const allCategories = liveDb.categories || [];
    const allBrands = liveDb.brands || [];

    function formatPrice(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function getWhatsAppUrl(text) {
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    }

    // =========================================================================
    // 1. CART & E2E CHECKOUT STATE (Stored in localStorage)
    // =========================================================================
    let cart = JSON.parse(localStorage.getItem('jijau_cart') || '[]');
    let appliedCoupon = null;

    function saveCart() {
        localStorage.setItem('jijau_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartDrawer();
    }

    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

        const cartBadges = document.querySelectorAll('.header-cart-badge, #header-cart-btn span');
        cartBadges.forEach(el => {
            if (el) {
                el.innerText = totalItems > 0 ? `CART ${formatPrice(totalPrice)} (${totalItems})` : 'CART ₹0';
            }
        });
    }

    window.addToCart = function (productId) {
        const p = allProducts.find(x => x.id === productId || String(x.id) === String(productId));
        if (!p) return;

        const existing = cart.find(x => x.id === p.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: p.id,
                name: p.name,
                category: p.category,
                brand: p.brand,
                price: p.price,
                salePrice: p.salePrice,
                image: p.image,
                quantity: 1,
            });
        }

        saveCart();
        showToast(`✓ Added "${p.name}" to cart!`);
        openCartDrawer();
    };

    function showToast(msg) {
        let toast = document.getElementById('jijau-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'jijau-toast';
            toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white border border-blue-500 shadow-2xl font-bold text-xs flex items-center gap-2 transition-all duration-300 pointer-events-none opacity-0';
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.classList.remove('opacity-0');
        setTimeout(() => toast.classList.add('opacity-0'), 3000);
    }

    // =========================================================================
    // 2. SLIDE-OVER CART & INSTANT UPI CHECKOUT DRAWER
    // =========================================================================
    function injectCartDrawer() {
        if (document.getElementById('jijau-cart-drawer')) return;

        const drawerHtml = `
            <div id="jijau-cart-overlay" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"></div>
            <div id="jijau-cart-drawer" class="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0d1424] text-white shadow-2xl border-l border-slate-800 flex flex-col justify-between translate-x-full transition-transform duration-300 font-sans">
                <!-- Drawer Header -->
                <div class="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-base text-white m-0">Your Shopping Cart</h3>
                            <span id="cart-drawer-count" class="text-[11px] text-slate-400">0 items selected</span>
                        </div>
                    </div>
                    <button type="button" id="close-cart-btn" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xl leading-none">&times;</button>
                </div>

                <!-- Drawer Content -->
                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <div id="cart-items-container" class="space-y-3">
                        <!-- Items rendered dynamically -->
                    </div>

                    <!-- Coupon Code Section -->
                    <div id="cart-coupon-section" class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-300">Have a Promo Coupon?</span>
                            <span class="text-[10px] text-amber-400 font-mono">e.g. JIJAU10, GAMING5K</span>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" id="cart-coupon-input" placeholder="Enter coupon code..." class="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs uppercase text-white outline-none font-mono focus:border-blue-500" />
                            <button type="button" id="apply-coupon-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors">Apply</button>
                        </div>
                        <div id="coupon-applied-msg" class="hidden text-[11px] text-emerald-400 font-bold"></div>
                    </div>

                    <!-- Checkout Shipping Form -->
                    <div id="cart-checkout-form" class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                        <h4 class="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-400"></i>
                            <span>Delivery & Customer Details</span>
                        </h4>
                        <div class="space-y-2 text-xs">
                            <input type="text" id="cust-name" required placeholder="Full Name *" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
                            <input type="tel" id="cust-phone" required placeholder="10-digit WhatsApp Mobile Number *" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 font-mono" />
                            <textarea id="cust-address" rows="2" placeholder="Delivery Address in Pune / Maharashtra *" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"></textarea>
                        </div>
                    </div>

                    <!-- Payment Method Selector -->
                    <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                        <span class="font-bold text-xs text-slate-300 block">Select Payment Option</span>
                        <label class="flex items-center gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 cursor-pointer">
                            <input type="radio" name="payment_opt" value="Instant UPI via WhatsApp (GPay / PhonePe / Paytm)" checked class="text-blue-600" />
                            <div>
                                <span class="text-xs font-bold text-white block">Instant UPI via WhatsApp</span>
                                <span class="text-[10px] text-slate-400">GPay, PhonePe, Paytm, BHIM to <strong>${storeUpiId}</strong></span>
                            </div>
                        </label>
                        <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                            <input type="radio" name="payment_opt" value="Cash on Store Pickup / Delivery" class="text-blue-600" />
                            <div>
                                <span class="text-xs font-bold text-white block">Pay on Store Pickup / Cash</span>
                                <span class="text-[10px] text-slate-400">Jafrabad / Pune Hardware Hub</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Drawer Footer -->
                <div class="p-6 border-t border-slate-800 bg-slate-950/90 space-y-3">
                    <div class="space-y-1 text-xs">
                        <div class="flex items-center justify-between text-slate-400">
                            <span>Subtotal</span>
                            <span id="cart-subtotal" class="text-white font-bold">₹0</span>
                        </div>
                        <div id="cart-discount-row" class="hidden flex items-center justify-between text-emerald-400">
                            <span>Coupon Discount</span>
                            <span id="cart-discount-amt">-₹0</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-400">
                            <span>GST (18% Included)</span>
                            <span class="text-slate-300">₹0 (Tax Paid Bill)</span>
                        </div>
                        <div class="flex items-center justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                            <span>Total Payable</span>
                            <span id="cart-final-total" class="text-emerald-400 text-base">₹0</span>
                        </div>
                    </div>

                    <button type="button" id="place-order-btn" class="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105">
                        <i data-lucide="zap" class="w-4 h-4 text-amber-300"></i>
                        <span>Pay via UPI & Confirm Order on WhatsApp</span>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHtml);

        document.getElementById('close-cart-btn')?.addEventListener('click', closeCartDrawer);
        document.getElementById('jijau-cart-overlay')?.addEventListener('click', closeCartDrawer);

        // Apply Coupon
        document.getElementById('apply-coupon-btn')?.addEventListener('click', function() {
            const code = (document.getElementById('cart-coupon-input').value || '').trim().toUpperCase();
            if (!code) return;

            if (code === 'JIJAU10') {
                appliedCoupon = { code: 'JIJAU10', percent: 10 };
            } else if (code === 'GAMING5K') {
                appliedCoupon = { code: 'GAMING5K', flat: 5000 };
            } else if (code === 'CCTVFREE') {
                appliedCoupon = { code: 'CCTVFREE', percent: 15 };
            } else {
                alert('Invalid coupon code.');
                return;
            }

            renderCartDrawer();
            const msg = document.getElementById('coupon-applied-msg');
            if (msg) {
                msg.innerText = `✓ Coupon "${code}" Applied Successfully!`;
                msg.classList.remove('hidden');
            }
        });

        // Checkout Button
        document.getElementById('place-order-btn')?.addEventListener('click', handlePlaceOrder);
    }

    function openCartDrawer() {
        injectCartDrawer();
        renderCartDrawer();
        document.getElementById('jijau-cart-overlay')?.classList.remove('hidden');
        document.getElementById('jijau-cart-drawer')?.classList.remove('translate-x-full');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeCartDrawer() {
        document.getElementById('jijau-cart-overlay')?.classList.add('hidden');
        document.getElementById('jijau-cart-drawer')?.classList.add('translate-x-full');
    }

    // Attach open handler to header cart buttons
    document.querySelectorAll('#header-cart-btn, a[href*="cart"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openCartDrawer();
        });
    });

    function renderCartDrawer() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        const countEl = document.getElementById('cart-drawer-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (countEl) countEl.innerText = `${totalItems} items selected`;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="py-12 text-center space-y-2">
                    <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto">
                        <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                    </div>
                    <h4 class="font-bold text-white text-sm">Your Cart is Empty</h4>
                    <p class="text-xs text-slate-500">Explore laptops, mobiles, printers & custom PCs to add items.</p>
                </div>
            `;
            document.getElementById('cart-subtotal').innerText = '₹0';
            document.getElementById('cart-final-total').innerText = '₹0';
            document.getElementById('cart-discount-row')?.classList.add('hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0" />
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-white text-xs truncate m-0">${item.name}</h4>
                    <span class="text-[11px] font-bold text-emerald-400">${formatPrice(item.salePrice)}</span>
                </div>
                <div class="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    <button type="button" onclick="changeQty('${item.id}', -1)" class="text-slate-400 hover:text-white px-1 font-bold">-</button>
                    <span class="text-xs font-bold text-white px-1">${item.quantity}</span>
                    <button type="button" onclick="changeQty('${item.id}', 1)" class="text-slate-400 hover:text-white px-1 font-bold">+</button>
                </div>
                <button type="button" onclick="removeFromCart('${item.id}')" class="text-slate-500 hover:text-rose-400 text-sm leading-none p-1">&times;</button>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.percent) discount = Math.round((subtotal * appliedCoupon.percent) / 100);
            if (appliedCoupon.flat) discount = appliedCoupon.flat;
        }
        const finalTotal = Math.max(0, subtotal - discount);

        document.getElementById('cart-subtotal').innerText = formatPrice(subtotal);
        if (discount > 0) {
            document.getElementById('cart-discount-row')?.classList.remove('hidden');
            document.getElementById('cart-discount-amt').innerText = `-${formatPrice(discount)}`;
        } else {
            document.getElementById('cart-discount-row')?.classList.add('hidden');
        }
        document.getElementById('cart-final-total').innerText = formatPrice(finalTotal);

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    window.changeQty = function (id, delta) {
        const item = cart.find(x => x.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(x => x.id !== id);
            }
            saveCart();
        }
    };

    window.removeFromCart = function (id) {
        cart = cart.filter(x => x.id !== id);
        saveCart();
    };

    function handlePlaceOrder() {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        const name = (document.getElementById('cust-name')?.value || '').trim();
        const phone = (document.getElementById('cust-phone')?.value || '').trim();
        const address = (document.getElementById('cust-address')?.value || '').trim();
        const paymentOpt = document.querySelector('input[name="payment_opt"]:checked')?.value || 'Instant UPI via WhatsApp';

        if (!name || !phone || !address) {
            alert('Please enter your Name, Phone Number, and Delivery Address.');
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.percent) discount = Math.round((subtotal * appliedCoupon.percent) / 100);
            if (appliedCoupon.flat) discount = appliedCoupon.flat;
        }
        const finalTotal = Math.max(0, subtotal - discount);
        const orderId = 'JC-ORD-' + Math.floor(1000 + Math.random() * 9000);

        const itemsSummary = cart.map((item, idx) => `${idx + 1}. ${item.name} (Qty: ${item.quantity}) - ${formatPrice(item.salePrice * item.quantity)}`).join('\n');

        // Formatted WhatsApp Receipt Message
        const waMsg = `*🛍️ NEW ORDER AT JIJAU COMPUTERS*\n----------------------------------\n*Order ID:* #${orderId}\n*Customer:* ${name}\n*Phone:* ${phone}\n*Delivery Address:* ${address}\n\n*Items Ordered:*\n${itemsSummary}\n\n*Subtotal:* ${formatPrice(subtotal)}\n${discount > 0 ? `*Coupon Discount (${appliedCoupon.code}):* -${formatPrice(discount)}\n` : ''}*Total Amount Payable:* ${formatPrice(finalTotal)}\n*GST Bill:* Included (27FQIPK5154C1ZU)\n*Payment Method:* ${paymentOpt}\n*Store UPI ID:* ${storeUpiId}\n----------------------------------\nHi Jijau Computers team, please confirm my order dispatch and send payment receipt.`;

        // Save order to WordPress DB via AJAX
        const orderPayload = {
            id: 'ord-' + Date.now(),
            orderNumber: orderId,
            customerName: name,
            phone: phone,
            address: address,
            items: cart.map(i => `${i.name} (x${i.quantity})`).join(', '),
            total: finalTotal,
            paymentMethod: paymentOpt,
            status: 'Processing'
        };

        const fd = new FormData();
        fd.append('action', 'jijau_place_order');
        fd.append('order', JSON.stringify(orderPayload));

        fetch(ajaxUrl, { method: 'POST', body: fd }).catch(e => console.log('Order logged locally'));

        // Clear cart
        cart = [];
        saveCart();
        closeCartDrawer();

        // UPI Intent on Mobile (GPay / PhonePe / Paytm deep link)
        const upiDeepLink = `upi://pay?pa=${storeUpiId}&pn=${encodeURIComponent(storeUpiName)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(orderId)}`;

        // Open WhatsApp Confirmation
        const waUrl = getWhatsAppUrl(waMsg);
        window.open(waUrl, '_blank');

        // Attempt mobile UPI app launch
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setTimeout(() => {
                window.location.href = upiDeepLink;
            }, 1000);
        }
    }

    // =========================================================================
    // 3. RENDER FEATURED PRODUCTS ON HOMEPAGE (Matching Localhost Image 2)
    // =========================================================================
    const homeFeaturedContainer = document.getElementById('home-featured-products-grid');
    if (homeFeaturedContainer) {
        const featuredProducts = allProducts.length > 0 ? allProducts : [
            {
                id: 'p-1',
                name: 'ASUS ROG Strix G16 (2024) Gaming Laptop',
                brand: 'ASUS',
                category: 'Laptop',
                price: 139990,
                salePrice: 124990,
                discount: '11% OFF',
                specs: '16-inch QHD+ 240Hz display, Intel Core i7-13650HX, 16GB DDR5, 1TB NVMe SSD, RTX 4060 8GB GDDR6.',
                image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-2',
                name: 'Lenovo Legion Pro 5i Gen 9 Gaming Laptop',
                brand: 'Lenovo',
                category: 'Laptop',
                price: 178000,
                salePrice: 159990,
                discount: '10% OFF',
                specs: 'Intel Core i9-14900HX, 32GB DDR5 RAM, 1TB Gen4 SSD, NVIDIA RTX 4070 8GB, 16-inch WQXGA 240Hz 500 nits HDR.',
                image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-3',
                name: 'Jijau Apex Titan Custom Gaming PC Build',
                brand: 'Corsair',
                category: 'Custom Gaming PCs',
                price: 245000,
                salePrice: 229990,
                discount: '6% OFF',
                specs: 'Intel Core i7-14700K, RTX 4080 Super 16GB, 32GB DDR5 6000MHz RGB, 2TB Gen4 SSD, 360mm Liquid Cooler.',
                image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-4',
                name: 'Jijau Creator Pro Workstation PC',
                brand: 'AMD',
                category: 'Custom Gaming PCs',
                price: 189000,
                salePrice: 174990,
                discount: '7% OFF',
                specs: 'AMD Ryzen 9 7900X, RTX 4070 Ti Super 16GB, 64GB DDR5 RAM, 2TB SSD, High-End Workstation Case.',
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-5',
                name: 'Dell G15 5530 Gaming Laptop (Intel i7-13650HX, RTX 4060)',
                brand: 'Dell',
                category: 'Laptop',
                price: 125000,
                salePrice: 109990,
                discount: '12% OFF',
                specs: '15.6-inch FHD 165Hz sRGB 100%, 13th Gen Intel Core i7-13650HX, 16GB DDR5, 1TB SSD, RTX 4060 8GB.',
                image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-6',
                name: 'Apple iPhone 15 Pro 128GB (Natural Titanium)',
                brand: 'Apple',
                category: 'Mobile',
                price: 134900,
                salePrice: 124990,
                discount: '7% OFF',
                specs: 'A17 Pro chip, Aerospace-grade titanium, 48MP Pro camera system, Action button, USB-C with USB 3 speeds.',
                image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-7',
                name: 'HP Smart Tank 580 All-in-One WiFi Color Printer',
                brand: 'HP',
                category: 'Printer',
                price: 15999,
                salePrice: 13490,
                discount: '16% OFF',
                specs: 'Print, Scan, Copy with High-capacity ink tank. Up to 12,000 black or 6,000 color pages in the box.',
                image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
            {
                id: 'p-8',
                name: 'CP PLUS 4MP Guard+ Smart Wi-Fi PT CCTV Camera',
                brand: 'CP PLUS',
                category: 'CCTV Camera',
                price: 3800,
                salePrice: 2499,
                discount: '34% OFF',
                specs: '4MP 2K Resolution, 360° Pan & Tilt, Motion Tracking, Two-Way Audio, Full Color Night Vision.',
                image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
                isFeatured: true
            },
        ];

        homeFeaturedContainer.innerHTML = featuredProducts.slice(0, 8).map(p => {
            const waMsg = `Hi Jijau Computers, I am interested in *${p.name}* (Price: ${formatPrice(p.salePrice)}). Is this available in stock?`;
            const waLink = getWhatsAppUrl(waMsg);

            return `
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
                    <!-- Badges -->
                    <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        <span class="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow uppercase">${p.discount || 'DEAL'}</span>
                        <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px] uppercase">FEATURED</span>
                    </div>

                    <!-- Wishlist -->
                    <button type="button" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors">
                        <i data-lucide="heart" class="w-4 h-4"></i>
                    </button>

                    <!-- Image -->
                    <div class="h-48 overflow-hidden bg-slate-50 relative p-4 flex items-center justify-center">
                        <img src="${p.image}" alt="${p.name}" class="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    <!-- Content -->
                    <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div class="space-y-1">
                            <span class="text-[11px] font-bold text-slate-500 uppercase">${p.brand || 'Jijau'} • ${p.category || 'Hardware'}</span>
                            <h3 class="font-black text-slate-900 text-sm leading-snug line-clamp-2 m-0">${p.name}</h3>
                            <p class="text-slate-500 text-xs line-clamp-2 leading-relaxed m-0">${p.specs || ''}</p>
                        </div>

                        <!-- Price & Actions -->
                        <div class="pt-3 border-t border-slate-100 space-y-3">
                            <div class="flex items-baseline gap-2">
                                <span class="text-base font-black text-slate-900">${formatPrice(p.salePrice)}</span>
                                <span class="text-xs text-slate-400 line-through">${formatPrice(p.price)}</span>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" onclick="addToCart('${p.id}')" class="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer">
                                    <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                                    <span>Add</span>
                                </button>
                                <a href="${waLink}" target="_blank" class="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors">
                                    <i data-lucide="message-square" class="w-3.5 h-3.5 text-emerald-600"></i>
                                    <span>Buy on WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // =========================================================================
    // 4. 4-STACK EXPLORER (/devices) WITH DYNAMIC BRANDS & LIVE SEARCH
    // =========================================================================
    const devicesGrid = document.getElementById('devices-products-grid');
    if (devicesGrid) {
        let activeStack = 'laptop';
        let activeBrand = 'all';

        const stackCategories = {
            laptop: { name: 'Laptop', title: 'Laptops', brands: ['Apple', 'ASUS', 'Dell', 'HP', 'Lenovo'] },
            mobile: { name: 'Mobile', title: 'Mobiles', brands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi'] },
            printer: { name: 'Printer', title: 'Printers', brands: ['HP', 'Epson', 'Canon', 'Brother'] },
            cctv: { name: 'CCTV Camera', title: 'CCTV Cameras', brands: ['CP PLUS', 'Hikvision', 'TP-Link'] },
        };

        function renderDevicesView() {
            const stackInfo = stackCategories[activeStack] || stackCategories.laptop;
            const searchInput = (document.getElementById('devices-search-input')?.value || document.getElementById('brand-product-search')?.value || '').toLowerCase();

            // Filter products
            let filtered = allProducts.filter(p => {
                const matchCategory = p.category && p.category.toLowerCase().includes(stackInfo.name.toLowerCase());
                const matchBrand = activeBrand === 'all' || (p.brand && p.brand.toLowerCase() === activeBrand.toLowerCase());
                const matchSearch = p.name.toLowerCase().includes(searchInput) || (p.specs || '').toLowerCase().includes(searchInput);
                return matchCategory && matchBrand && matchSearch;
            });

            // Update header count
            const countHeader = document.getElementById('devices-result-heading') || document.getElementById('results-count-label');
            if (countHeader) {
                countHeader.innerText = `All ${stackInfo.title} (${filtered.length} products found)`;
            }

            const titleHeader = document.getElementById('active-category-title');
            if (titleHeader) {
                titleHeader.innerText = `${stackInfo.title} Brands:`;
            }

            // Render Brand filter pills
            const brandPillsContainer = document.getElementById('devices-brand-pills') || document.getElementById('brand-pills-container');
            if (brandPillsContainer) {
                const totalInStack = allProducts.filter(p => p.category && p.category.toLowerCase().includes(stackInfo.name.toLowerCase())).length;

                let pillsHtml = `
                    <button type="button" onclick="selectDeviceBrand('all')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeBrand === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        All ${stackInfo.title} Brands (${totalInStack})
                    </button>
                `;

                stackInfo.brands.forEach(b => {
                    const count = allProducts.filter(p => p.category && p.category.toLowerCase().includes(stackInfo.name.toLowerCase()) && p.brand && p.brand.toLowerCase() === b.toLowerCase()).length;
                    const isActive = activeBrand.toLowerCase() === b.toLowerCase();
                    pillsHtml += `
                        <button type="button" onclick="selectDeviceBrand('${b}')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                            <span>${b}</span>
                            <span class="px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'} text-[10px]">${count}</span>
                        </button>
                    `;
                });

                brandPillsContainer.innerHTML = pillsHtml;
            }

            // Render Products Grid
            if (filtered.length === 0) {
                devicesGrid.innerHTML = `
                    <div class="col-span-full py-16 text-center space-y-2">
                        <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                            <i data-lucide="package-search" class="w-6 h-6"></i>
                        </div>
                        <h3 class="font-black text-slate-900 text-base">No models found for this brand filter</h3>
                        <p class="text-xs text-slate-500">Try selecting "All Brands" or searching for a different keyword.</p>
                    </div>
                `;
            } else {
                devicesGrid.innerHTML = filtered.map(p => {
                    const waMsg = `Hi Jijau Computers, I am interested in *${p.name}* (Price: ${formatPrice(p.salePrice)}). Is this available at your store?`;
                    const waLink = getWhatsAppUrl(waMsg);

                    return `
                        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
                            <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
                                <span class="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow uppercase">${p.discount || 'DEAL'}</span>
                            </div>

                            <button type="button" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors">
                                <i data-lucide="heart" class="w-4 h-4"></i>
                            </button>

                            <div class="h-48 overflow-hidden bg-slate-50 relative p-4 flex items-center justify-center">
                                <img src="${p.image}" alt="${p.name}" class="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                            </div>

                            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div class="space-y-1">
                                    <span class="text-[11px] font-bold text-slate-500 uppercase">${p.brand || 'Hardware'} • ${p.category || 'Device'}</span>
                                    <h3 class="font-black text-slate-900 text-sm leading-snug line-clamp-2 m-0">${p.name}</h3>
                                    <p class="text-slate-500 text-xs line-clamp-2 leading-relaxed m-0">${p.specs || ''}</p>
                                </div>

                                <div class="pt-3 border-t border-slate-100 space-y-3">
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-base font-black text-slate-900">${formatPrice(p.salePrice)}</span>
                                        <span class="text-xs text-slate-400 line-through">${formatPrice(p.price)}</span>
                                    </div>

                                    <div class="grid grid-cols-2 gap-2">
                                        <button type="button" onclick="addToCart('${p.id}')" class="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer">
                                            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                                            <span>Add</span>
                                        </button>
                                        <a href="${waLink}" target="_blank" class="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors">
                                            <i data-lucide="message-square" class="w-3.5 h-3.5 text-emerald-600"></i>
                                            <span>Buy on WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        window.selectDeviceStack = function (stackSlug) {
            activeStack = stackSlug;
            activeBrand = 'all';

            document.querySelectorAll('.device-stack-card').forEach(card => {
                if (card.getAttribute('data-stack') === stackSlug) {
                    card.className = 'device-stack-card p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl scale-[1.02] border-2 border-blue-400 transition-all cursor-pointer relative overflow-hidden group';
                } else {
                    card.className = 'device-stack-card p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group';
                }
            });

            renderDevicesView();
        };

        window.selectDeviceBrand = function (brandName) {
            activeBrand = brandName;
            renderDevicesView();
        };

        document.getElementById('devices-search-input')?.addEventListener('input', renderDevicesView);

        // Check URL param ?cat=mobile or ?cat=printer
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        if (catParam && stackCategories[catParam]) {
            selectDeviceStack(catParam);
        } else {
            renderDevicesView();
        }
    }

    // Initialize cart badge on page load
    updateCartBadge();
    injectCartDrawer();
});
