// app/api/uploads/presign/route.js
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { r2Client } from "@/lib/r2Client";

const BUCKET = process.env.R2_BUCKET;

// helper buat key yyyy/mm/dd/uuid.pdf
function buildObjectKey(originalName = "document.pdf") {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const safeBase =
    originalName.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80) || "file";

  const id = uuidv4();
  return `${yyyy}/${mm}/${dd}/${id}-${safeBase}`;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    const { contentType, size, originalName } = body;

    // validasi dasar
    if (contentType !== "application/pdf") {
      return new NextResponse("Only PDF allowed", { status: 400 });
    }
    const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
    if (typeof size !== "number" || size <= 0 || size > MAX_SIZE) {
      return new NextResponse("Invalid file size", { status: 400 });
    }
    if (!BUCKET) {
      return new NextResponse("R2_BUCKET not configured", { status: 500 });
    }

    const key = buildObjectKey(originalName);

    // Command PUT untuk objek ini
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      // Optional: Anda bisa set metadata di sini jika mau
      // Metadata: { originalName: originalName || "" },
    });

    // Masa berlaku presigned URL (detik)
    const expiresIn = 60 * 5; // 5 menit

    const url = await getSignedUrl(r2Client, command, { expiresIn });

    return NextResponse.json({
      url,
      key,
      contentType,
      expiresIn,
    });
  } catch (err) {
    console.error("Presign error:", err);
    return new NextResponse("Presign error", { status: 500 });
  }
}
