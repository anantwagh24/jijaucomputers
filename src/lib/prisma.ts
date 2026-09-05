import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  // If remote database URL provided (e.g. Postgres / Turso / MySQL), use it directly
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:")
  ) {
    return process.env.DATABASE_URL;
  }

  const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");

  // On Vercel / AWS Lambda serverless environments:
  // The root filesystem is read-only. We copy the seeded sqlite DB to /tmp for read & write operations.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join("/tmp", "jijau_dev.db");
    try {
      if (fs.existsSync(sourceDbPath)) {
        if (!fs.existsSync(tmpDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.error("Vercel SQLite /tmp copy warning:", err);
    }
  }

  // Fallback to absolute or relative path
  if (fs.existsSync(sourceDbPath)) {
    return `file:${sourceDbPath}`;
  }

  return "file:./prisma/dev.db";
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
