import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Coach } from "@/models/Coach";
import { CoachGalleryImage } from "@/models/CoachGalleryImage";
import {
  isCoachGalleryImageType,
  isValidCoachGalleryImage,
  MAX_COACH_GALLERY_IMAGES,
  MAX_COACH_GALLERY_UPLOAD_BYTES,
  type CoachGalleryImageType,
} from "@/lib/coach-gallery-image";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid coach ID."] }, { status: 400 });
    }

    const formData = await req.formData();
    const files = formData.getAll("images");
    if (files.length === 0 || files.some((file) => !(file instanceof File))) {
      return NextResponse.json({ success: false, errors: ["Choose one or more image files to upload."] }, { status: 400 });
    }
    if (files.length > MAX_COACH_GALLERY_IMAGES) {
      return NextResponse.json({ success: false, errors: [`Upload no more than ${MAX_COACH_GALLERY_IMAGES} images at once.`] }, { status: 400 });
    }

    let uploadSize = 0;
    const images: Array<{ coachId: mongoose.Types.ObjectId; contentType: CoachGalleryImageType; data: Buffer }> = [];
    for (const file of files as File[]) {
      if (!isCoachGalleryImageType(file.type)) {
        return NextResponse.json({ success: false, errors: ["Images must be PNG, JPEG, or WebP files."] }, { status: 400 });
      }
      if (file.size === 0 || file.size > 2 * 1024 * 1024) {
        return NextResponse.json({ success: false, errors: ["Each image must be no larger than 2 MB."] }, { status: 400 });
      }
      uploadSize += file.size;
      if (uploadSize > MAX_COACH_GALLERY_UPLOAD_BYTES) {
        return NextResponse.json({ success: false, errors: ["The combined image upload must be no larger than 12 MB."] }, { status: 400 });
      }

      const data = Buffer.from(await file.arrayBuffer());
      if (!isValidCoachGalleryImage(data, file.type)) {
        return NextResponse.json({ success: false, errors: ["One or more files are not valid images."] }, { status: 400 });
      }
      images.push({ coachId: new mongoose.Types.ObjectId(id), contentType: file.type, data });
    }

    await connectToDatabase();
    const coach = await Coach.exists({ _id: id });
    if (!coach) {
      return NextResponse.json({ success: false, errors: ["Coach not found."] }, { status: 404 });
    }

    const existingCount = await CoachGalleryImage.countDocuments({ coachId: id });
    if (existingCount + images.length > MAX_COACH_GALLERY_IMAGES) {
      return NextResponse.json({ success: false, errors: [`Each coach and academy can have up to ${MAX_COACH_GALLERY_IMAGES} gallery images.`] }, { status: 400 });
    }

    const created = await CoachGalleryImage.insertMany(images);
    return NextResponse.json({
      success: true,
      images: created.map((image) => ({
        id: String(image._id),
        url: `/api/coaches/${id}/images/${image._id}`,
      })),
    }, { status: 201 });
  } catch (error) {
    console.error("Upload coach gallery images error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to upload coach gallery images."] }, { status: 500 });
  }
}
