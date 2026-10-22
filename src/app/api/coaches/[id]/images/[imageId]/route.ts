import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { CoachGalleryImage } from "@/models/CoachGalleryImage";

type RouteContext = { params: Promise<{ id: string; imageId: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id, imageId } = await params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(imageId)) {
      return NextResponse.json({ success: false, errors: ["Invalid image reference."] }, { status: 400 });
    }

    await connectToDatabase();
    const image = await CoachGalleryImage.findOne({ _id: imageId, coachId: id }).lean();
    if (!image) {
      return NextResponse.json({ success: false, errors: ["Gallery image not found."] }, { status: 404 });
    }

    return new NextResponse(image.data, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Fetch coach gallery image error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to load gallery image."] }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id, imageId } = await params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(imageId)) {
      return NextResponse.json({ success: false, errors: ["Invalid image reference."] }, { status: 400 });
    }

    await connectToDatabase();
    const result = await CoachGalleryImage.deleteOne({ _id: imageId, coachId: id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, errors: ["Gallery image not found."] }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete coach gallery image error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to delete gallery image."] }, { status: 500 });
  }
}
