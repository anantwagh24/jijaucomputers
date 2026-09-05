<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$customerName = trim($input['name'] ?? $input['customerName'] ?? '');
$companyName = trim($input['company'] ?? $input['companyName'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$type = trim($input['type'] ?? 'Corporate / Bulk Order');
$quantity = trim($input['quantity'] ?? '1');
$productName = trim($input['productName'] ?? 'General Inquiry');
$message = trim($input['message'] ?? '');

if (!$customerName || !$phone) {
    echo json_encode(['success' => false, 'message' => 'Name and Phone are required.']);
    exit;
}

try {
    $db = getDB();
    $id = 'quo_' . bin2hex(random_bytes(8));
    $quoteNumber = 'JC-QT-' . date('ymd') . '-' . rand(100, 999);
    $itemsSummary = "Product: $productName (Qty: $quantity)";

    $stmt = $db->prepare("
        INSERT INTO QuotationRequest (id, quoteNumber, customerName, companyName, phone, email, type, itemsSummary, message, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'), datetime('now'))
    ");
    $stmt->execute([
        $id,
        $quoteNumber,
        $customerName,
        $companyName,
        $phone,
        $email,
        $type,
        $itemsSummary,
        $message
    ]);

    echo json_encode([
        'success' => true,
        'quoteNumber' => $quoteNumber,
        'message' => 'Quotation request received! Quotation Ref: ' . $quoteNumber
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
