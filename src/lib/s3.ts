import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Lazy initialization of S3 client (server-side only)
let s3Client: S3Client | null = null;

function validateS3Config() {
  const missing: string[] = [];
  if (!process.env.AWS_ACCESS_KEY_ID) missing.push("AWS_ACCESS_KEY_ID");
  if (!process.env.AWS_SECRET_ACCESS_KEY) missing.push("AWS_SECRET_ACCESS_KEY");
  if (!process.env.AWS_S3_BUCKET_NAME) missing.push("AWS_S3_BUCKET_NAME");

  if (missing.length > 0) {
    throw new Error(`Missing AWS configuration: ${missing.join(", ")}. Please check your .env file.`);
  }
}

function getS3Client(): S3Client {
  validateS3Config();

  s3Client ??= new S3Client({
    region: process.env.AWS_S3_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  return s3Client;
}

function getBucketName(): string {
  validateS3Config();
  return process.env.AWS_S3_BUCKET_NAME!;
}

function getRegion(): string {
  return process.env.AWS_S3_REGION ?? "us-east-1";
}

export interface UploadResult {
  key: string;
  url: string;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

/**
 * Generate a presigned URL for direct client upload to S3
 * @param filename - Original filename (for extension)
 * @param contentType - MIME type of the file
 * @param fieldName - Form field name (used in the key)
 * @param applicationNo - Application number (optional, for organizing files)
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns The presigned upload URL, key, and public URL
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  fieldName: string,
  applicationNo?: string,
  expiresIn = 300
): Promise<PresignedUploadResult> {
  const client = getS3Client();
  const bucket = getBucketName();
  const region = getRegion();

  // Generate unique key
  const ext = getFileExtension(filename);
  const timestamp = Date.now();
  const folder = applicationNo ? `applications/${applicationNo}` : "uploads/temp";
  const key = `${folder}/${fieldName}-${timestamp}${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, key, publicUrl };
}

/**
 * Upload a file to S3 (server-side)
 * @param file - The file to upload
 * @param applicationNo - The application number (used for organizing files)
 * @param fieldName - The form field name (used in the file key)
 * @param userId - Optional user ID for user-specific folder structure (used for supporting documents)
 * @returns The S3 key and public URL
 */
export async function uploadToS3(
  file: File,
  applicationNo: string,
  fieldName: string,
  userId?: string
): Promise<UploadResult> {
  const client = getS3Client();
  const bucket = getBucketName();
  const region = getRegion();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique key with appropriate folder structure
  const ext = getFileExtension(file.name);
  const timestamp = Date.now();

  // Use user-specific folder for supporting documents (otherDocuments)
  let key: string;
  if (fieldName === "otherDocuments" && userId) {
    key = `users/${userId}/supporting-documents/${fieldName}-${timestamp}${ext}`;
  } else {
    key = `applications/${applicationNo}/${fieldName}-${timestamp}${ext}`;
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await client.send(command);

  // Return the S3 URL
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { key, url };
}

/**
 * Delete a file from S3
 * @param key - The S3 object key to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  await client.send(command);
}

/**
 * Generate a presigned URL for temporary access to a private file
 * @param key - The S3 object key
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns The presigned URL
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Extract file extension from filename
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot !== -1 ? filename.slice(lastDot) : "";
}

/**
 * Extract the S3 key from a full S3 URL
 */
export function getKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Remove leading slash from pathname
    return urlObj.pathname.slice(1);
  } catch {
    return null;
  }
}
