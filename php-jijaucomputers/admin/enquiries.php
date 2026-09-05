<?php
$pageTitle = 'Enquiries & Messages';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$enquiries = $db->query('SELECT * FROM "Enquiry" ORDER BY createdAt DESC')->fetchAll();
?>

<div>
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">💬 Customer Messages & Inquiries (<?= count($enquiries) ?>)</h2>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 10px;">DATE</th>
            <th style="padding: 10px;">CUSTOMER</th>
            <th style="padding: 10px;">SUBJECT</th>
            <th style="padding: 10px;">MESSAGE</th>
            <th style="padding: 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($enquiries)): ?>
            <tr><td colspan="5" style="padding: 32px; text-align: center; color: #94a3b8;">No customer messages logged yet.</td></tr>
          <?php else: ?>
            <?php foreach ($enquiries as $enq): 
              $cleanPhone = preg_replace('/[^0-9]/', '', $enq['phone']);
              if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
              $waLink = "https://wa.me/{$cleanPhone}?text=" . urlencode("Hello {$enq['name']}, thank you for contacting Jijau Computers regarding {$enq['subject']}:");
            ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 10px; color: #64748b;"><?= date('d M, h:i A', strtotime($enq['createdAt'])) ?></td>
                <td style="padding: 12px 10px;">
                  <div style="font-weight: 700;"><?= htmlspecialchars($enq['name']) ?></div>
                  <div style="font-size: 11px; color: #64748b;"><?= htmlspecialchars($enq['phone']) ?> <?= $enq['email'] ? '• ' . htmlspecialchars($enq['email']) : '' ?></div>
                </td>
                <td style="padding: 12px 10px; font-weight: 600; color: #2563eb;"><?= htmlspecialchars($enq['subject']) ?></td>
                <td style="padding: 12px 10px; max-width: 300px; color: #475569; font-size: 12px;">
                  <?= htmlspecialchars($enq['message']) ?>
                </td>
                <td style="padding: 12px 10px; text-align: right;">
                  <a href="<?= $waLink ?>" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">
                    💬 WhatsApp Reply
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>
