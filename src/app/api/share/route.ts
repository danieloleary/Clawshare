// POST /api/share - Create a shareable link
import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl, isAllowedFileType, generateFileId } from "@/lib/r2";
import { writeFileMeta, getFileMeta } from "@/lib/meta";

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const expiresIn = parseInt(formData.get("expiresIn") as string) || 7 * 24 * 3600; // 7 days default
    const password = formData.get("password") as string || null;
    const isDownload = formData.get("download") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!isAllowedFileType(file.name)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 50MB)" },
        { status: 400 }
      );
    }

    // Generate file ID
    const fileId = generateFileId();
    const contentType = file.type || "application/octet-stream";

    // Get presigned upload URL
    const { uploadUrl, publicUrl } = await getUploadUrl(
      fileId,
      file.name,
      contentType,
      expiresIn
    );

    // Save metadata (in MVP, use JSON file)
    await writeFileMeta(fileId, {
      id: fileId,
      name: file.name,
      contentType,
      size: file.size,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      password: password ? "set" : null,
      isDownload: isDownload || false,
    });

    return NextResponse.json({
      success: true,
      shareId: fileId,
      uploadUrl,
      publicUrl,
      expiresIn,
    });
  } catch (error) {
    console.error("Share error:", error);
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 }
    );
  }
}

// GET /api/share - Get share info or list shares
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("id");
  const list = searchParams.get("list");

  if (shareId) {
    // Get single share info
    const meta = await getFileMeta(shareId);
    if (!meta) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, share: meta });
  }

  if (list) {
    // List all shares (for dashboard)
    // In MVP, read from JSON file
    return NextResponse.json({ success: true, shares: [] });
  }

  return NextResponse.json({ error: "Missing id or list parameter" }, { status: 400 });
}
