<?php
require_once __DIR__ . '/includes/functions.php';

$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? 'General Enquiry');
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || empty($phone) || empty($message)) {
        $error = 'Please provide your name, phone number, and message.';
    } else {
        try {
            $db = getDB();
            $id = 'enq_' . bin2hex(random_bytes(8));
            $now = date('Y-m-d H:i:s');
            $stmt = $db->prepare('INSERT INTO "Enquiry" (id, name, phone, email, subject, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $res = $stmt->execute([$id, $name, $phone, $email, $subject, $message, 'NEW', $now, $now]);
            if ($res) {
                $success = true;
            } else {
                $error = 'Failed to submit enquiry. Please try WhatsApp.';
            }
        } catch (Exception $e) {
            $error = 'Database error. Please contact us directly via WhatsApp.';
        }
    }
}

$pageTitle = 'Contact Us & Store Location - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="contact-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
    
    <div style="text-align: center; max-width: 700px; margin: 0 auto 40px;">
      <span style="display: inline-block; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 8px;">GET IN TOUCH</span>
      <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">Visit Our Store or Message Us</h1>
      <p style="color: #64748b; font-size: 16px; margin: 0;">Get customized hardware advice, check real-time stock, or drop off your device for certified repairs.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
      <!-- Store Details -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 24px;">Store Location & Contacts</h2>
        
        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
          <div style="font-size: 24px;">📍</div>
          <div>
            <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-bottom: 4px;">Store Address</div>
            <div style="color: #64748b; font-size: 14px; line-height: 1.5;"><?= htmlspecialchars($storeSettings['address'] ?? 'Shop No. 4, Jijau Complex, Station Road, Maharashtra') ?></div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
          <div style="font-size: 24px;">📞</div>
          <div>
            <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-bottom: 4px;">Phone & Support</div>
            <div style="color: #64748b; font-size: 14px;">
              <a href="tel:<?= htmlspecialchars($storeSettings['phone'] ?? '+918805607908') ?>" style="color: #2563eb; text-decoration: none; font-weight: 600;"><?= htmlspecialchars($storeSettings['phone'] ?? '+91 88056 07908') ?></a>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
          <div style="font-size: 24px;">⏰</div>
          <div>
            <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-bottom: 4px;">Operating Hours</div>
            <div style="color: #64748b; font-size: 14px;"><?= htmlspecialchars($storeSettings['openingHours'] ?? 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM') ?></div>
          </div>
        </div>

        <a href="<?= htmlspecialchars($storeSettings['googleMapsUrl'] ?? 'https://maps.google.com/?q=Maharashtra') ?>" target="_blank" style="width: 100%; padding: 12px; background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box;">
          <span>🗺️ Open in Google Maps</span>
        </a>
      </div>

      <!-- Send Enquiry Form -->
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Send Us a Direct Message</h2>

        <?php if ($success): ?>
          <div style="background: #f0fdf4; border: 1px solid #86efac; color: #15803d; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 6px;">✓</div>
            <div style="font-weight: 700; font-size: 15px;">Message Sent Successfully!</div>
            <div style="font-size: 13px; color: #166534;">Our team will get back to your contact number shortly.</div>
          </div>
        <?php endif; ?>

        <?php if ($error): ?>
          <div style="background: #fef2f2; border: 1px solid #f87171; color: #991b1b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
            ⚠️ <?= htmlspecialchars($error) ?>
          </div>
        <?php endif; ?>

        <form method="POST" action="/contact" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Your Name *</label>
            <input type="text" name="name" required placeholder="Full Name" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Phone Number *</label>
              <input type="tel" name="phone" required placeholder="10 Digit Phone" value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Email Address</label>
              <input type="email" name="email" placeholder="Optional" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Subject / Requirement *</label>
            <select name="subject" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
              <option value="Laptop / Desktop Repair">Laptop / Desktop Repair Service</option>
              <option value="Custom Gaming PC Build">Custom Gaming PC Assembly</option>
              <option value="Corporate / Bulk Quotation">Corporate / Bulk Hardware Quote</option>
              <option value="CCTV Installation">CCTV & Surveillance Inquiry</option>
              <option value="General Inquiry">General Store Inquiry</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Your Message / Issue Details *</label>
            <textarea name="message" required rows="4" placeholder="Describe the product you want or the issue you are facing..." style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;"><?= htmlspecialchars($_POST['message'] ?? '') ?></textarea>
          </div>

          <button type="submit" style="padding: 14px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>📨 Send Message</span>
          </button>
        </form>
      </div>

    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
