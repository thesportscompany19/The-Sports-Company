import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { WellnessBanner } from "@/models/WellnessBanner";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid provider ID."] }, { status: 400 });
    }

    await connectToDatabase();
    const banner = await WellnessBanner.findOne({ providerId: id }).lean();
    if (!banner) {
      return NextResponse.json({ success: false, errors: ["Wellness banner not found."] }, { status: 404 });
    }
    return new NextResponse(banner.data, {
      headers: {
        "Content-Type": banner.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Fetch wellness banner error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to load wellness banner."] }, { status: 500 });
  }
}
