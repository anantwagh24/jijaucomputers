<?php
$pageTitle = 'Promotional Offers & Banners';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $now = date('Y-m-d H:i:s');

    if ($action === 'add_offer') {
        $title = trim($_POST['title'] ?? '');
        $badge = trim($_POST['badge'] ?? 'HOT OFFER');
        $desc = trim($_POST['description'] ?? '');
        $coupon = trim($_POST['couponCode'] ?? '');

        if ($title && $desc) {
            $id = 'off_' . bin2hex(random_bytes(8));
            $stmt = $db->prepare('INSERT INTO "Offer" (id, title, badge, description, couponCode, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, ?, ?)');
            $stmt->execute([$id, $title, $badge, $desc, $coupon, $now, $now]);
            $message = 'Offer created successfully.';
        }
    } else if ($action === 'delete_offer') {
        $id = $_POST['id'] ?? '';
        $stmt = $db->prepare('DELETE FROM "Offer" WHERE id = ?');
        $stmt->execute([$id]);
        $message = 'Offer deleted.';
    }
}

$offers = $db->query('SELECT * FROM "Offer" ORDER BY createdAt DESC')->fetchAll();
?>

<div>
  <?php if ($message): ?>
    <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ✓ <?= $message ?>
    </div>
  <?php endif; ?>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
    
    <!-- Add Offer -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">➕ Create Promotional Offer</h3>

      <form method="POST" action="/admin/offers.php" style="display: flex; flex-direction: column; gap: 12px;">
        <input type="hidden" name="action" value="add_offer">
        <input type="text" name="title" required placeholder="Offer Title (e.g. Free NVMe SSD with Custom PC)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        <input type="text" name="badge" placeholder="Badge (e.g. FESTIVE DEAL / LIMITED)" value="FESTIVE DEAL" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        <input type="text" name="couponCode" placeholder="Coupon Code (e.g. DIWALI2026)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        <textarea name="description" required rows="3" placeholder="Offer terms and discount details..." style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
        
        <button type="submit" style="padding: 10px; background: #ea580c; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer;">
          Publish Offer
        </button>
      </form>
    </div>

    <!-- Active Offers List -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Active Offers (<?= count($offers) ?>)</h3>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        <?php if (empty($offers)): ?>
          <p style="color: #64748b; font-size: 13px;">No active promotional offers right now.</p>
        <?php else: ?>
          <?php foreach ($offers as $off): ?>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
              <div>
                <span style="font-size: 10px; font-weight: 800; background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px;"><?= htmlspecialchars($off['badge'] ?? 'OFFER') ?></span>
                <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-top: 4px;"><?= htmlspecialchars($off['title']) ?></div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;"><?= htmlspecialchars($off['description']) ?></div>
                <?php if ($off['couponCode']): ?>
                  <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #ea580c; margin-top: 4px;">CODE: <?= htmlspecialchars($off['couponCode']) ?></div>
                <?php endif; ?>
              </div>

              <form method="POST" action="/admin/offers.php" onsubmit="return confirm('Delete this offer?')">
                <input type="hidden" name="action" value="delete_offer">
                <input type="hidden" name="id" value="<?= htmlspecialchars($off['id']) ?>">
                <button type="submit" style="padding: 4px 8px; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">Delete</button>
              </form>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
