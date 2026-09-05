<?php
require_once __DIR__ . '/../includes/functions.php';
requireAdmin();

$db = getDB();

$db->exec('CREATE TABLE IF NOT EXISTS "Banner" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    tag TEXT DEFAULT "Special Promotion",
    imageUrl TEXT NOT NULL,
    ctaText TEXT DEFAULT "Explore Now",
    ctaLink TEXT DEFAULT "/products",
    "order" INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)');

$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create' || $action === 'update') {
        $id = ($action === 'update') ? ($_POST['id'] ?? '') : uniqid('b_');
        $title = trim($_POST['title'] ?? '');
        $subtitle = trim($_POST['subtitle'] ?? '');
        $tag = trim($_POST['tag'] ?? 'FEATURED DEAL');
        $imageUrl = trim($_POST['imageUrl'] ?? '');
        $ctaText = trim($_POST['ctaText'] ?? 'Explore Now');
        $ctaLink = trim($_POST['ctaLink'] ?? '/products');
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['isActive']) ? 1 : 0;

        if (!empty($_FILES['imageFile']['name']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../public/uploads/products/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $ext = pathinfo($_FILES['imageFile']['name'], PATHINFO_EXTENSION);
            $filename = 'banner_' . time() . '_' . rand(100, 999) . '.' . $ext;
            if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $uploadDir . $filename)) {
                $imageUrl = '/public/uploads/products/' . $filename;
            }
        }

        if ($title && $imageUrl) {
            if ($action === 'create') {
                $stmt = $db->prepare('INSERT INTO "Banner" (id, title, subtitle, tag, imageUrl, ctaText, ctaLink, "order", isActive, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
                $stmt->execute([$id, $title, $subtitle, $tag, $imageUrl, $ctaText, $ctaLink, $order, $isActive]);
                $msg = "Banner '{$title}' created successfully!";
            } else {
                $stmt = $db->prepare('UPDATE "Banner" SET title = ?, subtitle = ?, tag = ?, imageUrl = ?, ctaText = ?, ctaLink = ?, "order" = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
                $stmt->execute([$title, $subtitle, $tag, $imageUrl, $ctaText, $ctaLink, $order, $isActive, $id]);
                $msg = "Banner updated successfully!";
            }
        } else {
            $err = "Title and Image URL are required.";
        }
    } elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        if ($id) {
            $stmt = $db->prepare('DELETE FROM "Banner" WHERE id = ?');
            $stmt->execute([$id]);
            $msg = "Banner deleted.";
        }
    } elseif ($action === 'toggle_active') {
        $id = $_POST['id'] ?? '';
        $current = (int)($_POST['current'] ?? 0);
        $new = $current ? 0 : 1;
        $stmt = $db->prepare('UPDATE "Banner" SET isActive = ? WHERE id = ?');
        $stmt->execute([$new, $id]);
        $msg = "Banner visibility updated.";
    }
}

$banners = $db->query('SELECT * FROM "Banner" ORDER BY "order" ASC, createdAt DESC')->fetchAll();

$editTarget = null;
if (!empty($_GET['edit'])) {
    $stmt = $db->prepare('SELECT * FROM "Banner" WHERE id = ?');
    $stmt->execute([$_GET['edit']]);
    $editTarget = $stmt->fetch();
}

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: flex; min-height: 100vh;">
  <?php require_once __DIR__ . '/includes/sidebar.php'; ?>

  <main style="flex: 1; padding: 28px; background: #0b0f19; color: #f8fafc;">
    <div style="max-width: 1100px; margin: 0 auto;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0 0 4px;">🖼️ Homepage Banners CMS</h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">Manage carousel slides, click destination URLs, and 1-click active/disabled toggling.</p>
        </div>
        <a href="#banner-form" style="padding: 10px 18px; background: #2563eb; color: white; border-radius: 8px; font-weight: 800; font-size: 13px; text-decoration: none;">+ Add Banner</a>
      </div>

      <?php if ($msg): ?>
        <div style="background: #064e3b; color: #34d399; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 700; font-size: 13px;"><?= htmlspecialchars($msg) ?></div>
      <?php endif; ?>

      <?php if ($err): ?>
        <div style="background: #881337; color: #fda4af; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 700; font-size: 13px;"><?= htmlspecialchars($err) ?></div>
      <?php endif; ?>

      <!-- Form Section -->
      <div id="banner-form" style="background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 30px;">
        <h3 style="font-size: 16px; font-weight: 900; color: #ffffff; margin: 0 0 18px;">
          <?= $editTarget ? 'Edit Hero Banner' : 'Create New Hero Banner' ?>
        </h3>

        <form action="/admin/banners.php" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="hidden" name="action" value="<?= $editTarget ? 'update' : 'create' ?>">
          <?php if ($editTarget): ?>
            <input type="hidden" name="id" value="<?= htmlspecialchars($editTarget['id']) ?>">
          <?php endif; ?>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Banner Title / Heading *</label>
            <input type="text" name="title" required value="<?= htmlspecialchars($editTarget['title'] ?? '') ?>" placeholder="e.g. Our Happy Customers from Your City" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Subtitle / Description</label>
            <input type="text" name="subtitle" value="<?= htmlspecialchars($editTarget['subtitle'] ?? '') ?>" placeholder="e.g. 150+ Custom Rigs & Laptops Delivered Across Maharashtra" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Top Badge / Tag</label>
              <input type="text" name="tag" value="<?= htmlspecialchars($editTarget['tag'] ?? 'FEATURED DEAL') ?>" placeholder="e.g. REAL STORIES" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Display Order #</label>
              <input type="number" name="order" value="<?= htmlspecialchars($editTarget['order'] ?? 0) ?>" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Background Image URL *</label>
              <input type="url" name="imageUrl" value="<?= htmlspecialchars($editTarget['imageUrl'] ?? '') ?>" placeholder="https://images.unsplash.com/... or upload below" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Or Upload File</label>
              <input type="file" name="imageFile" accept="image/*" style="width: 100%; padding: 7px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: #94a3b8; font-size: 11px; box-sizing: border-box;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">CTA Button Text</label>
              <input type="text" name="ctaText" value="<?= htmlspecialchars($editTarget['ctaText'] ?? 'Explore Now') ?>" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Clickable Link Destination *</label>
              <input type="text" name="ctaLink" required value="<?= htmlspecialchars($editTarget['ctaLink'] ?? '/happy-customers') ?>" placeholder="/happy-customers or /custom-pc" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>
          </div>

          <div>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" name="isActive" value="1" <?= (!isset($editTarget) || $editTarget['isActive']) ? 'checked' : '' ?>>
              Active (Show on homepage banner slider)
            </label>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 6px;">
            <button type="submit" style="padding: 10px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer;">
              <?= $editTarget ? 'Update Banner' : 'Save Banner' ?>
            </button>
            <?php if ($editTarget): ?>
              <a href="/admin/banners.php" style="padding: 10px 18px; background: #334155; color: white; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none;">Cancel</a>
            <?php endif; ?>
          </div>
        </form>
      </div>

      <!-- Banners List -->
      <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background: #020617; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 14px 16px;">Preview</th>
              <th style="padding: 14px 16px;">Title & Tag</th>
              <th style="padding: 14px 16px;">Click Destination</th>
              <th style="padding: 14px 16px;">Status</th>
              <th style="padding: 14px 16px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($banners as $b): ?>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 14px 16px;">
                  <img src="<?= htmlspecialchars($b['imageUrl']) ?>" alt="" style="width: 100px; height: 50px; border-radius: 8px; object-fit: cover;">
                </td>
                <td style="padding: 14px 16px;">
                  <div style="font-weight: 800; color: #ffffff;"><?= htmlspecialchars($b['title']) ?></div>
                  <div style="font-size: 11px; color: #fbbf24;"><?= htmlspecialchars($b['tag'] ?? 'PROMOTION') ?> • Order #<?= $b['order'] ?></div>
                </td>
                <td style="padding: 14px 16px;">
                  <div style="font-family: monospace; font-size: 12px; color: #38bdf8;"><?= htmlspecialchars($b['ctaLink'] ?? '/products') ?></div>
                  <div style="font-size: 11px; color: #94a3b8;">CTA: <?= htmlspecialchars($b['ctaText'] ?? 'Explore') ?></div>
                </td>
                <td style="padding: 14px 16px;">
                  <form action="/admin/banners.php" method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="toggle_active">
                    <input type="hidden" name="id" value="<?= $b['id'] ?>">
                    <input type="hidden" name="current" value="<?= $b['isActive'] ?>">
                    <button type="submit" style="background: <?= $b['isActive'] ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)' ?>; color: <?= $b['isActive'] ? '#34d399' : '#94a3b8' ?>; border: 1px solid <?= $b['isActive'] ? '#059669' : '#475569' ?>; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; cursor: pointer;">
                      <?= $b['isActive'] ? '✓ Active' : 'Disabled' ?>
                    </button>
                  </form>
                </td>
                <td style="padding: 14px 16px; text-align: right;">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <a href="/admin/banners.php?edit=<?= $b['id'] ?>" style="padding: 6px 12px; background: #1e293b; color: #38bdf8; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">Edit</a>
                    <form action="/admin/banners.php" method="POST" onsubmit="return confirm('Delete this banner?');" style="display: inline;">
                      <input type="hidden" name="action" value="delete">
                      <input type="hidden" name="id" value="<?= $b['id'] ?>">
                      <button type="submit" style="padding: 6px 12px; background: rgba(225,29,72,0.2); color: #fb7185; border: 1px solid rgba(225,29,72,0.3); border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
