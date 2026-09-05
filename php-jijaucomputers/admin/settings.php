<?php
$pageTitle = 'Store & GST Invoice Settings';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $storeName = trim($_POST['storeName'] ?? 'Jijau Computers');
    $tagline = trim($_POST['tagline'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $whatsapp = trim($_POST['whatsapp'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $googleMapsUrl = trim($_POST['googleMapsUrl'] ?? '');
    $gstin = trim($_POST['gstin'] ?? '');
    $upiId = trim($_POST['upiId'] ?? '');
    $upiName = trim($_POST['upiName'] ?? '');
    $invoiceHsnCode = trim($_POST['invoiceHsnCode'] ?? '84713010');
    $invoiceBankDetails = trim($_POST['invoiceBankDetails'] ?? '');
    $invoiceTerms = trim($_POST['invoiceTerms'] ?? '');
    $invoiceNotes = trim($_POST['invoiceNotes'] ?? '');
    $now = date('Y-m-d H:i:s');

    $stmt = $db->prepare('UPDATE "WebsiteSetting" SET storeName = ?, tagline = ?, phone = ?, whatsapp = ?, email = ?, address = ?, googleMapsUrl = ?, gstin = ?, upiId = ?, upiName = ?, invoiceHsnCode = ?, invoiceBankDetails = ?, invoiceTerms = ?, invoiceNotes = ?, updatedAt = ? WHERE id = "default"');
    $stmt->execute([$storeName, $tagline, $phone, $whatsapp, $email, $address, $googleMapsUrl, $gstin, $upiId, $upiName, $invoiceHsnCode, $invoiceBankDetails, $invoiceTerms, $invoiceNotes, $now]);
    
    $message = 'Store & GST invoice settings updated successfully.';
    $storeSettings = getStoreSettings();
}
?>

<div>
  <?php if ($message): ?>
    <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ✓ <?= $message ?>
    </div>
  <?php endif; ?>

  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 28px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); max-width: 900px;">
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 20px;">⚙️ Store Branding & GST Tax Configuration</h2>

    <form method="POST" action="/admin/settings.php" style="display: flex; flex-direction: column; gap: 18px;">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Store Name</label>
          <input type="text" name="storeName" value="<?= htmlspecialchars($storeSettings['storeName'] ?? 'Jijau Computers') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Store Tagline</label>
          <input type="text" name="tagline" value="<?= htmlspecialchars($storeSettings['tagline'] ?? 'Your Tech Partner') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Official GSTIN</label>
          <input type="text" name="gstin" value="<?= htmlspecialchars($storeSettings['gstin'] ?? '27AAAAA0000A1Z5') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: monospace; font-weight: 700; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Default HSN / SAC Code</label>
          <input type="text" name="invoiceHsnCode" value="<?= htmlspecialchars($storeSettings['invoiceHsnCode'] ?? '84713010') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">WhatsApp Number</label>
          <input type="text" name="whatsapp" value="<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Store Phone</label>
          <input type="text" name="phone" value="<?= htmlspecialchars($storeSettings['phone'] ?? '+91 98765 43210') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Store Email</label>
          <input type="email" name="email" value="<?= htmlspecialchars($storeSettings['email'] ?? 'contact@jijaucomputers.com') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Store Physical Address</label>
        <textarea name="address" rows="2" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;"><?= htmlspecialchars($storeSettings['address'] ?? '') ?></textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Store UPI ID (For QR Invoices)</label>
          <input type="text" name="upiId" value="<?= htmlspecialchars($storeSettings['upiId'] ?? 'jijauc@ibl') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">UPI Beneficiary Name</label>
          <input type="text" name="upiName" value="<?= htmlspecialchars($storeSettings['upiName'] ?? 'Jijau Computers') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Invoice Bank Account Details (Displayed on 1-Page PDF)</label>
        <input type="text" name="invoiceBankDetails" value="<?= htmlspecialchars($storeSettings['invoiceBankDetails'] ?? '') ?>" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
      </div>

      <div>
        <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px;">Invoice Terms & Conditions (Strict 1-Page Layout)</label>
        <textarea name="invoiceTerms" rows="4" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box;"><?= htmlspecialchars($storeSettings['invoiceTerms'] ?? '') ?></textarea>
      </div>

      <button type="submit" style="padding: 14px 28px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; align-self: flex-start;">
        Save All Settings
      </button>

    </form>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
