<?php
require_once __DIR__ . '/../includes/functions.php';
requireAdmin();

$db = getDB();

// Ensure HappyCustomer table exists
$db->exec('CREATE TABLE IF NOT EXISTS "HappyCustomer" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    village TEXT,
    district TEXT DEFAULT "Pune",
    phone TEXT,
    productName TEXT NOT NULL,
    photoUrl TEXT NOT NULL,
    review TEXT,
    rating INTEGER DEFAULT 5,
    purchaseDate TEXT,
    isFeatured INTEGER DEFAULT 1,
    isActive INTEGER DEFAULT 1,
    "order" INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)');

$msg = '';
$err = '';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create' || $action === 'update') {
        $id = ($action === 'update') ? ($_POST['id'] ?? '') : uniqid('hc_');
        $name = trim($_POST['name'] ?? '');
        $city = trim($_POST['city'] ?? '');
        $village = trim($_POST['village'] ?? '');
        $district = trim($_POST['district'] ?? 'Pune');
        $phone = trim($_POST['phone'] ?? '');
        $productName = trim($_POST['productName'] ?? '');
        $photoUrl = trim($_POST['photoUrl'] ?? '');
        $review = trim($_POST['review'] ?? '');
        $rating = (int)($_POST['rating'] ?? 5);
        $purchaseDate = trim($_POST['purchaseDate'] ?? date('M Y'));
        $isActive = isset($_POST['isActive']) ? 1 : 0;
        $isFeatured = isset($_POST['isFeatured']) ? 1 : 0;

        // Handle Image Upload if provided
        if (!empty($_FILES['photoFile']['name']) && $_FILES['photoFile']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../public/uploads/products/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $ext = pathinfo($_FILES['photoFile']['name'], PATHINFO_EXTENSION);
            $filename = 'customer_' . time() . '_' . rand(100, 999) . '.' . $ext;
            if (move_uploaded_file($_FILES['photoFile']['tmp_name'], $uploadDir . $filename)) {
                $photoUrl = '/public/uploads/products/' . $filename;
            }
        }

        if ($name && $city && $productName && $photoUrl) {
            if ($action === 'create') {
                $stmt = $db->prepare('INSERT INTO "HappyCustomer" (id, name, city, village, district, phone, productName, photoUrl, review, rating, purchaseDate, isFeatured, isActive, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
                $stmt->execute([$id, $name, $city, $village, $district, $phone, $productName, $photoUrl, $review, $rating, $purchaseDate, $isFeatured, $isActive]);
                $msg = "Happy Customer story for '{$name}' created successfully!";
            } else {
                $stmt = $db->prepare('UPDATE "HappyCustomer" SET name = ?, city = ?, village = ?, district = ?, phone = ?, productName = ?, photoUrl = ?, review = ?, rating = ?, purchaseDate = ?, isFeatured = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
                $stmt->execute([$name, $city, $village, $district, $phone, $productName, $photoUrl, $review, $rating, $purchaseDate, $isFeatured, $isActive, $id]);
                $msg = "Happy Customer story updated successfully!";
            }
        } else {
            $err = "Customer name, city, product name, and photo URL are required.";
        }
    } elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        if ($id) {
            $stmt = $db->prepare('DELETE FROM "HappyCustomer" WHERE id = ?');
            $stmt->execute([$id]);
            $msg = "Customer story deleted successfully.";
        }
    } elseif ($action === 'toggle_active') {
        $id = $_POST['id'] ?? '';
        $current = (int)($_POST['current'] ?? 0);
        $new = $current ? 0 : 1;
        $stmt = $db->prepare('UPDATE "HappyCustomer" SET isActive = ? WHERE id = ?');
        $stmt->execute([$new, $id]);
        $msg = "Visibility updated.";
    }
}

// Fetch all customers
$customers = $db->query('SELECT * FROM "HappyCustomer" ORDER BY createdAt DESC')->fetchAll();

// Edit target if requested
$editTarget = null;
if (!empty($_GET['edit'])) {
    $stmt = $db->prepare('SELECT * FROM "HappyCustomer" WHERE id = ?');
    $stmt->execute([$_GET['edit']]);
    $editTarget = $stmt->fetch();
}

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: flex; min-height: 100vh;">
  <?php require_once __DIR__ . '/includes/sidebar.php'; ?>

  <main style="flex: 1; padding: 28px; background: #0b0f19; color: #f8fafc;">
    <div style="max-width: 1200px; margin: 0 auto;">
      
      <!-- Top Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0 0 4px;">🤝 Happy Customers Management</h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">Upload customer delivery photos, city & district tags, and testimonials.</p>
        </div>
        <a href="#customer-form" style="padding: 10px 18px; background: #2563eb; color: white; border-radius: 8px; font-weight: 800; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <span>+</span> Add Happy Customer
        </a>
      </div>

      <?php if ($msg): ?>
        <div style="background: #064e3b; border: 1px solid #059669; color: #34d399; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 700; font-size: 13px;">
          <?= htmlspecialchars($msg) ?>
        </div>
      <?php endif; ?>

      <?php if ($err): ?>
        <div style="background: #881337; border: 1px solid #be123c; color: #fda4af; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 700; font-size: 13px;">
          <?= htmlspecialchars($err) ?>
        </div>
      <?php endif; ?>

      <!-- Form Section -->
      <div id="customer-form" style="background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 30px;">
        <h3 style="font-size: 16px; font-weight: 900; color: #ffffff; margin: 0 0 18px;">
          <?= $editTarget ? 'Edit Customer Story' : 'Add New Customer Delivery Photo' ?>
        </h3>

        <form action="/admin/happy-customers.php" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 16px;">
          <input type="hidden" name="action" value="<?= $editTarget ? 'update' : 'create' ?>">
          <?php if ($editTarget): ?>
            <input type="hidden" name="id" value="<?= htmlspecialchars($editTarget['id']) ?>">
          <?php endif; ?>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Customer Full Name *</label>
              <input type="text" name="name" required value="<?= htmlspecialchars($editTarget['name'] ?? '') ?>" placeholder="e.g. Rahul Patil" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Mobile Number (Optional)</label>
              <input type="text" name="phone" value="<?= htmlspecialchars($editTarget['phone'] ?? '') ?>" placeholder="+91 98765 43210" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">District *</label>
              <select name="district" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
                <?php
                $distList = ['Pune', 'Satara', 'Ahmednagar', 'Solapur', 'Kolhapur', 'Nashik', 'Sangli', 'Thane', 'Mumbai', 'Other'];
                $selDist = $editTarget['district'] ?? 'Pune';
                foreach ($distList as $d): ?>
                  <option value="<?= $d ?>" <?= $selDist === $d ? 'selected' : '' ?>><?= $d ?></option>
                <?php endforeach; ?>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">City / Town *</label>
              <input type="text" name="city" required value="<?= htmlspecialchars($editTarget['city'] ?? '') ?>" placeholder="e.g. Pune / Baramati" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Village / Area</label>
              <input type="text" name="village" value="<?= htmlspecialchars($editTarget['village'] ?? '') ?>" placeholder="e.g. Kothrud / Manchar" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Product Purchased *</label>
            <input type="text" name="productName" required value="<?= htmlspecialchars($editTarget['productName'] ?? '') ?>" placeholder="e.g. Jijau Custom RTX 4080 Super Rig / Apple MacBook Air M3" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Customer Photo URL *</label>
              <input type="url" name="photoUrl" value="<?= htmlspecialchars($editTarget['photoUrl'] ?? '') ?>" placeholder="https://images.unsplash.com/... or upload below" style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Or Upload File</label>
              <input type="file" name="photoFile" accept="image/*" style="width: 100%; padding: 7px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: #94a3b8; font-size: 11px; box-sizing: border-box;">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 4px;">Customer Review / Testimonial</label>
            <textarea name="review" rows="2" placeholder="e.g. Assembled my dream gaming PC with full brand warranty." style="width: 100%; padding: 10px; background: #020617; border: 1px solid #334155; border-radius: 8px; color: white; font-size: 13px; box-sizing: border-box;"><?= htmlspecialchars($editTarget['review'] ?? '') ?></textarea>
          </div>

          <div style="display: flex; gap: 20px; align-items: center;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" name="isActive" value="1" <?= (!isset($editTarget) || $editTarget['isActive']) ? 'checked' : '' ?>>
              Display publicly
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #cbd5e1; cursor: pointer;">
              <input type="checkbox" name="isFeatured" value="1" <?= (!isset($editTarget) || $editTarget['isFeatured']) ? 'checked' : '' ?>>
              Featured on Homepage
            </label>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <button type="submit" style="padding: 10px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer;">
              <?= $editTarget ? 'Update Story' : 'Save Story' ?>
            </button>
            <?php if ($editTarget): ?>
              <a href="/admin/happy-customers.php" style="padding: 10px 18px; background: #334155; color: white; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none;">Cancel</a>
            <?php endif; ?>
          </div>
        </form>
      </div>

      <!-- Customer Stories Table -->
      <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background: #020617; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 14px 16px;">Photo</th>
              <th style="padding: 14px 16px;">Customer</th>
              <th style="padding: 14px 16px;">Location</th>
              <th style="padding: 14px 16px;">Product</th>
              <th style="padding: 14px 16px;">Status</th>
              <th style="padding: 14px 16px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($customers as $c): ?>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 14px 16px;">
                  <img src="<?= htmlspecialchars($c['photoUrl']) ?>" alt="" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
                </td>
                <td style="padding: 14px 16px;">
                  <div style="font-weight: 800; color: #ffffff;"><?= htmlspecialchars($c['name']) ?></div>
                  <?php if ($c['phone']): ?>
                    <div style="font-size: 11px; color: #94a3b8;"><?= htmlspecialchars($c['phone']) ?></div>
                  <?php endif; ?>
                </td>
                <td style="padding: 14px 16px;">
                  <div style="font-weight: 800; color: #fbbf24;">📍 <?= htmlspecialchars($c['city']) ?></div>
                  <div style="font-size: 11px; color: #94a3b8;"><?= htmlspecialchars($c['village'] ? $c['village'] . ', ' : '') ?><?= htmlspecialchars($c['district']) ?></div>
                </td>
                <td style="padding: 14px 16px; max-width: 250px;">
                  <div style="font-weight: 700; color: #cbd5e1;"><?= htmlspecialchars($c['productName']) ?></div>
                  <?php if ($c['review']): ?>
                    <div style="font-size: 11px; color: #64748b; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">"<?= htmlspecialchars($c['review']) ?>"</div>
                  <?php endif; ?>
                </td>
                <td style="padding: 14px 16px;">
                  <form action="/admin/happy-customers.php" method="POST" style="display: inline;">
                    <input type="hidden" name="action" value="toggle_active">
                    <input type="hidden" name="id" value="<?= $c['id'] ?>">
                    <input type="hidden" name="current" value="<?= $c['isActive'] ?>">
                    <button type="submit" style="background: <?= $c['isActive'] ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)' ?>; color: <?= $c['isActive'] ? '#34d399' : '#94a3b8' ?>; border: 1px solid <?= $c['isActive'] ? '#059669' : '#475569' ?>; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; cursor: pointer;">
                      <?= $c['isActive'] ? '✓ Active' : 'Hidden' ?>
                    </button>
                  </form>
                </td>
                <td style="padding: 14px 16px; text-align: right;">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <a href="/admin/happy-customers.php?edit=<?= $c['id'] ?>" style="padding: 6px 12px; background: #1e293b; color: #38bdf8; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">Edit</a>
                    <form action="/admin/happy-customers.php" method="POST" onsubmit="return confirm('Delete this customer story?');" style="display: inline;">
                      <input type="hidden" name="action" value="delete">
                      <input type="hidden" name="id" value="<?= $c['id'] ?>">
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
