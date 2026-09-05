import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleHappyCustomers = [
  {
    name: "Rahul Patil",
    city: "Pune",
    village: "Kothrud",
    district: "Pune",
    phone: "+91 98812 43210",
    productName: "Jijau Custom RTX 4080 Super Gaming Rig",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    review: "Assembled my dream 4K gaming PC with Intel Core i7 14700K & RTX 4080 Super. Excellent cable management, transparent pricing, and instant GST invoice for my IT firm!",
    rating: 5,
    purchaseDate: "Aug 2026",
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    name: "Snehal Deshmukh",
    city: "Baramati",
    village: "MIDC Baramati",
    district: "Pune",
    phone: "+91 97654 88120",
    productName: "Apple MacBook Air M3 (16GB / 512GB)",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    review: "Purchased Apple MacBook Air M3 for my architecture studio. Got official Pune dealer discount and full manufacturer brand warranty.",
    rating: 5,
    purchaseDate: "Aug 2026",
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    name: "Vikram Shinde",
    city: "Shirur",
    village: "Narayangaon / Manchar",
    district: "Pune",
    phone: "+91 99223 11450",
    productName: "HP OMEN 16 Gaming Laptop (Ryzen 7 + RTX 4060)",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    review: "Travelled from Shirur to Jijau Computers. Unbeatable price on HP OMEN and free gaming backpack + mouse combo. Highly recommend!",
    rating: 5,
    purchaseDate: "Jul 2026",
    isFeatured: true,
    isActive: true,
    order: 3,
  },
  {
    name: "Pooja Kulkarni",
    city: "Pimpri-Chinchwad",
    village: "Wakad",
    district: "Pune",
    phone: "+91 98230 77610",
    productName: "Dell XPS 15 OLED Creator Laptop",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    review: "Best tech buying experience in PCMC. Team assisted with data migration from my old laptop in under 30 minutes free of charge.",
    rating: 5,
    purchaseDate: "Jul 2026",
    isFeatured: true,
    isActive: true,
    order: 4,
  },
  {
    name: "Amol Gaikwad",
    city: "Satara",
    village: "Karad Road",
    district: "Satara",
    phone: "+91 96541 33290",
    productName: "8-Channel CP PLUS 5MP CCTV Security System",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    review: "Installed complete CCTV security camera package for our commercial warehouse in Satara. Very neat installation and phone app setup.",
    rating: 5,
    purchaseDate: "Jun 2026",
    isFeatured: true,
    isActive: true,
    order: 5,
  },
  {
    name: "Ganesh Jagtap",
    city: "Ahmednagar",
    village: "Shrirampur",
    district: "Ahmednagar",
    phone: "+91 94231 66540",
    productName: "Ryzen 9 7950X Video Editing Workstation",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    review: "Ordered 64GB DDR5 workstation rig for our 4K video editing studio. Delivered safely to Ahmednagar with premium packaging.",
    rating: 5,
    purchaseDate: "Jun 2026",
    isFeatured: true,
    isActive: true,
    order: 6,
  }
];

async function seed() {
  console.log("Seeding Happy Customers...");
  for (const c of sampleHappyCustomers) {
    const existing = await prisma.happyCustomer.findFirst({
      where: { name: c.name, city: c.city },
    });
    if (!existing) {
      await prisma.happyCustomer.create({ data: c });
    }
  }
  console.log("Seeding complete!");
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
