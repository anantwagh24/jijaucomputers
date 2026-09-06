<?php
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/functions.php';

$settings = getSettings();
$db = getDB();

$orderNo = trim($_GET['order'] ?? '');
$serviceId = trim($_GET['service'] ?? '');
$isAutoPrint = isset($_GET['print']) && $_GET['print'] === 'true';

$order = null;
$service = null;

if ($orderNo) {
    $stmt = $db->prepare("SELECT * FROM \"Order\" WHERE orderNumber = ? OR id = ? LIMIT 1");
    $stmt->execute([$orderNo, $orderNo]);
    $order = $stmt->fetch();

    if ($order) {
        $itemStmt = $db->prepare("
            SELECT oi.*, p.warranty 
            FROM OrderItem oi 
            LEFT JOIN Product p ON oi.productId = p.id 
            WHERE oi.orderId = ?
        ");
        $itemStmt->execute([$order['id']]);
        $order['items'] = $itemStmt->fetchAll();
    }
} elseif ($serviceId) {
    $stmt = $db->prepare("SELECT * FROM ServiceRequest WHERE ticketId = ? OR id = ? LIMIT 1");
    $stmt->execute([$serviceId, $serviceId]);
    $service = $stmt->fetch();
}

if (!$order && !$service) {
    die("<h3>Invoice or Record Not Found</h3>");
}

$isOrder = (bool)$order;
$invoiceNo = $isOrder ? 'INV-' . preg_replace('/[^a-zA-Z0-9]/', '', $order['orderNumber']) : 'SRV-INV-' . preg_replace('/[^a-zA-Z0-9]/', '', $service['ticketId']);
$invoiceDate = date('d M Y', strtotime($isOrder ? $order['createdAt'] : $service['createdAt']));

$grandTotal = $isOrder ? floatval($order['total']) : floatval($service['estimatedCost'] ?: 0);
$taxCalc = calculateGstBreakup($grandTotal, 0.18);
$taxableTotal = $taxCalc['taxable'];
$cgst = $taxCalc['cgst'];
$sgst = $taxCalc['sgst'];

// Prepare items list
$items = [];
if ($isOrder) {
    foreach ($order['items'] as $it) {
        $itTotal = floatval($it['price']) * intval($it['quantity']);
        $itTaxCalc = calculateGstBreakup($itTotal, 0.18);
        $items[] = [
            'name' => $it['name'],
            'warranty' => $it['warranty'] ?: '1 Year Brand Warranty',
            'hsn' => $settings['invoiceHsnCode'] ?: '84713010',
            'qty' => intval($it['quantity']),
            'taxable' => $itTaxCalc['taxable'],
            'cgst' => $itTaxCalc['cgst'],
            'sgst' => $itTaxCalc['sgst'],
            'total' => $itTotal,
        ];
    }
} else {
    $items[] = [
        'name' => "{$service['deviceType']} Repair: {$service['brand']} {$service['model']} ({$service['issueDesc']})",
        'warranty' => '90 Days Service Warranty',
        'hsn' => '998713',
        'qty' => 1,
        'taxable' => $taxableTotal,
        'cgst' => $cgst,
        'sgst' => $sgst,
        'total' => $grandTotal,
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST Tax Invoice - <?= htmlspecialchars($invoiceNo) ?> | Jijau Computers</title>
  <link rel="icon" type="image/jpeg" href="/public/images/jijau-logo.jpg">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="/public/css/style.css">

  <style>
    @media print {
      @page {
        size: A4 portrait;
        margin: 4mm 6mm 4mm 6mm !important;
      }
      html, body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-size: 9px !important;
      }
      .no-print, header, footer, nav, aside, button {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
      }
      .invoice-card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 auto !important;
        width: 100% !important;
        max-width: 100% !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        overflow: hidden !important;
      }
    }
  </style>
</head>
<body class="min-h-screen bg-slate-100 py-3 sm:py-5 print:p-0 print:m-0 print:bg-white text-slate-900 font-sans print:min-h-0">

  <!-- Top Action Controls -->
  <div class="max-w-3xl mx-auto px-3 mb-2 flex items-center justify-between no-print print:hidden">
    <a
      href="<?= $isOrder ? '/track-service.php?q=' . urlencode($order['orderNumber']) : '/track-service.php?q=' . urlencode($service['ticketId']) ?>"
      class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
    >
      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
      <span>Back to Tracker</span>
    </a>

    <button
      type="button"
      onclick="window.print()"
      class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
    >
      <i data-lucide="printer" class="w-3.5 h-3.5"></i>
      <span>Print / Save 1-Page PDF</span>
    </button>
  </div>

  <!-- 1-Page Compact Invoice Sheet -->
  <div class="invoice-card max-w-3xl mx-auto bg-white p-4 rounded-xl border border-slate-200 shadow-lg print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full print:p-0 space-y-2 text-[10px] leading-tight">
    <!-- Header: Logo & Store Info -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-300 pb-2">
      <div class="flex items-start gap-2.5">
        <div class="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center p-0.5">
          <img
            src="/public/images/jijau-logo.jpg"
            alt="<?= htmlspecialchars($settings['storeName']) ?>"
            class="w-full h-full object-contain"
          >
        </div>
        <div class="space-y-0.5">
          <h1 class="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-none">
            <?= htmlspecialchars($settings['storeName'] ?: 'JIJAU COMPUTERS') ?>
          </h1>
          <p class="text-[9px] font-bold text-blue-700 uppercase tracking-wide">
            <?= htmlspecialchars($settings['tagline'] ?: 'Your Tech Partner') ?>
          </p>
          <p class="text-[9px] text-slate-600 max-w-sm leading-snug">
            <?= htmlspecialchars($settings['address'] ?: 'Shop No. 12 & 13, Jijau Plaza, Station Road, Maharashtra') ?>
          </p>
          <p class="text-[9px] text-slate-600 font-mono">
            Phone: <?= htmlspecialchars($settings['phone']) ?> | Email: <?= htmlspecialchars($settings['email']) ?>
          </p>
        </div>
      </div>

      <div class="text-left sm:text-right space-y-0.5 sm:shrink-0 bg-slate-50 sm:bg-transparent p-1.5 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
        <span class="inline-block px-2 py-0.5 rounded <?= $isOrder ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900' ?> font-black text-[9px] uppercase tracking-wider">
          <?= $isOrder ? 'TAX INVOICE (ORIGINAL)' : 'SERVICE TAX BILL (ORIGINAL)' ?>
        </span>
        <p class="font-mono text-xs font-black text-slate-950 mt-0.5">#<?= htmlspecialchars($invoiceNo) ?></p>
        <p class="text-[9px] text-slate-600 font-semibold">Date: <?= htmlspecialchars($invoiceDate) ?></p>
        <p class="text-[9px] text-slate-900 font-bold font-mono">
          GSTIN: <span class="text-blue-700"><?= htmlspecialchars($settings['gstin'] ?: '27FQIPK5154C1ZU') ?></span>
        </p>
        <p class="text-[8.5px] text-slate-600">State: Maharashtra (Code: 27)</p>
      </div>
    </div>

    <!-- Customer Details / Billed To -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
      <div>
        <span class="text-[8px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">
          <?= $isOrder ? 'Billed & Shipped To:' : 'Customer Details:' ?>
        </span>
        <p class="text-[11px] font-black text-slate-900"><?= htmlspecialchars($isOrder ? $order['customerName'] : $service['customerName']) ?></p>
        <p class="text-[9px] text-slate-600">
          <?= htmlspecialchars($isOrder ? "{$order['address']}, {$order['city']} - {$order['pincode']}" : "Maharashtra") ?>
        </p>
        <p class="text-[9px] text-slate-600 font-mono">
          Phone: <?= htmlspecialchars($isOrder ? $order['phone'] : $service['phone']) ?> <?= !empty($isOrder ? $order['email'] : $service['email']) ? '| Email: ' . htmlspecialchars($isOrder ? $order['email'] : $service['email']) : '' ?>
        </p>
      </div>

      <div class="sm:text-right space-y-0.5">
        <span class="text-[8px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">
          <?= $isOrder ? 'Order & Payment Info:' : 'Service Ticket Reference:' ?>
        </span>
        <p class="text-[9px] text-slate-700 font-semibold">
          Reference ID: <span class="font-mono font-bold text-slate-900"><?= htmlspecialchars($isOrder ? $order['orderNumber'] : $service['ticketId']) ?></span>
        </p>
        <p class="text-[9px] text-slate-700 font-semibold">
          <?= $isOrder ? 'Payment Mode:' : 'Device Model:' ?> <span class="font-bold text-slate-900"><?= htmlspecialchars($isOrder ? $order['paymentMode'] : "{$service['brand']} {$service['model']}") ?></span>
        </p>
        <p class="text-[9px] text-slate-700 font-semibold">
          Place of Supply: <span class="font-bold text-slate-900">Maharashtra (27)</span>
        </p>
      </div>
    </div>

    <!-- Items Table with 18% GST Breakup -->
    <div class="overflow-x-auto border border-slate-200 rounded-lg">
      <table class="w-full text-left text-[9px] border-collapse">
        <thead>
          <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[8px]">
            <th class="py-1 px-2 w-5 text-center">#</th>
            <th class="py-1 px-2"><?= $isOrder ? 'Item Description & Warranty' : 'Repair Description & Diagnosis' ?></th>
            <th class="py-1 px-2 text-center">HSN/SAC</th>
            <th class="py-1 px-2 text-center">Qty</th>
            <th class="py-1 px-2 text-right">Taxable (₹)</th>
            <th class="py-1 px-2 text-right">CGST (9%)</th>
            <th class="py-1 px-2 text-right">SGST (9%)</th>
            <th class="py-1 px-2 text-right">Total (₹)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <?php foreach ($items as $idx => $it): ?>
            <tr class="hover:bg-slate-50/50">
              <td class="py-1 px-2 text-center font-mono text-slate-500"><?= $idx + 1 ?></td>
              <td class="py-1 px-2">
                <p class="font-bold text-slate-950 leading-tight"><?= htmlspecialchars($it['name']) ?></p>
                <p class="text-[8px] text-emerald-700 font-semibold flex items-center gap-1">
                  <i data-lucide="shield-check" class="w-2.5 h-2.5"></i>
                  <span>Warranty: <?= htmlspecialchars($it['warranty']) ?></span>
                </p>
              </td>
              <td class="py-1 px-2 text-center font-mono text-slate-600"><?= htmlspecialchars($it['hsn']) ?></td>
              <td class="py-1 px-2 text-center font-bold text-slate-900"><?= $it['qty'] ?></td>
              <td class="py-1 px-2 text-right font-mono text-slate-700"><?= number_format($it['taxable'], 2) ?></td>
              <td class="py-1 px-2 text-right font-mono text-slate-600"><?= number_format($it['cgst'], 2) ?></td>
              <td class="py-1 px-2 text-right font-mono text-slate-600"><?= number_format($it['sgst'], 2) ?></td>
              <td class="py-1 px-2 text-right font-mono font-black text-slate-950"><?= number_format($it['total'], 2) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <!-- Tax Summary & Grand Total -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
      <div class="space-y-1.5">
        <div class="p-1.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
          <span class="text-[8px] font-black text-slate-500 uppercase tracking-wider block">
            Amount in Words:
          </span>
          <p class="text-[9px] font-bold text-slate-900 italic leading-tight">
            <?= numberToWordsINR($grandTotal) ?>
          </p>
        </div>

        <div class="p-1.5 bg-blue-50/60 rounded-lg border border-blue-100 space-y-0.5 text-[8.5px]">
          <span class="text-[8px] font-black text-blue-900 uppercase tracking-wider block">
            Official Bank & UPI Payment Details:
          </span>
          <p class="text-slate-700 font-mono text-[8.5px] leading-tight">
            <?= htmlspecialchars($settings['invoiceBankDetails'] ?: 'Bank: HDFC Bank Ltd | A/C: 50200012345678 | IFSC: HDFC0001234 | Branch: Station Road') ?>
          </p>
          <p class="text-slate-700 font-mono font-bold text-[8.5px]">
            UPI VPA: <span class="text-blue-700"><?= htmlspecialchars($settings['upiId'] ?: 'jijauc@ibl') ?></span> (<?= htmlspecialchars($settings['upiName'] ?: 'Jijau Computers') ?>)
          </p>
        </div>
      </div>

      <div class="space-y-0.5 text-[9px] bg-slate-50 p-2 rounded-lg border border-slate-200">
        <div class="flex justify-between text-slate-600 pb-0.5 border-b border-slate-200">
          <span>Total Taxable Amount:</span>
          <span class="font-mono font-bold text-slate-800">₹<?= number_format($taxableTotal, 2) ?></span>
        </div>
        <div class="flex justify-between text-slate-600 pb-0.5 border-b border-slate-200">
          <span>Central GST (CGST @ 9%):</span>
          <span class="font-mono font-bold text-slate-800">₹<?= number_format($cgst, 2) ?></span>
        </div>
        <div class="flex justify-between text-slate-600 pb-0.5 border-b border-slate-200">
          <span>State GST (SGST @ 9%):</span>
          <span class="font-mono font-bold text-slate-800">₹<?= number_format($sgst, 2) ?></span>
        </div>
        <div class="flex justify-between text-[11px] pt-0.5 text-slate-950 font-black">
          <span>Grand Total (Incl. 18% GST):</span>
          <span class="font-mono text-xs text-blue-700">₹<?= number_format($grandTotal, 2) ?></span>
        </div>
      </div>
    </div>

    <!-- Terms, Conditions & Signatures -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200">
      <div class="sm:col-span-2 space-y-0.5">
        <span class="text-[8px] font-black text-slate-600 uppercase tracking-wider block">
          Terms & Warranty Conditions:
        </span>
        <div class="text-[8px] text-slate-500 whitespace-pre-line leading-tight">
          <?= htmlspecialchars($settings['invoiceTerms'] ?: "1. Warranty valid only with official serial number and intact warranty seals.\n2. Goods once sold are subject to manufacturer standard warranty policy.\n3. Physical damage, liquid spillage, or unauthorized modifications are not covered under warranty.\n4. Disputes subject to legal jurisdiction only.") ?>
        </div>
        <p class="text-[7.5px] text-slate-400 italic">
          <?= htmlspecialchars($settings['invoiceNotes'] ?: 'Thank you for choosing Jijau Computers - Your Trusted Tech Partner!') ?>
        </p>
      </div>

      <div class="flex flex-col justify-between items-center sm:items-end text-center sm:text-right pt-1 sm:pt-0">
        <span class="text-[8px] font-black text-slate-800 uppercase tracking-wider">
          For <?= htmlspecialchars($settings['storeName'] ?: 'JIJAU COMPUTERS') ?>
        </span>
        <div class="my-1 border-b border-slate-400 w-24 text-center">
          <span class="text-[7.5px] text-slate-400 uppercase italic">Authorized Signatory</span>
        </div>
        <p class="text-[7.5px] text-slate-500 font-mono">Computer Generated <?= $isOrder ? 'Invoice' : 'Bill' ?></p>
      </div>
    </div>
  </div>

  <script>
    lucide.createIcons();
    <?php if ($isAutoPrint): ?>
      window.onload = () => {
        setTimeout(() => window.print(), 300);
      };
    <?php endif; ?>
  </script>
</body>
</html>
