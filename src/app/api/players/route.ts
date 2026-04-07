import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Player } from "@/models/Player";

const VALID_SPORTS = [
  "Cricket", "Football", "Basketball", "Badminton",
  "Hockey", "Volleyball", "Swimming", "Athletics", "Tennis",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { fullName, dob, gender, mobile, guardianMobile, email, city, aadhaar, sports } = body;

    // --- Validation ---
    const errors: string[] = [];

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      errors.push("Full name is required (min 2 characters).");
    }
    if (!dob) {
      errors.push("Date of birth is required.");
    }
    if (!gender || !["male", "female", "other"].includes(gender)) {
      errors.push("Gender must be male, female, or other.");
    }
    if (!mobile || !/^\+?\d{10,15}$/.test(mobile.replace(/\s/g, ""))) {
      errors.push("A valid mobile number is required.");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("A valid email address is required.");
    }
    if (!city || typeof city !== "string" || city.trim().length < 2) {
      errors.push("City is required.");
    }
    if (!aadhaar || !/^\d{12}$/.test(aadhaar.replace(/\s/g, ""))) {
      errors.push("A valid 12-digit Aadhaar number is required.");
    }
    if (!Array.isArray(sports) || sports.length === 0) {
      errors.push("Select at least one sport.");
    } else if (sports.some((s: unknown) => typeof s !== "string" || !VALID_SPORTS.includes(s as string))) {
      errors.push("One or more selected sports are invalid.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // --- Save to DB ---
    await connectToDatabase();

    const player = await Player.create({
      fullName: fullName.trim(),
      dob,
      gender,
      mobile: mobile.replace(/\s/g, ""),
      guardianMobile: guardianMobile ? guardianMobile.replace(/\s/g, "") : "",
      email: email.trim().toLowerCase(),
      city: city.trim(),
      aadhaar: aadhaar.replace(/\s/g, ""),
      sports,
    });

    return NextResponse.json(
      { success: true, message: "Registration successful!", playerId: player._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Player registration error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error. Please try again later."] },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const players = await Player.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, players });
  } catch (error) {
    console.error("Fetch players error:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}
