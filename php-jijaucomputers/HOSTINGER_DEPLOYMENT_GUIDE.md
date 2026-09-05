# 🚀 Jijau Computers - Hostinger Shared Web Hosting Deployment Guide

## Overview
This package is a **100% native PHP 8.x web application** designed specifically to run seamlessly on **Hostinger Shared Web Hosting (Single, Premium, or Business Web Hosting)** with **Apache / LiteSpeed Web Server** and **PHP 8.0 - 8.3**.

Built with ❤️ by **Tech Sprout**.

---

## 📦 What's Inside `hostinger_php_deploy.zip`
- `index.php` - Homepage with dynamic hero banners, quick categories, bestseller grid, custom rig promo
- `products.php` - Comprehensive hardware catalog with Category, Brand, Price filters & sorting
- `product-detail.php` - Interactive product gallery, specs table, live reviews, 1-click WhatsApp purchase, Add to Cart & Buy Now
- `cart.php` & `checkout.php` - Complete shopping cart & checkout with Cash on Delivery / UPI
- `order-success.php` - Order confirmation screen with instant GST tax invoice download & WhatsApp notification
- `custom-pc.php` - Interactive Custom PC Builder with live power (Wattage) calculator & estimated pricing
- `devices.php` - Category hub for Laptops, Smartphones, CCTV, and Printers
- `track-service.php` - Universal live status tracker for Hardware Orders (`JC-ORD-xxx`) and Repair Tickets (`JC-SRV-xxx`)
- `invoice.php` - Strict 1-Page Guaranteed GST Tax Invoice & Service Bill generator (Print / PDF ready)
- `admin/` - Complete 13-Module Admin ERP Control Center (`/admin/login.php` with credentials: `admin` / `adminpassword123`)
- `database/jijau.db` - Pre-configured SQLite database with full product catalog, reviews, orders, and store settings
- `.htaccess` - Security headers, database file protection, clean URLs, and browser asset caching

---

## 🛠️ Step-by-Step 3-Minute Deployment on Hostinger

### Step 1: Log in to Hostinger hPanel
1. Open [https://hpanel.hostinger.com/](https://hpanel.hostinger.com/) and log in.
2. Click on **Websites** and click **Manage** next to `jijaucomputers.in` (or your domain).

### Step 2: Upload `hostinger_php_deploy.zip`
1. Under the **Files** section, click on **File Manager**.
2. Navigate into the **`public_html`** directory.
3. Click the **Upload** button (arrow pointing up icon) at top right.
4. Select `hostinger_php_deploy.zip` from your computer.
5. Once uploaded, right-click `hostinger_php_deploy.zip` and click **Extract**.
6. Choose `public_html` as the extract target.
7. Ensure all files (`index.php`, `admin/`, `includes/`, `public/`, `database/`, `.htaccess`) are directly inside `public_html`.

### Step 3: Verify PHP Configuration
1. In hPanel, go to **Advanced** → **PHP Configuration**.
2. Make sure **PHP Version** is set to **PHP 8.1, 8.2, or 8.3**.
3. Under **PHP Extensions**, ensure `pdo_sqlite` and `sqlite3` are enabled (enabled by default on all Hostinger plans).

### Step 4: Access Your Live Website & Admin Panel
- **Storefront Website**: `https://jijaucomputers.in/`
- **Admin Control Center**: `https://jijaucomputers.in/admin/login.php`
  - **Username**: `admin`
  - **Password**: `adminpassword123`

---

## 🔒 Security & Database Permissions
- SQLite database permissions: Hostinger automatically grants read/write permissions to `database/jijau.db`.
- The bundled `.htaccess` file prevents visitors from downloading or viewing `.db` files directly in browsers.

## 🏢 Technical Architecture
- **Engine**: PHP 8.x + SQLite (Zero external database setup required)
- **Styling**: Vanilla Modern CSS + Responsive Design System
- **Tax Compliance**: 18% CGST + SGST Calculation, HSN Code 84713010, Number to Words INR converter
- **Engineering Partner**: Tech Sprout
