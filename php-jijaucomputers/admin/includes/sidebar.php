<?php
$currentUri = $_SERVER['REQUEST_URI'];
?>
<aside class="admin-sidebar">
  <div style="padding: 24px 20px; border-bottom: 1px solid #1e293b;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 36px; height: 36px; background: #2563eb; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px;">
        JC
      </div>
      <div>
        <div style="font-weight: 800; font-size: 15px; color: #ffffff;">Jijau Admin</div>
        <div style="font-size: 11px; color: #64748b;">Hardware ERP & Billing</div>
      </div>
    </div>
  </div>

  <nav style="padding: 16px 0; flex: 1; overflow-y: auto;">
    <div style="padding: 0 20px 8px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Core Modules</div>
    
    <a href="/admin/index.php" class="nav-item <?= str_contains($currentUri, 'index.php') ? 'active' : '' ?>">
      <span>📊</span> Dashboard
    </a>

    <a href="/admin/orders.php" class="nav-item <?= str_contains($currentUri, 'orders.php') ? 'active' : '' ?>">
      <span>📦</span> Orders
      <?php if (!empty($pendingOrdersCount)): ?>
        <span class="badge-count"><?= $pendingOrdersCount ?></span>
      <?php endif; ?>
    </a>

    <a href="/admin/service-requests.php" class="nav-item <?= str_contains($currentUri, 'service-requests.php') ? 'active' : '' ?>">
      <span>🛠️</span> Service Tickets
      <?php if (!empty($activeServiceCount)): ?>
        <span class="badge-count"><?= $activeServiceCount ?></span>
      <?php endif; ?>
    </a>

    <a href="/admin/products.php" class="nav-item <?= str_contains($currentUri, 'products.php') ? 'active' : '' ?>">
      <span>💻</span> Products Catalog
    </a>

    <a href="/admin/happy-customers.php" class="nav-item <?= str_contains($currentUri, 'happy-customers.php') ? 'active' : '' ?>">
      <span>🤝</span> Happy Customers
    </a>

    <a href="/admin/categories.php" class="nav-item <?= str_contains($currentUri, 'categories.php') ? 'active' : '' ?>">
      <span>🏷️</span> Categories & Brands
    </a>

    <div style="padding: 16px 20px 8px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Leads & Inquiries</div>

    <a href="/admin/custom-pc.php" class="nav-item <?= str_contains($currentUri, 'custom-pc.php') ? 'active' : '' ?>">
      <span>⚡</span> Custom PC Builds
    </a>

    <a href="/admin/quotations.php" class="nav-item <?= str_contains($currentUri, 'quotations.php') ? 'active' : '' ?>">
      <span>📋</span> B2B Quotations
      <?php if (!empty($pendingQuotesCount)): ?>
        <span class="badge-count"><?= $pendingQuotesCount ?></span>
      <?php endif; ?>
    </a>

    <a href="/admin/enquiries.php" class="nav-item <?= str_contains($currentUri, 'enquiries.php') ? 'active' : '' ?>">
      <span>💬</span> Enquiries & Messages
    </a>

    <a href="/admin/reviews.php" class="nav-item <?= str_contains($currentUri, 'reviews.php') ? 'active' : '' ?>">
      <span>⭐</span> Customer Reviews
      <?php if (!empty($pendingReviewsCount)): ?>
        <span class="badge-count"><?= $pendingReviewsCount ?></span>
      <?php endif; ?>
    </a>

    <div style="padding: 16px 20px 8px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">System & Marketing</div>

    <a href="/admin/visitors.php" class="nav-item <?= str_contains($currentUri, 'visitors.php') ? 'active' : '' ?>">
      <span>👁️</span> Real-time Visitors
    </a>

    <a href="/admin/offers.php" class="nav-item <?= str_contains($currentUri, 'offers.php') ? 'active' : '' ?>">
      <span>🎁</span> Offers & Banners
    </a>

    <a href="/admin/settings.php" class="nav-item <?= str_contains($currentUri, 'settings.php') ? 'active' : '' ?>">
      <span>⚙️</span> Store & GST Settings
    </a>
  </nav>

  <!-- Tech Sprout Company Branding Credit in Admin -->
  <div style="padding: 16px 20px; border-top: 1px solid #1e293b; background: #0b0f19;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
      <img src="/public/images/tech-sprout-logo.png" alt="Tech Sprout" style="width: 28px; height: 28px; object-fit: contain; border-radius: 6px; background: white; padding: 2px;">
      <div>
        <div style="font-size: 11px; font-weight: 700; color: #38bdf8;">Tech Sprout Engine</div>
        <div style="font-size: 10px; color: #64748b;">Enterprise Build 2026</div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <a href="/" target="_blank" style="font-size: 12px; color: #94a3b8; text-decoration: none;">View Store ↗</a>
      <a href="/admin/logout.php" style="font-size: 12px; color: #ef4444; text-decoration: none; font-weight: 700;">Logout</a>
    </div>
  </div>
</aside>

<div class="admin-main">
  <header class="admin-topbar">
    <div style="font-size: 16px; font-weight: 700; color: #0f172a;">
      <?= htmlspecialchars($pageTitle ?? 'Admin Control Center') ?>
    </div>
    <div style="display: flex; align-items: center; gap: 16px;">
      <a href="/" target="_blank" style="font-size: 13px; font-weight: 600; color: #2563eb; text-decoration: none; display: flex; align-items: center; gap: 6px;">
        <span>🌐 Open Storefront</span>
      </a>
      <div style="font-size: 13px; font-weight: 700; color: #334155; padding: 6px 12px; background: #f1f5f9; border-radius: 20px;">
        👤 <?= htmlspecialchars($adminUser['name'] ?? 'Store Admin') ?>
      </div>
    </div>
  </header>
  <main class="admin-content">
