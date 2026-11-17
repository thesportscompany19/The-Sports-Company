import { NextRequest, NextResponse } from "next/server";
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

function mapWellnessProvider(
  provider: {
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
  }
) {
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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const showAll = req.nextUrl.searchParams.get("all") === "true";
    const providers = await WellnessProvider.find(showAll ? {} : { status: "active" }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, providers: providers.map(mapWellnessProvider) });
  } catch (error) {
    console.error("Fetch wellness providers error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to load wellness providers."] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, name, email, type, description, specialization, location, experience, fee, status } = body;
    const errors: string[] = [];
    if (image !== undefined && !isValidEventImage(image)) errors.push("Banner must be a PNG, JPEG, or WebP image no larger than 2 MB.");
    if (!name || typeof name !== "string" || name.trim().length < 2) errors.push("Name is required.");
    if (!WELLNESS_TYPES.includes(type)) errors.push("Choose a valid provider type.");
    if (description !== undefined && typeof description !== "string") errors.push("Description must be text.");
    if (email !== undefined && email !== "" && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.push("Enter a valid provider email.");
    for (const [value, label] of [[specialization, "Specialization"], [location, "Location"], [experience, "Experience"], [fee, "Fee"]] as const) {
      if (typeof value !== "string" || !value.trim()) errors.push(`${label} is required.`);
    }
    if (status !== undefined && !WELLNESS_STATUSES.includes(status)) errors.push("Choose a valid status.");
    if (errors.length) return NextResponse.json({ success: false, errors }, { status: 400 });

    await connectToDatabase();
    const uploadedBanner = typeof image === "string" ? decodeEventImage(image) : null;
    const provider = await WellnessProvider.create({
      image: uploadedBanner ? "" : image || "/images/event-1.png",
      name: name.trim(),
      email: typeof email === "string" ? email.trim().toLowerCase() : "",
      type,
      description: typeof description === "string" ? description.trim() : "",
      specialization: specialization.trim(),
      location: location.trim(),
      experience: experience.trim(),
      fee: fee.trim(),
      status: status || "active",
    });

    if (uploadedBanner) {
      try {
        await WellnessBanner.create({ providerId: provider._id, ...uploadedBanner });
        provider.image = `/api/wellness/${provider._id}/image`;
        await provider.save();
      } catch (error) {
        await WellnessProvider.deleteOne({ _id: provider._id });
        await WellnessBanner.deleteOne({ providerId: provider._id });
        throw error;
      }
    }

    return NextResponse.json({ success: true, provider: mapWellnessProvider(provider.toObject()) }, { status: 201 });
  } catch (error) {
    console.error("Create wellness provider error:", error);
    return NextResponse.json({ success: false, errors: ["Unable to save wellness provider."] }, { status: 500 });
  }
}
