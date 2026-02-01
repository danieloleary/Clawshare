// Simple JSON-based file metadata store (MVP)
// In production, use Vercel KV or SQLite

import fs from "fs";
import path from "path";

const META_DIR = path.join(process.cwd(), "data");
const META_FILE = path.join(META_DIR, "shares.json");

// Ensure data directory exists
function ensureDir() {
  if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR, { recursive: true });
  }
}

// Initialize empty file if needed
ensureDir();
if (!fs.existsSync(META_FILE)) {
  fs.writeFileSync(META_FILE, JSON.stringify({}));
}

export interface FileMeta {
  id: string;
  name: string;
  contentType: string;
  size: number;
  createdAt: string;
  expiresAt: string;
  password: string | null;
  isDownload: boolean;
  downloads?: number;
}

export async function writeFileMeta(id: string, meta: FileMeta): Promise<void> {
  ensureDir();
  const data = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  data[id] = meta;
  fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2));
}

export async function getFileMeta(id: string): Promise<FileMeta | null> {
  ensureDir();
  if (!fs.existsSync(META_FILE)) return null;
  const data = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  return data[id] || null;
}

export async function deleteFileMeta(id: string): Promise<void> {
  ensureDir();
  const data = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  delete data[id];
  fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2));
}

export async function listFileMeta(): Promise<FileMeta[]> {
  ensureDir();
  if (!fs.existsSync(META_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  return Object.values(data);
}
