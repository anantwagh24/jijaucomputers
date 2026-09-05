<?php
require_once __DIR__ . '/includes/functions.php';

$ticketQuery = trim($_GET['ticket'] ?? '');
$db = getDB();
$message = '';
$error = '';

// Handle customer raising a repair request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'book_repair') {
    $customerName = trim($_POST['customerName'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $deviceType = trim($_POST['deviceType'] ?? 'Laptop');
    $brand = trim($_POST['brand'] ?? 'Dell');
    $model = trim($_POST['model'] ?? '');
    $serialNo = trim($_POST['serialNo'] ?? '');
    $issueDesc = trim($_POST['issueDesc'] ?? '');

    if (empty($customerName) || empty($phone) || empty($issueDesc)) {
        $error = 'Customer name, phone, and problem description are required.';
    } else {
        $ticketId = 'JC-SRV-' . rand(1000, 9999);
        $id = 'srv_' . bin2hex(random_bytes(8));
        $now = date('Y-m-d H:i:s');

        $stmt = $db->prepare('INSERT INTO "ServiceRequest" (id, ticketId, customerName, phone, email, deviceType, brand, model, serialNo, issueDesc, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $res = $stmt->execute([$id, $ticketId, $customerName, $phone, $email, $deviceType, $brand, $model, $serialNo, $issueDesc, 'Received', $now, $now]);
        if ($res) {
            $ticketQuery = $ticketId;
            $message = "Repair ticket #{$ticketId} created successfully! You can track live status below.";
        } else {
            $error = 'Failed to submit repair ticket.';
        }
    }
}

$order = null;
$orderItems = [];
$service = null;
$phoneResults = [];

if ($ticketQuery) {
    if (str_starts_with($ticketQuery, 'JC-ORD-')) {
        $stmt = $db->prepare('SELECT * FROM "Order" WHERE orderNumber = ?');
        $stmt->execute([$ticketQuery]);
        $order = $stmt->fetch();

        if ($order) {
            $itemStmt = $db->prepare('SELECT * FROM "OrderItem" WHERE orderId = ?');
            $itemStmt->execute([$order['id']]);
            $orderItems = $itemStmt->fetchAll();
        }
    } elseif (str_starts_with($ticketQuery, 'JC-SRV-')) {
        $stmt = $db->prepare('SELECT * FROM "ServiceRequest" WHERE ticketId = ?');
        $stmt->execute([$ticketQuery]);
        $service = $stmt->fetch();
    } else {
        // Search by phone or general string
        $cleanQ = preg_replace('/[^0-9]/', '', $ticketQuery);
        if ($cleanQ && strlen($cleanQ) >= 4) {
            $srvStmt = $db->prepare('SELECT * FROM "ServiceRequest" WHERE phone LIKE ? OR ticketId LIKE ? ORDER BY createdAt DESC');
            $srvStmt->execute(['%' . $cleanQ . '%', '%' . $ticketQuery . '%']);
            $service = $srvStmt->fetch();

            $ordStmt = $db->prepare('SELECT * FROM "Order" WHERE phone LIKE ? OR orderNumber LIKE ? ORDER BY createdAt DESC');
            $ordStmt->execute(['%' . $cleanQ . '%', '%' . $ticketQuery . '%']);
            $order = $ordStmt->fetch();
            if ($order) {
                $itemStmt = $db->prepare('SELECT * FROM "OrderItem" WHERE orderId = ?');
                $itemStmt->execute([$order['id']]);
                $orderItems = $itemStmt->fetchAll();
            }
        }
    }
}

$pageTitle = 'Live Order & Repair Tracker - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="tracker-page" style="padding: 40px 0 60px; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 16px;">
    
    <?php if ($message): ?>
      <div style="background: #dcfce7; border: 1.5px solid #86efac; color: #166534; padding: 14px 18px; border-radius: 12px; margin-bottom: 24px; font-weight: 700; text-align: center;">
        ✓ <?= $message ?>
      </div>
    <?php endif; ?>

    <?php if ($error): ?>
      <div style="background: #fee2e2; border: 1.5px solid #f87171; color: #991b1b; padding: 14px 18px; border-radius: 12px; margin-bottom: 24px; font-weight: 700; text-align: center;">
        ⚠️ <?= $error ?>
      </div>
    <?php endif; ?>

    <!-- Search Box Card -->
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 32px;">
      <div style="text-align: center; max-width: 600px; margin: 0 auto 24px;">
        <span style="display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #059669; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 8px;">REAL-TIME DIAGNOSTICS</span>
        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Live Order & Service Ticket Tracker</h1>
        <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">Enter your 10-digit mobile number, Order # (e.g. <code>JC-ORD-...</code>), or Repair Ticket ID to view live progress.</p>
        
        <div>
          <button type="button" onclick="document.getElementById('bookRepairModal').style.display='flex'" style="padding: 10px 20px; background: linear-gradient(135deg, #059669, #047857); color: white; border: none; border-radius: 20px; font-weight: 800; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
            <span>🔧 + Book a Repair / Check-in Device</span>
          </button>
        </div>
      </div>

      <form method="GET" action="/track-service" style="display: flex; gap: 12px; max-width: 600px; margin: 0 auto;">
        <input type="text" name="ticket" required placeholder="Enter 10-digit mobile, Order #, or Ticket ID..." value="<?= htmlspecialchars($ticketQuery) ?>" style="flex: 1; padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 15px; outline: none; font-family: monospace; font-weight: 600;">
        <button type="submit" style="padding: 14px 28px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 15px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <span>🔍 Track Live</span>
        </button>
      </form>
    </div>

    <?php if ($ticketQuery && !$order && !$service): ?>
      <div style="background: white; border-radius: 16px; border: 1px solid #fee2e2; padding: 40px 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
        <div style="font-size: 40px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #991b1b; margin: 0 0 8px;">No Record Found</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0 0 20px;">We couldn't find any order or repair ticket matching "<strong><?= htmlspecialchars($ticketQuery) ?></strong>".</p>
        <a href="https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '918805607908') ?>?text=Hello%20Jijau%20Computers!%20Please%20help%20me%20track%20my%20ticket%20<?= urlencode($ticketQuery) ?>" target="_blank" style="padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
          <span>💬 Ask on WhatsApp</span>
        </a>
      </div>
    <?php endif; ?>

    <!-- Service Request View -->
    <?php if ($service): ?>
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
          <div>
            <span style="display: inline-block; padding: 3px 10px; background: #fef3c7; color: #b45309; border-radius: 4px; font-size: 11px; font-weight: 800;">SERVICE REPAIR TICKET</span>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 6px 0 2px;"><?= htmlspecialchars($service['ticketId']) ?></h2>
            <div style="font-size: 13px; color: #64748b;"><?= htmlspecialchars($service['brand']) ?> <?= htmlspecialchars($service['model']) ?> (Owner: <?= htmlspecialchars($service['customerName']) ?>)</div>
          </div>

          <a href="/invoice?service=<?= urlencode($service['ticketId']) ?>&print=true" target="_blank" style="padding: 10px 18px; background: #0f172a; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
            <span>📄 Official 1-Page Bill</span>
          </a>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Status:</div>
          <div style="font-weight: 800; color: #059669; font-size: 16px; margin-bottom: 12px;"><?= htmlspecialchars($service['status']) ?></div>

          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Reported Issue:</div>
          <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 12px;"><?= htmlspecialchars($service['issueDesc']) ?></div>
          
          <?php if (!empty($service['adminNotes'])): ?>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Engineer Diagnostic Notes:</div>
            <div style="font-weight: 600; color: #2563eb; font-size: 14px;"><?= htmlspecialchars($service['adminNotes']) ?></div>
          <?php endif; ?>
        </div>

        <?php if (!empty($service['estimatedCost'])): ?>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <span style="font-size: 15px; color: #64748b;">Estimated Repair & Parts Cost:</span>
            <span style="font-size: 20px; font-weight: 800; color: #0f172a;"><?= formatPrice($service['estimatedCost']) ?></span>
          </div>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <!-- Order Details View -->
    <?php if ($order): ?>
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
          <div>
            <span style="display: inline-block; padding: 3px 10px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 11px; font-weight: 800;">HARDWARE ORDER</span>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 6px 0 2px;"><?= htmlspecialchars($order['orderNumber']) ?></h2>
            <div style="font-size: 13px; color: #64748b;">Placed on <?= date('d M Y, h:i A', strtotime($order['createdAt'])) ?> by <?= htmlspecialchars($order['customerName']) ?></div>
          </div>

          <div style="display: flex; gap: 10px;">
            <a href="/invoice?order=<?= urlencode($order['orderNumber']) ?>&print=true" target="_blank" style="padding: 10px 18px; background: #0f172a; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
              <span>📄 1-Page GST Invoice</span>
            </a>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Order Status:</div>
          <div style="font-weight: 800; color: #2563eb; font-size: 15px;"><?= htmlspecialchars($order['status']) ?></div>
        </div>

        <!-- Order Items -->
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Items in this Order</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <?php foreach ($orderItems as $item): ?>
            <div style="display: flex; justify-content: space-between; font-size: 14px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #f1f5f9;">
              <span style="color: #1e293b; font-weight: 600;"><?= htmlspecialchars($item['name']) ?> × <?= $item['quantity'] ?></span>
              <span style="font-weight: 800; color: #0f172a;"><?= formatPrice($item['price'] * $item['quantity']) ?></span>
            </div>
          <?php endforeach; ?>
        </div>

        <div style="border-top: 2px dashed #cbd5e1; padding-top: 16px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #0f172a;">
          <span>Total Order Value:</span>
          <span style="color: #2563eb;"><?= formatPrice($order['total']) ?></span>
        </div>
      </div>
    <?php endif; ?>

  </div>
</div>

<!-- Modal for Booking a Repair -->
<div id="bookRepairModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 999; align-items: center; justify-content: center; padding: 16px;">
  <div style="background: white; border-radius: 16px; max-width: 550px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a;">🔧 Book Repair / Check-in Device</h3>
      <button onclick="document.getElementById('bookRepairModal').style.display='none'" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <form method="POST" action="/track-service" style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
      <input type="hidden" name="action" value="book_repair">

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Your Full Name *</label>
          <input type="text" name="customerName" required placeholder="e.g. Ramesh Shinde" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Mobile / WhatsApp *</label>
          <input type="tel" name="phone" required placeholder="10-digit number" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Device Category *</label>
          <select name="deviceType" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
            <option value="Laptop">Laptop (Windows / Linux)</option>
            <option value="MacBook">Apple MacBook / iMac</option>
            <option value="Desktop">Desktop / Gaming PC</option>
            <option value="Printer">Printer / Scanner</option>
            <option value="CCTV">CCTV Camera / DVR</option>
            <option value="GPU">GPU / Component</option>
            <option value="Other">Other Device</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Brand *</label>
          <input type="text" name="brand" required placeholder="e.g. Dell / HP / Apple" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Model Name (Optional)</label>
          <input type="text" name="model" placeholder="e.g. Inspiron 15" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Serial No. (Optional)</label>
          <input type="text" name="serialNo" placeholder="e.g. 7XG9B42" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        </div>
      </div>

      <div>
        <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Fault / Issue Description *</label>
        <textarea name="issueDesc" required rows="3" placeholder="Describe the issue (e.g. Display broken, overheating, not booting, liquid damage...)" style="width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;"></textarea>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button type="button" onclick="document.getElementById('bookRepairModal').style.display='none'" style="flex: 1; padding: 12px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Cancel</button>
        <button type="submit" style="flex: 2; padding: 12px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">Submit Repair Request</button>
      </div>
    </form>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
