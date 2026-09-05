<?php
require_once __DIR__ . '/functions.php';
$storeSettings = getStoreSettings();
?>

<!-- Trust & Feature Badges Bar -->
<section style="background: #0b0f19; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; padding: 28px 16px; color: #f8fafc;">
  <div style="max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">
    
    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="width: 44px; height: 44px; background: rgba(59,130,246,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #60a5fa;">🛡️</div>
      <div>
        <div style="font-weight: 800; font-size: 14px; color: #ffffff;">100% Genuine Tech</div>
        <div style="font-size: 12px; color: #94a3b8;">Brand Warranty with Serial Tracking</div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="width: 44px; height: 44px; background: rgba(34,197,94,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #4ade80;">📄</div>
      <div>
        <div style="font-weight: 800; font-size: 14px; color: #ffffff;">1-Page GST Invoicing</div>
        <div style="font-size: 12px; color: #94a3b8;">HSN 84713010 Input Tax Credit</div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="width: 44px; height: 44px; background: rgba(245,158,11,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fbbf24;">⚡</div>
      <div>
        <div style="font-weight: 800; font-size: 14px; color: #ffffff;">Live Status Tracker</div>
        <div style="font-size: 12px; color: #94a3b8;">Order & Repair Diagnostic Alerts</div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="width: 44px; height: 44px; background: rgba(168,85,247,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #c084fc;">🛠️</div>
      <div>
        <div style="font-weight: 800; font-size: 14px; color: #ffffff;">Certified Lab Repairs</div>
        <div style="font-size: 12px; color: #94a3b8;">Chip-level Soldering & Diagnostics</div>
      </div>
    </div>

  </div>
</section>

<!-- Main Footer -->
<footer style="background: #020617; color: #94a3b8; font-size: 13px; padding: 50px 16px 20px;">
  <div style="max-width: 1320px; margin: 0 auto;">
    
    <div style="display: grid; grid-template-columns: 2fr 1.2fr 1.2fr 1.5fr; gap: 40px; margin-bottom: 40px;">
      
      <!-- Column 1: Store Bio & Address -->
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <img src="/public/images/jijau-logo.jpg" alt="Jijau Computers" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #f59e0b;">
          <div>
            <div style="font-size: 18px; font-weight: 900; color: #ffffff;">Jijau Computers</div>
            <div style="font-size: 10px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">SALES • CUSTOM PCS • REPAIRS</div>
          </div>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
          Pune's premier destination for high-performance custom gaming rigs, business laptops, Apple MacBooks, CCTV surveillance security systems, and chip-level motherboard repairs.
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
          <div>📍 <?= htmlspecialchars($storeSettings['address'] ?? 'Shop No. 4, Jijau Complex, Station Road, Pune, Maharashtra 411001') ?></div>
          <div>📞 <a href="tel:<?= htmlspecialchars($storeSettings['phone'] ?? '+91 88056 07908') ?>" style="color: #cbd5e1; text-decoration: none; font-weight: 600;"><?= htmlspecialchars($storeSettings['phone'] ?? '+91 88056 07908') ?></a></div>
          <div>✉️ <a href="mailto:<?= htmlspecialchars($storeSettings['email'] ?? 'contact@jijaucomputers.com') ?>" style="color: #cbd5e1; text-decoration: none;"><?= htmlspecialchars($storeSettings['email'] ?? 'contact@jijaucomputers.com') ?></a></div>
        </div>
      </div>

      <!-- Column 2: Quick Links -->
      <div>
        <h4 style="font-size: 14px; font-weight: 800; color: #ffffff; text-transform: uppercase; margin: 0 0 16px; letter-spacing: 0.5px;">Navigation</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="/products" style="color: #94a3b8; text-decoration: none;">All Products Catalog</a>
          <a href="/custom-pc" style="color: #94a3b8; text-decoration: none;">Custom PC Part Picker</a>
          <a href="/devices" style="color: #94a3b8; text-decoration: none;">Devices Hub (Laptops/CCTV)</a>
          <a href="/offers" style="color: #94a3b8; text-decoration: none;">Special Offers & Deals</a>
          <a href="/track-service" style="color: #94a3b8; text-decoration: none;">Track Order / Repair</a>
          <a href="/quote-request" style="color: #94a3b8; text-decoration: none;">B2B Corporate Quotation</a>
        </div>
      </div>

      <!-- Column 3: Customer Services -->
      <div>
        <h4 style="font-size: 14px; font-weight: 800; color: #ffffff; text-transform: uppercase; margin: 0 0 16px; letter-spacing: 0.5px;">Customer Care</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="/account" style="color: #94a3b8; text-decoration: none;">My Account & Past Orders</a>
          <a href="/about" style="color: #94a3b8; text-decoration: none;">About Jijau Computers</a>
          <a href="/contact" style="color: #94a3b8; text-decoration: none;">Store Location & Contact</a>
          <a href="/track-service" style="color: #94a3b8; text-decoration: none;">Service Ticket Status</a>
        </div>
      </div>

      <!-- Column 4: Store Hours & Map -->
      <div>
        <h4 style="font-size: 14px; font-weight: 800; color: #ffffff; text-transform: uppercase; margin: 0 0 16px; letter-spacing: 0.5px;">Store Timings</h4>
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
          <div style="font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 4px;">OPERATING HOURS</div>
          <div style="color: #cbd5e1; font-size: 12px; line-height: 1.5;"><?= htmlspecialchars($storeSettings['openingHours'] ?? 'Mon - Sat: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 6:00 PM') ?></div>
        </div>

        <a href="<?= htmlspecialchars($storeSettings['googleMapsUrl'] ?? 'https://maps.google.com/?q=Pune,Maharashtra') ?>" target="_blank" style="padding: 10px 16px; background: #1e293b; color: #38bdf8; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #334155;">
          <span>🗺️ Open in Google Maps</span>
        </a>
      </div>

    </div>

    <!-- Tech Sprout Company Credit Bar -->
    <div style="border-top: 1px solid #1e293b; padding: 24px 0 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="/public/images/tech-sprout-logo.png" alt="Tech Sprout" style="width: 32px; height: 32px; object-fit: contain; border-radius: 6px; background: white; padding: 2px;">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #f8fafc;">
            Built with ❤️ by <span style="color: #38bdf8;">Tech Sprout</span>
          </div>
          <div style="font-size: 11px; color: #64748b;">Digital Infrastructure & Native Cloud Architecture</div>
        </div>
      </div>

      <div style="font-size: 12px; color: #64748b;">
        © <?= date('Y') ?> Jijau Computers. All rights reserved. GSTIN: <?= htmlspecialchars($storeSettings['gstin'] ?? '27AAAAA0000A1Z5') ?>
      </div>

    </div>

  </div>
</footer>

<!-- Floating WhatsApp Button -->
<a href="https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>?text=Hello%20Jijau%20Computers!%20I%20have%20an%20inquiry." target="_blank" class="floating-whatsapp" style="position: fixed; bottom: 24px; right: 24px; z-index: 100; width: 56px; height: 56px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 10px 25px rgba(34,197,94,0.5); text-decoration: none; transition: transform 0.2s;" title="Chat with us on WhatsApp">
  💬
</a>

<script src="/public/js/main.js"></script>
</body>
</html>
