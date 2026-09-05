<?php
require_once __DIR__ . '/includes/functions.php';

$db = getDB();
$categories = $db->query('SELECT * FROM "Category" ORDER BY name ASC')->fetchAll();
$brands = $db->query('SELECT * FROM "Brand" ORDER BY name ASC')->fetchAll();

// Get active category filter
$activeCategory = trim($_GET['category'] ?? 'laptops');

// Query products matching category or all
$query = 'SELECT p.*, c.name as categoryName, b.name as brandName, (SELECT url FROM "ProductImage" WHERE productId = p.id ORDER BY "order" ASC LIMIT 1) as mainImage FROM "Product" p JOIN "Category" c ON p.categoryId = c.id LEFT JOIN "Brand" b ON p.brandId = b.id WHERE 1=1';
$params = [];

if ($activeCategory && $activeCategory !== 'all') {
    $query .= ' AND (c.slug = ? OR lower(c.name) LIKE ?)';
    $params[] = $activeCategory;
    $params[] = '%' . strtolower($activeCategory) . '%';
}

$query .= ' ORDER BY p.isFeatured DESC, p.price DESC';
$stmt = $db->prepare($query);
$stmt->execute($params);
$products = $stmt->fetchAll();

$pageTitle = 'Explore Tech Hardware Devices - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="devices-hub-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1320px; margin: 0 auto; padding: 0 16px;">
    
    <!-- Hero Banner -->
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 16px; padding: 36px; color: white; margin-bottom: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(59,130,246,0.2); border-radius: 20px; font-size: 12px; font-weight: 700; color: #60a5fa; margin-bottom: 12px;">DEVICES HUB</span>
      <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px;">Explore All Hardware & Electronics</h1>
      <p style="color: #94a3b8; font-size: 15px; margin: 0; max-width: 650px;">From high-performance business laptops to CCTV security surveillance kits and all-in-one desktop computers.</p>
    </div>

    <!-- Category Pills Navigation -->
    <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 24px;">
      <a href="/devices?category=all" style="padding: 10px 20px; border-radius: 24px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; <?= ($activeCategory === 'all' || !$activeCategory) ? 'background: #2563eb; color: white;' : 'background: white; color: #334155; border: 1px solid #e2e8f0;' ?>">
        All Devices
      </a>
      <a href="/devices?category=laptops" style="padding: 10px 20px; border-radius: 24px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; <?= ($activeCategory === 'laptops') ? 'background: #2563eb; color: white;' : 'background: white; color: #334155; border: 1px solid #e2e8f0;' ?>">
        💻 Laptops & MacBooks
      </a>
      <a href="/devices?category=mobiles" style="padding: 10px 20px; border-radius: 24px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; <?= ($activeCategory === 'mobiles') ? 'background: #2563eb; color: white;' : 'background: white; color: #334155; border: 1px solid #e2e8f0;' ?>">
        📱 Smartphones & Tablets
      </a>
      <a href="/devices?category=cctv" style="padding: 10px 20px; border-radius: 24px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; <?= ($activeCategory === 'cctv') ? 'background: #2563eb; color: white;' : 'background: white; color: #334155; border: 1px solid #e2e8f0;' ?>">
        📹 CCTV & Security Systems
      </a>
      <a href="/devices?category=printers" style="padding: 10px 20px; border-radius: 24px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; <?= ($activeCategory === 'printers') ? 'background: #2563eb; color: white;' : 'background: white; color: #334155; border: 1px solid #e2e8f0;' ?>">
        🖨️ Printers & Scanners
      </a>
    </div>

    <!-- Product Grid -->
    <?php if (empty($products)): ?>
      <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 60px 20px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">📦</div>
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">No devices found in this category</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0 0 20px;">Try browsing our complete hardware catalog or ask for a direct quote.</p>
        <a href="/products" style="padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">Browse Catalog</a>
      </div>
    <?php else: ?>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">
        <?php foreach ($products as $p): ?>
          <div class="product-card" style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <a href="/product-detail?slug=<?= urlencode($p['slug']) ?>" style="display: block; position: relative; padding: 20px; text-align: center; background: #ffffff;">
              <img src="<?= htmlspecialchars($p['mainImage'] ?: '/public/images/tech-sprout-logo.png') ?>" alt="<?= htmlspecialchars($p['name']) ?>" style="width: 100%; height: 180px; object-fit: contain;">
              <?php if ($p['isBestseller']): ?>
                <span style="position: absolute; top: 12px; left: 12px; background: #ea580c; color: white; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Bestseller</span>
              <?php endif; ?>
            </a>

            <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
              <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;"><?= htmlspecialchars($p['brandName'] ?: $p['categoryName']) ?></div>
              <a href="/product-detail?slug=<?= urlencode($p['slug']) ?>" style="font-size: 15px; font-weight: 700; color: #0f172a; text-decoration: none; line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                <?= htmlspecialchars($p['name']) ?>
              </a>

              <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-size: 18px; font-weight: 800; color: #0f172a;"><?= formatPrice($p['price']) ?></div>
                  <?php if (!empty($p['salePrice']) && $p['salePrice'] > $p['price']): ?>
                    <div style="font-size: 12px; color: #94a3b8; text-decoration: line-through;"><?= formatPrice($p['salePrice']) ?></div>
                  <?php endif; ?>
                </div>

                <button onclick="addToCart('<?= $p['id'] ?>', '<?= addslashes($p['name']) ?>', <?= $p['price'] ?>, '<?= addslashes($p['mainImage'] ?? '') ?>')" style="padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                  <span>🛒 Add</span>
                </button>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
