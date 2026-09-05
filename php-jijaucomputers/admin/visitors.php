<?php
$pageTitle = 'Real-time Visitor Analytics';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$logs = $db->query('SELECT * FROM "VisitorLog" ORDER BY createdAt DESC LIMIT 100')->fetchAll();
?>

<div>
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">👁️ Live Visitor Feed (Last 100 Hits)</h2>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 10px;">TIME</th>
            <th style="padding: 10px;">IP ADDRESS</th>
            <th style="padding: 10px;">LOCATION</th>
            <th style="padding: 10px;">PAGE</th>
            <th style="padding: 10px;">DEVICE / OS</th>
            <th style="padding: 10px;">BROWSER</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($logs)): ?>
            <tr><td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;">No visitor traffic logged yet.</td></tr>
          <?php else: ?>
            <?php foreach ($logs as $log): ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px; color: #64748b;"><?= date('d M, h:i:s A', strtotime($log['createdAt'])) ?></td>
                <td style="padding: 10px; font-family: monospace; font-weight: 700; color: #0f172a;"><?= htmlspecialchars($log['ip']) ?></td>
                <td style="padding: 10px;"><?= htmlspecialchars($log['location'] ?? 'Pune, India') ?></td>
                <td style="padding: 10px; font-family: monospace; color: #2563eb;"><?= htmlspecialchars($log['page']) ?></td>
                <td style="padding: 10px;"><?= htmlspecialchars($log['device'] ?? 'Desktop') ?> (<?= htmlspecialchars($log['os'] ?? 'Mac') ?>)</td>
                <td style="padding: 10px;"><?= htmlspecialchars($log['browser'] ?? 'Chrome') ?></td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
