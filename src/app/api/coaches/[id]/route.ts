import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Coach, type CoachStatus } from "@/models/Coach";

const VALID_SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball", "Chess"];
const VALID_STATUSES: CoachStatus[] = ["active", "inactive"];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ success: false, errors: ["Invalid coach ID."] }, { status: 400 });
    const body = await req.json();
    const { image, name, email, sport, academy, location, specialization, experience, fee, status } = body;
    if (name !== undefined && (!name || name.trim().length < 2)) return NextResponse.json({ success: false, errors: ["Name is required."] }, { status: 400 });
    if (sport !== undefined && !VALID_SPORTS.includes(sport)) return NextResponse.json({ success: false, errors: ["Valid sport is required."] }, { status: 400 });
    if (status !== undefined && !VALID_STATUSES.includes(status)) return NextResponse.json({ success: false, errors: ["Invalid status."] }, { status: 400 });
    await connectToDatabase();
    const updates = Object.fromEntries(Object.entries({ image, name, email, sport, academy, location, specialization, experience, fee, status }).filter(([, value]) => value !== undefined));
    const coach = await Coach.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!coach) return NextResponse.json({ success: false, errors: ["Coach not found."] }, { status: 404 });
    return NextResponse.json({ success: true, coach: { ...coach, id: String(coach._id) } });
  } catch (error) {
    console.error("Update coach error:", error);
    return NextResponse.json({ success: false, errors: ["Internal server error."] }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ success: false, errors: ["Invalid coach ID."] }, { status: 400 });
    await connectToDatabase();
    const coach = await Coach.findByIdAndDelete(id);
    if (!coach) return NextResponse.json({ success: false, errors: ["Coach not found."] }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete coach error:", error);
    return NextResponse.json({ success: false, errors: ["Internal server error."] }, { status: 500 });
  }
}