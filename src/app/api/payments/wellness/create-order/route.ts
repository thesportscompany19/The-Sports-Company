import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { connectToDatabase } from "@/lib/mongodb";
import { WellnessBooking } from "@/models/WellnessBooking";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      providerName,
      providerEmail,
      providerType,
      specialization,
      location,
      experience,
      sessionLabel,
      amount,
    } = body;

    const errors: string[] = [];
    if (!customerName || typeof customerName !== "string") errors.push("Customer name is required.");
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) errors.push("A valid customer email is required.");
    if (!providerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providerEmail)) errors.push("A valid provider email is required.");
    if (!providerName || typeof providerName !== "string" || providerName.trim().length < 2) {
      errors.push("Provider name is required.");
    }
    if (!providerType || !["psychologists", "counselors", "gyms"].includes(providerType)) {
      errors.push("Provider type is invalid.");
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
    const booking = await WellnessBooking.create({
      customerName: customerName.trim(), customerEmail: customerEmail.trim().toLowerCase(), customerPhone: customerPhone?.trim() || "",
      providerName: providerName.trim(),
      providerEmail: providerEmail?.trim().toLowerCase() || "",
      providerType,
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
      receipt: `wellness_${booking._id}`,
      notes: {
        bookingId: String(booking._id),
        providerName: providerName.trim(),
        providerType,
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
    console.error("Create wellness order error:", error);
    return NextResponse.json(
      { success: false, errors: ["Failed to create wellness booking order. Please try again."] },
      { status: 500 }
    );
  }
}
