/**
 * Main Client JavaScript for Jijau Computers PHP Application
 */

function showToast(message, type = 'success') {
  const existing = document.getElementById('global-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'global-toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.zIndex = '9999';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '10px';
  toast.style.fontWeight = '700';
  toast.style.fontSize = '14px';
  toast.style.color = '#ffffff';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.background = type === 'success' ? '#16a34a' : '#dc2626';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  toast.style.transition = 'all 0.3s';
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span><span>${message}</span>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

async function addToCart(productId, name = '', price = 0, image = '') {
  try {
    const res = await fetch('/api/cart.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', productId, id: productId, name, price, image, quantity: 1 })
    });
    const data = await res.json();
    if (data.success) {
      updateCartUI(data.cartCount, data.cartTotalFormatted || ('₹' + (data.cartTotal || 0).toLocaleString('en-IN')));
      showToast('Added to Cart!');
    } else {
      showToast(data.message || 'Could not add to cart', 'error');
    }
  } catch (err) {
    showToast('Item added to cart!');
  }
}

async function updateCartQty(productId, quantity) {
  try {
    const res = await fetch('/api/cart.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', productId, quantity })
    });
    const data = await res.json();
    if (data.success) {
      location.reload();
    }
  } catch (err) {
    location.reload();
  }
}

async function removeFromCart(productId) {
  try {
    const res = await fetch('/api/cart.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', productId })
    });
    const data = await res.json();
    if (data.success) {
      location.reload();
    }
  } catch (err) {
    location.reload();
  }
}

async function clearCart() {
  if (!confirm('Are you sure you want to clear your cart?')) return;
  try {
    const res = await fetch('/api/cart.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear' })
    });
    const data = await res.json();
    location.reload();
  } catch (err) {
    location.reload();
  }
}

function updateCartUI(count, totalFormatted) {
  const countElem = document.getElementById('header-cart-count');
  const totalElem = document.getElementById('header-cart-total');

  if (countElem) {
    countElem.textContent = count;
  }
  if (totalElem) {
    totalElem.textContent = totalFormatted;
  }
}

async function submitReview(e, productId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const payload = {
    productId,
    customerName: formData.get('customerName'),
    customerPhone: formData.get('customerPhone'),
    rating: parseInt(formData.get('rating') || 5),
    title: formData.get('title'),
    comment: formData.get('comment')
  };

  try {
    const res = await fetch('/api/reviews.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert('🎉 Thank you! Your review has been submitted.');
      form.reset();
      location.reload();
    } else {
      alert('Error: ' + (data.error || 'Failed to submit review.'));
    }
  } catch (err) {
    alert('Network error. Please try again.');
  }
}
