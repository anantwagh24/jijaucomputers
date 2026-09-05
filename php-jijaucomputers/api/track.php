<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

$query = trim($_GET['q'] ?? '');
if (!$query) {
    echo json_encode(['orders' => [], 'serviceRequests' => []]);
    exit;
}

$db = getDB();

// Search Orders by orderNumber or phone
$cleanPhone = preg_replace('/[^0-9]/', '', $query);
$stmt = $db->prepare("
    SELECT o.* FROM \"Order\" o 
    WHERE o.orderNumber = ? OR o.phone LIKE ? OR o.id = ?
    ORDER BY o.createdAt DESC LIMIT 10
");
$stmt->execute([$query, "%$query%", $query]);
$orders = $stmt->fetchAll();

// Attach order items
foreach ($orders as &$order) {
    $itemStmt = $db->prepare("SELECT * FROM OrderItem WHERE orderId = ?");
    $itemStmt->execute([$order['id']]);
    $order['items'] = $itemStmt->fetchAll();
}

// Search Service Requests by ticketId or phone
$srvStmt = $db->prepare("
    SELECT * FROM ServiceRequest 
    WHERE ticketId = ? OR phone LIKE ? OR id = ?
    ORDER BY createdAt DESC LIMIT 10
");
$srvStmt->execute([$query, "%$query%", $query]);
$serviceRequests = $srvStmt->fetchAll();

echo json_encode([
    'orders' => $orders,
    'serviceRequests' => $serviceRequests
]);
