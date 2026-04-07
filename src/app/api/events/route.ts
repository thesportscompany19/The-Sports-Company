import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";

const VALID_SPORTS = [
  "Cricket", "Football", "Badminton", "Basketball",
  "Tennis", "Athletics", "Hockey", "Volleyball",
];
const VALID_STATUSES = ["upcoming", "ongoing", "completed", "cancelled"];

// ─── GET /api/events ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (status && VALID_STATUSES.includes(status)) {
      filter.status = status;
    }

    const events = await Event.find(filter).sort({ createdAt: -1 }).lean();

    // Map _id to id for frontend compatibility
    const mapped = events.map((e) => ({
      id: String(e._id),
      image: e.image,
      tag: e.tag,
      title: e.title,
      date: e.date,
      location: e.location,
      entryFee: e.entryFee,
      prize: e.prize,
      status: e.status,
      createdAt: e.createdAt,
    }));

    return NextResponse.json({ success: true, events: mapped });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}

// ─── POST /api/events ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, tag, title, date, location, entryFee, prize, status } = body;

    const errors: string[] = [];
    if (!title || typeof title !== "string" || title.trim().length < 2) errors.push("Title is required.");
    if (!tag || !VALID_SPORTS.includes(tag)) errors.push("Valid sport tag is required.");
    if (!date || typeof date !== "string") errors.push("Date is required.");
    if (!location || typeof location !== "string") errors.push("Location is required.");
    if (!entryFee || typeof entryFee !== "string") errors.push("Entry fee is required.");
    if (!prize || typeof prize !== "string") errors.push("Prize is required.");
    if (status && !VALID_STATUSES.includes(status)) errors.push("Invalid status.");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await connectToDatabase();

    const event = await Event.create({
      image: image || "/images/event-1.png",
      tag: tag.trim(),
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      entryFee: entryFee.trim(),
      prize: prize.trim(),
      status: status || "upcoming",
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}
