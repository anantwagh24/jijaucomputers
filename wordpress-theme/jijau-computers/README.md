# Jijau Computers - WordPress Custom Theme Package

A complete, production-ready WordPress & WooCommerce compatible theme built for **Jijau Computers** with interactive custom PC configurator, 4-stacked device explorer (Laptop, Mobile, Printer, CCTV Camera), live repair tracking, and instant WhatsApp / UPI deep-linking.

---

## 📁 Package Structure

```
wordpress-theme/jijau-computers/
├── style.css                  # Theme metadata & global stylesheet
├── functions.php              # WooCommerce setup, customizer settings & custom post types
├── header.php                 # Sticky top bar, hotline, search & navigation
├── footer.php                 # Footer links, floating WhatsApp & mobile bottom navigation
├── front-page.php             # Homepage with Hero banner & device stack showcase
├── page-devices.php           # 4-Category Device & Brand Stack Explorer (Laptop, Mobile, Printer, CCTV)
├── page-custom-pc.php         # Interactive Custom PC Builder with live wattage & WhatsApp quote
├── page-track-service.php     # Live Laptop & Hardware Repair Request Tracker
├── page-quote-request.php     # Corporate B2B Quotation Form
├── index.php                  # Default / Blog page template
└── assets/
    └── js/
        └── main.js            # Interactive JS (Stack filtering, brand filtering, WhatsApp link generator)
```

---

## 🚀 How to Install in WordPress

### Step 1: Zip the Theme Folder
Navigate to the `wordpress-theme/` directory and compress the `jijau-computers` folder into `jijau-computers.zip`.

### Step 2: Upload to WordPress
1. Log in to your WordPress Admin Dashboard (`/wp-admin`).
2. Go to **Appearance > Themes**.
3. Click **Add New Theme > Upload Theme**.
4. Choose `jijau-computers.zip` and click **Install Now**.
5. Click **Activate**.

### Step 3: Configure Store Contact & UPI Settings
1. Go to **Appearance > Customize > Jijau Computers Store Settings**.
2. Update:
   - **Phone Number**: `+91 88056 07908`
   - **WhatsApp Number**: `918805607908`
   - **Store UPI VPA ID**: `jijauc@ibl` (or your store UPI ID)
   - **UPI Merchant Name**: `Jijau Computers`
   - **Store Address & Business Hours**
3. Click **Publish**.

### Step 4: Create the Custom Pages
Go to **Pages > Add New** and create:
1. **Devices Hub**: Assign Template -> `4-Category Device & Brand Stack Explorer` (Slug: `devices`).
2. **Custom PC Builder**: Assign Template -> `Interactive Custom PC Builder` (Slug: `custom-pc`).
3. **Track Repair Ticket**: Assign Template -> `Live Service & Repair Tracking Portal` (Slug: `track-service`).
4. **B2B Quotation**: Assign Template -> `Corporate & B2B Quotation Request` (Slug: `quote-request`).

---

## ✨ Features Included

- **4-Category Stacked Device Explorer**:
  - **1. Laptop** (Dell, HP, ASUS, Lenovo, Apple)
  - **2. Mobile** (Apple, Samsung, OnePlus, Xiaomi)
  - **3. Printer** (HP, Epson, Canon, Brother)
  - **4. CCTV Camera** (CP PLUS, Hikvision, TP-Link)
- **Instant WhatsApp Link Generator**: Pre-fills itemized orders, custom rig configurations, and product inquiries.
- **Instant UPI Intent Triggering**: Launches Google Pay, PhonePe, Paytm, or BHIM directly on mobile devices.
- **Mobile, Foldable & Tablet Responsive**: Includes dedicated bottom navigation bar for small screens.
- **WooCommerce Ready**: Compatible with standard WooCommerce catalogs, carts, and checkout pipelines.
