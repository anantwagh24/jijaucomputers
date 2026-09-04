<?php
/**
 * 1-Click Demo Data Importer for Jijau Computers Core Plugin
 * Seeds all products, categories, brands, banners, offers, and settings matching prisma/seed.ts
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jijau_Demo_Importer {

    public static function get_default_dataset() {
        return array(
            'settings' => array(
                'storeName' => 'Jijau Computers',
                'tagline' => 'Pune\'s #1 Destination for Laptops, Custom Gaming PCs & Computer Hardware',
                'phone' => '+91 88056 07908',
                'whatsapp' => '918805607908',
                'email' => 'sales@jijaucomputers.in',
                'address' => 'Shop No. 12 & 13, Jijau Plaza, Near Railway Station, Shivajinagar, Pune, Maharashtra 411005',
                'googleMapsUrl' => 'https://maps.google.com/?q=Shivajinagar,Pune,Maharashtra',
                'openingHours' => 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM',
                'gstin' => '27FQIPK5154C1ZU',
                'upiId' => 'jijauc@ibl',
                'upiName' => 'Jijau Computers',
                'metaTitle' => 'Jijau Computers - Premium Laptops, Gaming PCs & Hardware Store in Pune',
                'metaDescription' => 'Explore the best deals on custom gaming PCs, laptops, graphics cards, processors, CCTV, and same-day repair services at Jijau Computers Pune.'
            ),
            'categories' => array(
                array('id' => 'cat-1', 'name' => 'Laptop', 'slug' => 'laptops', 'description' => 'Gaming, Ultrabooks, Business & Student Laptops', 'imageUrl' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', 'order' => 1, 'isActive' => true),
                array('id' => 'cat-2', 'name' => 'Mobile', 'slug' => 'mobiles', 'description' => '5G Smartphones, Flagships, Gaming Phones & Tablets', 'imageUrl' => 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80', 'order' => 2, 'isActive' => true),
                array('id' => 'cat-3', 'name' => 'Printer', 'slug' => 'printers', 'description' => 'Ink Tank, Laser, All-in-One Wireless Printers & Scanners', 'imageUrl' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80', 'order' => 3, 'isActive' => true),
                array('id' => 'cat-4', 'name' => 'CCTV Camera', 'slug' => 'cctv-camera', 'description' => 'HD IP Cameras, ColorVu Night Vision, WiFi PTZ & NVRs', 'imageUrl' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80', 'order' => 4, 'isActive' => true),
                array('id' => 'cat-5', 'name' => 'Custom Gaming PCs', 'slug' => 'custom-gaming-pcs', 'description' => 'Extreme Performance custom liquid-cooled RGB Battle-stations', 'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', 'order' => 5, 'isActive' => true),
                array('id' => 'cat-6', 'name' => 'Processors (CPU)', 'slug' => 'processors', 'description' => 'Intel Core 14th Gen & AMD Ryzen 7000/9000 series', 'imageUrl' => 'https://images.unsplash.com/photo-1555618568-9a3d4608c0ff?w=800&auto=format&fit=crop&q=80', 'order' => 6, 'isActive' => true),
                array('id' => 'cat-7', 'name' => 'Graphics Cards (GPU)', 'slug' => 'graphics-cards', 'description' => 'NVIDIA GeForce RTX 40 & AMD Radeon RX series', 'imageUrl' => 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80', 'order' => 7, 'isActive' => true),
                array('id' => 'cat-8', 'name' => 'Monitors', 'slug' => 'monitors', 'description' => 'High Refresh Rate 144Hz-240Hz Gaming & 4K IPS Displays', 'imageUrl' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 'order' => 8, 'isActive' => true),
            ),
            'brands' => array(
                array('name' => 'ASUS', 'slug' => 'asus', 'logoUrl' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'HP', 'slug' => 'hp', 'logoUrl' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Dell', 'slug' => 'dell', 'logoUrl' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Lenovo', 'slug' => 'lenovo', 'logoUrl' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Apple', 'slug' => 'apple', 'logoUrl' => 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Samsung', 'slug' => 'samsung', 'logoUrl' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'OnePlus', 'slug' => 'oneplus', 'logoUrl' => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Xiaomi', 'slug' => 'xiaomi', 'logoUrl' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Epson', 'slug' => 'epson', 'logoUrl' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Canon', 'slug' => 'canon', 'logoUrl' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Brother', 'slug' => 'brother', 'logoUrl' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'CP PLUS', 'slug' => 'cp-plus', 'logoUrl' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Hikvision', 'slug' => 'hikvision', 'logoUrl' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'TP-Link', 'slug' => 'tp-link', 'logoUrl' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Intel', 'slug' => 'intel', 'logoUrl' => 'https://images.unsplash.com/photo-1555618568-9a3d4608c0ff?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'AMD', 'slug' => 'amd', 'logoUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'Corsair', 'slug' => 'corsair', 'logoUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
                array('name' => 'MSI', 'slug' => 'msi', 'logoUrl' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=120&auto=format&fit=crop&q=80', 'isActive' => true),
            ),
            'banners' => array(
                array(
                    'id' => 'ban-1',
                    'title' => 'Jijau Custom Gaming Battlestations',
                    'subtitle' => 'Unleash Ultimate Power with Intel 14th Gen & RTX 4080 Super | Custom Liquid Cooling & Rig Tuning in Pune',
                    'tag' => 'FLAGSHIP PC BUILDS',
                    'imageUrl' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1400&auto=format&fit=crop&q=80',
                    'ctaText' => 'Build Custom PC',
                    'ctaLink' => '/custom-pc',
                    'order' => 1,
                    'isActive' => true,
                ),
                array(
                    'id' => 'ban-2',
                    'title' => 'Mega Laptop Festival 2026',
                    'subtitle' => 'Up to ₹25,000 Off on ASUS ROG, HP OMEN, Lenovo Legion & Dell XPS + Free Laptop Bag',
                    'tag' => 'FESTIVAL SPECIAL',
                    'imageUrl' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1400&auto=format&fit=crop&q=80',
                    'ctaText' => 'Shop Laptop Deals',
                    'ctaLink' => '/devices?cat=laptop',
                    'order' => 2,
                    'isActive' => true,
                ),
            ),
            'offers' => array(
                array(
                    'id' => 'off-1',
                    'title' => 'Festive Mega Hardware Sale',
                    'badge' => 'LIMITED TIME',
                    'description' => 'Flat ₹5,000 OFF on all custom PC builds over ₹75,000. Includes free cable management.',
                    'bannerUrl' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                    'discountPct' => 15,
                    'couponCode' => 'GAMING5K',
                    'isActive' => true,
                ),
                array(
                    'id' => 'off-2',
                    'title' => 'Storewide Welcome Discount',
                    'badge' => 'SPECIAL OFFER',
                    'description' => 'Get 10% instant discount on accessories and peripherals with coupon JIJAU10.',
                    'bannerUrl' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
                    'discountPct' => 10,
                    'couponCode' => 'JIJAU10',
                    'isActive' => true,
                ),
            ),
            'products' => array(
                array('id' => 'p-1', 'name' => 'Lenovo Legion Pro 5i Gen 9 Gaming Laptop', 'brand' => 'Lenovo', 'category' => 'Laptop', 'price' => 178000, 'salePrice' => 159990, 'stock' => 5, 'discount' => '10% OFF', 'specs' => 'Intel Core i9-14900HX, 32GB DDR5 RAM, 1TB Gen4 SSD, NVIDIA RTX 4070 8GB, 16-inch WQXGA 240Hz 500 nits HDR.', 'image' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-2', 'name' => 'ASUS ROG Strix G16 (2024) Gaming Laptop', 'brand' => 'ASUS', 'category' => 'Laptop', 'price' => 139990, 'salePrice' => 124990, 'stock' => 8, 'discount' => '11% OFF', 'specs' => '16-inch QHD+ 240Hz display, Intel Core i7-13650HX, 16GB DDR5, 1TB NVMe SSD, RTX 4060 8GB GDDR6.', 'image' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-3', 'name' => 'Jijau Apex Titan Custom Gaming PC Build', 'brand' => 'Corsair', 'category' => 'Custom Gaming PCs', 'price' => 245000, 'salePrice' => 229990, 'stock' => 3, 'discount' => '6% OFF', 'specs' => 'Intel Core i7-14700K, RTX 4080 Super 16GB, 32GB DDR5 6000MHz RGB, 2TB Gen4 SSD, 360mm Liquid Cooler.', 'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-4', 'name' => 'Jijau Creator Pro Workstation PC', 'brand' => 'AMD', 'category' => 'Custom Gaming PCs', 'price' => 189000, 'salePrice' => 174990, 'stock' => 4, 'discount' => '7% OFF', 'specs' => 'AMD Ryzen 9 7900X, RTX 4070 Ti Super 16GB, 64GB DDR5 RAM, 2TB SSD, High-End Workstation Case.', 'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-5', 'name' => 'Dell G15 5530 Gaming Laptop (Intel i7-13650HX, RTX 4060)', 'brand' => 'Dell', 'category' => 'Laptop', 'price' => 125000, 'salePrice' => 109990, 'stock' => 6, 'discount' => '12% OFF', 'specs' => '15.6-inch FHD 165Hz sRGB 100%, 13th Gen Intel Core i7-13650HX, 16GB DDR5, 1TB SSD, RTX 4060 8GB.', 'image' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-6', 'name' => 'Apple iPhone 15 Pro 128GB (Natural Titanium)', 'brand' => 'Apple', 'category' => 'Mobile', 'price' => 134900, 'salePrice' => 124990, 'stock' => 7, 'discount' => '7% OFF', 'specs' => 'A17 Pro chip, Aerospace-grade titanium, 48MP Pro camera system, Action button, USB-C with USB 3 speeds.', 'image' => 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-7', 'name' => 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)', 'brand' => 'Samsung', 'category' => 'Mobile', 'price' => 129999, 'salePrice' => 119999, 'stock' => 6, 'discount' => '8% OFF', 'specs' => 'Snapdragon 8 Gen 3 for Galaxy, 200MP Quad Telephoto Camera, Built-in S Pen, Titanium frame.', 'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-8', 'name' => 'OnePlus 12 5G (16GB RAM, 512GB, Silky Black)', 'brand' => 'OnePlus', 'category' => 'Mobile', 'price' => 69999, 'salePrice' => 64999, 'stock' => 10, 'discount' => '7% OFF', 'specs' => 'Snapdragon 8 Gen 3, 2K 120Hz ProXDR Display, 4th Gen Hasselblad Camera for Mobile, 100W SUPERVOOC.', 'image' => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-9', 'name' => 'HP Smart Tank 580 All-in-One WiFi Color Printer', 'brand' => 'HP', 'category' => 'Printer', 'price' => 15999, 'salePrice' => 13490, 'stock' => 10, 'discount' => '16% OFF', 'specs' => 'Print, Scan, Copy with High-capacity ink tank. Up to 12,000 black or 6,000 color pages in the box.', 'image' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-10', 'name' => 'Epson EcoTank L3250 Wi-Fi All-in-One Ink Tank Printer', 'brand' => 'Epson', 'category' => 'Printer', 'price' => 17999, 'salePrice' => 14999, 'stock' => 14, 'discount' => '17% OFF', 'specs' => 'Wireless printing with Heat-Free Technology. Ultra-high page yield of 4,500 pages (black) and 7,500 pages (color).', 'image' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-11', 'name' => 'Canon PIXMA MegaTank G3010 Wireless All-in-One Printer', 'brand' => 'Canon', 'category' => 'Printer', 'price' => 16500, 'salePrice' => 13990, 'stock' => 11, 'discount' => '15% OFF', 'specs' => 'High volume printing at low cost with integrated ink tanks. Canon PRINT Inkjet/SELPHY app compatible.', 'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-12', 'name' => 'Brother DCP-T820DW Auto-Duplex Wireless Ink Tank Printer', 'brand' => 'Brother', 'category' => 'Printer', 'price' => 22000, 'salePrice' => 18990, 'stock' => 8, 'discount' => '14% OFF', 'specs' => 'Automatic 2-Sided Printing, 20-sheet Auto Document Feeder, Ethernet & Wireless connectivity.', 'image' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-13', 'name' => 'CP PLUS 4MP Guard+ Smart Wi-Fi PT CCTV Camera', 'brand' => 'CP PLUS', 'category' => 'CCTV Camera', 'price' => 3800, 'salePrice' => 2499, 'stock' => 25, 'discount' => '34% OFF', 'specs' => '4MP 2K Resolution, 360° Pan & Tilt, Motion Tracking, Two-Way Audio, Full Color Night Vision.', 'image' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-14', 'name' => 'Hikvision 4-Camera 2MP HD CCTV Setup with 1TB HDD & DVR', 'brand' => 'Hikvision', 'category' => 'CCTV Camera', 'price' => 16500, 'salePrice' => 12999, 'stock' => 8, 'discount' => '21% OFF', 'specs' => 'Complete Security Kit: 2 Dome + 2 Bullet Cameras, 4CH DVR, 1TB Surveillance Hard Disk, Power Supply & Cables.', 'image' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-15', 'name' => 'TP-Link Tapo C210 2K 3MP Pan/Tilt Security Camera', 'brand' => 'TP-Link', 'category' => 'CCTV Camera', 'price' => 3299, 'salePrice' => 2199, 'stock' => 18, 'discount' => '33% OFF', 'specs' => 'Ultra-High-Definition 3MP Video, Advanced Night Vision up to 30 ft, Sound and Light Alarm, Two-Way Audio.', 'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
                array('id' => 'p-16', 'name' => 'Intel Core i7-14700K 20-Core Desktop Processor', 'brand' => 'Intel', 'category' => 'Processors (CPU)', 'price' => 43500, 'salePrice' => 39499, 'stock' => 12, 'discount' => '9% OFF', 'specs' => '20 Cores (8 P-cores + 12 E-cores) up to 5.6 GHz, LGA1700, 33MB Cache, Intel UHD Graphics 770.', 'image' => 'https://images.unsplash.com/photo-1555618568-9a3d4608c0ff?w=800&auto=format&fit=crop&q=80', 'isFeatured' => true),
            ),
            'repairs' => array(
                array(
                    'ticketId' => 'JC-SRV-1001',
                    'customerName' => 'Rahul Sharma',
                    'phone' => '9822012345',
                    'deviceType' => 'Laptop',
                    'brand' => 'ASUS',
                    'model' => 'ROG Zephyrus G14',
                    'issueDesc' => 'Liquid spill on keyboard, overheating under gaming load.',
                    'status' => 'Under Inspection',
                    'estimatedCost' => 3500,
                    'adminNotes' => 'Ultrasonic cleaning done, testing motherboard power rails.'
                ),
                array(
                    'ticketId' => 'JC-SRV-1002',
                    'customerName' => 'Pooja Kulkarni',
                    'phone' => '9890154321',
                    'deviceType' => 'Desktop PC',
                    'brand' => 'Custom',
                    'model' => 'Intel i5-12400 Gaming Rig',
                    'issueDesc' => 'No display, GPU fans spinning at 100% on boot.',
                    'status' => 'Ready for Delivery',
                    'estimatedCost' => 1200,
                    'adminNotes' => 'Reseated RAM & GPU, replaced CMOS battery, BIOS updated.'
                ),
            ),
            'customPcRequests' => array(
                array(
                    'reqNumber' => 'JC-PC-2026-01',
                    'customerName' => 'Vikram Deshmukh',
                    'phone' => '9850011223',
                    'budget' => '₹1,50,000 - ₹1,80,000',
                    'purpose' => '4K Video Editing & Unreal Engine Game Dev',
                    'cpuPref' => 'Intel Core i7-14700K',
                    'gpuPref' => 'NVIDIA RTX 4070 Super 12GB',
                    'ramPref' => '32GB DDR5 6000MHz',
                    'storagePref' => '2TB Gen4 NVMe SSD',
                    'cabinetPref' => 'Lian Li O11 Dynamic EVO',
                    'status' => 'QUOTED',
                    'totalEst' => 165000,
                    'adminNotes' => 'Quotation sent on WhatsApp with 3 years onsite warranty.'
                ),
            ),
            'orders' => array(
                array(
                    'id' => 'ord-demo-1',
                    'orderNumber' => 'JC-ORD-5501',
                    'customerName' => 'Aditya Patil',
                    'phone' => '9823098765',
                    'address' => 'Flat 402, Green Acres, Baner, Pune 411045',
                    'items' => 'ASUS ROG Strix G16 (2024) (x1)',
                    'total' => 124990,
                    'paymentMethod' => 'Instant UPI via WhatsApp (jijauc@ibl)',
                    'status' => 'Confirmed'
                )
            ),
            'quotations' => array(
                array(
                    'quoteNumber' => 'JC-QTE-301',
                    'customerName' => 'Pravin Shinde',
                    'companyName' => 'Apex Tech Solutions Pune',
                    'phone' => '9822334455',
                    'email' => 'pravin@apextech.in',
                    'type' => 'Corporate B2B',
                    'itemsSummary' => '10x Dell Latitude Business Laptops + 2x HP LaserJet Printers',
                    'status' => 'QUOTED'
                )
            ),
            'enquiries' => array(
                array(
                    'name' => 'Saurabh More',
                    'phone' => '9850123456',
                    'email' => 'saurabh@gmail.com',
                    'subject' => 'RTX 4080 Super Stock Availability',
                    'message' => 'Is ZOTAC or ASUS ROG RTX 4080 Super available for store pickup today?',
                    'status' => 'CONTACTED'
                )
            )
        );
    }

    public static function seed_default_store_data() {
        $dataset = self::get_default_dataset();
        update_option('jijau_full_store_database', $dataset);
        return $dataset;
    }
}
