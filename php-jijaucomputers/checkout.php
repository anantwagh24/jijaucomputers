<?php
require_once __DIR__ . '/includes/functions.php';

$cart = getCart();
$cartItems = $cart['items'] ?? [];
$summary = getCartSummary();

$error = '';
$successOrder = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($cartItems)) {
    $customerName = trim($_POST['customerName'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $pincode = trim($_POST['pincode'] ?? '');
    $notes = trim($_POST['notes'] ?? '');
    $paymentMode = trim($_POST['paymentMode'] ?? 'UPI_WHATSAPP');
    $upiReference = trim($_POST['upiReference'] ?? '');

    if (empty($customerName) || empty($phone) || empty($address) || empty($city) || empty($pincode)) {
        $error = 'Please fill in all mandatory billing and shipping fields.';
    } elseif (($paymentMode === 'UPI_WHATSAPP' || $paymentMode === 'UPI_ONLINE') && (empty($upiReference) || strlen($upiReference) < 8)) {
        $error = 'Please complete the UPI payment and enter your valid 12-digit UTR / Transaction Reference ID.';
    } else {
        try {
            $db = getDB();
            $orderId = 'ord_' . bin2hex(random_bytes(8));
            $orderNumber = generateOrderNumber();
            $now = date('Y-m-d H:i:s');

            $finalNotes = $notes;
            if (!empty($upiReference)) {
                $finalNotes = '[UPI UTR / Ref: ' . $upiReference . ']' . ($notes ? ' | ' . $notes : '');
            }

            $stmt = $db->prepare('INSERT INTO "Order" (id, orderNumber, customerName, phone, email, address, city, pincode, notes, subtotal, discount, tax, total, paymentMode, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $res = $stmt->execute([
                $orderId,
                $orderNumber,
                $customerName,
                $phone,
                $email,
                $address,
                $city,
                $pincode,
                $finalNotes,
                $summary['subtotal'],
                0,
                $summary['tax'],
                $summary['total'],
                $paymentMode,
                'PENDING',
                $now,
                $now
            ]);

            if ($res) {
                $itemStmt = $db->prepare('INSERT INTO "OrderItem" (id, orderId, productId, name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)');
                foreach ($cartItems as $item) {
                    $itemId = 'oi_' . bin2hex(random_bytes(8));
                    $itemStmt->execute([
                        $itemId,
                        $orderId,
                        $item['id'] ?? null,
                        $item['name'] ?? 'Hardware Item',
                        $item['price'] ?? 0,
                        $item['quantity'] ?? 1
                    ]);
                }

                // Clear Cart
                clearCart();

                // Redirect to success
                header("Location: /order-success?order=" . urlencode($orderNumber) . (!empty($upiReference) ? "&utr=" . urlencode($upiReference) : ""));
                exit;
            } else {
                $error = 'Failed to record your order. Please try again or order via WhatsApp.';
            }
        } catch (Exception $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}

$pageTitle = 'Secure Checkout - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';

$storeUpiId = $storeSettings['upiId'] ?? 'jijauc@ibl';
$storeUpiName = $storeSettings['upiName'] ?? 'Jijau Computers';
$totalAmt = $summary['total'];
$genericUpiUrl = 'upi://pay?pa=' . urlencode($storeUpiId) . '&pn=' . urlencode($storeUpiName) . '&am=' . $totalAmt . '&cu=INR&tn=JijauComputers_Order';
$gpayUrl = 'tez://upi/pay?pa=' . urlencode($storeUpiId) . '&pn=' . urlencode($storeUpiName) . '&am=' . $totalAmt . '&cu=INR&tn=JijauComputers';
$phonepeUrl = 'phonepe://pay?pa=' . urlencode($storeUpiId) . '&pn=' . urlencode($storeUpiName) . '&am=' . $totalAmt . '&cu=INR&tn=JijauComputers';
$paytmUrl = 'paytmmp://pay?pa=' . urlencode($storeUpiId) . '&pn=' . urlencode($storeUpiName) . '&am=' . $totalAmt . '&cu=INR&tn=JijauComputers';
$qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($genericUpiUrl);
?>

<div class="checkout-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
    
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Secure Checkout</h1>
      <p style="color: #64748b; margin: 0;">Complete your delivery details to place your hardware order with instant GST invoice & WhatsApp tracking.</p>
    </div>

    <?php if ($error): ?>
      <div style="background: #fef2f2; border: 1.5px solid #f87171; color: #991b1b; padding: 14px 18px; border-radius: 12px; margin-bottom: 24px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">⚠️</span>
        <div><?= htmlspecialchars($error) ?></div>
      </div>
    <?php endif; ?>

    <?php if (empty($cartItems)): ?>
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 60px 20px; text-align: center; max-width: 600px; margin: 40px auto; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
        <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Your Shopping Cart is Empty</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">Add laptops, gaming rigs, or PC components from our hardware catalog before proceeding to checkout.</p>
        <a href="/products" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
          <span>Explore Products Catalog →</span>
        </a>
      </div>
    <?php else: ?>

      <form method="POST" action="/checkout" id="checkoutForm" style="display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start;">
        
        <!-- Customer Information Card -->
        <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; display: flex; align-items: center; gap: 10px;">
            <span>📍</span> 1. Shipping & Customer Details
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Full Name *</label>
              <input type="text" name="customerName" required placeholder="e.g. Rahul Sharma" value="<?= htmlspecialchars($_POST['customerName'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Phone Number (for WhatsApp Updates) *</label>
              <input type="tel" name="phone" required placeholder="e.g. 9876543210" value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Email Address (for GST Invoice PDF)</label>
            <input type="email" name="email" placeholder="rahul@example.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Delivery Street Address *</label>
            <textarea name="address" required rows="3" placeholder="Flat / House No., Building Name, Street, Landmark" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;"><?= htmlspecialchars($_POST['address'] ?? '') ?></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">City / Town *</label>
              <input type="text" name="city" required placeholder="Enter city or town" value="<?= htmlspecialchars($_POST['city'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">PIN Code *</label>
              <input type="text" name="pincode" required placeholder="e.g. 411001" value="<?= htmlspecialchars($_POST['pincode'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
            </div>
          </div>

          <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 24px 0 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; display: flex; align-items: center; gap: 10px;">
            <span>💳</span> 2. Choose Payment Method
          </h2>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            
            <!-- UPI Option -->
            <label style="display: block; padding: 16px; border: 2px solid #059669; border-radius: 12px; background: #ecfdf5; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="radio" name="paymentMode" id="pm_upi" value="UPI_WHATSAPP" checked onchange="togglePaymentSections()" style="width: 18px; height: 18px;">
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 800; color: #065f46; font-size: 15px;">Instant UPI App (GPay / PhonePe / Paytm / BHIM)</span>
                    <span style="background: #059669; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800;">RECOMMENDED</span>
                  </div>
                  <div style="font-size: 13px; color: #047857; margin-top: 2px;">Pay directly via UPI and enter your 12-digit transaction UTR to verify your order.</div>
                </div>
              </div>

              <!-- UPI Embedded Sub-box -->
              <div id="upiSubSection" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #a7f3d0;">
                <div style="font-size: 12px; font-weight: 700; color: #065f46; margin-bottom: 8px;">1. Pay <?= formatPrice($totalAmt) ?> via Quick UPI App or Scan QR:</div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
                  <a href="<?= htmlspecialchars($gpayUrl) ?>" style="padding: 8px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; text-align: center; text-decoration: none; font-size: 12px; font-weight: 700; color: #0f172a; display: block;">Google Pay</a>
                  <a href="<?= htmlspecialchars($phonepeUrl) ?>" style="padding: 8px; background: #5f259f; border-radius: 8px; text-align: center; text-decoration: none; font-size: 12px; font-weight: 700; color: white; display: block;">PhonePe</a>
                  <a href="<?= htmlspecialchars($paytmUrl) ?>" style="padding: 8px; background: #002970; border-radius: 8px; text-align: center; text-decoration: none; font-size: 12px; font-weight: 700; color: white; display: block;">Paytm</a>
                  <a href="<?= htmlspecialchars($genericUpiUrl) ?>" style="padding: 8px; background: #059669; border-radius: 8px; text-align: center; text-decoration: none; font-size: 12px; font-weight: 700; color: white; display: block;">Other UPI</a>
                </div>

                <div style="display: flex; gap: 12px; align-items: center; background: white; padding: 10px; border-radius: 10px; border: 1px solid #a7f3d0; margin-bottom: 12px;">
                  <img src="<?= htmlspecialchars($qrUrl) ?>" alt="QR" style="width: 80px; height: 80px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 12px;">
                    <div style="color: #64748b; font-size: 11px;">Store UPI ID:</div>
                    <div style="font-family: monospace; font-weight: 800; color: #0f172a; font-size: 13px;"><?= htmlspecialchars($storeUpiId) ?></div>
                    <div style="color: #64748b; font-size: 11px;">Payee: <?= htmlspecialchars($storeUpiName) ?></div>
                  </div>
                </div>

                <div style="margin-top: 10px;">
                  <label style="display: block; font-size: 12px; font-weight: 800; color: #065f46; margin-bottom: 4px;">2. Enter 12-Digit UPI UTR / Transaction Reference ID *</label>
                  <input type="text" name="upiReference" id="upiRefField" placeholder="e.g. 423589123456 (from GPay / PhonePe receipt)" value="<?= htmlspecialchars($_POST['upiReference'] ?? '') ?>" style="width: 100%; padding: 10px 12px; border: 2px solid #059669; border-radius: 8px; font-size: 13px; font-family: monospace; font-weight: 700; outline: none; box-sizing: border-box; background: white;">
                </div>
              </div>
            </label>

            <!-- Cash on Delivery -->
            <label style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; cursor: pointer;">
              <input type="radio" name="paymentMode" id="pm_cod" value="CASH_ON_DELIVERY" onchange="togglePaymentSections()" style="width: 18px; height: 18px;">
              <div>
                <div style="font-weight: 700; color: #0f172a; font-size: 15px;">Cash / Pay on Delivery / Store Pickup</div>
                <div style="font-size: 13px; color: #64748b;">Pay cash or scan QR when collecting items at store or upon delivery.</div>
              </div>
            </label>

          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Order Notes / Specific Instructions (Optional)</label>
            <input type="text" name="notes" placeholder="e.g. Call before delivery, pre-install Windows 11" value="<?= htmlspecialchars($_POST['notes'] ?? '') ?>" style="width: 100%; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>

        </div>

        <!-- Order Summary Card -->
        <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); position: sticky; top: 100px;">
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Order Summary (<?= count($cartItems) ?> items)</h3>

          <div style="max-height: 240px; overflow-y: auto; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px;">
            <?php foreach ($cartItems as $item): ?>
              <div style="display: flex; gap: 12px; align-items: center;">
                <img src="<?= htmlspecialchars($item['image'] ?: '/public/images/tech-sprout-logo.png') ?>" alt="" style="width: 48px; height: 48px; object-fit: contain; border-radius: 6px; border: 1px solid #f1f5f9; background: #fff;">
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><?= htmlspecialchars($item['name']) ?></div>
                  <div style="font-size: 12px; color: #64748b;">Qty: <?= $item['quantity'] ?> × <?= formatPrice($item['price']) ?></div>
                </div>
                <div style="font-size: 14px; font-weight: 700; color: #0f172a;"><?= formatPrice($item['price'] * $item['quantity']) ?></div>
              </div>
            <?php endforeach; ?>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>Subtotal:</span>
              <span style="font-weight: 600; color: #0f172a;"><?= formatPrice($summary['subtotal']) ?></span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>18% GST (Included):</span>
              <span style="font-weight: 600; color: #0f172a;"><?= formatPrice($summary['tax']) ?></span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>Shipping:</span>
              <span style="font-weight: 700; color: #16a34a;">FREE (Store Pickup / Express)</span>
            </div>
            <div style="border-top: 2px dashed #cbd5e1; margin-top: 6px; padding-top: 12px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #0f172a;">
              <span>Total Amount:</span>
              <span style="color: #059669;"><?= formatPrice($summary['total']) ?></span>
            </div>
          </div>

          <button type="submit" id="submitBtn" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #059669, #047857); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(5,150,105,0.35);">
            <span>Submit Order with UPI (<?= formatPrice($summary['total']) ?>)</span>
          </button>

          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #64748b; text-align: center;">
            <div>🛡️ 100% Genuine Tech Hardware & Brand Warranty</div>
            <div>📄 Instant Official 1-Page GST Tax Invoice Included</div>
          </div>
        </div>

      </form>

      <script>
        function togglePaymentSections() {
          var isUpi = document.getElementById('pm_upi').checked;
          var upiSub = document.getElementById('upiSubSection');
          var refField = document.getElementById('upiRefField');
          var submitBtn = document.getElementById('submitBtn');
          var total = '<?= formatPrice($summary['total']) ?>';

          if (isUpi) {
            upiSub.style.display = 'block';
            refField.required = true;
            submitBtn.innerHTML = '<span>Submit Order with UPI (' + total + ')</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';
            submitBtn.style.boxShadow = '0 4px 14px rgba(5,150,105,0.35)';
          } else {
            upiSub.style.display = 'none';
            refField.required = false;
            submitBtn.innerHTML = '<span>Confirm Order (Cash on Delivery - ' + total + ')</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
            submitBtn.style.boxShadow = '0 4px 14px rgba(37,99,235,0.35)';
          }
        }
      </script>

    <?php endif; ?>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
