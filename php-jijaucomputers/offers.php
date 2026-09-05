<?php
require_once __DIR__ . '/includes/functions.php';

$db = getDB();
$offers = [];
$deals = [];
try {
    $offers = $db->query('SELECT * FROM "Offer" WHERE isActive = 1 ORDER BY createdAt DESC')->fetchAll();
    $deals = $db->query('SELECT p.*, c.name as categoryName, (SELECT url FROM "ProductImage" WHERE productId = p.id ORDER BY "order" ASC LIMIT 1) as mainImage FROM "Product" p JOIN "Category" c ON p.categoryId = c.id WHERE p.salePrice IS NOT NULL AND p.salePrice > p.price LIMIT 8')->fetchAll();
} catch (Exception $e) {}

$pageTitle = 'Exclusive Offers & Deals - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="offers-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1320px; margin: 0 auto; padding: 0 16px;">
    
    <div style="background: linear-gradient(135deg, #ea580c, #c2410c); border-radius: 16px; padding: 40px; color: white; margin-bottom: 40px; text-align: center;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase;">SPECIAL SAVINGS</span>
      <h1 style="font-size: 34px; font-weight: 800; margin: 0 0 10px;">Hot Tech Deals & Festive Discounts</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin: 0 auto; max-width: 600px;">Save big on gaming PC components, MacBooks, business laptops, and certified repair packages.</p>
    </div>

    <!-- Active Promotional Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 48px;">
      <?php if (empty($offers)): ?>
        <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">
          <span style="background: #fee2e2; color: #dc2626; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 800;">LIMITED TIME</span>
          <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 12px 0 8px;">Flat 10% Off On Custom PC Assembly</h3>
          <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">Use code <strong style="color: #ea580c;">JIJAUBUILD</strong> or mention this deal on WhatsApp during quotation.</p>
          <a href="/custom-pc" style="padding: 10px 18px; background: #0f172a; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">Configure Rig →</a>
        </div>
      <?php else: ?>
        <?php foreach ($offers as $offer): ?>
          <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">
            <span style="background: #fee2e2; color: #dc2626; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 800;"><?= htmlspecialchars($offer['badge'] ?? 'HOT OFFER') ?></span>
            <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 12px 0 8px;"><?= htmlspecialchars($offer['title']) ?></h3>
            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;"><?= htmlspecialchars($offer['description']) ?></p>
            <?php if (!empty($offer['couponCode'])): ?>
              <div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 16px; display: inline-block;">
                Coupon: <?= htmlspecialchars($offer['couponCode']) ?>
              </div>
            <?php endif; ?>
            <div>
              <a href="/products" style="padding: 10px 18px; background: #0f172a; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">Shop Deals →</a>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>

    <!-- Discounted Products Section -->
    <?php if (!empty($deals)): ?>
      <div style="margin-top: 40px;">
        <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 20px;">🔥 Top Discounted Products</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">
          <?php foreach ($deals as $p): ?>
            <div class="product-card" style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
              <a href="/product-detail?slug=<?= urlencode($p['slug']) ?>" style="display: block; position: relative; padding: 20px; text-align: center; background: #fff;">
                <img src="<?= htmlspecialchars($p['mainImage'] ?: '/public/images/tech-sprout-logo.png') ?>" alt="" style="width: 100%; height: 180px; object-fit: contain;">
                <span style="position: absolute; top: 12px; left: 12px; background: #dc2626; color: white; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">SAVE <?= round((($p['salePrice'] - $p['price']) / $p['salePrice']) * 100) ?>%</span>
              </a>

              <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
                <a href="/product-detail?slug=<?= urlencode($p['slug']) ?>" style="font-size: 15px; font-weight: 700; color: #0f172a; text-decoration: none; line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  <?= htmlspecialchars($p['name']) ?>
                </a>

                <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-size: 18px; font-weight: 800; color: #0f172a;"><?= formatPrice($p['price']) ?></div>
                    <div style="font-size: 12px; color: #94a3b8; text-decoration: line-through;"><?= formatPrice($p['salePrice']) ?></div>
                  </div>
                  <button onclick="addToCart('<?= $p['id'] ?>', '<?= addslashes($p['name']) ?>', <?= $p['price'] ?>, '<?= addslashes($p['mainImage'] ?? '') ?>')" style="padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
                    🛒 Add
                  </button>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    <?php endif; ?>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
