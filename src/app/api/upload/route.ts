import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getAdminSessionFromReq } from "@/lib/session";

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

export async function POST(req: Request) {
  try {
    // 1. Enforce Admin session for file uploads
    const adminSession = await getAdminSessionFromReq(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required to upload media." },
        { status: 401 }
      );
    }

    // 2. Rate Limiting Check
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`upload_${ip}`, { limit: 25, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Upload rate limit reached. Please wait a minute before uploading more files." },
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

      // 4. MIME Type Validation (SVG explicitly removed to prevent Stored XSS)
      if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `Invalid file type for "${file.name}". Only JPG, PNG, WEBP, and GIF raster images are permitted.` },
          { status: 400 }
        );
      }

      // 5. File Extension Validation
      const ext = (path.extname(file.name) || ".jpg").toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `Extension "${ext}" is not permitted for security reasons.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 6. Magic byte header verification (JPG, PNG, GIF, WEBP)
      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
      const isWebp = buffer.slice(8, 12).toString("ascii") === "WEBP";

      if (!isJpeg && !isPng && !isGif && !isWebp) {
        return NextResponse.json(
          { error: `File "${file.name}" has invalid image data. Only valid JPEG, PNG, GIF, or WEBP files are accepted.` },
          { status: 400 }
        );
      }

      // 7. Cryptographically secure random filename to prevent collisions and path traversal
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
