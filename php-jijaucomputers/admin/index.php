<?php
$pageTitle = 'Executive Dashboard & Metrics';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();

// Metrics
$totalSales = $db->query('SELECT COALESCE(SUM(total), 0) FROM "Order" WHERE status != "CANCELLED"')->fetchColumn();
$totalOrders = $db->query('SELECT COUNT(*) FROM "Order"')->fetchColumn();
$totalProducts = $db->query('SELECT COUNT(*) FROM "Product"')->fetchColumn();
$totalServices = $db->query('SELECT COUNT(*) FROM "ServiceRequest"')->fetchColumn();
$totalVisitors = $db->query('SELECT COUNT(*) FROM "VisitorLog"')->fetchColumn();

// Recent Orders
$recentOrders = $db->query('SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT 5')->fetchAll();
// Recent Service Tickets
$recentServices = $db->query('SELECT * FROM "ServiceRequest" ORDER BY createdAt DESC LIMIT 5')->fetchAll();
?>

<div style="display: flex; flex-direction: column; gap: 32px;">
  
  <!-- Stats Cards Row -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
    
    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Sales</div>
      <div style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 8px 0 4px;"><?= formatPrice($totalSales) ?></div>
      <div style="font-size: 12px; color: #16a34a; font-weight: 600;">+18% GST Accounted</div>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Hardware Orders</div>
      <div style="font-size: 26px; font-weight: 900; color: #2563eb; margin: 8px 0 4px;"><?= $totalOrders ?></div>
      <div style="font-size: 12px; color: #64748b;">With 1-Page Invoices</div>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Service Tickets</div>
      <div style="font-size: 26px; font-weight: 900; color: #f59e0b; margin: 8px 0 4px;"><?= $totalServices ?></div>
      <div style="font-size: 12px; color: #64748b;">Live Tracker Sync</div>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Storefront Visits</div>
      <div style="font-size: 26px; font-weight: 900; color: #10b981; margin: 8px 0 4px;"><?= $totalVisitors ?></div>
      <div style="font-size: 12px; color: #64748b;">Logged Live Hits</div>
    </div>

  </div>

  <!-- Recent Hardware Orders Table -->
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">📦 Recent Hardware Orders</h2>
      <a href="/admin/orders.php" style="font-size: 13px; font-weight: 700; color: #2563eb; text-decoration: none;">View All Orders →</a>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 12px 10px;">ORDER #</th>
            <th style="padding: 12px 10px;">CUSTOMER</th>
            <th style="padding: 12px 10px;">PHONE</th>
            <th style="padding: 12px 10px;">AMOUNT</th>
            <th style="padding: 12px 10px;">STATUS</th>
            <th style="padding: 12px 10px;">DATE</th>
            <th style="padding: 12px 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($recentOrders)): ?>
            <tr><td colspan="7" style="padding: 24px; text-align: center; color: #94a3b8;">No orders recorded yet.</td></tr>
          <?php else: ?>
            <?php foreach ($recentOrders as $ord): ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;"><?= htmlspecialchars($ord['orderNumber']) ?></td>
                <td style="padding: 14px 10px; font-weight: 600;"><?= htmlspecialchars($ord['customerName']) ?></td>
                <td style="padding: 14px 10px; color: #64748b;"><?= htmlspecialchars($ord['phone']) ?></td>
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;"><?= formatPrice($ord['total']) ?></td>
                <td style="padding: 14px 10px;">
                  <span style="padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 11px; background: <?= $ord['status'] === 'DELIVERED' ? '#dcfce7; color: #16a34a;' : ($ord['status'] === 'PENDING' ? '#fef3c7; color: #b45309;' : '#dbeafe; color: #1e40af;') ?>">
                    <?= htmlspecialchars($ord['status']) ?>
                  </span>
                </td>
                <td style="padding: 14px 10px; color: #64748b;"><?= date('d M, h:i A', strtotime($ord['createdAt'])) ?></td>
                <td style="padding: 14px 10px; text-align: right;">
                  <a href="/invoice.php?order=<?= urlencode($ord['orderNumber']) ?>&print=true" target="_blank" style="padding: 6px 12px; background: #0f172a; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; margin-right: 6px;">
                    📄 Invoice
                  </a>
                  <a href="/admin/orders.php" style="padding: 6px 12px; background: #eff6ff; color: #2563eb; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px;">
                    Manage
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Recent Service Tickets -->
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">🛠️ Active Repair Service Tickets</h2>
      <a href="/admin/service-requests.php" style="font-size: 13px; font-weight: 700; color: #2563eb; text-decoration: none;">View All Tickets →</a>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 12px 10px;">TICKET #</th>
            <th style="padding: 12px 10px;">CUSTOMER</th>
            <th style="padding: 12px 10px;">DEVICE</th>
            <th style="padding: 12px 10px;">ISSUE</th>
            <th style="padding: 12px 10px;">STAGE</th>
            <th style="padding: 12px 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($recentServices)): ?>
            <tr><td colspan="6" style="padding: 24px; text-align: center; color: #94a3b8;">No repair tickets logged.</td></tr>
          <?php else: ?>
            <?php foreach ($recentServices as $srv): ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;"><?= htmlspecialchars($srv['ticketId']) ?></td>
                <td style="padding: 14px 10px; font-weight: 600;"><?= htmlspecialchars($srv['customerName']) ?> (<?= htmlspecialchars($srv['phone']) ?>)</td>
                <td style="padding: 14px 10px;"><?= htmlspecialchars($srv['brand']) ?> <?= htmlspecialchars($srv['model']) ?></td>
                <td style="padding: 14px 10px; color: #64748b; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><?= htmlspecialchars($srv['issueDesc']) ?></td>
                <td style="padding: 14px 10px;">
                  <span style="padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 11px; background: #fef3c7; color: #b45309;">
                    <?= htmlspecialchars($srv['status']) ?>
                  </span>
                </td>
                <td style="padding: 14px 10px; text-align: right;">
                  <a href="/invoice.php?service=<?= urlencode($srv['ticketId']) ?>&print=true" target="_blank" style="padding: 6px 12px; background: #0f172a; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; margin-right: 6px;">
                    📄 Bill
                  </a>
                  <a href="/admin/service-requests.php" style="padding: 6px 12px; background: #eff6ff; color: #2563eb; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px;">
                    Update
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

</div>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
