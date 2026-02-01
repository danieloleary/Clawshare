// R2 Storage Configuration
// Cloudflare R2 presigned URLs for upload/download

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 Configuration - set via environment variables
const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID || "",
  accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  bucketName: process.env.R2_BUCKET_NAME || "clawshare",
  publicUrl: process.env.R2_PUBLIC_URL || "https://pub-xxx.r2.dev",
};

// Create S3 client for R2 (compatible with S3 API)
export function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_CONFIG.accessKeyId,
      secretAccessKey: R2_CONFIG.secretAccessKey,
    },
  });
}

// Generate presigned URL for upload
export async function getUploadUrl(
  fileId: string,
  fileName: string,
  contentType: string,
  expirySeconds: number = 3600
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const client = getR2Client();
  
  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: fileId,
    ContentType: contentType,
  });
  
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expirySeconds });
  const publicUrl = `${R2_CONFIG.publicUrl}/${fileId}`;
  
  return { uploadUrl, publicUrl };
}

// Generate presigned URL for download
export async function getDownloadUrl(
  fileId: string,
  expirySeconds: number = 3600
): Promise<string> {
  const client = getR2Client();
  
  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: fileId,
  });
  
  return await getSignedUrl(client, command, { expiresIn: expirySeconds });
}

// Validate file type (MVP whitelist)
export function isAllowedFileType(fileName: string): boolean {
  const allowed = [
    // PDFs
    ".pdf",
    // Office documents
    ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    // Images
    ".jpg", ".jpeg", ".png", ".gif", ".webp",
    // Text
    ".txt", ".csv", ".json", ".md",
  ];
  
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
  return allowed.includes(ext);
}

// Generate unique file ID
export function generateFileId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}
