<?php
require_once __DIR__ . '/includes/functions.php';

$cart = getCart();
$cartItems = $cart['items'];
$summary = getCartSummary();

$pageTitle = 'Shopping Cart - ' . ($storeSettings['storeName'] ?? 'Jijau Computers');
require_once __DIR__ . '/includes/header.php';
?>

<div class="cart-page" style="padding: 40px 0; background: #f8fafc; min-height: 80vh;">
  <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 0 16px;">
    
    <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Your Shopping Cart</h1>
    <p style="color: #64748b; margin: 0 0 32px;">Review your hardware items before proceeding to checkout with 1-page GST tax invoice.</p>

    <?php if (empty($cartItems)): ?>
      <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 60px 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
        <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Your Cart is Empty</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">Discover our high-performance laptops, custom PC components, CCTV systems, and accessories.</p>
        <a href="/products" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
          <span>Explore Products Catalog →</span>
        </a>
      </div>
    <?php else: ?>
      
      <div style="display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start;">
        
        <!-- Cart Items List -->
        <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 14px; margin-bottom: 16px;">
            <span style="font-weight: 700; color: #0f172a; font-size: 16px;">Items (<?= count($cartItems) ?>)</span>
            <button onclick="clearCart()" style="background: none; border: none; color: #ef4444; font-size: 13px; font-weight: 600; cursor: pointer;">Empty Cart</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <?php foreach ($cartItems as $item): ?>
              <div style="display: flex; gap: 16px; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
                <img src="<?= htmlspecialchars($item['image'] ?: '/public/images/tech-sprout-logo.png') ?>" alt="<?= htmlspecialchars($item['name']) ?>" style="width: 72px; height: 72px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;">
                
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 700; font-size: 15px; color: #0f172a; line-height: 1.4; margin-bottom: 4px;"><?= htmlspecialchars($item['name']) ?></div>
                  <div style="font-size: 13px; color: #64748b;"><?= formatPrice($item['price']) ?> each</div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px;">
                  <button onclick="updateCartQty('<?= $item['id'] ?>', <?= $item['quantity'] - 1 ?>)" style="background: none; border: none; font-size: 16px; font-weight: bold; cursor: pointer; color: #64748b; padding: 0 4px;">-</button>
                  <span style="font-weight: 700; font-size: 14px; min-width: 20px; text-align: center;"><?= $item['quantity'] ?></span>
                  <button onclick="updateCartQty('<?= $item['id'] ?>', <?= $item['quantity'] + 1 ?>)" style="background: none; border: none; font-size: 16px; font-weight: bold; cursor: pointer; color: #64748b; padding: 0 4px;">+</button>
                </div>

                <div style="font-weight: 800; font-size: 16px; color: #0f172a; min-width: 90px; text-align: right;">
                  <?= formatPrice($item['price'] * $item['quantity']) ?>
                </div>

                <button onclick="removeFromCart('<?= $item['id'] ?>')" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 4px 8px;" title="Remove">✕</button>
              </div>
            <?php endforeach; ?>
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <a href="/products" style="color: #2563eb; font-weight: 700; text-decoration: none; font-size: 14px;">← Continue Shopping</a>
          </div>
        </div>

        <!-- Order Summary Card -->
        <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); position: sticky; top: 100px;">
          <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Price Details</h2>

          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>Subtotal:</span>
              <span style="font-weight: 600; color: #0f172a;"><?= formatPrice($summary['subtotal']) ?></span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>18% GST (Included):</span>
              <span style="font-weight: 600; color: #0f172a;"><?= formatPrice($summary['tax']) ?></span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #64748b;">
              <span>Delivery:</span>
              <span style="font-weight: 700; color: #16a34a;">FREE Store Pickup / Express Courier</span>
            </div>
            <div style="border-top: 2px dashed #cbd5e1; margin-top: 8px; padding-top: 14px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #0f172a;">
              <span>Total Amount:</span>
              <span style="color: #2563eb;"><?= formatPrice($summary['total']) ?></span>
            </div>
          </div>

          <a href="/checkout" style="width: 100%; padding: 14px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.3); box-sizing: border-box;">
            <span>Proceed to Checkout →</span>
          </a>

          <div style="margin-top: 16px; text-align: center;">
            <a href="https://wa.me/<?= htmlspecialchars($storeSettings['whatsapp'] ?? '919876543210') ?>?text=Hello%20Jijau%20Computers!%20I%20have%20<?= count($cartItems) ?>%20items%20in%20my%20cart%20(Total:%20<?= urlencode(formatPrice($summary['total'])) ?>).%20Please%20help%20me%20order." target="_blank" style="color: #16a34a; font-weight: 700; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              <span>💬 Instant Order via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    <?php endif; ?>

  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
