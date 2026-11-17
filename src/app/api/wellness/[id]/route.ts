import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { decodeEventImage, isValidEventImage } from "@/lib/event-image";
import { WellnessBanner } from "@/models/WellnessBanner";
import {
  WellnessProvider,
  type WellnessProviderStatus,
  type WellnessProviderType,
} from "@/models/WellnessProvider";

const WELLNESS_TYPES: WellnessProviderType[] = ["psychologists", "counselors", "gyms"];
const WELLNESS_STATUSES: WellnessProviderStatus[] = ["active", "inactive"];
type RouteContext = { params: Promise<{ id: string }> };

function mapWellnessProvider(provider: {
  _id: unknown;
  image: string;
  name: string;
  email?: string;
  type: WellnessProviderType;
  description?: string;
  specialization: string;
  location: string;
  experience: string;
  fee: string;
  status: WellnessProviderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  const image = provider.image.startsWith("/api/wellness/") && provider.updatedAt
    ? `${provider.image}?v=${provider.updatedAt.getTime()}`
    : provider.image;
  return {
    id: String(provider._id),
    image,
    name: provider.name,
    email: provider.email || "",
    type: provider.type,
    description: provider.description || "",
    specialization: provider.specialization,
    location: provider.location,
    experience: provider.experience,
    fee: provider.fee,
    status: provider.status,
    createdAt: provider.createdAt,
    updatedAt: provider.updatedAt,
  };
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid provider ID."] }, { status: 400 });
    }

    const body = await req.json();
    const { image, name, email, type, description, specialization, location, experience, fee, status } = body;
    const errors: string[] = [];
    if (image !== undefined && !isValidEventImage(image)) errors.push("Banner must be a PNG, JPEG, or WebP image no larger than 2 MB.");
    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) errors.push("Name is required.");
    if (email !== undefined && email !== "" && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.push("Enter a valid provider email.");
    if (type !== undefined && !WELLNESS_TYPES.includes(type)) errors.push("Choose a valid provider type.");
    if (description !== undefined && typeof description !== "string") errors.push("Description must be text.");
    if (status !== undefined && !WELLNESS_STATUSES.includes(status)) errors.push("Choose a valid status.");
    for (const [value, label] of [[specialization, "Specialization"], [location, "Location"], [experience, "Experience"], [fee, "Fee"]] as const) {
      if (value !== undefined && (typeof value !== "string" || !value.trim())) errors.push(`${label} is required.`);
    }
    if (errors.length) return NextResponse.json({ success: false, errors }, { status: 400 });

    await connectToDatabase();
    const updates = Object.fromEntries(
      Object.entries({
        name,
        email: typeof email === "string" ? email.trim().toLowerCase() : email,
        type,
        description,
        specialization,
        location,
        experience,
        fee,
        status,
      })
        .filter(([, value]) => value !== undefined)
    );
    const uploadedBanner = typeof image === "string" && image.startsWith("data:") ? decodeEventImage(image) : null;
    const keepCurrentBanner = typeof image === "string" && image.startsWith("/api/wellness/");
    if (image !== undefined && !keepCurrentBanner) updates.image = uploadedBanner ? "" : image;

    const provider = await WellnessProvider.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!provider) {
      return NextResponse.json({ success: false, errors: ["Wellness provider not found."] }, { status: 404 });
    }

    if (uploadedBanner) {
      await WellnessBanner.findOneAndUpdate(
        { providerId: provider._id },
        { ...uploadedBanner },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      provider.image = `/api/wellness/${provider._id}/image`;
      await provider.save();
    } else if (image !== undefined && !keepCurrentBanner) {
      await WellnessBanner.deleteOne({ providerId: provider._id });
    }

    return NextResponse.json({ success: true, provider: mapWellnessProvider(provider.toObject()) });
  } catch (error) {
    console.error("Update wellness provider error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to update wellness provider."] }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, errors: ["Invalid provider ID."] }, { status: 400 });
    }

    await connectToDatabase();
    const provider = await WellnessProvider.findByIdAndDelete(id);
    if (!provider) {
      return NextResponse.json({ success: false, errors: ["Wellness provider not found."] }, { status: 404 });
    }
    await WellnessBanner.deleteOne({ providerId: provider._id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete wellness provider error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to delete wellness provider."] }, { status: 500 });
  }
}
