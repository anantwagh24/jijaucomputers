<?php
require_once __DIR__ . '/functions.php';
$storeSettings = getStoreSettings();
$cart = getCart();
$cartCount = $cart['count'];
$cartTotal = $cart['total'];

// Categories for dropdown
$headerCategories = [];
try {
    $db = getDB();
    $headerCategories = $db->query('SELECT * FROM "Category" ORDER BY name ASC')->fetchAll();
} catch (Exception $e) {}

$phoneClean = preg_replace('/[^0-9]/', '', $storeSettings['phone'] ?? '918805607908');
if (strlen($phoneClean) === 10) $phoneClean = '91' . $phoneClean;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title><?= htmlspecialchars($pageTitle ?? ($storeSettings['metaTitle'] ?? 'Jijau Computers - Computer & Laptop Store')) ?></title>
  <meta name="description" content="<?= htmlspecialchars($storeSettings['metaDescription'] ?? 'Best Computer Store for Custom Gaming PCs, Laptops, MacBooks, and Repair Services.') ?>">
  <link rel="icon" href="/public/favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/style.css">
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased">

<!-- Header Sticky Wrap -->
<header class="sticky top-0 z-50 w-full shadow-md">
  
  <!-- 1. Top Announcement & Timing Bar (HIDDEN ON MOBILE/TABLET per user request) -->
  <div class="desktop-only" style="background: #0f172a; color: #cbd5e1; font-size: 12px; padding: 6px 16px; border-bottom: 1px solid #1e293b;">
    <div style="max-width: 1320px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      
      <!-- Left: Dealer & Timings -->
      <div style="display: flex; align-items: center; gap: 14px; font-weight: 500;">
        <span style="color: #fbbf24; font-weight: 700; display: flex; align-items: center; gap: 4px;">
          <span>✨</span> Authorized Computer & Hardware Dealer
        </span>
        <span style="color: #475569;">|</span>
        <span style="display: flex; align-items: center; gap: 4px; color: #94a3b8;">
          <span>🕒</span> <?= htmlspecialchars($storeSettings['openingHours'] ?? 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM') ?>
        </span>
      </div>

      <!-- Right: Links & Phone -->
      <div style="display: flex; align-items: center; gap: 14px; font-weight: 600;">
        <a href="/track-service" style="color: #34d399; text-decoration: none; display: flex; align-items: center; gap: 4px;">
          <span>🔧</span> Track Repair / Service
        </a>
        <span style="color: #475569;">|</span>
        <a href="/quote-request" style="color: #cbd5e1; text-decoration: none;">
          Request Quote
        </a>
        <span style="color: #475569;">|</span>
        <a href="tel:<?= htmlspecialchars($storeSettings['phone'] ?? '+91 88056 07908') ?>" style="color: #60a5fa; text-decoration: none; display: flex; align-items: center; gap: 4px; font-weight: 700;">
          <span>📞</span> <?= htmlspecialchars($storeSettings['phone'] ?? '+91 88056 07908') ?>
        </a>
      </div>

    </div>
  </div>

  <!-- 2. Main Navbar -->
  <div style="background: #ffffff; padding: 10px 16px; border-bottom: 1px solid #e2e8f0;">
    <div style="max-width: 1320px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
      
      <!-- Mobile Hamburger Button & Logo -->
      <div style="display: flex; align-items: center; gap: 10px;">
        <button onclick="toggleMobileDrawer()" class="mobile-only" style="background: none; border: none; font-size: 24px; color: #0f172a; cursor: pointer; padding: 0 4px;" aria-label="Toggle menu">
          ☰
        </button>

        <!-- Brand Logo -->
        <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
          <img src="/public/images/jijau-logo.jpg" alt="Jijau Computers" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #f59e0b;">
          <div>
            <div style="font-size: 18px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; line-height: 1.1;">Jijau Computers</div>
            <div class="desktop-only" style="font-size: 9px; font-weight: 800; color: #2563eb; letter-spacing: 0.5px; text-transform: uppercase;">SALES • CUSTOM PCS • REPAIRS</div>
          </div>
        </a>
      </div>

      <!-- Desktop Search Bar with Category Dropdown -->
      <form action="/products" method="GET" class="desktop-only" style="flex: 1; max-width: 580px; display: flex; align-items: center; background: #ffffff; border: 2px solid #2563eb; border-radius: 30px; padding: 2px; box-shadow: 0 2px 8px rgba(37,99,235,0.1);">
        <select name="category" style="background: #f8fafc; border: none; border-right: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600; padding: 8px 12px; border-radius: 20px 0 0 20px; outline: none; cursor: pointer;">
          <option value="">All Categories</option>
          <?php foreach ($headerCategories as $c): ?>
            <option value="<?= htmlspecialchars($c['slug']) ?>" <?= (isset($_GET['category']) && $_GET['category'] === $c['slug']) ? 'selected' : '' ?>><?= htmlspecialchars($c['name']) ?></option>
          <?php endforeach; ?>
        </select>
        <input type="text" name="search" placeholder="Search laptops, RTX 4070, Intel i7, monitors, RAM..." value="<?= htmlspecialchars($_GET['search'] ?? '') ?>" style="flex: 1; border: none; padding: 8px 14px; font-size: 13px; color: #0f172a; outline: none; background: transparent;">
        <button type="submit" style="background: #2563eb; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; margin-right: 2px;">
          <span>🔍</span> Search
        </button>
      </form>

      <!-- Right Action Items (Desktop & Mobile) -->
      <div style="display: flex; align-items: center; gap: 8px;">
        
        <!-- PC Builder Button (Desktop Only) -->
        <a href="/custom-pc" class="desktop-only" style="background: #f59e0b; color: #000000; padding: 8px 14px; border-radius: 20px; font-weight: 800; font-size: 12px; text-decoration: none; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(245,158,11,0.3);">
          <span>⚙️ PC Builder</span>
          <span style="background: #000; color: #fff; font-size: 9px; padding: 2px 5px; border-radius: 4px;">RIG</span>
        </a>

        <!-- Cart Button -->
        <a href="/cart" style="background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e3a8a; padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 13px; text-decoration: none; display: flex; align-items: center; gap: 6px;">
          <span style="background: #2563eb; color: white; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px;" id="header-cart-count"><?= $cartCount ?></span>
          <span class="desktop-only" style="font-size: 11px; color: #64748b;">CART</span>
          <span class="desktop-only" style="color: #2563eb;" id="header-cart-total"><?= formatPrice($cartTotal) ?></span>
        </a>

        <!-- Account Pill -->
        <a href="/account" style="background: #7c3aed; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; text-decoration: none;">
          A
        </a>

      </div>

    </div>

    <!-- Mobile Full-Width Search Bar (Image 4 match) -->
    <div class="mobile-only" style="margin-top: 8px;">
      <form action="/products" method="GET" style="display: flex; align-items: center; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #ffffff; overflow: hidden;">
        <input type="text" name="search" placeholder="Search computers, laptops, parts..." value="<?= htmlspecialchars($_GET['search'] ?? '') ?>" style="flex: 1; border: none; padding: 9px 12px; font-size: 13px; outline: none;">
        <button type="submit" style="background: #2563eb; color: white; border: none; padding: 9px 16px; font-size: 14px; cursor: pointer;">
          🔍
        </button>
      </form>
    </div>
  </div>

  <!-- 3. Category & Navigation Sub-Bar (Desktop Only) -->
  <div class="desktop-only" style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 8px 16px;">
    <div style="max-width: 1320px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 14px; overflow-x: auto;">
      
      <!-- Browse Categories Blue Dropdown Button -->
      <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
        <a href="/products" style="background: #2563eb; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 800; font-size: 12px; text-decoration: none; display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px;">
          <span>≡</span> BROWSE CATEGORIES ▾
        </a>

        <a href="/devices" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; padding: 7px 14px; border-radius: 20px; font-weight: 700; font-size: 12px; text-decoration: none; white-space: nowrap; display: flex; align-items: center; gap: 6px;">
          <span>📱</span> Devices Hub (Laptop, Mobile, Printer, CCTV)
        </a>
      </div>

      <!-- Quick Category Nav Links -->
      <nav style="display: flex; align-items: center; gap: 16px; font-size: 13px; font-weight: 700; white-space: nowrap;">
        <a href="/products" style="color: #334155; text-decoration: none;">All Products</a>
        <a href="/products?category=laptops" style="color: #334155; text-decoration: none;">Laptops</a>
        <a href="/custom-pc" style="color: #2563eb; text-decoration: none; display: flex; align-items: center; gap: 4px;">
          <span>⚡</span> Custom PC Builder
        </a>
        <a href="/products?category=graphics-cards" style="color: #334155; text-decoration: none;">Graphics Cards</a>
        <a href="/products?category=processors" style="color: #334155; text-decoration: none;">Processors</a>
        <a href="/offers" style="color: #ea580c; text-decoration: none; display: flex; align-items: center; gap: 4px;">
          <span>🔥</span> Special Offers
        </a>
        <a href="/track-service" style="color: #059669; text-decoration: none; display: flex; align-items: center; gap: 4px;">
          <span>🛠️</span> Repair Tracker
        </a>
        <a href="/about" style="color: #64748b; text-decoration: none;">About Us</a>
        <a href="/contact" style="color: #64748b; text-decoration: none;">Contact</a>
      </nav>

      <!-- Buy on WhatsApp Button -->
      <a href="https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>?text=Hello%20Jijau%20Computers!%20I%20want%20to%20inquire%20about%20hardware%20and%20prices." target="_blank" style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 7px 14px; border-radius: 20px; font-weight: 700; font-size: 12px; text-decoration: none; display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
        <span>💬</span> Buy on WhatsApp
      </a>

    </div>
  </div>

</header>

<!-- Mobile Slide-out Drawer Menu -->
<div id="mobile-drawer" onclick="toggleMobileDrawer()">
  <div class="drawer-content" onclick="event.stopPropagation()">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 12px;">
      <div style="font-weight: 800; font-size: 16px; color: #ffffff;">Menu</div>
      <button onclick="toggleMobileDrawer()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px; font-weight: 600;">
      <a href="/" style="color: #f8fafc; text-decoration: none; padding: 8px 0;">🏠 Home</a>
      <a href="/products" style="color: #f8fafc; text-decoration: none; padding: 8px 0;">💻 All Hardware Products</a>
      <a href="/devices" style="color: #f8fafc; text-decoration: none; padding: 8px 0;">📱 Devices Hub (Laptops/CCTV)</a>
      <a href="/custom-pc" style="color: #38bdf8; text-decoration: none; padding: 8px 0;">⚡ Custom PC Builder</a>
      <a href="/products?category=laptops" style="color: #f8fafc; text-decoration: none; padding: 8px 0;">💻 Laptops & MacBooks</a>
      <a href="/products?category=graphics-cards" style="color: #f8fafc; text-decoration: none; padding: 8px 0;">🎮 Graphics Cards</a>
      <a href="/offers" style="color: #fb923c; text-decoration: none; padding: 8px 0;">🔥 Special Offers</a>
      <a href="/track-service" style="color: #34d399; text-decoration: none; padding: 8px 0;">🛠️ Track Repair / Order</a>
      <a href="/quote-request" style="color: #f8fafc; text-decoration: none; padding: 8px 0;">📋 Request B2B Quote</a>
      <a href="/about" style="color: #94a3b8; text-decoration: none; padding: 8px 0;">About Us</a>
      <a href="/contact" style="color: #94a3b8; text-decoration: none; padding: 8px 0;">Store Contact & Location</a>
    </div>
  </div>
</div>

<!-- Mobile Bottom Navigation Bar (Image 4 Match) -->
<nav class="mobile-bottom-nav mobile-only">
  <a href="/" class="mobile-bottom-item <?= ($_SERVER['REQUEST_URI'] === '/' || $_SERVER['REQUEST_URI'] === '/index.php') ? 'active' : '' ?>">
    <div class="mobile-bottom-icon">🏠</div>
    <span>Home</span>
  </a>

  <a href="/track-service" class="mobile-bottom-item <?= str_contains($_SERVER['REQUEST_URI'], 'track') ? 'active' : '' ?>">
    <div class="mobile-bottom-icon">📦</div>
    <span>Track Hub</span>
  </a>

  <a href="/cart" class="mobile-bottom-item <?= str_contains($_SERVER['REQUEST_URI'], 'cart') ? 'active' : '' ?>">
    <div class="mobile-bottom-icon">
      🛒
      <?php if ($cartCount > 0): ?>
        <span class="mobile-bottom-badge"><?= $cartCount ?></span>
      <?php endif; ?>
    </div>
    <span>Cart</span>
  </a>

  <a href="/account" class="mobile-bottom-item <?= str_contains($_SERVER['REQUEST_URI'], 'account') ? 'active' : '' ?>">
    <div class="mobile-bottom-icon">👤</div>
    <span>Account</span>
  </a>
</nav>

<script>
function toggleMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.toggle('open');
  }
}
</script>
