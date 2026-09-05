<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$productId = trim($input['productId'] ?? '');
$customerName = trim($input['customerName'] ?? '');
$customerPhone = trim($input['customerPhone'] ?? '');
$rating = max(1, min(5, intval($input['rating'] ?? 5)));
$title = trim($input['title'] ?? '');
$comment = trim($input['comment'] ?? '');

if (!$productId || !$customerName || !$title || !$comment) {
    echo json_encode(['success' => false, 'message' => 'Please fill out all required fields.']);
    exit;
}

try {
    $db = getDB();
    $id = 'rev_' . bin2hex(random_bytes(8));
    $stmt = $db->prepare("
        INSERT INTO Review (id, productId, customerName, customerPhone, rating, title, comment, isVerifiedBuyer, isApproved, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))
    ");
    $stmt->execute([
        $id,
        $productId,
        $customerName,
        $customerPhone,
        $rating,
        $title,
        $comment
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your verified review has been submitted successfully.'
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to submit review: ' . $e->getMessage()]);
}
