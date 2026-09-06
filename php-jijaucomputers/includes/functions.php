<?php
require_once __DIR__ . '/db.php';

function getSettings(): array {
    static $settings = null;
    if ($settings !== null) {
        return $settings;
    }

    try {
        $db = getDB();
        $stmt = $db->query("SELECT * FROM \"WebsiteSetting\" WHERE id = 'default' LIMIT 1");
        $settings = $stmt->fetch();
        if (!$settings) {
            $settings = [
                'storeName' => 'Jijau Computers',
                'tagline' => 'Your Tech Partner',
                'logoUrl' => '/public/images/jijau-logo.jpg',
                'phone' => '+91 88056 07908',
                'whatsapp' => '918805607908',
                'email' => 'contact@jijaucomputers.com',
                'address' => 'Shop No. 4, Jijau Complex, Station Road, Maharashtra',
                'googleMapsUrl' => 'https://maps.google.com/?q=Maharashtra',
                'openingHours' => 'Mon - Sat: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 6:00 PM',
                'gstin' => '27FQIPK5154C1ZU',
                'upiId' => 'jijauc@ibl',
                'upiName' => 'Jijau Computers',
                'invoiceTerms' => "1. Warranty valid only with official serial number and intact warranty seals.\n2. Goods once sold are subject to manufacturer standard warranty policy.\n3. Physical damage, liquid spillage, or unauthorized modifications are not covered under warranty.\n4. Disputes subject to legal jurisdiction only.",
                'invoiceBankDetails' => 'Bank: HDFC Bank Ltd | A/C No: 50200012345678 | IFSC: HDFC0001234 | Branch: Station Road',
                'invoiceHsnCode' => '84713010',
                'invoiceNotes' => 'Thank you for choosing Jijau Computers - Your Trusted Tech Partner!',
            ];
        }
    } catch (Exception $e) {
        $settings = [
            'storeName' => 'Jijau Computers',
            'tagline' => 'Your Tech Partner',
            'phone' => '+91 88056 07908',
            'whatsapp' => '918805607908',
            'email' => 'contact@jijaucomputers.com',
            'address' => 'Shop No. 4, Jijau Complex, Station Road, Maharashtra',
            'openingHours' => 'Mon - Sat: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 6:00 PM',
            'gstin' => '27FQIPK5154C1ZU',
            'upiId' => 'jijauc@ibl',
            'upiName' => 'Jijau Computers',
            'invoiceHsnCode' => '84713010',
            'invoiceTerms' => 'Standard manufacturer warranty applies.',
            'invoiceBankDetails' => 'HDFC Bank',
            'invoiceNotes' => 'Thank you for choosing Jijau Computers!'
        ];
    }
    return $settings;
}

function getStoreSettings(): array {
    return getSettings();
}

function formatPrice($amount): string {
    $num = floatval($amount);
    return '₹' . number_format($num, 0, '.', ',');
}

function formatPriceDecimal($amount): string {
    $num = floatval($amount);
    return '₹' . number_format($num, 2, '.', ',');
}

function numberToWordsINR($amount): string {
    $num = round(floatval($amount));
    if ($num <= 0) return 'Zero Rupees Only';

    $single = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    $tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    $convertSection = function($n) use ($single, $tens) {
        $str = '';
        if ($n > 99) {
            $str .= $single[intval($n / 100)] . ' Hundred ';
            $n %= 100;
        }
        if ($n > 19) {
            $str .= $tens[intval($n / 10)] . ' ' . $single[$n % 10] . ' ';
        } else if ($n > 0) {
            $str .= $single[$n] . ' ';
        }
        return trim($str);
    };

    $crore = intval($num / 10000000);
    $num %= 10000000;
    $lakh = intval($num / 100000);
    $num %= 100000;
    $thousand = intval($num / 1000);
    $num %= 1000;
    $hundred = $num;

    $words = '';
    if ($crore > 0) $words .= $convertSection($crore) . ' Crore ';
    if ($lakh > 0) $words .= $convertSection($lakh) . ' Lakh ';
    if ($thousand > 0) $words .= $convertSection($thousand) . ' Thousand ';
    if ($hundred > 0) $words .= $convertSection($hundred) . ' ';

    return preg_replace('/\s+/', ' ', 'Rupees ' . trim($words) . ' Only');
}

function calculateGstBreakup($totalAmount, $rate = 0.18): array {
    $grandTotal = floatval($totalAmount);
    $taxable = $grandTotal > 0 ? round($grandTotal / (1 + $rate), 2) : 0;
    $totalTax = round($grandTotal - $taxable, 2);
    $cgst = round($totalTax / 2, 2);
    $sgst = round($totalTax / 2, 2);

    return [
        'grandTotal' => $grandTotal,
        'taxable' => $taxable,
        'totalTax' => $totalTax,
        'cgst' => $cgst,
        'sgst' => $sgst,
    ];
}

function generateWhatsAppUrl($phone, $message): string {
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    if (!str_starts_with($cleanPhone, '91') && strlen($cleanPhone) === 10) {
        $cleanPhone = '91' . $cleanPhone;
    }
    return "https://wa.me/" . $cleanPhone . "?text=" . rawurlencode($message);
}

function generateOrderNumber(): string {
    return 'JC-ORD-' . date('Ymd') . '-' . rand(1000, 9999);
}

function getCart(): array {
    $raw = $_SESSION['cart'] ?? [];
    $items = is_array($raw) ? array_values($raw) : [];
    
    $count = 0;
    $total = 0;
    foreach ($items as $it) {
        $qty = intval($it['quantity'] ?? 1);
        $price = floatval($it['price'] ?? 0);
        $count += $qty;
        $total += ($price * $qty);
    }

    return [
        'items' => $items,
        'count' => $count,
        'total' => $total
    ];
}

function getCartSummary(): array {
    $cart = getCart();
    $total = $cart['total'];
    $breakup = calculateGstBreakup($total, 0.18);
    return [
        'subtotal' => $breakup['taxable'],
        'tax' => $breakup['totalTax'],
        'total' => $total
    ];
}

function clearCart(): void {
    $_SESSION['cart'] = [];
}

function sanitizeInput($data): string {
    if (is_array($data)) return '';
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function isAdminLoggedIn(): bool {
    return !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function getCurrentAdmin(): ?array {
    return $_SESSION['admin_user'] ?? null;
}

function requireAdmin(): void {
    if (!isAdminLoggedIn()) {
        header('Location: /admin/login.php');
        exit;
    }
}

function logVisitor($page = '/', $referrer = '—'): void {
    try {
        $db = getDB();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $stmt = $db->prepare('INSERT INTO "VisitorLog" (id, ip, location, device, browser, os, page, referrer, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            'vis_' . bin2hex(random_bytes(8)),
            $ip,
            'Maharashtra, India',
            'Desktop',
            'Chrome',
            'macOS',
            $page,
            $referrer,
            $ua,
            date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {}
}
