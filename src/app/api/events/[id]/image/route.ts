import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { EventBanner } from "@/models/EventBanner";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid event ID."] }, { status: 400 });
    }

    await connectToDatabase();
    const banner = await EventBanner.findOne({ eventId: id }).lean();
    if (!banner) {
      return NextResponse.json({ success: false, errors: ["Event image not found."] }, { status: 404 });
    }

    return new NextResponse(banner.data, {
      headers: {
        "Content-Type": banner.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Fetch event image error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to load event image."] }, { status: 500 });
  }
}
