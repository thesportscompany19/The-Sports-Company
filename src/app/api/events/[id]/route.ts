import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { EventBanner } from "@/models/EventBanner";
import { decodeEventImage, isValidEventImage } from "@/lib/event-image";

const VALID_SPORTS = [
  "Cricket", "Football", "Badminton", "Basketball",
  "Tennis", "Athletics", "Hockey", "Volleyball", "Chess",
];
const VALID_STATUSES = ["upcoming", "ongoing", "completed", "cancelled"];

// ─── PUT /api/events/[id] ────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, errors: ["Invalid event ID."] },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { image, description, tag, title, date, location, entryFee, prize, status } = body;

    const errors: string[] = [];
    if (image !== undefined && !isValidEventImage(image)) errors.push("Event image must be a valid PNG, JPEG, or WebP upload under 2 MB.");
    if (description !== undefined && typeof description !== "string") errors.push("Event description must be text.");
    if (title !== undefined && (!title || title.trim().length < 2)) errors.push("Title is required.");
    if (tag !== undefined && !VALID_SPORTS.includes(tag)) errors.push("Valid sport tag is required.");
    if (status !== undefined && !VALID_STATUSES.includes(status)) errors.push("Invalid status.");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await connectToDatabase();

    const updates: Record<string, unknown> = {};
    if (image !== undefined) {
      const uploadedImage = decodeEventImage(image);
      if (uploadedImage) {
        await EventBanner.findOneAndUpdate(
          { eventId: id },
          { $set: uploadedImage },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        updates.image = `/api/events/${id}/image?v=${Date.now()}`;
      } else {
        updates.image = image;
        if (!image.startsWith(`/api/events/${id}/image`)) {
          await EventBanner.deleteOne({ eventId: id });
        }
      }
    }
    if (description !== undefined) updates.description = description.trim();
    if (tag !== undefined) updates.tag = tag.trim();
    if (title !== undefined) updates.title = title.trim();
    if (date !== undefined) updates.date = date.trim();
    if (location !== undefined) updates.location = location.trim();
    if (entryFee !== undefined) updates.entryFee = entryFee.trim();
    if (prize !== undefined) updates.prize = prize.trim();
    if (status !== undefined) updates.status = status;

    const event = await Event.findByIdAndUpdate(id, updates, { new: true }).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, errors: ["Event not found."] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event: {
        id: String(event._id),
        image: event.image,
        description: event.description,
        tag: event.tag,
        title: event.title,
        date: event.date,
        location: event.location,
        entryFee: event.entryFee,
        prize: event.prize,
        status: event.status,
        createdAt: event.createdAt,
      },
    });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/events/[id] ──────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, errors: ["Invalid event ID."] },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { success: false, errors: ["Event not found."] },
        { status: 404 }
      );
    }

    await EventBanner.deleteOne({ eventId: id });
    return NextResponse.json({ success: true, message: "Event deleted." });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}
