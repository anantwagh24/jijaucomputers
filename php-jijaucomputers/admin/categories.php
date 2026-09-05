<?php
$pageTitle = 'Categories & Brands';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $now = date('Y-m-d H:i:s');

    if ($action === 'add_category') {
        $name = trim($_POST['name'] ?? '');
        $slug = trim($_POST['slug'] ?? '') ?: strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
        $desc = trim($_POST['description'] ?? '');
        $icon = trim($_POST['icon'] ?? '💻');

        if ($name) {
            $id = 'cat_' . bin2hex(random_bytes(8));
            $stmt = $db->prepare('INSERT INTO "Category" (id, name, slug, description, icon, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$id, $name, $slug, $desc, $icon, $now, $now]);
            $message = 'Category created successfully.';
        }
    } else if ($action === 'add_brand') {
        $name = trim($_POST['name'] ?? '');
        $slug = trim($_POST['slug'] ?? '') ?: strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
        $logo = trim($_POST['logoUrl'] ?? '');

        if ($name) {
            $id = 'brd_' . bin2hex(random_bytes(8));
            $stmt = $db->prepare('INSERT INTO "Brand" (id, name, slug, logoUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([$id, $name, $slug, $logo, $now, $now]);
            $message = 'Brand created successfully.';
        }
    }
}

$categories = $db->query('SELECT c.*, (SELECT COUNT(*) FROM "Product" WHERE categoryId = c.id) as productCount FROM "Category" c ORDER BY name ASC')->fetchAll();
$brands = $db->query('SELECT b.*, (SELECT COUNT(*) FROM "Product" WHERE brandId = b.id) as productCount FROM "Brand" b ORDER BY name ASC')->fetchAll();
?>

<div>
  <?php if ($message): ?>
    <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ✓ <?= $message ?>
    </div>
  <?php endif; ?>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
    
    <!-- Categories Column -->
    <div>
      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">➕ Add New Category</h3>
        <form method="POST" action="/admin/categories.php" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="hidden" name="action" value="add_category">
          <input type="text" name="name" required placeholder="Category Name (e.g. Graphics Cards)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          <input type="text" name="icon" placeholder="Icon / Emoji (e.g. 🎮)" value="💻" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          <textarea name="description" rows="2" placeholder="Short description..." style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
          <button type="submit" style="padding: 10px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer;">Save Category</button>
        </form>
      </div>

      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Active Categories (<?= count($categories) ?>)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b;">
              <th style="padding: 8px;">NAME</th>
              <th style="padding: 8px;">PRODUCTS</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($categories as $c): ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px; font-weight: 700;"><?= htmlspecialchars($c['icon'] ?? '') ?> <?= htmlspecialchars($c['name']) ?></td>
                <td style="padding: 10px; color: #64748b;"><?= $c['productCount'] ?> items</td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Brands Column -->
    <div>
      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">➕ Add New Brand</h3>
        <form method="POST" action="/admin/categories.php" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="hidden" name="action" value="add_brand">
          <input type="text" name="name" required placeholder="Brand Name (e.g. ASUS / NVIDIA)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          <input type="text" name="logoUrl" placeholder="Logo Image URL (Optional)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          <button type="submit" style="padding: 10px; background: #0f172a; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer;">Save Brand</button>
        </form>
      </div>

      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Active Brands (<?= count($brands) ?>)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b;">
              <th style="padding: 8px;">BRAND</th>
              <th style="padding: 8px;">PRODUCTS</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($brands as $b): ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px; font-weight: 700;"><?= htmlspecialchars($b['name']) ?></td>
                <td style="padding: 10px; color: #64748b;"><?= $b['productCount'] ?> items</td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
