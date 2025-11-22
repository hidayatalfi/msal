// app/api/uploads/r2-object/route.js
import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2Client";

const BUCKET = process.env.R2_BUCKET;

export async function DELETE(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.key) {
      return new NextResponse("Missing key", { status: 400 });
    }

    const { key } = body;

    if (!BUCKET) {
      return new NextResponse("R2_BUCKET not configured", { status: 500 });
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    await r2Client.send(command);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("R2 delete error:", err);
    return new NextResponse("Delete error", { status: 500 });
  }
}
