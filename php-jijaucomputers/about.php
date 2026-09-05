<?php
require_once __DIR__ . '/includes/functions.php';

$pageTitle = 'About Us - ' . ($storeSettings['storeName'] ?? 'Jijau Computers') . ' | Pune Tech Hardware Experts';
require_once __DIR__ . '/includes/header.php';
?>

<div class="about-page" style="padding: 40px 0 60px; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 0 16px;">
    
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 16px; padding: 48px 36px; color: white; text-align: center; margin-bottom: 40px;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(59,130,246,0.2); border-radius: 20px; font-size: 12px; font-weight: 700; color: #60a5fa; margin-bottom: 12px;">PUNE'S TRUSTED TECH DESTINATION</span>
      <h1 style="font-size: 36px; font-weight: 800; margin: 0 0 16px;"><?= htmlspecialchars($storeSettings['storeName'] ?? 'Jijau Computers') ?></h1>
      <p style="color: #94a3b8; font-size: 16px; max-width: 750px; margin: 0 auto; line-height: 1.6;">
        Providing high-performance gaming rigs, enterprise workstations, Apple MacBooks, OEM computer accessories, and certified repair services across Pune & Maharashtra.
      </p>
    </div>

    <!-- Core Pillars Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 48px;">
      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">🛡️</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">100% Genuine Tech</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Direct authorized sourcing from Intel, AMD, ASUS, NVIDIA, Gigabyte, Dell, HP & Lenovo with official brand warranties.</p>
      </div>

      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">📄</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">1-Page GST Invoicing</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Instant compliant tax invoices for businesses and individual buyers with HSN codes, serial number tracking, and seamless claim.</p>
      </div>

      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">🛠️</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Certified Chip-Level Lab</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Expert motherboard micro-soldering, GPU re-balling, data recovery, and ultra-fast turnaround times for all devices.</p>
      </div>

      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">⚡</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Live WhatsApp Updates</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Direct notifications on every stage of your order and service request ticket straight to your WhatsApp.</p>
      </div>
    </div>

    <!-- Tech Sprout Company Mention -->
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <img src="/public/images/tech-sprout-logo.png" alt="Tech Sprout" style="width: 70px; height: 70px; object-fit: contain; border-radius: 12px; border: 1px solid #e2e8f0; padding: 6px; background: white;">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Technology & Digital Infrastructure</div>
          <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 4px 0;">Built with ❤️ by Tech Sprout</h3>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Empowering Jijau Computers with state-of-the-art native digital commerce, live tracker engine, and automated invoicing.</p>
        </div>
      </div>
      <a href="/contact" style="padding: 12px 24px; background: #0f172a; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">Contact Us</a>
    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
