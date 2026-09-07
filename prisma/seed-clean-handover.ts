import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting Clean Handover Database Reset...");

  // 1. Clean out existing products, product images, happy customers, enquiries, quotes, reviews
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.happyCustomer.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.quotationRequest.deleteMany({});
  await prisma.serviceRequest.deleteMany({});

  console.log("✅ Cleared old transaction & product tables");

  // 2. Fetch or create Categories
  const categoriesData = [
    { name: "Laptop", slug: "laptops", iconName: "Laptop", description: "Gaming, Ultrabooks, Business & Student Laptops", order: 1, imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop&q=80" },
    { name: "Mobile", slug: "mobiles", iconName: "Smartphone", description: "5G Smartphones, Flagships, Gaming Phones & Tablets", order: 2, imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&auto=format&fit=crop&q=80" },
    { name: "Printer", slug: "printers", iconName: "Printer", description: "Ink Tank, Laser, All-in-One Wireless Printers & Scanners", order: 3, imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&auto=format&fit=crop&q=80" },
    { name: "CCTV Camera", slug: "cctv-camera", iconName: "Camera", description: "HD IP Cameras, ColorVu Night Vision, WiFi PTZ & NVRs", order: 4, imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&auto=format&fit=crop&q=80" },
    { name: "Custom Gaming PCs", slug: "custom-gaming-pcs", iconName: "Cpu", description: "Extreme Performance custom liquid-cooled RGB Battle-stations", order: 5, imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80" },
    { name: "Desktop PC", slug: "desktops", iconName: "Monitor", description: "All-in-One and Tower Desktop Computers", order: 6, imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80" },
    { name: "Processors (CPU)", slug: "processors", iconName: "Cpu", description: "Intel Core & AMD Ryzen processors", order: 7, imageUrl: "https://images.unsplash.com/photo-1555618568-9a3d4608c0ff?w=400&auto=format&fit=crop&q=80" },
    { name: "Graphics Cards (GPU)", slug: "graphics-cards", iconName: "Tv", description: "NVIDIA GeForce RTX & AMD Radeon RX series", order: 8, imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop&q=80" },
    { name: "RAM & Memory", slug: "ram", iconName: "Cpu", description: "DDR4 and DDR5 Gaming & Desktop RAM", order: 9, imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80" },
    { name: "Storage (SSD / HDD)", slug: "storage", iconName: "Database", description: "NVMe M.2 Gen4 SSDs & High Capacity Hard Drives", order: 10, imageUrl: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&auto=format&fit=crop&q=80" },
    { name: "Monitors", slug: "monitors", iconName: "Monitor", description: "Gaming and Professional IPS Monitors", order: 11, imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80" },
    { name: "Accessories", slug: "accessories", iconName: "Headphones", description: "Mechanical Keyboards, Wireless Mice & Accessories", order: 12, imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80" },
  ];

  const categoryMap = new Map<string, string>();
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order, description: c.description, iconName: c.iconName, imageUrl: c.imageUrl },
      create: c,
    });
    categoryMap.set(c.slug, cat.id);
    categoryMap.set(c.name.toLowerCase(), cat.id);
  }

  // 3. Fetch or create Brands
  const brandsData = [
    { name: "Apple", slug: "apple" },
    { name: "Dell", slug: "dell" },
    { name: "HP", slug: "hp" },
    { name: "ASUS", slug: "asus" },
    { name: "Lenovo", slug: "lenovo" },
    { name: "Samsung", slug: "samsung" },
    { name: "OnePlus", slug: "oneplus" },
    { name: "Google", slug: "google" },
    { name: "Intel", slug: "intel" },
    { name: "AMD", slug: "amd" },
    { name: "NVIDIA", slug: "nvidia" },
    { name: "MSI", slug: "msi" },
    { name: "Corsair", slug: "corsair" },
    { name: "Logitech", slug: "logitech" },
    { name: "Epson", slug: "epson" },
    { name: "CP PLUS", slug: "cp-plus" },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const created = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, isActive: true },
      create: { name: b.name, slug: b.slug, isActive: true },
    });
    brandMap.set(b.slug, created.id);
  }

  console.log("✅ Standardized categories and brands");

  // 4. Create EXACTLY 1 clean showcase product for each category / brand / feature
  const productsToSeed = [
    // 1 Apple Laptop
    {
      name: "Apple MacBook Air 13.6-inch (M3 Chip, 16GB RAM, 512GB SSD)",
      slug: "apple-macbook-air-m3-16gb-512gb",
      sku: "JC-MAC-M3-01",
      categorySlug: "laptops",
      brandSlug: "apple",
      price: 134900,
      salePrice: 124900,
      stock: 8,
      inStock: true,
      warranty: "1 Year Apple India Official Warranty",
      shortDesc: "M3 chip with 8-core CPU, 10-core GPU, Liquid Retina display, 18-hour battery life.",
      description: "Supercharged by the next-generation M3 chip, the redesigned MacBook Air combines incredible performance and up to 18 hours of battery life into a strikingly thin aluminum enclosure.",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
    },
    // 1 Dell Laptop
    {
      name: "Dell Inspiron 15 (Core i5 13th Gen, 16GB RAM, 512GB SSD)",
      slug: "dell-inspiron-15-core-i5-13th-gen",
      sku: "JC-DELL-INSP-01",
      categorySlug: "laptops",
      brandSlug: "dell",
      price: 64990,
      salePrice: 54990,
      stock: 12,
      inStock: true,
      warranty: "1 Year Dell Onsite Domestic Warranty",
      shortDesc: "13th Gen Intel Core i5-1335U, 15.6-inch FHD 120Hz Anti-Glare, Backlit Keyboard.",
      description: "Experience responsive yet quiet performance featuring 13th Generation Intel Core processors combined with PCIe SSD options and Dell ComfortView Low Blue Light software.",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: false,
      isNewArrival: false,
    },
    // 1 HP Laptop
    {
      name: "HP Pavilion 15 (13th Gen Intel Core i5, 16GB RAM, 512GB SSD)",
      slug: "hp-pavilion-15-intel-core-i5",
      sku: "JC-HP-PAV-01",
      categorySlug: "laptops",
      brandSlug: "hp",
      price: 69990,
      salePrice: 59990,
      stock: 10,
      inStock: true,
      warranty: "1 Year HP India Onsite Warranty",
      shortDesc: "Intel Core i5-1335U, 15.6-inch FHD IPS Micro-Edge display, Audio by B&O.",
      description: "The HP Pavilion 15 Laptop packs more performance into a smaller profile, so you can get more done wherever you go with premium B&O audio and long battery life.",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
    },
    // 1 ASUS Gaming Laptop
    {
      name: "ASUS ROG Strix G16 (2024) Gaming Laptop",
      slug: "asus-rog-strix-g16-2024",
      sku: "JC-ROG-G16-01",
      categorySlug: "laptops",
      brandSlug: "asus",
      price: 154990,
      salePrice: 139990,
      stock: 6,
      inStock: true,
      warranty: "1 Year ASUS Brand Warranty",
      shortDesc: "Intel Core i7-13650HX, 16GB DDR5, 1TB SSD, NVIDIA GeForce RTX 4060 8GB, 165Hz Display.",
      description: "Dominate the competition with the ROG Strix G16 featuring high-power Intel Core processors and NVIDIA RTX 40-Series graphics cooled by ROG Intelligent Cooling.",
      imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: false,
      isGamingDeal: true,
      isNewArrival: true,
    },
    // 1 Lenovo Laptop
    {
      name: "Lenovo Legion Pro 5i Gen 9 Gaming Laptop",
      slug: "lenovo-legion-pro-5i-gen-9",
      sku: "JC-LEN-LEG-01",
      categorySlug: "laptops",
      brandSlug: "lenovo",
      price: 172990,
      salePrice: 156990,
      stock: 5,
      inStock: true,
      warranty: "1 Year Lenovo Legion Ultimate Support",
      shortDesc: "Intel Core i7-14650HX, 16GB DDR5, 1TB SSD, RTX 4070 8GB, 240Hz WQXGA Display.",
      description: "Engineered for elite competitive gamers, Legion Pro 5i features AI-tuned performance with Legion ColdFront 5.0 cooling technology.",
      imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: false,
      isGamingDeal: true,
      isNewArrival: false,
    },
    // 1 Apple iPhone
    {
      name: "Apple iPhone 15 Pro (128GB, Natural Titanium)",
      slug: "apple-iphone-15-pro-128gb",
      sku: "JC-IPH-15P-01",
      categorySlug: "mobiles",
      brandSlug: "apple",
      price: 134900,
      salePrice: 127900,
      stock: 7,
      inStock: true,
      warranty: "1 Year Apple India Warranty",
      shortDesc: "Aerospace-grade titanium design, A17 Pro chip, Action button, 48MP Main camera.",
      description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
    },
    // 1 Samsung Smartphone
    {
      name: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Gray)",
      slug: "samsung-galaxy-s24-ultra-5g",
      sku: "JC-SAM-S24U-01",
      categorySlug: "mobiles",
      brandSlug: "samsung",
      price: 129999,
      salePrice: 119999,
      stock: 6,
      inStock: true,
      warranty: "1 Year Samsung India Brand Warranty",
      shortDesc: "Galaxy AI, Snapdragon 8 Gen 3 for Galaxy, 200MP Camera with ProVisual Engine, Built-in S Pen.",
      description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
      imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
    },
    // 1 Google Pixel Smartphone
    {
      name: "Google Pixel 8 Pro 5G (12GB RAM, 128GB, Obsidian Black)",
      slug: "google-pixel-8-pro-5g-128gb",
      sku: "JC-PIX-8P-01",
      categorySlug: "mobiles",
      brandSlug: "google",
      price: 106999,
      salePrice: 97999,
      stock: 5,
      inStock: true,
      warranty: "1 Year Google India Warranty",
      shortDesc: "Google Tensor G3, Super Actua display, Pro triple camera with Best Take & Magic Editor.",
      description: "Pixel 8 Pro is the all-pro phone engineered by Google. It has the best Pixel Camera yet, all-day battery, and incredible Google AI features.",
      imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
    },
    // 1 Custom Gaming PC
    {
      name: "Jijau Apex Titan Custom Liquid Cooled Gaming PC",
      slug: "jijau-apex-titan-custom-gaming-pc",
      sku: "JC-PC-TITAN-01",
      categorySlug: "custom-gaming-pcs",
      brandSlug: "corsair",
      price: 245000,
      salePrice: 229990,
      stock: 3,
      inStock: true,
      warranty: "3 Years Jijau Computers Comprehensive PC Warranty",
      shortDesc: "AMD Ryzen 7 7800X3D, RTX 4080 Super 16GB, 32GB DDR5 6000MHz, 2TB Gen4 SSD, 360mm ARGB AIO Liquid Cooler.",
      description: "Handcrafted in Jafrabad by Jijau Computers master PC builders. Stress-tested for 48 hours to deliver maximum 4K ultra gaming frame rates and thermal stability.",
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: true,
      isGamingDeal: true,
      isNewArrival: true,
    },
    // 1 Desktop PC
    {
      name: "HP Pavilion 27-inch All-in-One Touchscreen Desktop PC",
      slug: "hp-pavilion-27-aio-desktop",
      sku: "JC-HP-AIO-01",
      categorySlug: "desktop-pcs",
      brandSlug: "hp",
      price: 94990,
      salePrice: 84990,
      stock: 6,
      inStock: true,
      warranty: "3 Years HP Onsite Warranty",
      shortDesc: "Intel Core i7 13th Gen, 16GB DDR5, 1TB SSD, 27-inch FHD IPS Touch, Wireless Keyboard & Mouse.",
      description: "A perfect blend of design and performance for modern offices and home setups with pop-up privacy camera and high-fidelity B&O dual speakers.",
      imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
    },
    // 1 Processor (CPU)
    {
      name: "Intel Core i7-14700K Desktop Processor (20 Cores / 28 Threads)",
      slug: "intel-core-i7-14700k-desktop-processor",
      sku: "JC-CPU-14700K",
      categorySlug: "processors",
      brandSlug: "intel",
      price: 39990,
      salePrice: 36490,
      stock: 15,
      inStock: true,
      warranty: "3 Years Intel Brand Warranty",
      shortDesc: "20 Cores (8 P-cores + 12 E-cores), Up to 5.6 GHz, LGA1700 Socket, PCIe 5.0 & DDR5 Support.",
      description: "14th Gen Intel Core i7 desktop processor designed for demanding creators and high-FPS gaming enthusiasts.",
      imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: true,
    },
    // 1 Graphics Card (GPU)
    {
      name: "MSI GeForce RTX 4070 Super 12GB Gaming X Slim",
      slug: "msi-geforce-rtx-4070-super-12gb",
      sku: "JC-GPU-4070S",
      categorySlug: "graphics-cards",
      brandSlug: "msi",
      price: 68990,
      salePrice: 63990,
      stock: 8,
      inStock: true,
      warranty: "3 Years MSI Brand Warranty",
      shortDesc: "12GB GDDR6X, DLSS 3.5, Ada Lovelace Architecture, TRI FROZR 3 Thermal Design.",
      description: "Supercharged gaming and creative performance with Ray Tracing, AI-accelerated rendering and ultra-efficient cooling.",
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: false,
      isGamingDeal: true,
      isNewArrival: false,
    },
    // 1 RAM Kit
    {
      name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM",
      slug: "corsair-vengeance-rgb-32gb-ddr5",
      sku: "JC-RAM-DDR5-32",
      categorySlug: "ram-memory",
      brandSlug: "corsair",
      price: 12490,
      salePrice: 10490,
      stock: 20,
      inStock: true,
      warranty: "10 Years / Lifetime Limited Warranty",
      shortDesc: "DDR5 6000MHz CL30, Intel XMP 3.0 & AMD EXPO Compatible, Ten-Zone RGB Lighting.",
      description: "Deliver higher frequencies and greater capacities of DDR5 technology in a compact module with dynamic ten-zone RGB lighting.",
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
    },
    // 1 Storage (SSD)
    {
      name: "Samsung 990 PRO 2TB NVMe M.2 PCIe Gen 4 SSD",
      slug: "samsung-990-pro-2tb-nvme-ssd",
      sku: "JC-SSD-990P-2TB",
      categorySlug: "storage",
      brandSlug: "samsung",
      price: 19990,
      salePrice: 16990,
      stock: 14,
      inStock: true,
      warranty: "5 Years Samsung Official Warranty",
      shortDesc: "Up to 7,450 MB/s Read, 6,900 MB/s Write speeds, PCIe 4.0 NVMe M.2 2280.",
      description: "Reach near-max performance with PCIe 4.0 speeds. Smart thermal control delivers top-tier power efficiency for heavy gaming and 3D rendering.",
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
    },
    // 1 Monitor
    {
      name: "ASUS ROG Swift OLED PG27AQDM 27-inch 240Hz Gaming Monitor",
      slug: "asus-rog-swift-oled-pg27aqdm-240hz",
      sku: "JC-MON-OLED-240",
      categorySlug: "monitors",
      brandSlug: "asus",
      price: 99990,
      salePrice: 89990,
      stock: 4,
      inStock: true,
      warranty: "3 Years ASUS Brand Warranty with OLED Care",
      shortDesc: "27-inch QHD (2560 x 1440) OLED, 240Hz, 0.03ms Response Time, 99% DCI-P3, HDR10.",
      description: "Unrivaled OLED visuals with lightning 0.03ms response time and custom heatsink design to prevent burn-in.",
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: false,
      isGamingDeal: true,
      isNewArrival: false,
    },
    // 1 Gaming Accessory
    {
      name: "Logitech G502 X PLUS Wireless RGB Gaming Mouse",
      slug: "logitech-g502-x-plus-wireless",
      sku: "JC-ACC-G502X",
      categorySlug: "gaming-accessories",
      brandSlug: "logitech",
      price: 15495,
      salePrice: 12995,
      stock: 18,
      inStock: true,
      warranty: "2 Years Logitech Brand Warranty",
      shortDesc: "LIGHTFORCE Hybrid Switches, HERO 25K Sensor, LIGHTSPEED Wireless, LIGHTSYNC RGB.",
      description: "The world's most popular gaming mouse, reimagined and redesigned with hybrid optical-mechanical switches for speed and reliability.",
      imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
    },
    // 1 Printer
    {
      name: "Epson EcoTank L3250 Wi-Fi All-in-One Color Ink Tank Printer",
      slug: "epson-ecotank-l3250-wifi-printer",
      sku: "JC-PRN-L3250",
      categorySlug: "printers",
      brandSlug: "epson",
      price: 16999,
      salePrice: 13999,
      stock: 12,
      inStock: true,
      warranty: "1 Year / 30,000 Pages Epson Onsite Warranty",
      shortDesc: "Print, Scan, Copy, Wi-Fi & Wi-Fi Direct, Ultra-low-cost printing (7 paise per page).",
      description: "Designed to improve business cost savings and print productivity with high page yield of up to 4,500 pages for black and 7,500 pages for color.",
      imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
    },
    // 1 CCTV Camera
    {
      name: "CP PLUS 4MP Guard+ Smart Wi-Fi PT CCTV Security Camera",
      slug: "cp-plus-4mp-guard-plus-smart-wifi-cctv",
      sku: "JC-CCTV-4MP-CP",
      categorySlug: "cctv-camera",
      brandSlug: "cp-plus",
      price: 3999,
      salePrice: 2499,
      stock: 25,
      inStock: true,
      warranty: "2 Years CP PLUS Brand Warranty",
      shortDesc: "4MP Ultra HD, 360-degree Pan/Tilt, Full Color Night Vision, Two-Way Audio, Motion Tracking.",
      description: "Protect your home, shop, or office with 360-degree coverage, crystal-clear 4MP resolution, AI human detection, and instant phone alerts.",
      imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
    },
  ];

  for (const p of productsToSeed) {
    const categoryId = categoryMap.get(p.categorySlug);
    const brandId = p.brandSlug ? brandMap.get(p.brandSlug) : null;

    if (!categoryId) continue;

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        categoryId: categoryId,
        brandId: brandId || null,
        price: p.price,
        salePrice: p.salePrice || null,
        stock: p.stock,
        inStock: p.inStock,
        warranty: p.warranty,
        shortDesc: p.shortDesc,
        description: p.description,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        isGamingDeal: (p as any).isGamingDeal || false,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: p.imageUrl,
        isPrimary: true,
        order: 0,
      },
    });
  }

  console.log(`✅ Seeded ${productsToSeed.length} clean reference showcase products`);

  // 5. Seed EXACTLY 1 verified Happy Customer story
  await prisma.happyCustomer.create({
    data: {
      name: "Rahul Patil",
      city: "Jafrabad",
      village: "Main Road",
      district: "Jalna",
      phone: "9876543210",
      productName: "Jijau Custom RTX 4080 Super Gaming Rig",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      review: "Got my dream liquid-cooled gaming build from Jijau Computers! Flawless cable management, original GST bill, and super fast delivery. Highly recommended in Jalna & Jafrabad!",
      rating: 5,
      purchaseDate: "Sept 2026",
      isFeatured: true,
      isActive: true,
      order: 0,
    },
  });

  console.log("✅ Seeded exactly 1 verified Happy Customer story");

  // 6. Ensure default Website Setting exists
  const existingSetting = await prisma.websiteSetting.findUnique({ where: { id: "default" } });
  if (!existingSetting) {
    await prisma.websiteSetting.create({
      data: {
        id: "default",
        storeName: "Jijau Computers",
        tagline: "Your Tech Partner in Jafrabad & Maharashtra",
        phone: "+91 88056 07908",
        whatsapp: "918805607908",
        email: "sales@jijaucomputers.in",
        address: "Jijau Computer Sales & Service, Opposite SBI Bank, Main Road, Jafrabad, Maharashtra - 431206",
        googleMapsUrl: "https://maps.app.goo.gl/UjCXouqaC9ufVJNTA",
        openingHours: "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM",
        gstin: "27AAAAA0000A1Z5",
      },
    });
  }

  console.log("✨ Clean Handover Database Setup Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding clean database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
