<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $input['action'] ?? '';
$productId = $input['productId'] ?? ($input['id'] ?? '');
$quantity = max(1, intval($input['quantity'] ?? 1));

if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$db = getDB();

if ($action === 'add') {
    if (!$productId) {
        echo json_encode(['success' => false, 'message' => 'Product ID required']);
        exit;
    }

    try {
        $stmt = $db->prepare('SELECT p.*, (SELECT url FROM "ProductImage" WHERE productId = p.id ORDER BY "order" ASC LIMIT 1) as imageUrl FROM "Product" p WHERE p.id = ? LIMIT 1');
        $stmt->execute([$productId]);
        $product = $stmt->fetch();

        if (!$product) {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit;
        }

        if (isset($_SESSION['cart'][$productId])) {
            $_SESSION['cart'][$productId]['quantity'] += $quantity;
        } else {
            $_SESSION['cart'][$productId] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'slug' => $product['slug'],
                'price' => floatval($product['price']),
                'salePrice' => $product['salePrice'] ? floatval($product['salePrice']) : null,
                'image' => $product['imageUrl'] ?: ($input['image'] ?? '/public/images/tech-sprout-logo.png'),
                'warranty' => $product['warranty'] ?: '1 Year Brand Warranty',
                'quantity' => $quantity,
            ];
        }

        $cart = getCart();
        echo json_encode([
            'success' => true,
            'cartCount' => $cart['count'],
            'cartTotal' => $cart['total'],
            'cartTotalFormatted' => formatPrice($cart['total']),
            'message' => 'Added to cart'
        ]);
        exit;
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

if ($action === 'update') {
    if (isset($_SESSION['cart'][$productId])) {
        if ($quantity <= 0) {
            unset($_SESSION['cart'][$productId]);
        } else {
            $_SESSION['cart'][$productId]['quantity'] = $quantity;
        }
    }
    $cart = getCart();
    echo json_encode([
        'success' => true,
        'cartCount' => $cart['count'],
        'cartTotal' => $cart['total'],
        'cartTotalFormatted' => formatPrice($cart['total'])
    ]);
    exit;
}

if ($action === 'remove') {
    if (isset($_SESSION['cart'][$productId])) {
        unset($_SESSION['cart'][$productId]);
    }
    $cart = getCart();
    echo json_encode([
        'success' => true,
        'cartCount' => $cart['count'],
        'cartTotal' => $cart['total'],
        'cartTotalFormatted' => formatPrice($cart['total'])
    ]);
    exit;
}

if ($action === 'clear') {
    $_SESSION['cart'] = [];
    echo json_encode(['success' => true, 'cartCount' => 0, 'cartTotal' => 0, 'cartTotalFormatted' => '₹0']);
    exit;
}

$cart = getCart();
echo json_encode([
    'success' => true,
    'cart' => $cart['items'],
    'cartCount' => $cart['count'],
    'cartTotal' => $cart['total'],
    'cartTotalFormatted' => formatPrice($cart['total'])
]);
