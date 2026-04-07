import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";

const VALID_SPORTS = [
  "Cricket", "Football", "Badminton", "Basketball",
  "Tennis", "Athletics", "Hockey", "Volleyball",
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
    const { image, tag, title, date, location, entryFee, prize, status } = body;

    const errors: string[] = [];
    if (title !== undefined && (!title || title.trim().length < 2)) errors.push("Title is required.");
    if (tag !== undefined && !VALID_SPORTS.includes(tag)) errors.push("Valid sport tag is required.");
    if (status !== undefined && !VALID_STATUSES.includes(status)) errors.push("Invalid status.");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await connectToDatabase();

    const updates: Record<string, unknown> = {};
    if (image !== undefined) updates.image = image;
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

    return NextResponse.json({ success: true, message: "Event deleted." });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}
