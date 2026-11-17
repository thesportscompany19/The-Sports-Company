import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { MediaThumbnail } from "@/models/MediaThumbnail";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid media item ID."] }, { status: 400 });
    }
    await connectToDatabase();
    const thumbnail = await MediaThumbnail.findOne({ mediaId: id }).lean();
    if (!thumbnail) {
      return NextResponse.json({ success: false, errors: ["Media thumbnail not found."] }, { status: 404 });
    }
    return new NextResponse(thumbnail.data, {
      headers: {
        "Content-Type": thumbnail.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Fetch media thumbnail error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to load media thumbnail."] }, { status: 500 });
  }
}
