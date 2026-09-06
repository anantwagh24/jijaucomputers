<?php
require_once __DIR__ . '/includes/functions.php';

$db = getDB();

// Log visitor
logVisitor('/', $_SERVER['HTTP_REFERER'] ?? '—');

// Fetch dynamic data from SQLite
$banners = [];
$categories = [];
$brands = [];
$featuredProducts = [];
$allProducts = [];

try {
    $banners = $db->query('SELECT * FROM "Banner" WHERE isActive = 1 ORDER BY "order" ASC')->fetchAll();
    if (empty($banners)) {
        $banners = [
            [
                'id' => 'b-1',
                'title' => 'Mega Laptop Festival 2026',
                'subtitle' => 'Up to ₹25,000 Off on Apple MacBook M3, ASUS ROG, HP OMEN, Lenovo Legion',
                'imageUrl' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1400&auto=format&fit=crop&q=80',
                'ctaLink' => '/products?category=laptops',
                'tag' => 'FEATURED DEAL'
            ],
            [
                'id' => 'b-2',
                'title' => 'Next-Gen Graphics Cards In Stock',
                'subtitle' => 'GeForce RTX 4090, 4080 Super & 4070 Ti Super at Genuine Dealer Prices',
                'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1400&auto=format&fit=crop&q=80',
                'ctaLink' => '/products?category=graphics-cards',
                'tag' => 'HARDWARE DEALS'
            ],
            [
                'id' => 'b-3',
                'title' => 'Jijau Custom Gaming Battlestations',
                'subtitle' => 'Unleash Ultimate Power with Intel 14th Gen & RTX 4080 Super | 3 Yrs Warranty',
                'imageUrl' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80',
                'ctaLink' => '/custom-pc',
                'tag' => 'FLAGSHIP PC BUILDS'
            ]
        ];
    }

    $categories = $db->query('SELECT c.*, (SELECT COUNT(*) FROM "Product" WHERE categoryId = c.id) as productCount FROM "Category" c ORDER BY name ASC')->fetchAll();
    $brands = $db->query('SELECT * FROM "Brand" ORDER BY name ASC')->fetchAll();
    
    $featStmt = $db->query('SELECT p.*, c.name as categoryName, b.name as brandName, (SELECT url FROM "ProductImage" WHERE productId = p.id ORDER BY "order" ASC LIMIT 1) as mainImage FROM "Product" p JOIN "Category" c ON p.categoryId = c.id LEFT JOIN "Brand" b ON p.brandId = b.id WHERE p.inStock = 1 ORDER BY p.isFeatured DESC, p.createdAt DESC LIMIT 8');
    $featuredProducts = $featStmt->fetchAll();
} catch (Exception $e) {}

$pageTitle = 'Jijau Computers - Best Computer & Laptop Store | Custom Gaming PCs & Repairs';
require_once __DIR__ . '/includes/header.php';
?>

<main style="background: #f8fafc; padding-bottom: 60px;">

  <!-- 1. HERO BANNER SLIDER -->
  <section style="max-width: 1320px; margin: 12px auto 0; padding: 0 12px;">
    <div class="hero-slider-wrap" style="position: relative; overflow: hidden; border-radius: 24px; background: #020617; border: 1px solid #1e293b; aspect-ratio: 21/9; min-height: 260px; box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);">
      
      <?php foreach ($banners as $idx => $b): ?>
        <div class="hero-slide" data-index="<?= $idx ?>" style="position: absolute; inset: 0; transition: opacity 0.8s ease-in-out; opacity: <?= $idx === 0 ? '1' : '0' ?>; pointer-events: <?= $idx === 0 ? 'auto' : 'none' ?>; z-index: <?= $idx === 0 ? '10' : '0' ?>;">
          <img src="<?= htmlspecialchars($b['imageUrl']) ?>" alt="<?= htmlspecialchars($b['title']) ?>" style="width: 100%; height: 100%; object-fit: cover; object-position: center; filter: brightness(0.85);">
          
          <!-- Dark gradient overlay -->
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 50%, rgba(2,6,23,0.1) 100%);"></div>

          <!-- Banner Content Overlay -->
          <div class="hero-slide-content" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 32px 36px; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;">
            <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; background: #2563eb; color: white; font-family: monospace; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
              <?= htmlspecialchars($b['tag'] ?? 'FEATURED DEAL') ?>
            </span>
            <h2 class="hero-slide-title" style="font-size: 28px; font-weight: 900; color: #ffffff; line-height: 1.2; margin: 0 0 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); max-width: 750px;">
              <?= htmlspecialchars($b['title']) ?>
            </h2>
            <?php if (!empty($b['subtitle'])): ?>
              <p class="hero-slide-subtitle" style="font-size: 13px; color: #cbd5e1; margin: 0 0 14px; max-width: 600px; line-height: 1.4;">
                <?= htmlspecialchars($b['subtitle']) ?>
              </p>
            <?php endif; ?>
            <a href="<?= htmlspecialchars($b['ctaLink'] ?? '/products') ?>" style="padding: 9px 20px; border-radius: 8px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; text-decoration: none; font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
              <span>Explore Now →</span>
            </a>
          </div>
        </div>
      <?php endforeach; ?>

      <!-- Arrow Controls -->
      <button onclick="prevHeroSlide()" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); z-index: 20; width: 34px; height: 34px; border-radius: 50%; background: rgba(15,23,42,0.7); color: white; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px;">
        ‹
      </button>
      <button onclick="nextHeroSlide()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); z-index: 20; width: 34px; height: 34px; border-radius: 50%; background: rgba(15,23,42,0.7); color: white; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px;">
        ›
      </button>

      <!-- Dots Indicators -->
      <div style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; align-items: center; gap: 6px; background: rgba(2,6,23,0.6); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
        <?php foreach ($banners as $idx => $b): ?>
          <button class="hero-dot" onclick="setHeroSlide(<?= $idx ?>)" style="width: <?= $idx === 0 ? '20px' : '6px' ?>; height: 6px; border-radius: 3px; background: <?= $idx === 0 ? '#38bdf8' : '#64748b' ?>; border: none; cursor: pointer; transition: all 0.3s;"></button>
        <?php endforeach; ?>
      </div>

    </div>
  </section>

  <!-- 2. LAPTOP BRANDS (Exact Horizontal Carousel matching Image 4) -->
  <section style="max-width: 1320px; margin: 28px auto 0; padding: 0 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 32px; height: 32px; background: #f3e8ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px solid #e9d5ff;">
          🛍️
        </div>
        <h2 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 0;">LAPTOP Brands</h2>
      </div>
      <a href="/products?category=laptops" style="font-size: 12px; font-weight: 800; color: #9333ea; text-decoration: none; display: flex; align-items: center; gap: 3px;">
        <span>View All</span> <span>→</span>
      </a>
    </div>

    <!-- Horizontal Scrollable Container (Image 4 match) -->
    <div class="brand-scroll-row">
      <?php
      $laptopBrands = [
          ['name' => 'MacBook', 'slug' => 'apple', 'img' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'HP Laptops', 'slug' => 'hp', 'img' => 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Dell Laptops', 'slug' => 'dell', 'img' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'ASUS Laptops', 'slug' => 'asus', 'img' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Lenovo Laptops', 'slug' => 'lenovo', 'img' => 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Acer Laptops', 'slug' => 'acer', 'img' => 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=80']
      ];
      foreach ($laptopBrands as $lb):
      ?>
        <a href="/products?brand=<?= $lb['slug'] ?>&category=laptops" class="brand-scroll-card">
          <div class="brand-img-wrap">
            <img src="<?= $lb['img'] ?>" alt="<?= htmlspecialchars($lb['name']) ?>">
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;"><?= htmlspecialchars($lb['name']) ?></div>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- 3. MOBILES (Exact Horizontal Carousel matching Image 4) -->
  <section style="max-width: 1320px; margin: 28px auto 0; padding: 0 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 32px; height: 32px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px solid #bfdbfe;">
          📱
        </div>
        <h2 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 0;">Mobiles</h2>
      </div>
      <a href="/devices?category=mobiles" style="font-size: 12px; font-weight: 800; color: #2563eb; text-decoration: none; display: flex; align-items: center; gap: 3px;">
        <span>View All Products</span> <span>→</span>
      </a>
    </div>

    <!-- Horizontal Scrollable Container (Image 4 match) -->
    <div class="brand-scroll-row">
      <?php
      $mobileBrands = [
          ['name' => 'Apple iPhones', 'slug' => 'apple', 'img' => 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Samsung Galaxy', 'slug' => 'samsung', 'img' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'OnePlus', 'slug' => 'oneplus', 'img' => 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Google Pixel', 'slug' => 'google', 'img' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Xiaomi / Redmi', 'slug' => 'xiaomi', 'img' => 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80'],
          ['name' => 'Vivo & Realme', 'slug' => 'vivo', 'img' => 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop&q=80']
      ];
      foreach ($mobileBrands as $mb):
      ?>
        <a href="/devices?category=mobiles" class="brand-scroll-card">
          <div class="brand-img-wrap">
            <img src="<?= $mb['img'] ?>" alt="<?= htmlspecialchars($mb['name']) ?>">
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;"><?= htmlspecialchars($mb['name']) ?></div>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- 4. ASSEMBLE A CUSTOM GAMING RIG CARD -->
  <section style="max-width: 1320px; margin: 32px auto 0; padding: 0 16px;">
    <div style="background: linear-gradient(135deg, #0f172a, #1e1b4b); border: 1px solid #312e81; border-radius: 20px; padding: 28px; color: white; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div>
        <span style="display: inline-block; padding: 3px 8px; background: rgba(99,102,241,0.25); border: 1px solid rgba(99,102,241,0.5); border-radius: 20px; font-size: 10px; font-weight: 800; color: #a5b4fc; margin-bottom: 6px;">CUSTOM PC PART PICKER</span>
        <h2 style="font-size: 22px; font-weight: 900; margin: 0 0 6px;">Assemble Your Dream Gaming & Workstation PC</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; max-width: 620px;">Choose processors, RTX 40-series GPUs, RAM, liquid cooling and tempered glass cabinets with live power wattage calculator & instant official GST quote.</p>
      </div>

      <a href="/custom-pc" style="padding: 12px 24px; background: #f59e0b; color: #000; border-radius: 10px; font-weight: 900; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(245,158,11,0.4);">
        <span>⚙️ Start Custom Build →</span>
      </a>
    </div>
  </section>

  <!-- 4.5. HAPPY CUSTOMERS SOCIAL PROOF BANNER -->
  <section style="max-width: 1320px; margin: 28px auto 0; padding: 0 16px;">
    <div style="background: linear-gradient(135deg, #020617, #1e1b4b); border: 1px solid #3730a3; border-radius: 20px; padding: 28px; color: white; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
      <div style="max-width: 650px;">
        <span style="display: inline-block; padding: 3px 10px; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); border-radius: 20px; font-size: 10px; font-weight: 800; color: #fbbf24; margin-bottom: 6px;">
          ✨ REAL VERIFIED CUSTOMER DELIVERIES
        </span>
        <h2 style="font-size: 22px; font-weight: 900; margin: 0 0 6px;">See Real Customer Builds & <span style="color: #fbbf24;">Deliveries</span></h2>
        <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 12px;">Explore authentic photos of happy customers who assembled custom rigs, laptops, and Apple MacBooks with Jijau Computers.</p>
      </div>

      <a href="/happy-customers" style="padding: 12px 24px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border-radius: 10px; font-weight: 900; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(245,158,11,0.4);">
        <span>📸 Explore Customer Gallery →</span>
      </a>
    </div>
  </section>

  <!-- 5. EXPLORE BY HARDWARE CATEGORY -->
  <section style="max-width: 1320px; margin: 36px auto 0; padding: 0 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <div>
        <span style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">BROWSE CATEGORIES</span>
        <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 2px 0 0;">Explore by Hardware Category</h2>
      </div>
      <a href="/products" style="font-size: 12px; font-weight: 700; color: #2563eb; text-decoration: none;">View All →</a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px;">
      <?php foreach ($categories as $cat): ?>
        <a href="/products?category=<?= urlencode($cat['slug']) ?>" style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 10px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="font-size: 28px; margin-bottom: 6px;"><?= htmlspecialchars($cat['icon'] ?? '💻') ?></div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;"><?= htmlspecialchars($cat['name']) ?></div>
          <div style="font-size: 11px; color: #64748b;"><?= $cat['productCount'] ?> Items</div>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- 6. FEATURED PRODUCTS -->
  <section style="max-width: 1320px; margin: 36px auto 0; padding: 0 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <div>
        <span style="font-size: 10px; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: 0.5px;">IN STOCK READY TO SHIP</span>
        <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 2px 0 0;">Featured Hardware & Components</h2>
      </div>
      <a href="/products" style="font-size: 12px; font-weight: 700; color: #2563eb; text-decoration: none;">View All →</a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
      <?php foreach ($featuredProducts as $p): ?>
        <div class="product-card" style="background: white; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <a href="/product-detail?slug=<?= urlencode($p['slug']) ?>" style="display: block; position: relative; padding: 20px; text-align: center; background: #ffffff;">
            <img src="<?= htmlspecialchars($p['mainImage'] ?: '/public/images/tech-sprout-logo.png') ?>" alt="<?= htmlspecialchars($p['name']) ?>" style="width: 100%; height: 160px; object-fit: contain;">
            <?php if ($p['isBestseller']): ?>
              <span style="position: absolute; top: 10px; left: 10px; background: #ea580c; color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Bestseller</span>
            <?php endif; ?>
          </a>

          <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
            <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
              <?= htmlspecialchars($p['brandName'] ?: $p['categoryName']) ?>
            </div>
            <a href="/product-detail?slug=<?= urlencode($p['slug']) ?>" style="font-size: 13px; font-weight: 700; color: #0f172a; text-decoration: none; line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              <?= htmlspecialchars($p['name']) ?>
            </a>

            <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-size: 16px; font-weight: 900; color: #0f172a;"><?= formatPrice($p['price']) ?></div>
                <?php if (!empty($p['salePrice']) && $p['salePrice'] > $p['price']): ?>
                  <div style="font-size: 11px; color: #94a3b8; text-decoration: line-through;"><?= formatPrice($p['salePrice']) ?></div>
                <?php endif; ?>
              </div>

              <button onclick="addToCart('<?= $p['id'] ?>', '<?= addslashes($p['name']) ?>', <?= $p['price'] ?>, '<?= addslashes($p['mainImage'] ?? '') ?>')" style="padding: 7px 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer;">
                🛒 Add
              </button>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </section>

</main>

<script>
// Hero slider logic
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
let slideInterval = null;

function showSlide(index) {
  if (!slides.length) return;
  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;
  currentSlide = index;

  slides.forEach((s, idx) => {
    if (idx === currentSlide) {
      s.style.opacity = '1';
      s.style.pointerEvents = 'auto';
      s.style.zIndex = '10';
    } else {
      s.style.opacity = '0';
      s.style.pointerEvents = 'none';
      s.style.zIndex = '0';
    }
  });

  dots.forEach((d, idx) => {
    if (idx === currentSlide) {
      d.style.width = '20px';
      d.style.background = '#38bdf8';
    } else {
      d.style.width = '6px';
      d.style.background = '#64748b';
    }
  });
}

function nextHeroSlide() {
  showSlide(currentSlide + 1);
  resetTimer();
}

function prevHeroSlide() {
  showSlide(currentSlide - 1);
  resetTimer();
}

function setHeroSlide(idx) {
  showSlide(idx);
  resetTimer();
}

function resetTimer() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  resetTimer();
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
