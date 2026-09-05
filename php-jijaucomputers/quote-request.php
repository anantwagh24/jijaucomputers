<?php
require_once __DIR__ . '/includes/functions.php';

$successQuote = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerName = trim($_POST['customerName'] ?? '');
    $companyName = trim($_POST['companyName'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $type = trim($_POST['type'] ?? 'Bulk Order');
    $itemsSummary = trim($_POST['itemsSummary'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (empty($customerName) || empty($phone) || empty($email) || empty($itemsSummary)) {
        $error = 'Please provide your name, phone, email, and required hardware items.';
    } else {
        try {
            $db = getDB();
            $id = 'qr_' . bin2hex(random_bytes(8));
            $quoteNumber = 'JC-QT-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
            $now = date('Y-m-d H:i:s');

            $stmt = $db->prepare('INSERT INTO "QuotationRequest" (id, quoteNumber, customerName, companyName, phone, email, type, itemsSummary, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $res = $stmt->execute([$id, $quoteNumber, $customerName, $companyName, $phone, $email, $type, $itemsSummary, $message, 'PENDING', $now, $now]);

            if ($res) {
                $successQuote = $quoteNumber;
            } else {
                $error = 'Failed to submit quote request. Please try again.';
            }
        } catch (Exception $e) {
            $error = 'Database error. Please WhatsApp us directly.';
        }
    }
}

$pageTitle = 'Request Corporate / Bulk Hardware Quote - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="quote-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 16px;">
    
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="display: inline-block; padding: 4px 12px; background: #eff6ff; color: #2563eb; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 8px;">INSTANT B2B / B2C PRICING</span>
        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Request an Official Hardware Quotation</h1>
        <p style="color: #64748b; font-size: 15px; margin: 0;">Get customized corporate pricing, GST input credits, and bulk rates for laptops, gaming rigs, and office IT setups.</p>
      </div>

      <?php if ($successQuote): ?>
        <div style="background: #f0fdf4; border: 1px solid #86efac; color: #15803d; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 36px; margin-bottom: 8px;">🎉</div>
          <h3 style="font-size: 20px; font-weight: 800; margin: 0 0 6px;">Quotation Request Submitted!</h3>
          <p style="margin: 0 0 16px;">Your reference number is: <strong style="color: #15803d; font-size: 18px;"><?= htmlspecialchars($successQuote) ?></strong></p>
          <a href="https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>?text=Hello%20Jijau%20Computers,%20I%20requested%20quote%20<?= urlencode($successQuote) ?>" target="_blank" style="padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            <span>💬 Fast Track via WhatsApp</span>
          </a>
        </div>
      <?php endif; ?>

      <?php if ($error): ?>
        <div style="background: #fef2f2; border: 1px solid #f87171; color: #991b1b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
          ⚠️ <?= htmlspecialchars($error) ?>
        </div>
      <?php endif; ?>

      <form method="POST" action="/quote-request" style="display: flex; flex-direction: column; gap: 18px;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Contact Person Name *</label>
            <input type="text" name="customerName" required placeholder="e.g. Anand Deshmukh" value="<?= htmlspecialchars($_POST['customerName'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Company / Organization (Optional)</label>
            <input type="text" name="companyName" placeholder="e.g. Tech Solutions Pvt Ltd" value="<?= htmlspecialchars($_POST['companyName'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Phone / WhatsApp *</label>
            <input type="tel" name="phone" required placeholder="10 Digit Mobile" value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Email Address *</label>
            <input type="email" name="email" required placeholder="name@company.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Requirement Type *</label>
          <select name="type" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            <option value="Bulk Order">Bulk Hardware Purchase (Multiple Units)</option>
            <option value="Enterprise IT Setup">Office IT Setup (Desktops + Networking + Printers)</option>
            <option value="Custom High-End Workstation">Custom High-End Workstation / Render Rig</option>
            <option value="CCTV Security Setup">Complete CCTV Surveillance Setup</option>
            <option value="Annual Maintenance Contract (AMC)">Hardware AMC & Repair Contract</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Hardware Items & Quantities Summary *</label>
          <textarea name="itemsSummary" required rows="3" placeholder="e.g. 5x Intel i7 14700K Desktops with 32GB RAM, 10x 24-inch Monitors, 2x HP LaserJet Printers" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;"><?= htmlspecialchars($_POST['itemsSummary'] ?? '') ?></textarea>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Additional Specifics / Target Budget</label>
          <input type="text" name="message" placeholder="e.g. Need delivery within 3 days, require GST invoice for Pune company" value="<?= htmlspecialchars($_POST['message'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
        </div>

        <button type="submit" style="padding: 16px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;">
          <span>📋 Submit Quotation Request</span>
        </button>

      </form>

    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
