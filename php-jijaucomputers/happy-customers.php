<?php
require_once __DIR__ . '/includes/functions.php';

$db = getDB();
logVisitor('/happy-customers', $_SERVER['HTTP_REFERER'] ?? '—');

// Ensure table exists
try {
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
} catch (Exception $e) {}

$selectedDistrict = $_GET['district'] ?? 'All';
$selectedCity = $_GET['city'] ?? 'All';
$searchQuery = trim($_GET['search'] ?? '');

$sql = 'SELECT * FROM "HappyCustomer" WHERE isActive = 1';
$params = [];

if ($selectedDistrict !== 'All' && $selectedDistrict !== '') {
    $sql .= ' AND district = ?';
    $params[] = $selectedDistrict;
}

if ($selectedCity !== 'All' && $selectedCity !== '') {
    $sql .= ' AND city = ?';
    $params[] = $selectedCity;
}

if ($searchQuery !== '') {
    $sql .= ' AND (name LIKE ? OR city LIKE ? OR village LIKE ? OR district LIKE ? OR productName LIKE ? OR review LIKE ?)';
    $like = "%{$searchQuery}%";
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}

$sql .= ' ORDER BY isFeatured DESC, "order" ASC, createdAt DESC';

$stmt = $db->prepare($sql);
$stmt->execute($params);
$customers = $stmt->fetchAll();

// Get unique districts & cities for filter pills
$allRows = $db->query('SELECT district, city FROM "HappyCustomer" WHERE isActive = 1')->fetchAll();
$districts = array_values(array_unique(array_filter(array_column($allRows, 'district'))));
$cities = array_values(array_unique(array_filter(array_column($allRows, 'city'))));

$pageTitle = 'Our Happy Customers & Real Setups in Maharashtra - Jijau Computers';
require_once __DIR__ . '/includes/header.php';
?>

<main style="background: #f8fafc; padding-bottom: 70px;">
  
  <!-- Hero Section -->
  <section style="background: linear-gradient(135deg, #0f172a, #1e1b4b); color: white; padding: 48px 16px; text-align: center;">
    <div style="max-width: 900px; margin: 0 auto;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); border-radius: 20px; font-size: 11px; font-weight: 800; color: #fbbf24; margin-bottom: 12px;">
        ✨ REAL DELIVERIES & CUSTOMER SMILES
      </span>
      <h1 style="font-size: 32px; font-weight: 900; margin: 0 0 10px; line-height: 1.2;">
        Our Happy Customers from <span style="color: #fbbf24;">Your City</span>
      </h1>
      <p style="color: #cbd5e1; font-size: 14px; max-width: 600px; margin: 0 auto 24px;">
        Explore authentic photos of happy customers who assembled custom gaming rigs, bought laptops, and upgraded tech with Jijau Computers Pune.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 12px;">
          <div style="font-size: 18px; font-weight: 900; color: #fbbf24;">150+</div>
          <div style="font-size: 10px; color: #94a3b8;">Setups Delivered</div>
        </div>
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 12px;">
          <div style="font-size: 18px; font-weight: 900; color: #38bdf8;">100%</div>
          <div style="font-size: 10px; color: #94a3b8;">Brand Warranty</div>
        </div>
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 12px;">
          <div style="font-size: 18px; font-weight: 900; color: #34d399;">5.0 ★</div>
          <div style="font-size: 10px; color: #94a3b8;">Average Rating</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Filter & Search Controls -->
  <section style="max-width: 1320px; margin: -20px auto 0; padding: 0 16px; position: relative; z-index: 10;">
    <div style="background: white; border-radius: 18px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      
      <form action="/happy-customers" method="GET" style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
        <input type="text" name="search" placeholder="Search customer name, city, village, laptop model..." value="<?= htmlspecialchars($searchQuery) ?>" style="flex: 1; min-width: 240px; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 13px; outline: none;">
        <button type="submit" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer;">
          🔍 Search
        </button>
        <?php if ($selectedDistrict !== 'All' || $selectedCity !== 'All' || $searchQuery !== ''): ?>
          <a href="/happy-customers" style="padding: 10px 16px; background: #f1f5f9; color: #475569; border-radius: 10px; font-weight: 700; font-size: 13px; text-decoration: none; display: flex; align-items: center;">
            ✕ Reset
          </a>
        <?php endif; ?>
      </form>

      <!-- District Pills -->
      <div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 10px;">
        <span style="font-size: 11px; font-weight: 800; color: #64748b; white-space: nowrap;">DISTRICT:</span>
        <a href="/happy-customers?district=All&city=All<?= $searchQuery ? '&search=' . urlencode($searchQuery) : '' ?>" style="padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-decoration: none; white-space: nowrap; background: <?= $selectedDistrict === 'All' ? '#2563eb' : '#f1f5f9' ?>; color: <?= $selectedDistrict === 'All' ? '#ffffff' : '#334155' ?>;">
          All Districts
        </a>
        <?php foreach ($districts as $d): ?>
          <a href="/happy-customers?district=<?= urlencode($d) ?>&city=All<?= $searchQuery ? '&search=' . urlencode($searchQuery) : '' ?>" style="padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-decoration: none; white-space: nowrap; background: <?= $selectedDistrict === $d ? '#2563eb' : '#f1f5f9' ?>; color: <?= $selectedDistrict === $d ? '#ffffff' : '#334155' ?>;">
            <?= htmlspecialchars($d) ?>
          </a>
        <?php endforeach; ?>
      </div>

      <!-- City Pills -->
      <div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <span style="font-size: 11px; font-weight: 800; color: #64748b; white-space: nowrap;">CITY:</span>
        <a href="/happy-customers?district=<?= urlencode($selectedDistrict) ?>&city=All<?= $searchQuery ? '&search=' . urlencode($searchQuery) : '' ?>" style="padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-decoration: none; white-space: nowrap; background: <?= $selectedCity === 'All' ? '#f59e0b' : '#f1f5f9' ?>; color: <?= $selectedCity === 'All' ? '#000000' : '#334155' ?>;">
          All Cities
        </a>
        <?php foreach ($cities as $c): ?>
          <a href="/happy-customers?district=<?= urlencode($selectedDistrict) ?>&city=<?= urlencode($c) ?><?= $searchQuery ? '&search=' . urlencode($searchQuery) : '' ?>" style="padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-decoration: none; white-space: nowrap; background: <?= $selectedCity === $c ? '#f59e0b' : '#f1f5f9' ?>; color: <?= $selectedCity === $c ? '#000000' : '#334155' ?>;">
            <?= htmlspecialchars($c) ?>
          </a>
        <?php endforeach; ?>
      </div>

    </div>
  </section>

  <!-- Customer Cards Gallery -->
  <section style="max-width: 1320px; margin: 32px auto 0; padding: 0 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0;">Verified Deliveries (<?= count($customers) ?>)</h2>
      </div>
      <a href="https://wa.me/918805607908?text=Hello%20Jijau%20Computers!%20I%20want%20to%20submit%20my%20customer%20photo." target="_blank" style="padding: 8px 14px; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration: none;">
        💬 Share Your Story
      </a>
    </div>

    <?php if (empty($customers)): ?>
      <div style="background: white; border-radius: 16px; padding: 40px; text-align: center; border: 1px solid #e2e8f0;">
        <div style="font-size: 36px; margin-bottom: 10px;">📸</div>
        <h3 style="font-weight: 800; color: #0f172a;">No Customer Photos Found</h3>
        <p style="color: #64748b; font-size: 13px;">Try clearing search filters.</p>
        <a href="/happy-customers" style="display: inline-block; padding: 8px 18px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 12px; margin-top: 10px;">View All Photos</a>
      </div>
    <?php else: ?>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
        <?php foreach ($customers as $c): ?>
          <div style="background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column;">
            
            <div style="position: relative; width: 100%; height: 240px; background: #020617;">
              <img src="<?= htmlspecialchars($c['photoUrl']) ?>" alt="<?= htmlspecialchars($c['name']) ?>" style="width: 100%; height: 100%; object-fit: cover;">
              
              <div style="position: absolute; top: 12px; left: 12px; background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 4px;">
                <span>📍</span> <?= htmlspecialchars($c['village'] ? $c['village'] . ', ' : '') ?><?= htmlspecialchars($c['city']) ?>
              </div>

              <div style="position: absolute; top: 12px; right: 12px; background: #22c55e; color: white; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
                ✓ Verified
              </div>

              <?php if (!empty($c['purchaseDate'])): ?>
                <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(15,23,42,0.7); color: #cbd5e1; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700;">
                  📅 <?= htmlspecialchars($c['purchaseDate']) ?>
                </div>
              <?php endif; ?>
            </div>

            <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 0;"><?= htmlspecialchars($c['name']) ?></h3>
                  <div style="color: #f59e0b; font-size: 13px;">⭐⭐⭐⭐⭐</div>
                </div>

                <div style="background: #eff6ff; border: 1px solid #dbeafe; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; color: #1e3a8a; margin-bottom: 10px;">
                  💻 <?= htmlspecialchars($c['productName']) ?>
                </div>

                <?php if (!empty($c['review'])): ?>
                  <p style="color: #475569; font-size: 12px; line-height: 1.5; font-style: italic; margin: 0 0 12px;">
                    "<?= htmlspecialchars($c['review']) ?>"
                  </p>
                <?php endif; ?>
              </div>

              <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
                <div>District: <strong style="color: #0f172a;"><?= htmlspecialchars($c['district']) ?></strong></div>
                <div style="color: #2563eb; font-weight: 800;">Jijau Verified Tech</div>
              </div>
            </div>

          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </section>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
