<?php
require_once __DIR__ . '/includes/functions.php';

$phoneLookup = trim($_GET['phone'] ?? '');
$orders = [];
$services = [];

if ($phoneLookup) {
    try {
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM "Order" WHERE phone LIKE ? ORDER BY createdAt DESC LIMIT 10');
        $stmt->execute(['%' . $phoneLookup . '%']);
        $orders = $stmt->fetchAll();

        $srvStmt = $db->prepare('SELECT * FROM "ServiceRequest" WHERE phone LIKE ? ORDER BY createdAt DESC LIMIT 10');
        $srvStmt->execute(['%' . $phoneLookup . '%']);
        $services = $srvStmt->fetchAll();
    } catch (Exception $e) {}
}

$pageTitle = 'My Customer Portal & Order History - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="account-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 16px;">
    
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 32px;">
      <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Customer Portal & Order History</h1>
      <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Enter your phone number to look up your past hardware orders, download 1-page GST tax invoices, and track service requests.</p>

      <form method="GET" action="/account" style="display: flex; gap: 12px; max-width: 500px;">
        <input type="tel" name="phone" required placeholder="Enter 10-digit Phone Number" value="<?= htmlspecialchars($phoneLookup) ?>" style="flex: 1; padding: 12px 16px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        <button type="submit" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer;">
          Find Orders
        </button>
      </form>
    </div>

    <?php if ($phoneLookup): ?>
      <!-- Orders List -->
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 32px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 20px; display: flex; align-items: center; gap: 10px;">
          <span>📦</span> Hardware Orders (<?= count($orders) ?>)
        </h2>

        <?php if (empty($orders)): ?>
          <p style="color: #64748b; font-size: 14px; margin: 0;">No past orders found for phone number <?= htmlspecialchars($phoneLookup) ?>.</p>
        <?php else: ?>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <?php foreach ($orders as $ord): ?>
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div>
                  <div style="font-weight: 800; font-size: 16px; color: #0f172a;"><?= htmlspecialchars($ord['orderNumber']) ?></div>
                  <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Date: <?= date('d M Y, h:i A', strtotime($ord['createdAt'])) ?> • Total: <strong style="color: #0f172a;"><?= formatPrice($ord['total']) ?></strong></div>
                  <div style="font-size: 12px; margin-top: 6px;">
                    <span style="padding: 2px 8px; border-radius: 4px; font-weight: 700; background: <?= $ord['status'] === 'DELIVERED' ? '#dcfce7; color: #16a34a;' : '#dbeafe; color: #1e40af;' ?>"><?= htmlspecialchars($ord['status']) ?></span>
                    <span style="color: #64748b; margin-left: 8px;">Payment: <?= htmlspecialchars($ord['paymentMode']) ?></span>
                  </div>
                </div>

                <div style="display: flex; gap: 10px;">
                  <a href="/invoice?order=<?= urlencode($ord['orderNumber']) ?>&print=true" target="_blank" style="padding: 8px 16px; background: #0f172a; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                    <span>📄 GST Invoice</span>
                  </a>
                  <a href="/track-service?ticket=<?= urlencode($ord['orderNumber']) ?>" style="padding: 8px 16px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 700;">
                    Live Status
                  </a>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <!-- Service Tickets List -->
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 20px; display: flex; align-items: center; gap: 10px;">
          <span>🛠️</span> Repair Service Requests (<?= count($services) ?>)
        </h2>

        <?php if (empty($services)): ?>
          <p style="color: #64748b; font-size: 14px; margin: 0;">No service tickets found for phone number <?= htmlspecialchars($phoneLookup) ?>.</p>
        <?php else: ?>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <?php foreach ($services as $srv): ?>
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div>
                  <div style="font-weight: 800; font-size: 16px; color: #0f172a;"><?= htmlspecialchars($srv['ticketId']) ?> - <?= htmlspecialchars($srv['brand']) ?> <?= htmlspecialchars($srv['model']) ?></div>
                  <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Issue: <?= htmlspecialchars($srv['issueDesc']) ?></div>
                  <div style="font-size: 12px; margin-top: 6px;">
                    <span style="padding: 2px 8px; border-radius: 4px; font-weight: 700; background: #fef3c7; color: #b45309;"><?= htmlspecialchars($srv['status']) ?></span>
                    <span style="color: #64748b; margin-left: 8px;">Logged: <?= date('d M Y', strtotime($srv['createdAt'])) ?></span>
                  </div>
                </div>

                <div style="display: flex; gap: 10px;">
                  <a href="/invoice?service=<?= urlencode($srv['ticketId']) ?>&print=true" target="_blank" style="padding: 8px 16px; background: #0f172a; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 700;">
                    <span>📄 Service Bill</span>
                  </a>
                  <a href="/track-service?ticket=<?= urlencode($srv['ticketId']) ?>" style="padding: 8px 16px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 700;">
                    Track Repair
                  </a>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    <?php endif; ?>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
