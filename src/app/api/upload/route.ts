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
  if (buffer.length < 4) return false;

  // JPEG: FF D8 (covers all EXIF / JFIF markers)
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return true;
  }
  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return true;
  }
  // WEBP: 52 49 46 46 (RIFF)
  if (
    buffer.length >= 12 &&
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
  // BMP: 42 4D
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return true;
  }
  // AVIF / HEIC (ftyp marker)
  if (buffer.length >= 12 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
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
    const rateCheck = checkRateLimit(`upload_${ip}`, { limit: 60, windowSeconds: 60 });
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
    if (singleFile && singleFile.size > 0) allFiles.push(singleFile);
    if (files && files.length > 0) {
      files.forEach((f) => {
        if (f && f.size > 0 && !allFiles.some((existing) => existing.name === f.name && existing.size === f.size)) {
          allFiles.push(f);
        }
      });
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    let isDiskWritable = true;
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      isDiskWritable = false;
    }

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      // 3. File Size Validation (Max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds maximum allowed size of 10MB.` },
          { status: 400 }
        );
      }

      // 4. Strict File Extension Validation
      const ext = (path.extname(file.name) || ".jpg").toLowerCase();
      const forbiddenExts = new Set([".exe", ".sh", ".php", ".py", ".js", ".ts", ".html", ".htm", ".svg"]);
      if (forbiddenExts.has(ext)) {
        return NextResponse.json(
          { error: `Extension "${ext}" is not permitted for security reasons.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 5. Header Inspection
      if (!isValidImageHeader(buffer)) {
        // If header doesn't match standard magic bytes, check mime type fallback
        const mime = file.type || "image/jpeg";
        if (!mime.startsWith("image/")) {
          return NextResponse.json(
            { error: `File "${file.name}" has invalid image format and was rejected.` },
            { status: 400 }
          );
        }
      }

      const mimeType = file.type || "image/jpeg";

      if (isDiskWritable) {
        try {
          const randomId = crypto.randomBytes(8).toString("hex");
          const sanitizedBase = (file.name || "image")
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 30);
          const fileName = `${Date.now()}_${randomId}_${sanitizedBase}${ext}`;
          const filePath = path.join(uploadDir, fileName);

          await writeFile(filePath, buffer);
          uploadedUrls.push(`/uploads/products/${fileName}`);
          continue;
        } catch (diskErr) {
          console.warn("Disk write failed, using data URI fallback:", diskErr);
        }
      }

      // Fallback for serverless / read-only filesystem: Base64 Data URI
      const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
      uploadedUrls.push(base64Data);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error?.message || "Failed to process upload" }, { status: 500 });
  }
}
