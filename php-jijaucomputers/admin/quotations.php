<?php
$pageTitle = 'B2B Quotation Requests';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$quotes = $db->query('SELECT * FROM "QuotationRequest" ORDER BY createdAt DESC')->fetchAll();
?>

<div>
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">📋 Corporate & Bulk Quotation Inquiries (<?= count($quotes) ?>)</h2>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 10px;">QUOTE #</th>
            <th style="padding: 10px;">CLIENT / COMPANY</th>
            <th style="padding: 10px;">TYPE</th>
            <th style="padding: 10px;">REQUESTED ITEMS</th>
            <th style="padding: 10px;">STATUS</th>
            <th style="padding: 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($quotes)): ?>
            <tr><td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;">No quotation requests logged yet.</td></tr>
          <?php else: ?>
            <?php foreach ($quotes as $q): 
              $cleanPhone = preg_replace('/[^0-9]/', '', $q['phone']);
              if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
              $waLink = "https://wa.me/{$cleanPhone}?text=" . urlencode("Hello {$q['customerName']}, regarding your quote request #{$q['quoteNumber']} for Jijau Computers:");
            ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 10px; font-weight: 800; color: #0f172a;"><?= htmlspecialchars($q['quoteNumber']) ?></td>
                <td style="padding: 12px 10px;">
                  <div style="font-weight: 700;"><?= htmlspecialchars($q['customerName']) ?></div>
                  <div style="font-size: 11px; color: #64748b;"><?= htmlspecialchars($q['companyName'] ?? 'Individual') ?> • <?= htmlspecialchars($q['phone']) ?></div>
                </td>
                <td style="padding: 12px 10px; font-weight: 600; color: #2563eb;"><?= htmlspecialchars($q['type']) ?></td>
                <td style="padding: 12px 10px; max-width: 250px; font-size: 12px; color: #475569;">
                  <?= htmlspecialchars($q['itemsSummary']) ?>
                </td>
                <td style="padding: 12px 10px;">
                  <span style="padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; background: #fef3c7; color: #b45309;">
                    <?= htmlspecialchars($q['status']) ?>
                  </span>
                </td>
                <td style="padding: 12px 10px; text-align: right;">
                  <a href="<?= $waLink ?>" target="_blank" style="padding: 6px 12px; background: #22c55e; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">
                    💬 Send Quote
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
