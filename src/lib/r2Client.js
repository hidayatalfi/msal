// src/lib/r2Client.js
import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT;
const region = "auto"; // R2 biasanya memakai region 'auto'

if (!endpoint) {
  throw new Error("R2_ENDPOINT is not defined");
}

export const r2Client = new S3Client({
  region,
  endpoint, // contoh: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // penting untuk R2/S3 kompatibel non-AWS
});
