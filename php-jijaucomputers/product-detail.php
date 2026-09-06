<?php
require_once __DIR__ . '/includes/functions.php';

$slug = trim($_GET['slug'] ?? '');
$db = getDB();

$stmt = $db->prepare('SELECT p.*, c.name as categoryName, c.slug as categorySlug, b.name as brandName, b.slug as brandSlug FROM "Product" p JOIN "Category" c ON p.categoryId = c.id LEFT JOIN "Brand" b ON p.brandId = b.id WHERE p.slug = ? LIMIT 1');
$stmt->execute([$slug]);
$product = $stmt->fetch();

if (!$product) {
    header('Location: /products');
    exit;
}

// Log visitor
logVisitor('/product-detail?slug=' . $product['slug'], $_SERVER['HTTP_REFERER'] ?? '—');

// Fetch product images
$imgStmt = $db->prepare('SELECT * FROM "ProductImage" WHERE productId = ? ORDER BY "order" ASC');
$imgStmt->execute([$product['id']]);
$images = $imgStmt->fetchAll();

if (empty($images)) {
    $images = [['url' => '/public/images/tech-sprout-logo.png']];
}

// Fetch approved reviews
$revStmt = $db->prepare('SELECT * FROM "Review" WHERE productId = ? AND isApproved = 1 ORDER BY createdAt DESC');
$revStmt->execute([$product['id']]);
$reviews = $revStmt->fetchAll();

$avgRating = 5;
$reviewCount = count($reviews);
if ($reviewCount > 0) {
    $avgRating = array_sum(array_column($reviews, 'rating')) / $reviewCount;
}

// Related products
$relStmt = $db->prepare('SELECT p.*, (SELECT url FROM "ProductImage" WHERE productId = p.id ORDER BY "order" ASC LIMIT 1) as mainImage FROM "Product" p WHERE p.categoryId = ? AND p.id != ? LIMIT 4');
$relStmt->execute([$product['categoryId'], $product['id']]);
$relatedProducts = $relStmt->fetchAll();

$specs = [];
if (!empty($product['specsJson'])) {
    $specs = json_decode($product['specsJson'], true) ?: [];
}

$pageTitle = $product['name'] . ' - Price & Specs | ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';

// Prepare WhatsApp Link
$waMsg = "Hello Jijau Computers! I am interested in buying: *" . $product['name'] . "* priced at " . formatPrice($product['price']) . ". Please confirm availability and delivery.";
$waUrl = generateWhatsAppUrl($storeSettings['whatsapp'] ?? '919876543210', $waMsg);
?>

<div class="product-detail-page" style="padding: 32px 0 60px; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1320px; margin: 0 auto; padding: 0 16px;">
    
    <!-- Breadcrumb -->
    <div style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
      <a href="/" style="color: #64748b; text-decoration: none;">Home</a> / 
      <a href="/products" style="color: #64748b; text-decoration: none;">Products</a> / 
      <a href="/products?category=<?= urlencode($product['categorySlug']) ?>" style="color: #64748b; text-decoration: none;"><?= htmlspecialchars($product['categoryName']) ?></a> / 
      <span style="color: #0f172a; font-weight: 700;"><?= htmlspecialchars($product['name']) ?></span>
    </div>

    <!-- Product Top Section: Images + Buy Box -->
    <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); margin-bottom: 40px;">
      
      <!-- Gallery Column -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; text-align: center; position: relative; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center;">
          <img id="main-product-img" src="<?= htmlspecialchars($images[0]['url']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          <?php if ($product['isBestseller']): ?>
            <span style="position: absolute; top: 16px; left: 16px; background: #ea580c; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; text-transform: uppercase;">Bestseller</span>
          <?php endif; ?>
        </div>

        <?php if (count($images) > 1): ?>
          <div style="display: flex; gap: 12px; overflow-x: auto;">
            <?php foreach ($images as $idx => $img): ?>
              <button onclick="document.getElementById('main-product-img').src='<?= htmlspecialchars($img['url']) ?>'" style="width: 70px; height: 70px; border: 2px solid <?= $idx === 0 ? '#2563eb' : '#e2e8f0' ?>; border-radius: 8px; background: white; padding: 4px; cursor: pointer; flex-shrink: 0;">
                <img src="<?= htmlspecialchars($img['url']) ?>" alt="" style="width: 100%; height: 100%; object-fit: contain;">
              </button>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <!-- Info & Buy Column -->
      <div style="display: flex; flex-direction: column;">
        <div style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 6px;">
          <?= htmlspecialchars($product['brandName'] ?: $product['categoryName']) ?>
        </div>

        <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 12px; line-height: 1.3;">
          <?= htmlspecialchars($product['name']) ?>
        </h1>

        <!-- Rating & Stock Badge -->
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 4px; background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 700;">
            <span>★</span> <?= number_format($avgRating, 1) ?> (<?= $reviewCount ?> Reviews)
          </div>
          <div style="font-size: 13px; font-weight: 700; color: <?= $product['inStock'] ? '#16a34a' : '#dc2626' ?>;">
            <?= $product['inStock'] ? '✓ In Stock Ready for Dispatch' : '✕ Out of Stock' ?>
          </div>
        </div>

        <!-- Price Card -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; align-items: baseline; gap: 12px;">
            <div style="font-size: 32px; font-weight: 900; color: #0f172a;"><?= formatPrice($product['price']) ?></div>
            <?php if (!empty($product['salePrice']) && $product['salePrice'] > $product['price']): ?>
              <div style="font-size: 16px; color: #94a3b8; text-decoration: line-through;"><?= formatPrice($product['salePrice']) ?></div>
              <div style="background: #dc2626; color: white; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">SAVE <?= round((($product['salePrice'] - $product['price']) / $product['salePrice']) * 100) ?>%</div>
            <?php endif; ?>
          </div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Price is inclusive of 18% GST with official tax invoice & warranty.</div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button onclick="addToCart('<?= $product['id'] ?>', '<?= addslashes($product['name']) ?>', <?= $product['price'] ?>, '<?= addslashes($images[0]['url']) ?>')" style="padding: 14px; background: #eff6ff; color: #2563eb; border: 2px solid #2563eb; border-radius: 8px; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>🛒 Add to Cart</span>
            </button>
            
            <button onclick="addToCart('<?= $product['id'] ?>', '<?= addslashes($product['name']) ?>', <?= $product['price'] ?>, '<?= addslashes($images[0]['url']) ?>'); window.location.href='/checkout';" style="padding: 14px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>⚡ Buy Now</span>
            </button>
          </div>

          <a href="<?= $waUrl ?>" target="_blank" style="padding: 14px; background: #22c55e; color: white; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(34,197,94,0.3);">
            <span>💬 Direct WhatsApp Order & Consultation</span>
          </a>
        </div>

        <!-- Trust Badges -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #475569;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> <?= htmlspecialchars($product['warranty'] ?? '1 Year Brand Warranty') ?>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>📄</span> Instant 1-Page GST Tax Invoice
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>📍</span> Fast Store Pickup & Express Delivery
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>🔄</span> 7 Days Replacement Support
          </div>
        </div>

      </div>

    </div>

    <!-- Details Tabs: Description, Specs, Reviews -->
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); margin-bottom: 40px;">
      
      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
        Product Overview & Specifications
      </h2>

      <div style="color: #475569; font-size: 14px; line-height: 1.7; margin-bottom: 28px; white-space: pre-line;">
        <?= htmlspecialchars($product['description']) ?>
      </div>

      <?php if (!empty($specs)): ?>
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 24px 0 12px;">Technical Specifications</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 32px;">
          <?php foreach ($specs as $key => $val): ?>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-weight: 700; color: #334155; width: 220px; background: #f8fafc;"><?= htmlspecialchars($key) ?></td>
              <td style="padding: 10px 12px; color: #0f172a;"><?= htmlspecialchars(is_array($val) ? json_encode($val) : $val) ?></td>
            </tr>
          <?php endforeach; ?>
        </table>
      <?php endif; ?>

      <!-- Verified Customer Reviews Section -->
      <div style="border-top: 2px solid #f1f5f9; padding-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">
            Customer Reviews (<?= $reviewCount ?>)
          </h3>
          <button onclick="document.getElementById('review-form-box').scrollIntoView({behavior:'smooth'})" style="padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
            Write a Review
          </button>
        </div>

        <?php if (empty($reviews)): ?>
          <p style="color: #64748b; font-size: 14px; font-style: italic;">No reviews yet. Be the first verified customer to leave a review!</p>
        <?php else: ?>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
            <?php foreach ($reviews as $rev): ?>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 14px; color: #0f172a;"><?= htmlspecialchars($rev['customerName']) ?></span>
                    <?php if ($rev['isVerifiedBuyer']): ?>
                      <span style="background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">VERIFIED BUYER</span>
                    <?php endif; ?>
                  </div>
                  <span style="color: #f59e0b; font-weight: 800; font-size: 14px;"><?= str_repeat('★', $rev['rating']) ?></span>
                </div>
                <div style="font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 4px;"><?= htmlspecialchars($rev['title']) ?></div>
                <div style="font-size: 13px; color: #64748b; line-height: 1.5;"><?= htmlspecialchars($rev['comment']) ?></div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <!-- Submit Review Box -->
        <div id="review-form-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; max-width: 600px;">
          <h4 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Leave Your Review</h4>
          
          <form onsubmit="submitReview(event, '<?= $product['id'] ?>')" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <input type="text" name="customerName" required placeholder="Your Name *" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
              <input type="tel" name="customerPhone" placeholder="Phone Number (Optional)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <label style="font-size: 13px; font-weight: 600; color: #334155;">Rating:</label>
              <select name="rating" style="padding: 8px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                <option value="5">★★★★★ (5 - Excellent)</option>
                <option value="4">★★★★☆ (4 - Very Good)</option>
                <option value="3">★★★☆☆ (3 - Good)</option>
                <option value="2">★★☆☆☆ (2 - Average)</option>
                <option value="1">★☆☆☆☆ (1 - Poor)</option>
              </select>
            </div>

            <input type="text" name="title" required placeholder="Review Title (e.g. Blazing fast performance!)" style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
            <textarea name="comment" required rows="3" placeholder="Share your experience with this product..." style="padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>

            <button type="submit" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer; align-self: flex-start;">
              Submit Review
            </button>
          </form>
        </div>

      </div>

    </div>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
