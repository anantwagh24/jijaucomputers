<?php
$pageTitle = 'Custom PC Build Inquiries';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$builds = $db->query('SELECT * FROM "CustomPcRequest" ORDER BY createdAt DESC')->fetchAll();
?>

<div>
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">⚡ Custom PC Build Requests (<?= count($builds) ?>)</h2>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 10px;">REQ #</th>
            <th style="padding: 10px;">CUSTOMER</th>
            <th style="padding: 10px;">BUDGET</th>
            <th style="padding: 10px;">PURPOSE / DETAILS</th>
            <th style="padding: 10px;">STATUS</th>
            <th style="padding: 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($builds)): ?>
            <tr><td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;">No custom PC inquiries logged yet.</td></tr>
          <?php else: ?>
            <?php foreach ($builds as $b): 
              $cleanPhone = preg_replace('/[^0-9]/', '', $b['phone']);
              if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
              $waLink = "https://wa.me/{$cleanPhone}?text=" . urlencode("Hello {$b['customerName']}, regarding your custom PC build request #{$b['reqNumber']} (Budget {$b['budget']}):");
            ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 10px; font-weight: 800; color: #0f172a;"><?= htmlspecialchars($b['reqNumber']) ?></td>
                <td style="padding: 12px 10px;">
                  <div style="font-weight: 700;"><?= htmlspecialchars($b['customerName']) ?></div>
                  <div style="font-size: 11px; color: #64748b;"><?= htmlspecialchars($b['phone']) ?></div>
                </td>
                <td style="padding: 12px 10px; font-weight: 800; color: #2563eb;"><?= htmlspecialchars($b['budget']) ?></td>
                <td style="padding: 12px 10px; max-width: 250px; font-size: 12px; color: #475569;">
                  <strong><?= htmlspecialchars($b['purpose']) ?></strong><br>
                  <?= htmlspecialchars($b['notes'] ?? '') ?>
                </td>
                <td style="padding: 12px 10px;">
                  <span style="padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; background: #dbeafe; color: #1e40af;">
                    <?= htmlspecialchars($b['status']) ?>
                  </span>
                </td>
                <td style="padding: 12px 10px; text-align: right;">
                  <a href="<?= $waLink ?>" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">
                    💬 WhatsApp Client
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
