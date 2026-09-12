import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

async function restore() {
  const backupPath = path.join(process.cwd(), "prisma", "backup.json");
  if (!fs.existsSync(backupPath)) {
    console.error("Backup file not found at:", backupPath);
    process.exit(1);
  }

  console.log("Reading backup file...");
  const data = JSON.parse(fs.readFileSync(backupPath, "utf8"));

  console.log("Restoring into database...");

  // 1. Website Settings
  if (data.websiteSetting && data.websiteSetting.length > 0) {
    for (const setting of data.websiteSetting) {
      await prisma.websiteSetting.upsert({
        where: { id: setting.id },
        update: setting,
        create: setting,
      });
    }
    console.log("✓ Website Settings restored");
  }

  // 2. Admin Users
  if (data.adminUser && data.adminUser.length > 0) {
    for (const admin of data.adminUser) {
      await prisma.adminUser.upsert({
        where: { id: admin.id },
        update: admin,
        create: admin,
      });
    }
    console.log("✓ Admin Users restored");
  }

  // 3. Categories
  if (data.category && data.category.length > 0) {
    for (const cat of data.category) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat,
      });
    }
    console.log(`✓ Categories restored (${data.category.length})`);
  }

  // 4. Brands
  if (data.brand && data.brand.length > 0) {
    for (const brand of data.brand) {
      await prisma.brand.upsert({
        where: { id: brand.id },
        update: brand,
        create: brand,
      });
    }
    console.log(`✓ Brands restored (${data.brand.length})`);
  }

  // 5. Products & Product Images
  if (data.product && data.product.length > 0) {
    for (const prod of data.product) {
      const { images, ...productData } = prod;
      await prisma.product.upsert({
        where: { id: prod.id },
        update: productData,
        create: productData,
      });

      if (images && images.length > 0) {
        for (const img of images) {
          await prisma.productImage.upsert({
            where: { id: img.id },
            update: img,
            create: img,
          });
        }
      }
    }
    console.log(`✓ Products & Images restored (${data.product.length} products)`);
  }

  // 6. Banners
  if (data.banner && data.banner.length > 0) {
    for (const ban of data.banner) {
      await prisma.banner.upsert({
        where: { id: ban.id },
        update: ban,
        create: ban,
      });
    }
    console.log(`✓ Banners restored (${data.banner.length})`);
  }

  // 7. Offers
  if (data.offer && data.offer.length > 0) {
    for (const off of data.offer) {
      await prisma.offer.upsert({
        where: { id: off.id },
        update: off,
        create: off,
      });
    }
    console.log(`✓ Offers restored (${data.offer.length})`);
  }

  // 8. Happy Customers
  if (data.happyCustomer && data.happyCustomer.length > 0) {
    for (const cust of data.happyCustomer) {
      await prisma.happyCustomer.upsert({
        where: { id: cust.id },
        update: cust,
        create: cust,
      });
    }
    console.log(`✓ Happy Customers restored (${data.happyCustomer.length})`);
  }

  // 9. Users
  if (data.user && data.user.length > 0) {
    for (const u of data.user) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: u,
        create: u,
      });
    }
    console.log(`✓ Users restored (${data.user.length})`);
  }

  // 10. Orders
  if (data.order && data.order.length > 0) {
    for (const ord of data.order) {
      const { items, ...orderData } = ord;
      await prisma.order.upsert({
        where: { id: ord.id },
        update: orderData,
        create: orderData,
      });

      if (items && items.length > 0) {
        for (const item of items) {
          await prisma.orderItem.upsert({
            where: { id: item.id },
            update: item,
            create: item,
          });
        }
      }
    }
    console.log(`✓ Orders restored (${data.order.length})`);
  }

  console.log("\n==========================================");
  console.log("🎉 DATABASE RESTORE COMPLETED SUCCESSFULLY!");
  console.log("==========================================");
}

restore()
  .catch((err) => {
    console.error("Restore error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
