<?php
$pageTitle = 'Orders Management & Tax Billing';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';

// Handle status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    $orderId = $_POST['orderId'] ?? '';
    $newStatus = $_POST['status'] ?? '';
    $now = date('Y-m-d H:i:s');

    if ($orderId && $newStatus) {
        $stmt = $db->prepare('UPDATE "Order" SET status = ?, updatedAt = ? WHERE id = ?');
        $stmt->execute([$newStatus, $now, $orderId]);
        $message = 'Order status updated to ' . htmlspecialchars($newStatus);
    }
}

// Fetch all orders
$orders = $db->query('SELECT * FROM "Order" ORDER BY createdAt DESC')->fetchAll();
?>

<div>
  <?php if ($message): ?>
    <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ✓ <?= $message ?>
    </div>
  <?php endif; ?>

  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px;">Hardware Orders (<?= count($orders) ?>)</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Manage fulfillment, update statuses, dispatch WhatsApp notifications, and print 1-page GST tax invoices.</p>
      </div>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 12px 10px;">ORDER #</th>
            <th style="padding: 12px 10px;">CUSTOMER</th>
            <th style="padding: 12px 10px;">DELIVERY ADDRESS</th>
            <th style="padding: 12px 10px;">TOTAL</th>
            <th style="padding: 12px 10px;">PAYMENT</th>
            <th style="padding: 12px 10px;">STATUS</th>
            <th style="padding: 12px 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($orders)): ?>
            <tr><td colspan="7" style="padding: 32px; text-align: center; color: #94a3b8;">No customer orders placed yet.</td></tr>
          <?php else: ?>
            <?php foreach ($orders as $ord): 
              $cleanPhone = preg_replace('/[^0-9]/', '', $ord['phone']);
              if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
              $waMsg = "Hello {$ord['customerName']}, your Jijau Computers Order #{$ord['orderNumber']} (Total " . formatPrice($ord['total']) . ") is currently: {$ord['status']}. Track live at: http://localhost:8000/track-service.php?ticket={$ord['orderNumber']}";
              $waLink = "https://wa.me/{$cleanPhone}?text=" . urlencode($waMsg);
            ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;">
                  <?= htmlspecialchars($ord['orderNumber']) ?>
                  <div style="font-size: 11px; color: #94a3b8; font-weight: normal;"><?= date('d M Y, h:i A', strtotime($ord['createdAt'])) ?></div>
                </td>
                <td style="padding: 14px 10px;">
                  <div style="font-weight: 700; color: #1e293b;"><?= htmlspecialchars($ord['customerName']) ?></div>
                  <div style="font-size: 12px; color: #64748b;"><?= htmlspecialchars($ord['phone']) ?></div>
                </td>
                <td style="padding: 14px 10px; color: #475569; max-width: 200px; font-size: 12px;">
                  <?= htmlspecialchars($ord['address']) ?>, <?= htmlspecialchars($ord['city']) ?> - <?= htmlspecialchars($ord['pincode']) ?>
                </td>
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;">
                  <?= formatPrice($ord['total']) ?>
                  <div style="font-size: 10px; color: #16a34a;">Incl. 18% GST</div>
                </td>
                <td style="padding: 14px 10px; font-size: 12px; font-weight: 600; color: #334155;">
                  <?= htmlspecialchars($ord['paymentMode']) ?>
                </td>
                <td style="padding: 14px 10px;">
                  <form method="POST" action="/admin/orders.php" style="display: inline-block;">
                    <input type="hidden" name="action" value="update_status">
                    <input type="hidden" name="orderId" value="<?= htmlspecialchars($ord['id']) ?>">
                    <select name="status" onchange="this.form.submit()" style="padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; border: 1.5px solid #cbd5e1; outline: none; background: <?= $ord['status'] === 'DELIVERED' ? '#dcfce7; color: #16a34a;' : ($ord['status'] === 'PENDING' ? '#fef3c7; color: #b45309;' : '#eff6ff; color: #1e40af;') ?>">
                      <option value="PENDING" <?= $ord['status'] === 'PENDING' ? 'selected' : '' ?>>PENDING</option>
                      <option value="CONFIRMED" <?= $ord['status'] === 'CONFIRMED' ? 'selected' : '' ?>>CONFIRMED</option>
                      <option value="PROCESSING" <?= $ord['status'] === 'PROCESSING' ? 'selected' : '' ?>>PROCESSING</option>
                      <option value="SHIPPED" <?= $ord['status'] === 'SHIPPED' ? 'selected' : '' ?>>SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY" <?= $ord['status'] === 'OUT_FOR_DELIVERY' ? 'selected' : '' ?>>OUT FOR DELIVERY</option>
                      <option value="DELIVERED" <?= $ord['status'] === 'DELIVERED' ? 'selected' : '' ?>>DELIVERED</option>
                      <option value="CANCELLED" <?= $ord['status'] === 'CANCELLED' ? 'selected' : '' ?>>CANCELLED</option>
                    </select>
                  </form>
                </td>
                <td style="padding: 14px 10px; text-align: right;">
                  <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <a href="/invoice.php?order=<?= urlencode($ord['orderNumber']) ?>&print=true" target="_blank" style="padding: 6px 10px; background: #0f172a; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
                      <span>📄 Print GST Invoice</span>
                    </a>
                    <a href="<?= $waLink ?>" target="_blank" style="padding: 6px 10px; background: #22c55e; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
