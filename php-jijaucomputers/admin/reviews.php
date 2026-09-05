<?php
$pageTitle = 'Customer Reviews Moderation';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $id = $_POST['id'] ?? '';

    if ($action === 'approve') {
        $stmt = $db->prepare('UPDATE "Review" SET isApproved = 1 WHERE id = ?');
        $stmt->execute([$id]);
        $message = 'Review approved and published.';
    } else if ($action === 'delete') {
        $stmt = $db->prepare('DELETE FROM "Review" WHERE id = ?');
        $stmt->execute([$id]);
        $message = 'Review removed.';
    }
}

$reviews = $db->query('SELECT r.*, p.name as productName FROM "Review" r JOIN "Product" p ON r.productId = p.id ORDER BY r.createdAt DESC')->fetchAll();
?>

<div>
  <?php if ($message): ?>
    <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ✓ <?= $message ?>
    </div>
  <?php endif; ?>

  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Product Reviews (<?= count($reviews) ?>)</h2>

    <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
      <thead>
        <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
          <th style="padding: 12px 10px;">PRODUCT</th>
          <th style="padding: 12px 10px;">CUSTOMER</th>
          <th style="padding: 12px 10px;">RATING</th>
          <th style="padding: 12px 10px;">REVIEW DETAILS</th>
          <th style="padding: 12px 10px;">STATUS</th>
          <th style="padding: 12px 10px; text-align: right;">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($reviews)): ?>
          <tr><td colspan="6" style="padding: 32px; text-align: center; color: #94a3b8;">No customer reviews submitted yet.</td></tr>
        <?php else: ?>
          <?php foreach ($reviews as $rev): ?>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 10px; font-weight: 700; color: #0f172a; max-width: 180px;"><?= htmlspecialchars($rev['productName']) ?></td>
              <td style="padding: 12px 10px;">
                <div style="font-weight: 600;"><?= htmlspecialchars($rev['customerName']) ?></div>
                <div style="font-size: 11px; color: #64748b;"><?= htmlspecialchars($rev['customerPhone'] ?? '—') ?></div>
              </td>
              <td style="padding: 12px 10px; color: #f59e0b; font-weight: 800;"><?= str_repeat('★', $rev['rating']) ?></td>
              <td style="padding: 12px 10px; max-width: 300px;">
                <div style="font-weight: 700; color: #1e293b;"><?= htmlspecialchars($rev['title']) ?></div>
                <div style="color: #64748b; font-size: 12px; margin-top: 2px;"><?= htmlspecialchars($rev['comment']) ?></div>
              </td>
              <td style="padding: 12px 10px;">
                <span style="padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; background: <?= $rev['isApproved'] ? '#dcfce7; color: #16a34a;' : '#fef3c7; color: #b45309;' ?>">
                  <?= $rev['isApproved'] ? 'Published' : 'Pending' ?>
                </span>
              </td>
              <td style="padding: 12px 10px; text-align: right;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                  <?php if (!$rev['isApproved']): ?>
                    <form method="POST" action="/admin/reviews.php">
                      <input type="hidden" name="action" value="approve">
                      <input type="hidden" name="id" value="<?= htmlspecialchars($rev['id']) ?>">
                      <button type="submit" style="padding: 4px 10px; background: #22c55e; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">Approve</button>
                    </form>
                  <?php endif; ?>
                  <form method="POST" action="/admin/reviews.php" onsubmit="return confirm('Delete review?')">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= htmlspecialchars($rev['id']) ?>">
                    <button type="submit" style="padding: 4px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">Delete</button>
                  </form>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
