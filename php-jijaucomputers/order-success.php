<?php
require_once __DIR__ . '/includes/functions.php';

$orderNumber = trim($_GET['order'] ?? '');
$db = getDB();

$order = null;
$orderItems = [];

if ($orderNumber) {
    $stmt = $db->prepare('SELECT * FROM "Order" WHERE orderNumber = ?');
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch();

    if ($order) {
        $itemStmt = $db->prepare('SELECT * FROM "OrderItem" WHERE orderId = ?');
        $itemStmt->execute([$order['id']]);
        $orderItems = $itemStmt->fetchAll();
    }
}

if (!$order) {
    header('Location: /products');
    exit;
}

$pageTitle = 'Order Confirmed - ' . $order['orderNumber'] . ' | ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';

// Prepare WhatsApp message
$utrInfo = '';
if (!empty($order['notes']) && strpos($order['notes'], '[UPI UTR') !== false) {
    $utrInfo = " (Payment Mode: " . $order['paymentMode'] . " | Note: " . $order['notes'] . ")";
}
$waMessage = "Hello Jijau Computers! I just placed order #" . $order['orderNumber'] . " for total " . formatPrice($order['total']) . $utrInfo . ". Please confirm delivery details.";
$waUrl = generateWhatsAppUrl($storeSettings['whatsapp'] ?? '918805607908', $waMessage);
?>

<div class="order-success-page" style="padding: 60px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 16px;">
    
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
      
      <div style="width: 72px; height: 72px; background: #dcfce7; color: #16a34a; font-size: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
        ✓
      </div>

      <span style="display: inline-block; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 12px;">ORDER PLACED SUCCESSFULLY</span>
      <h1 style="font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">Thank You, <?= htmlspecialchars($order['customerName']) ?>!</h1>
      <p style="color: #64748b; font-size: 16px; margin: 0 0 28px;">Your order has been recorded in our system. Order reference: <strong style="color: #2563eb;"><?= htmlspecialchars($order['orderNumber']) ?></strong></p>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px;">
        <a href="/invoice?order=<?= urlencode($order['orderNumber']) ?>&print=true" target="_blank" style="padding: 12px 24px; background: #0f172a; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
          <span>📄 Print / Download GST Invoice</span>
        </a>
        <a href="<?= $waUrl ?>" target="_blank" style="padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
          <span>💬 WhatsApp Store for Fast Dispatch</span>
        </a>
        <a href="/track-service?ticket=<?= urlencode($order['orderNumber']) ?>" style="padding: 12px 24px; background: #f1f5f9; color: #334155; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
          <span>🚚 Live Order Tracker</span>
        </a>
      </div>

      <!-- Order Details Summary -->
      <div style="text-align: left; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Order Items (<?= count($orderItems) ?>)</h3>
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <?php foreach ($orderItems as $item): ?>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span style="color: #334155;"><strong><?= htmlspecialchars($item['name']) ?></strong> × <?= $item['quantity'] ?></span>
              <span style="font-weight: 700; color: #0f172a;"><?= formatPrice($item['price'] * $item['quantity']) ?></span>
            </div>
          <?php endforeach; ?>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a;">
          <span>Total Paid / Payable:</span>
          <span style="color: #2563eb;"><?= formatPrice($order['total']) ?></span>
        </div>

        <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #64748b; line-height: 1.6;">
          <strong>Shipping Address:</strong><br>
          <?= htmlspecialchars($order['address']) ?>, <?= htmlspecialchars($order['city']) ?> - <?= htmlspecialchars($order['pincode']) ?><br>
          <strong>Phone:</strong> <?= htmlspecialchars($order['phone']) ?> | <strong>Payment:</strong> <?= htmlspecialchars($order['paymentMode']) ?>
        </div>
      </div>

      <div style="margin-top: 32px;">
        <a href="/products" style="color: #2563eb; font-weight: 700; text-decoration: none; font-size: 15px;">← Continue Shopping More Hardware</a>
      </div>

    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
