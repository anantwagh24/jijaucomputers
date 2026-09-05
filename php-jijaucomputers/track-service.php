<?php
require_once __DIR__ . '/includes/functions.php';

$ticketQuery = trim($_GET['ticket'] ?? '');
$db = getDB();

$order = null;
$orderItems = [];
$service = null;

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
    } else {
        $stmt = $db->prepare('SELECT * FROM "ServiceRequest" WHERE ticketId = ?');
        $stmt->execute([$ticketQuery]);
        $service = $stmt->fetch();
    }
}

$pageTitle = 'Live Order & Repair Tracker - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="tracker-page" style="padding: 40px 0 60px; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 16px;">
    
    <!-- Search Box Card -->
    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 32px;">
      <div style="text-align: center; max-width: 600px; margin: 0 auto 28px;">
        <span style="display: inline-block; padding: 4px 12px; background: #eff6ff; color: #2563eb; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 8px;">REAL-TIME DIAGNOSTICS</span>
        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Live Order & Service Ticket Tracker</h1>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Enter your Order Number (e.g. <code>JC-ORD-20260831-5079</code>) or Repair Ticket ID (e.g. <code>JC-SRV-20260831-4821</code>) to view live progress.</p>
      </div>

      <form method="GET" action="/track-service" style="display: flex; gap: 12px; max-width: 600px; margin: 0 auto;">
        <input type="text" name="ticket" required placeholder="Enter Order Number or Ticket ID..." value="<?= htmlspecialchars($ticketQuery) ?>" style="flex: 1; padding: 14px 18px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 15px; outline: none; font-family: monospace; font-weight: 600;">
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
        <a href="https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>?text=Hello%20Jijau%20Computers!%20Please%20help%20me%20track%20my%20ticket%20<?= urlencode($ticketQuery) ?>" target="_blank" style="padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
          <span>💬 Ask on WhatsApp</span>
        </a>
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

        <!-- Order Milestones Stepper -->
        <?php
        $orderStages = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        $currentStageIdx = array_search($order['status'], $orderStages);
        if ($currentStageIdx === false) $currentStageIdx = 1;
        ?>
        <div style="display: flex; justify-content: space-between; position: relative; margin: 36px 0 40px;">
          <div style="position: absolute; top: 18px; left: 30px; right: 30px; height: 4px; background: #e2e8f0; z-index: 1;"></div>
          <div style="position: absolute; top: 18px; left: 30px; width: <?= ($currentStageIdx / (count($orderStages) - 1)) * 90 ?>%; height: 4px; background: #2563eb; z-index: 2; transition: width 0.5s;"></div>

          <?php foreach ($orderStages as $sIdx => $stage): 
            $isDone = $sIdx <= $currentStageIdx;
          ?>
            <div style="position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; width: 100px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: <?= $isDone ? '#2563eb' : '#ffffff' ?>; border: 3px solid <?= $isDone ? '#2563eb' : '#cbd5e1' ?>; color: <?= $isDone ? '#ffffff' : '#64748b' ?>; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px;">
                <?= $isDone ? '✓' : ($sIdx + 1) ?>
              </div>
              <div style="font-size: 11px; font-weight: 700; color: <?= $isDone ? '#0f172a' : '#94a3b8' ?>; margin-top: 8px; text-align: center; text-transform: capitalize;">
                <?= str_replace('_', ' ', strtolower($stage)) ?>
              </div>
            </div>
          <?php endforeach; ?>
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

    <!-- Service Request View -->
    <?php if ($service): ?>
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
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

        <!-- Service Milestones Stepper -->
        <?php
        $serviceStages = ['Received', 'Diagnosing', 'Parts Arranged', 'In Repair', 'Testing & QA', 'Ready for Pickup', 'Delivered'];
        $curSrvIdx = array_search($service['status'], $serviceStages);
        if ($curSrvIdx === false) $curSrvIdx = 1;
        ?>
        <div style="display: flex; justify-content: space-between; position: relative; margin: 36px 0 40px;">
          <div style="position: absolute; top: 18px; left: 20px; right: 20px; height: 4px; background: #e2e8f0; z-index: 1;"></div>
          <div style="position: absolute; top: 18px; left: 20px; width: <?= ($curSrvIdx / (count($serviceStages) - 1)) * 95 ?>%; height: 4px; background: #10b981; z-index: 2; transition: width 0.5s;"></div>

          <?php foreach ($serviceStages as $sIdx => $stage): 
            $isDone = $sIdx <= $curSrvIdx;
          ?>
            <div style="position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; width: 70px;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: <?= $isDone ? '#10b981' : '#ffffff' ?>; border: 3px solid <?= $isDone ? '#10b981' : '#cbd5e1' ?>; color: <?= $isDone ? '#ffffff' : '#64748b' ?>; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">
                <?= $isDone ? '✓' : ($sIdx + 1) ?>
              </div>
              <div style="font-size: 10px; font-weight: 700; color: <?= $isDone ? '#0f172a' : '#94a3b8' ?>; margin-top: 8px; text-align: center; line-height: 1.2;">
                <?= htmlspecialchars($stage) ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Reported Issue:</div>
          <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-bottom: 12px;"><?= htmlspecialchars($service['issueDesc']) ?></div>
          
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

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
