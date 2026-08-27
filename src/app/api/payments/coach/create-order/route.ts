import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { connectToDatabase } from "@/lib/mongodb";
import { CoachBooking } from "@/models/CoachBooking";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, coachName, coachEmail, sport, academy, specialization, location, experience, sessionLabel, amount } = body;

    const errors: string[] = [];
    if (!customerName || typeof customerName !== "string") errors.push("Customer name is required.");
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) errors.push("A valid customer email is required.");
    if (!coachEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coachEmail)) errors.push("A valid coach email is required.");
    if (!coachName || typeof coachName !== "string" || coachName.trim().length < 2) {
      errors.push("Coach name is required.");
    }
    if (!sport || typeof sport !== "string") {
      errors.push("Sport is required.");
    }
    if (!academy || typeof academy !== "string") {
      errors.push("Academy is required.");
    }
    if (!specialization || typeof specialization !== "string") {
      errors.push("Specialization is required.");
    }
    if (!location || typeof location !== "string") {
      errors.push("Location is required.");
    }
    if (!experience || typeof experience !== "string") {
      errors.push("Experience is required.");
    }
    if (!sessionLabel || typeof sessionLabel !== "string") {
      errors.push("Session label is required.");
    }

    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      errors.push("A valid booking amount is required.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await connectToDatabase();
    const booking = await CoachBooking.create({
      customerName: customerName.trim(), customerEmail: customerEmail.trim().toLowerCase(), customerPhone: customerPhone?.trim() || "",
      coachName: coachName.trim(),
      coachEmail: coachEmail?.trim().toLowerCase() || "",
      sport: sport.trim(),
      academy: academy.trim(),
      specialization: specialization.trim(),
      location: location.trim(),
      experience: experience.trim(),
      sessionLabel: sessionLabel.trim(),
      amount: amountNumber,
      status: "pending",
    });

    const order = await getRazorpay().orders.create({
      amount: Math.round(amountNumber * 100),
      currency: "INR",
      receipt: `coach_${booking._id}`,
      notes: {
        bookingId: String(booking._id),
        coachName: coachName.trim(),
        sport: sport.trim(),
      },
    });

    booking.razorpayOrderId = order.id;
    await booking.save();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      bookingId: booking._id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create coach order error:", error);
    return NextResponse.json(
      { success: false, errors: ["Failed to create coach booking order. Please try again."] },
      { status: 500 }
    );
  }
}
