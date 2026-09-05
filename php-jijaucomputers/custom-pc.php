<?php
require_once __DIR__ . '/includes/functions.php';

$db = getDB();

// Fetch components
$categories = [];
$allProducts = [];
try {
    $categories = $db->query('SELECT * FROM "Category" ORDER BY name ASC')->fetchAll();
    $allProducts = $db->query('SELECT * FROM "Product" WHERE inStock = 1 ORDER BY price ASC')->fetchAll();
} catch (Exception $e) {}

$pageTitle = 'Custom PC Builder - Configure Your Dream Gaming & Workstation Rig | ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="pc-builder-page" style="padding: 40px 0; background: #0b0f19; color: #f8fafc; min-height: 85vh;">
  <div class="container" style="max-width: 1320px; margin: 0 auto; padding: 0 16px;">
    
    <!-- Hero Header -->
    <div style="background: linear-gradient(135deg, rgba(37,99,235,0.15), rgba(147,51,234,0.15)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
      <div>
        <span style="display: inline-block; padding: 4px 12px; background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.4); border-radius: 20px; font-size: 12px; font-weight: 700; color: #60a5fa; margin-bottom: 8px;">CUSTOM RIG BUILDER</span>
        <h1 style="font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 8px;">Configure Your Dream PC</h1>
        <p style="color: #94a3b8; margin: 0; max-width: 600px;">Select your components with guaranteed hardware compatibility, real-time power calculation, and instant official GST quote submission.</p>
      </div>

      <div style="display: flex; gap: 16px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 24px; text-align: right;">
        <div>
          <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Estimated Total</div>
          <div id="builder-total-price" style="font-size: 26px; font-weight: 900; color: #38bdf8;">₹0</div>
        </div>
        <div style="border-left: 1px solid rgba(255,255,255,0.1); padding-left: 16px;">
          <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Est. Wattage</div>
          <div id="builder-est-wattage" style="font-size: 26px; font-weight: 900; color: #34d399;">0W</div>
        </div>
      </div>
    </div>

    <!-- Main Grid: Slots on Left, Summary on Right -->
    <div style="display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start;">
      
      <!-- Component Slots -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <?php
        $slots = [
            ['key' => 'cpu', 'name' => 'Processor (CPU)', 'icon' => '⚡', 'desc' => 'Intel Core i5/i7/i9 or AMD Ryzen 5/7/9', 'watts' => 105],
            ['key' => 'motherboard', 'name' => 'Motherboard', 'icon' => '🎛️', 'desc' => 'Chipsets compatible with chosen CPU', 'watts' => 45],
            ['key' => 'gpu', 'name' => 'Graphics Card (GPU)', 'icon' => '🎮', 'desc' => 'NVIDIA GeForce RTX or AMD Radeon', 'watts' => 220],
            ['key' => 'ram', 'name' => 'RAM Memory', 'icon' => '🧠', 'desc' => 'DDR4 / DDR5 High Speed Dual-Channel', 'watts' => 15],
            ['key' => 'storage', 'name' => 'Primary SSD Storage', 'icon' => '💾', 'desc' => 'NVMe M.2 Gen4 Ultra Fast SSD', 'watts' => 10],
            ['key' => 'psu', 'name' => 'Power Supply Unit (PSU)', 'icon' => '🔌', 'desc' => '80+ Bronze/Gold Certified PSU', 'watts' => 0],
            ['key' => 'cabinet', 'name' => 'Cabinet / Case', 'icon' => '🖥️', 'desc' => 'ARGB High-Airflow Tempered Glass Case', 'watts' => 10],
            ['key' => 'cooler', 'name' => 'Cooling System', 'icon' => '❄️', 'desc' => 'AIO Liquid 240/360mm or Tower Air Cooler', 'watts' => 20],
        ];

        foreach ($slots as $slot):
        ?>
          <div class="builder-slot-card" style="background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
              <div style="width: 48px; height: 48px; background: rgba(59,130,246,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                <?= $slot['icon'] ?>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 16px; color: #ffffff;"><?= htmlspecialchars($slot['name']) ?></div>
                <div style="font-size: 13px; color: #94a3b8;"><?= htmlspecialchars($slot['desc']) ?></div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <select class="builder-select" data-slot="<?= $slot['key'] ?>" data-watts="<?= $slot['watts'] ?>" onchange="updatePCBuilder()" style="background: #0f172a; border: 1.5px solid #334155; color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; min-width: 220px; max-width: 320px;">
                <option value="" data-price="0" data-name="None">-- Select <?= htmlspecialchars($slot['name']) ?> --</option>
                <?php foreach ($allProducts as $p): ?>
                  <option value="<?= $p['id'] ?>" data-price="<?= $p['price'] ?>" data-name="<?= htmlspecialchars($p['name']) ?>">
                    <?= htmlspecialchars($p['name']) ?> (<?= formatPrice($p['price']) ?>)
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
        <?php endforeach; ?>

      </div>

      <!-- Rig Summary & Quote Request Box -->
      <div style="background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; position: sticky; top: 100px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
          <span>🛠️</span> Build Summary
        </h3>

        <div id="builder-selected-list" style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; font-size: 13px; border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 16px;">
          <div style="color: #64748b; font-style: italic; text-align: center; padding: 20px 0;">No components selected yet. Pick hardware on the left!</div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; color: #94a3b8; font-size: 14px; margin-bottom: 8px;">
            <span>Estimated Price:</span>
            <span id="summary-price" style="font-weight: 700; color: #38bdf8;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #94a3b8; font-size: 14px; margin-bottom: 8px;">
            <span>18% GST (Included):</span>
            <span id="summary-tax" style="font-weight: 700; color: #ffffff;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #94a3b8; font-size: 14px;">
            <span>Recommended PSU:</span>
            <span id="summary-psu" style="font-weight: 700; color: #34d399;">550W+</span>
          </div>
        </div>

        <!-- Submission Form for Inquiries -->
        <form id="custom-pc-form" onsubmit="submitCustomPC(event)" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" name="customerName" required placeholder="Your Full Name *" style="background: #0f172a; border: 1px solid #334155; color: white; padding: 10px 14px; border-radius: 8px; font-size: 13px;">
          <input type="tel" name="phone" required placeholder="Phone (WhatsApp) *" style="background: #0f172a; border: 1px solid #334155; color: white; padding: 10px 14px; border-radius: 8px; font-size: 13px;">
          <input type="email" name="email" placeholder="Email (for Official PDF Quote)" style="background: #0f172a; border: 1px solid #334155; color: white; padding: 10px 14px; border-radius: 8px; font-size: 13px;">
          
          <button type="submit" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px;">
            <span>🚀 Request Official Quote / Build</span>
          </button>
        </form>

        <div style="margin-top: 16px; text-align: center;">
          <a id="builder-whatsapp-btn" href="#" target="_blank" style="color: #22c55e; font-weight: 700; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <span>💬 Or WhatsApp this build to Engineer</span>
          </a>
        </div>
      </div>

    </div>

  </div>
</div>

<script>
function updatePCBuilder() {
  const selects = document.querySelectorAll('.builder-select');
  let totalPrice = 0;
  let totalWatts = 0;
  const selectedItems = [];

  selects.forEach(sel => {
    const opt = sel.options[sel.selectedIndex];
    const price = parseFloat(opt.getAttribute('data-price') || 0);
    const name = opt.getAttribute('data-name');
    const watts = parseInt(sel.getAttribute('data-watts') || 0);

    if (sel.value && price > 0) {
      totalPrice += price;
      totalWatts += watts;
      selectedItems.push({
        slot: sel.getAttribute('data-slot'),
        name: name,
        price: price
      });
    }
  });

  const tax = Math.round(totalPrice * 0.18);
  const psuRec = (totalWatts + 150 < 450) ? 550 : (totalWatts + 250);

  document.getElementById('builder-total-price').innerText = '₹' + totalPrice.toLocaleString('en-IN');
  document.getElementById('summary-price').innerText = '₹' + totalPrice.toLocaleString('en-IN');
  document.getElementById('summary-tax').innerText = '₹' + tax.toLocaleString('en-IN');
  document.getElementById('builder-est-wattage').innerText = totalWatts + 'W';
  document.getElementById('summary-psu').innerText = psuRec + 'W+';

  const listContainer = document.getElementById('builder-selected-list');
  if (selectedItems.length === 0) {
    listContainer.innerHTML = '<div style="color: #64748b; font-style: italic; text-align: center; padding: 20px 0;">No components selected yet. Pick hardware on the left!</div>';
  } else {
    listContainer.innerHTML = selectedItems.map(item => `
      <div style="display: flex; justify-content: space-between; gap: 8px;">
        <span style="color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;">• ${item.name}</span>
        <span style="color: #38bdf8; font-weight: 700;">₹${item.price.toLocaleString('en-IN')}</span>
      </div>
    `).join('');
  }

  const waMsg = `Hello Jijau Computers! I configured a custom PC build on your website with total price ₹${totalPrice.toLocaleString('en-IN')}. Please review and send quote.`;
  document.getElementById('builder-whatsapp-btn').href = `https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>?text=${encodeURIComponent(waMsg)}`;
}

function submitCustomPC(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const payload = {
    customerName: formData.get('customerName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    budget: document.getElementById('builder-total-price').innerText,
    purpose: 'Gaming & Workstation Custom PC',
    notes: 'Configured via interactive web builder'
  };

  fetch('/api/custom-pc.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`🎉 Custom PC request #${data.reqNumber} submitted successfully! Our hardware engineer will contact you shortly.`);
      form.reset();
    } else {
      alert('Error: ' + (data.error || 'Failed to submit quote request.'));
    }
  })
  .catch(err => alert('Network error. Please WhatsApp us directly.'));
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
