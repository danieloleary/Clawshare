// GET /api/download - Get download URL for a share
import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/r2";
import { getFileMeta, deleteFileMeta } from "@/lib/meta";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("id");
  const password = searchParams.get("password");

  if (!shareId) {
    return NextResponse.json({ error: "Missing share ID" }, { status: 400 });
  }

  try {
    const meta = await getFileMeta(shareId);
    if (!meta) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    // Check expiry
    if (new Date(meta.expiresAt) < new Date()) {
      await deleteFileMeta(shareId);
      return NextResponse.json({ error: "Share expired" }, { status: 410 });
    }

    // Check password
    if (meta.password && meta.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Get download URL
    const downloadUrl = await getDownloadUrl(shareId);

    return NextResponse.json({
      success: true,
      meta,
      downloadUrl,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to get download URL" },
      { status: 500 }
    );
  }
}

// DELETE /api/download - Revoke a share
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("id");

  if (!shareId) {
    return NextResponse.json({ error: "Missing share ID" }, { status: 400 });
  }

  try {
    await deleteFileMeta(shareId);
    return NextResponse.json({ success: true, message: "Share revoked" });
  } catch (error) {
    console.error("Revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke share" },
      { status: 500 }
    );
  }
}
