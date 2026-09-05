<?php
$pageTitle = 'Registered Customers Management';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$db = getDB();
$message = '';
$error = '';

// Handle actions (Create, Edit, Delete)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $now = date('Y-m-d H:i:s');

    if ($action === 'create') {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $city = trim($_POST['city'] ?? '');
        $pincode = trim($_POST['pincode'] ?? '');
        $isVerified = isset($_POST['isVerified']) ? 1 : 0;

        if (!$name || !$email) {
            $error = 'Name and Email are required.';
        } else {
            // Check existing
            $check = $db->prepare('SELECT id FROM "User" WHERE email = ?');
            $check->execute([$email]);
            if ($check->fetch()) {
                $error = 'A user with this email already exists.';
            } else {
                $id = 'usr_' . bin2hex(random_bytes(8));
                $hashed = $password ? password_hash($password, PASSWORD_DEFAULT) : password_hash('Customer@123', PASSWORD_DEFAULT);
                $stmt = $db->prepare('INSERT INTO "User" (id, name, email, phone, password, address, city, pincode, isVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$id, $name, $email, $phone, $hashed, $address, $city, $pincode, $isVerified, $now, $now]);
                $message = "Customer '$name' added successfully!";
            }
        }
    } elseif ($action === 'edit') {
        $id = $_POST['id'] ?? '';
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $city = trim($_POST['city'] ?? '');
        $pincode = trim($_POST['pincode'] ?? '');
        $isVerified = isset($_POST['isVerified']) ? 1 : 0;
        $password = trim($_POST['password'] ?? '');

        if ($id && $name) {
            if ($password) {
                $hashed = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $db->prepare('UPDATE "User" SET name = ?, phone = ?, address = ?, city = ?, pincode = ?, isVerified = ?, password = ?, updatedAt = ? WHERE id = ?');
                $stmt->execute([$name, $phone, $address, $city, $pincode, $isVerified, $hashed, $now, $id]);
            } else {
                $stmt = $db->prepare('UPDATE "User" SET name = ?, phone = ?, address = ?, city = ?, pincode = ?, isVerified = ?, updatedAt = ? WHERE id = ?');
                $stmt->execute([$name, $phone, $address, $city, $pincode, $isVerified, $now, $id]);
            }
            $message = "Customer details updated!";
        }
    } elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        if ($id) {
            $stmt = $db->prepare('DELETE FROM "User" WHERE id = ?');
            $stmt->execute([$id]);
            $message = "Customer record deleted.";
        }
    }
}

// Fetch all users with order count and total spend
$query = '
    SELECT u.*,
           COUNT(o.id) AS orderCount,
           COALESCE(SUM(o.totalAmount), 0) AS totalSpend
    FROM "User" u
    LEFT JOIN "Order" o ON o.userId = u.id
    GROUP BY u.id
    ORDER BY u.createdAt DESC
';
$users = $db->query($query)->fetchAll();

// KPIs
$totalUsers = count($users);
$verifiedCount = 0;
$totalSpendAll = 0;
$totalOrdersAll = 0;

foreach ($users as $u) {
    if (!empty($u['isVerified'])) $verifiedCount++;
    $totalSpendAll += (float)$u['totalSpend'];
    $totalOrdersAll += (int)$u['orderCount'];
}
?>

<div>
  <?php if ($message): ?>
    <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ✓ <?= htmlspecialchars($message) ?>
    </div>
  <?php endif; ?>

  <?php if ($error): ?>
    <div style="background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 12px 18px; border-radius: 8px; font-weight: 700; margin-bottom: 20px;">
      ⚠ <?= htmlspecialchars($error) ?>
    </div>
  <?php endif; ?>

  <!-- KPI METRICS GRID -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total Registered</div>
      <div style="font-size: 28px; font-weight: 800; color: #0f172a; margin-top: 6px;"><?= number_format($totalUsers) ?></div>
      <div style="font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 600;">Active accounts in database</div>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Verified Customers</div>
      <div style="font-size: 28px; font-weight: 800; color: #2563eb; margin-top: 6px;"><?= number_format($verifiedCount) ?></div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Email/Phone validated</div>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Orders Placed</div>
      <div style="font-size: 28px; font-weight: 800; color: #d97706; margin-top: 6px;"><?= number_format($totalOrdersAll) ?></div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">By registered members</div>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Cumulative Spend</div>
      <div style="font-size: 28px; font-weight: 800; color: #16a34a; margin-top: 6px;">₹<?= number_format($totalSpendAll) ?></div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Lifetime revenue from accounts</div>
    </div>
  </div>

  <!-- TABLE CONTAINER -->
  <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px;">Customer Directory & Profiles</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">View customer details, addresses, purchase history, and initiate direct communication.</p>
      </div>

      <div style="display: flex; gap: 12px; align-items: center;">
        <input type="text" id="userSearch" placeholder="Search by name, email, phone, city..." 
               style="padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; width: 280px;"
               onkeyup="filterUsers()">
        <button onclick="openCreateModal()" style="background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
          + Add New Customer
        </button>
      </div>
    </div>

    <div style="overflow-x: auto;">
      <table id="usersTable" style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b;">
            <th style="padding: 12px 10px;">CUSTOMER</th>
            <th style="padding: 12px 10px;">CONTACT & WHATSAPP</th>
            <th style="padding: 12px 10px;">LOCATION / ADDRESS</th>
            <th style="padding: 12px 10px;">ORDERS</th>
            <th style="padding: 12px 10px;">LIFETIME SPEND</th>
            <th style="padding: 12px 10px;">STATUS</th>
            <th style="padding: 12px 10px;">JOINED</th>
            <th style="padding: 12px 10px; text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($users)): ?>
            <tr><td colspan="8" style="padding: 32px; text-align: center; color: #94a3b8;">No registered customers in the database yet.</td></tr>
          <?php else: ?>
            <?php foreach ($users as $u): 
              $cleanPhone = preg_replace('/[^0-9]/', '', $u['phone'] ?? '');
              if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
              $encodedJson = htmlspecialchars(json_encode($u), ENT_QUOTES, 'UTF-8');
            ?>
              <tr class="user-row" style="border-bottom: 1px solid #f1f5f9;" data-search="<?= strtolower(htmlspecialchars(($u['name']??'').' '.($u['email']??'').' '.($u['phone']??'').' '.($u['city']??''))) ?>">
                <td style="padding: 12px 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; border: 1px solid #bfdbfe;">
                      <?= strtoupper(substr($u['name'] ?? 'U', 0, 1)) ?>
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #0f172a;"><?= htmlspecialchars($u['name'] ?? 'Unnamed User') ?></div>
                      <div style="font-size: 12px; color: #64748b;"><?= htmlspecialchars($u['email'] ?? 'No email') ?></div>
                    </div>
                  </div>
                </td>

                <td style="padding: 12px 10px;">
                  <div style="font-weight: 600; color: #334155;"><?= htmlspecialchars($u['phone'] ?: 'N/A') ?></div>
                  <?php if ($cleanPhone): ?>
                    <a href="https://wa.me/<?= $cleanPhone ?>?text=<?= urlencode('Hello ' . ($u['name']??'Valued Customer') . ', greeting from Jijau Computers!') ?>" target="_blank"
                       style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #16a34a; font-weight: 700; text-decoration: none; margin-top: 2px;">
                      💬 Chat WhatsApp
                    </a>
                  <?php endif; ?>
                </td>

                <td style="padding: 12px 10px; max-width: 200px;">
                  <div style="font-weight: 600; color: #0f172a;"><?= htmlspecialchars($u['city'] ?: 'City not set') ?><?= !empty($u['pincode']) ? ' - ' . htmlspecialchars($u['pincode']) : '' ?></div>
                  <div style="font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="<?= htmlspecialchars($u['address'] ?? '') ?>">
                    <?= htmlspecialchars($u['address'] ?: 'No street address') ?>
                  </div>
                </td>

                <td style="padding: 12px 10px;">
                  <span style="display: inline-block; background: #f1f5f9; color: #475569; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 12px;">
                    <?= (int)$u['orderCount'] ?> orders
                  </span>
                </td>

                <td style="padding: 12px 10px; font-weight: 800; color: #0f172a;">
                  ₹<?= number_format((float)$u['totalSpend']) ?>
                </td>

                <td style="padding: 12px 10px;">
                  <?php if (!empty($u['isVerified'])): ?>
                    <span style="background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                      ✓ Verified
                    </span>
                  <?php else: ?>
                    <span style="background: #f1f5f9; color: #64748b; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">
                      Standard
                    </span>
                  <?php endif; ?>
                </td>

                <td style="padding: 12px 10px; color: #64748b; font-size: 12px;">
                  <?= !empty($u['createdAt']) ? date('d M Y', strtotime($u['createdAt'])) : '—' ?>
                </td>

                <td style="padding: 12px 10px; text-align: right;">
                  <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button onclick='openEditModal(<?= $encodedJson ?>)' style="background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                      Edit
                    </button>
                    <form method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this customer?');">
                      <input type="hidden" name="action" value="delete">
                      <input type="hidden" name="id" value="<?= htmlspecialchars($u['id']) ?>">
                      <button type="submit" style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- CREATE CUSTOMER MODAL -->
<div id="createModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
  <div style="background: white; border-radius: 12px; width: 100%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">Add New Registered Customer</h3>
      <button onclick="closeCreateModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">✕</button>
    </div>
    <form method="POST">
      <input type="hidden" name="action" value="create">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Full Name *</label>
          <input type="text" name="name" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="e.g. Rahul Patil">
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Email ID *</label>
          <input type="email" name="email" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="rahul@example.com">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Phone Number</label>
            <input type="tel" name="phone" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="9876543210">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Password</label>
            <input type="password" name="password" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="Default: Customer@123">
          </div>
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Street Address</label>
          <input type="text" name="address" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="Shop / Flat No, Landmark">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">City / District</label>
            <input type="text" name="city" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="e.g. Jalna / Aurangabad">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Pincode</label>
            <input type="text" name="pincode" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="431203">
          </div>
        </div>
        <div style="margin-top: 4px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155; font-weight: 600; cursor: pointer;">
            <input type="checkbox" name="isVerified" value="1" checked> Mark as Verified Customer
          </label>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button type="button" onclick="closeCreateModal()" style="background: #f1f5f9; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; color: #475569;">Cancel</button>
        <button type="submit" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer;">Save Customer</button>
      </div>
    </form>
  </div>
</div>

<!-- EDIT CUSTOMER MODAL -->
<div id="editModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
  <div style="background: white; border-radius: 12px; width: 100%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">Edit Customer Details</h3>
      <button onclick="closeEditModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">✕</button>
    </div>
    <form method="POST">
      <input type="hidden" name="action" value="edit">
      <input type="hidden" id="edit_id" name="id">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Full Name *</label>
          <input type="text" id="edit_name" name="name" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Email ID (Read-only)</label>
          <input type="email" id="edit_email" disabled style="width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 6px; font-size: 13px; color: #64748b;">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Phone Number</label>
            <input type="tel" id="edit_phone" name="phone" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Reset Password (optional)</label>
            <input type="password" name="password" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" placeholder="Leave blank to keep current">
          </div>
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Street Address</label>
          <input type="text" id="edit_address" name="address" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">City / District</label>
            <input type="text" id="edit_city" name="city" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Pincode</label>
            <input type="text" id="edit_pincode" name="pincode" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          </div>
        </div>
        <div style="margin-top: 4px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #334155; font-weight: 600; cursor: pointer;">
            <input type="checkbox" id="edit_isVerified" name="isVerified" value="1"> Mark as Verified Customer
          </label>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button type="button" onclick="closeEditModal()" style="background: #f1f5f9; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; color: #475569;">Cancel</button>
        <button type="submit" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer;">Save Changes</button>
      </div>
    </form>
  </div>
</div>

<script>
function filterUsers() {
  const query = document.getElementById('userSearch').value.toLowerCase();
  const rows = document.querySelectorAll('.user-row');
  rows.forEach(row => {
    const searchData = row.getAttribute('data-search') || '';
    if (searchData.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function openCreateModal() {
  const modal = document.getElementById('createModal');
  modal.style.display = 'flex';
}

function closeCreateModal() {
  const modal = document.getElementById('createModal');
  modal.style.display = 'none';
}

function openEditModal(user) {
  document.getElementById('edit_id').value = user.id || '';
  document.getElementById('edit_name').value = user.name || '';
  document.getElementById('edit_email').value = user.email || '';
  document.getElementById('edit_phone').value = user.phone || '';
  document.getElementById('edit_address').value = user.address || '';
  document.getElementById('edit_city').value = user.city || '';
  document.getElementById('edit_pincode').value = user.pincode || '';
  document.getElementById('edit_isVerified').checked = (user.isVerified == 1 || user.isVerified === true);

  const modal = document.getElementById('editModal');
  modal.style.display = 'flex';
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  modal.style.display = 'none';
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
