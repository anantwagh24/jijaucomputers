<?php
require_once __DIR__ . '/../../includes/functions.php';
requireAdmin();

$adminUser = getCurrentAdmin();
$db = getDB();

// Count badges
$pendingOrdersCount = $db->query('SELECT COUNT(*) FROM "Order" WHERE status = "PENDING"')->fetchColumn();
$activeServiceCount = $db->query('SELECT COUNT(*) FROM "ServiceRequest" WHERE status NOT IN ("Completed", "Delivered", "Cancelled")')->fetchColumn();
$pendingReviewsCount = $db->query('SELECT COUNT(*) FROM "Review" WHERE isApproved = 0')->fetchColumn();
$pendingQuotesCount = $db->query('SELECT COUNT(*) FROM "QuotationRequest" WHERE status = "PENDING"')->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle ?? 'Admin Control Center - Jijau Computers') ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/css/style.css">
  <style>
    :root {
      --admin-bg: #0f172a;
      --admin-card: #1e293b;
      --admin-sidebar: #0b0f19;
      --admin-border: #334155;
      --admin-accent: #3b82f6;
    }
    body.admin-body {
      background: #f1f5f9;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      min-height: 100vh;
    }
    .admin-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }
    .admin-sidebar {
      width: 260px;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      border-right: 1px solid #1e293b;
    }
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      min-width: 0;
    }
    .admin-topbar {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .admin-content {
      padding: 32px;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.15s;
    }
    .nav-item:hover, .nav-item.active {
      background: #1e293b;
      color: #38bdf8;
      border-left: 3px solid #38bdf8;
    }
    .badge-count {
      margin-left: auto;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 10px;
    }
  </style>
</head>
<body class="admin-body">
<div class="admin-layout">
