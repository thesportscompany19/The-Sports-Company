import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coach, type CoachStatus } from "@/models/Coach";

const VALID_SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball", "Chess"];
const VALID_STATUSES: CoachStatus[] = ["active", "inactive"];

function mapCoach(coach: { _id: unknown; image: string; name: string; email?: string; sport: string; academy: string; location: string; specialization: string; experience: string; fee: string; status: CoachStatus }) {
  return { id: String(coach._id), image: coach.image, name: coach.name, email: coach.email || "", sport: coach.sport, academy: coach.academy, location: coach.location, specialization: coach.specialization, experience: coach.experience, fee: coach.fee, status: coach.status };
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const showAll = req.nextUrl.searchParams.get("all") === "true";
    const coaches = await Coach.find(showAll ? {} : { status: "active" }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, coaches: coaches.map(mapCoach) });
  } catch (error) {
    console.error("Fetch coaches error:", error);
    return NextResponse.json({ success: false, errors: ["Internal server error."] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, name, email, sport, academy, location, specialization, experience, fee, status } = body;
    const errors: string[] = [];
    if (!name || typeof name !== "string" || name.trim().length < 2) errors.push("Name is required.");
    if (!sport || !VALID_SPORTS.includes(sport)) errors.push("Valid sport is required.");
    for (const [value, label] of [[academy, "Academy"], [location, "Location"], [specialization, "Specialization"], [experience, "Experience"], [fee, "Fee"]] as const) {
      if (!value || typeof value !== "string" || !value.trim()) errors.push(`${label} is required.`);
    }
    if (status && !VALID_STATUSES.includes(status)) errors.push("Invalid status.");
    if (errors.length) return NextResponse.json({ success: false, errors }, { status: 400 });

    await connectToDatabase();
    const coach = await Coach.create({ image, name, email, sport, academy, location, specialization, experience, fee, status: status || "active" });
    return NextResponse.json({ success: true, coach: mapCoach(coach.toObject()) }, { status: 201 });
  } catch (error) {
    console.error("Create coach error:", error);
    return NextResponse.json({ success: false, errors: ["Internal server error."] }, { status: 500 });
  }
}