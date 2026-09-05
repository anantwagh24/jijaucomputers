<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$customerName = trim($input['name'] ?? $input['customerName'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$budget = trim($input['budget'] ?? '₹50,000 - ₹80,000');
$purpose = trim($input['purpose'] ?? 'Gaming & Streaming');
$cpuPref = trim($input['cpu'] ?? $input['cpuPref'] ?? '');
$gpuPref = trim($input['gpu'] ?? $input['gpuPref'] ?? '');
$ramPref = trim($input['ram'] ?? $input['ramPref'] ?? '');
$storagePref = trim($input['storage'] ?? $input['storagePref'] ?? '');
$cabinetPref = trim($input['cabinet'] ?? $input['cabinetPref'] ?? '');
$notes = trim($input['notes'] ?? '');

if (!$customerName || !$phone) {
    echo json_encode(['success' => false, 'message' => 'Name and Phone number are required.']);
    exit;
}

try {
    $db = getDB();
    $id = 'cpc_' . bin2hex(random_bytes(8));
    $reqNumber = 'JC-PC-' . date('ymd') . '-' . rand(100, 999);

    $stmt = $db->prepare("
        INSERT INTO CustomPcRequest (id, reqNumber, customerName, phone, email, budget, purpose, cpuPref, gpuPref, ramPref, storagePref, cabinetPref, notes, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'), datetime('now'))
    ");
    $stmt->execute([
        $id,
        $reqNumber,
        $customerName,
        $phone,
        $email,
        $budget,
        $purpose,
        $cpuPref,
        $gpuPref,
        $ramPref,
        $storagePref,
        $cabinetPref,
        $notes
    ]);

    echo json_encode([
        'success' => true,
        'reqNumber' => $reqNumber,
        'message' => 'Custom PC Quote Request submitted! Reference ID: ' . $reqNumber
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error submitting request: ' . $e->getMessage()]);
}
