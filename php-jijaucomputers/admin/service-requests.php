<?php
$pageTitle = 'Service Tickets & Lab Repairs';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';

// Handle stage/cost update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'update_stage') {
        $ticketId = $_POST['ticketId'] ?? '';
        $newStatus = $_POST['status'] ?? '';
        $adminNotes = $_POST['adminNotes'] ?? '';
        $estCost = !empty($_POST['estimatedCost']) ? floatval($_POST['estimatedCost']) : null;
        $now = date('Y-m-d H:i:s');

        $stmt = $db->prepare('UPDATE "ServiceRequest" SET status = ?, adminNotes = ?, estimatedCost = ?, updatedAt = ? WHERE ticketId = ?');
        $stmt->execute([$newStatus, $adminNotes, $estCost, $now, $ticketId]);
        $message = "Service Ticket #{$ticketId} updated to {$newStatus}.";
    }
}

$tickets = $db->query('SELECT * FROM "ServiceRequest" ORDER BY createdAt DESC')->fetchAll();
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
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px;">Service & Repair Tickets (<?= count($tickets) ?>)</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Track diagnostics, repair milestones, update customers via WhatsApp, and print official 1-page Service Bills.</p>
      </div>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 12px 10px;">TICKET ID</th>
            <th style="padding: 12px 10px;">CUSTOMER</th>
            <th style="padding: 12px 10px;">DEVICE INFO</th>
            <th style="padding: 12px 10px;">REPORTED ISSUE</th>
            <th style="padding: 12px 10px;">EST. COST</th>
            <th style="padding: 12px 10px;">CURRENT STAGE</th>
            <th style="padding: 12px 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($tickets)): ?>
            <tr><td colspan="7" style="padding: 32px; text-align: center; color: #94a3b8;">No service tickets logged yet.</td></tr>
          <?php else: ?>
            <?php foreach ($tickets as $srv): 
              $cleanPhone = preg_replace('/[^0-9]/', '', $srv['phone']);
              if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
              $waMsg = "Hello {$srv['customerName']}, your {$srv['brand']} {$srv['model']} service ticket #{$srv['ticketId']} is currently in status: {$srv['status']}. Track live status at: http://localhost:8000/track-service.php?ticket={$srv['ticketId']}";
              $waLink = "https://wa.me/{$cleanPhone}?text=" . urlencode($waMsg);
            ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;">
                  <?= htmlspecialchars($srv['ticketId']) ?>
                  <div style="font-size: 11px; color: #94a3b8; font-weight: normal;"><?= date('d M Y', strtotime($srv['createdAt'])) ?></div>
                </td>
                <td style="padding: 14px 10px;">
                  <div style="font-weight: 700; color: #1e293b;"><?= htmlspecialchars($srv['customerName']) ?></div>
                  <div style="font-size: 12px; color: #64748b;"><?= htmlspecialchars($srv['phone']) ?></div>
                </td>
                <td style="padding: 14px 10px;">
                  <div style="font-weight: 600; color: #0f172a;"><?= htmlspecialchars($srv['brand']) ?> <?= htmlspecialchars($srv['model']) ?></div>
                  <div style="font-size: 11px; color: #64748b;">Type: <?= htmlspecialchars($srv['deviceType']) ?> <?= $srv['serialNo'] ? '| S/N: ' . htmlspecialchars($srv['serialNo']) : '' ?></div>
                </td>
                <td style="padding: 14px 10px; color: #475569; max-width: 200px; font-size: 12px;">
                  <?= htmlspecialchars($srv['issueDesc']) ?>
                </td>
                <td style="padding: 14px 10px; font-weight: 800; color: #0f172a;">
                  <?= $srv['estimatedCost'] ? formatPrice($srv['estimatedCost']) : 'TBD' ?>
                </td>
                <td style="padding: 14px 10px;">
                  <form method="POST" action="/admin/service-requests.php" style="display: flex; flex-direction: column; gap: 4px;">
                    <input type="hidden" name="action" value="update_stage">
                    <input type="hidden" name="ticketId" value="<?= htmlspecialchars($srv['ticketId']) ?>">
                    <select name="status" onchange="this.form.submit()" style="padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1.5px solid #cbd5e1; outline: none; background: #fef3c7; color: #b45309;">
                      <option value="Received" <?= $srv['status'] === 'Received' ? 'selected' : '' ?>>Received</option>
                      <option value="Diagnosing" <?= $srv['status'] === 'Diagnosing' ? 'selected' : '' ?>>Diagnosing</option>
                      <option value="Parts Arranged" <?= $srv['status'] === 'Parts Arranged' ? 'selected' : '' ?>>Parts Arranged</option>
                      <option value="In Repair" <?= $srv['status'] === 'In Repair' ? 'selected' : '' ?>>In Repair</option>
                      <option value="Testing & QA" <?= $srv['status'] === 'Testing & QA' ? 'selected' : '' ?>>Testing & QA</option>
                      <option value="Ready for Pickup" <?= $srv['status'] === 'Ready for Pickup' ? 'selected' : '' ?>>Ready for Pickup</option>
                      <option value="Delivered" <?= $srv['status'] === 'Delivered' ? 'selected' : '' ?>>Delivered</option>
                    </select>
                  </form>
                </td>
                <td style="padding: 14px 10px; text-align: right;">
                  <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <a href="/invoice.php?service=<?= urlencode($srv['ticketId']) ?>&print=true" target="_blank" style="padding: 6px 10px; background: #0f172a; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
                      <span>📄 1-Page Bill</span>
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
