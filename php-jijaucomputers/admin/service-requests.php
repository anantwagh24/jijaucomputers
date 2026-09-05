<?php
$pageTitle = 'Service Tickets & Lab Repairs';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';
$error = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'create_ticket') {
        $customerName = trim($_POST['customerName'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $deviceType = trim($_POST['deviceType'] ?? 'Laptop');
        $brand = trim($_POST['brand'] ?? 'Dell');
        $model = trim($_POST['model'] ?? '');
        $serialNo = trim($_POST['serialNo'] ?? '');
        $issueDesc = trim($_POST['issueDesc'] ?? '');
        $status = trim($_POST['status'] ?? 'Received');
        $estimatedCost = !empty($_POST['estimatedCost']) ? floatval($_POST['estimatedCost']) : null;
        $adminNotes = trim($_POST['adminNotes'] ?? '');

        if (empty($customerName) || empty($phone) || empty($issueDesc)) {
            $error = 'Customer name, phone, and issue description are required.';
        } else {
            $ticketId = 'JC-SRV-' . rand(1000, 9999);
            $id = 'srv_' . bin2hex(random_bytes(8));
            $now = date('Y-m-d H:i:s');

            $stmt = $db->prepare('INSERT INTO "ServiceRequest" (id, ticketId, customerName, phone, email, deviceType, brand, model, serialNo, issueDesc, status, adminNotes, estimatedCost, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $res = $stmt->execute([$id, $ticketId, $customerName, $phone, $email, $deviceType, $brand, $model, $serialNo, $issueDesc, $status, $adminNotes, $estimatedCost, $now, $now]);
            if ($res) {
                $message = "Service Ticket #{$ticketId} created successfully!";
            } else {
                $error = 'Failed to create service ticket in database.';
            }
        }
    } elseif ($_POST['action'] === 'update_stage') {
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

  <?php if ($error): ?>
    <div style="background: #fee2e2; border: 1px solid #f87171; color: #991b1b; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ⚠️ <?= $error ?>
    </div>
  <?php endif; ?>

  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px;">Service & Repair Tickets (<?= count($tickets) ?>)</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Track diagnostics, repair milestones, update customers via WhatsApp, and print official 1-page Service Bills.</p>
      </div>

      <button onclick="document.getElementById('newTicketModal').style.display='flex'" style="padding: 10px 18px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
        <span>+ Check-in Walk-in Device</span>
      </button>
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
              $waMsg = "Hello {$srv['customerName']}, your {$srv['brand']} {$srv['model']} service ticket #{$srv['ticketId']} is currently in status: {$srv['status']}. Track live status at: https://jijaucomputers.in/track-service?ticket={$srv['ticketId']}";
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
                      <option value="Under Inspection" <?= $srv['status'] === 'Under Inspection' ? 'selected' : '' ?>>Under Inspection</option>
                      <option value="Repairing" <?= $srv['status'] === 'Repairing' ? 'selected' : '' ?>>Repairing</option>
                      <option value="Waiting for Parts" <?= $srv['status'] === 'Waiting for Parts' ? 'selected' : '' ?>>Waiting for Parts</option>
                      <option value="Ready for Delivery" <?= $srv['status'] === 'Ready for Delivery' ? 'selected' : '' ?>>Ready for Delivery</option>
                      <option value="Completed" <?= $srv['status'] === 'Completed' ? 'selected' : '' ?>>Completed</option>
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

<!-- Modal for New Service Ticket -->
<div id="newTicketModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 999; align-items: center; justify-content: center; padding: 16px;">
  <div style="background: white; border-radius: 12px; max-width: 550px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a;">Check-in Device / New Ticket</h3>
      <button onclick="document.getElementById('newTicketModal').style.display='none'" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <form method="POST" action="/admin/service-requests.php" style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
      <input type="hidden" name="action" value="create_ticket">

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Customer Name *</label>
          <input type="text" name="customerName" required placeholder="e.g. Ramesh Shinde" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Mobile / WhatsApp *</label>
          <input type="tel" name="phone" required placeholder="10-digit number" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Device Type *</label>
          <select name="deviceType" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop PC</option>
            <option value="MacBook">Apple MacBook</option>
            <option value="Printer">Printer / Scanner</option>
            <option value="CCTV">CCTV System</option>
            <option value="GPU">Graphics Card</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Brand *</label>
          <input type="text" name="brand" required placeholder="e.g. Dell / HP / Apple" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Model Name</label>
          <input type="text" name="model" placeholder="e.g. Inspiron 15" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Serial / S/N</label>
          <input type="text" name="serialNo" placeholder="e.g. 7XG9B42" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div>
        <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Reported Issue / Fault Description *</label>
        <textarea name="issueDesc" required rows="2" placeholder="e.g. Display not working, heating issue, OS reinstall..." style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;"></textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Initial Status</label>
          <select name="status" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
            <option value="Received">Received</option>
            <option value="Under Inspection">Under Inspection</option>
            <option value="Repairing">Repairing</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Estimated Cost (₹)</label>
          <input type="number" name="estimatedCost" placeholder="e.g. 1500" style="width: 100%; padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button type="button" onclick="document.getElementById('newTicketModal').style.display='none'" style="flex: 1; padding: 10px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">Cancel</button>
        <button type="submit" style="flex: 2; padding: 10px; background: #059669; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">Save & Check-in Device</button>
      </div>
    </form>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
