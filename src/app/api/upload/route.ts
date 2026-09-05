import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getAdminSession } from "@/lib/session";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates image magic bytes to prevent polyglot / disguised executable uploads
 */
function isValidImageHeader(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return true;
  }
  // WEBP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Admin Authentication Check
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to upload files." },
        { status: 401 }
      );
    }

    // 2. Rate Limiting Check
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`upload_${ip}`, { limit: 30, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Upload rate limit reached. Please wait a moment." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = [];
    if (singleFile) allFiles.push(singleFile);
    if (files && files.length > 0) {
      files.forEach((f) => {
        if (!allFiles.some((existing) => existing.name === f.name && existing.size === f.size)) {
          allFiles.push(f);
        }
      });
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      // 3. File Size Validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds maximum allowed size of 5MB.` },
          { status: 400 }
        );
      }

      // 4. Strict MIME Type Validation
      if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `Invalid file type for "${file.name}". Only JPG, PNG, WEBP, and GIF images are permitted.` },
          { status: 400 }
        );
      }

      // 5. Strict File Extension Validation (Disallows .svg / .html / .php)
      const ext = (path.extname(file.name) || ".jpg").toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `Extension "${ext}" is not permitted for security reasons.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 6. Magic Bytes / File Signature Inspection
      if (!isValidImageHeader(buffer)) {
        return NextResponse.json(
          { error: `File "${file.name}" has invalid image signatures and was rejected.` },
          { status: 400 }
        );
      }

      // 7. Cryptographically secure randomized filename
      const randomId = crypto.randomBytes(8).toString("hex");
      const sanitizedBase = file.name
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 30);
      const fileName = `${Date.now()}_${randomId}_${sanitizedBase}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/products/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
