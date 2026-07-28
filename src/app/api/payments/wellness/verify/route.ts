import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { WellnessBooking } from "@/models/WellnessBooking";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { success: false, errors: ["Missing payment verification parameters."] },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, errors: ["Server configuration error."] },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    await connectToDatabase();

    if (expectedSignature !== razorpay_signature) {
      await WellnessBooking.findByIdAndUpdate(bookingId, { status: "failed" });
      return NextResponse.json(
        { success: false, errors: ["Payment verification failed. Signature mismatch."] },
        { status: 400 }
      );
    }

    const booking = await WellnessBooking.findByIdAndUpdate(
      bookingId,
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { success: false, errors: ["Booking not found."] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and wellness booking confirmed.",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Wellness payment verification error:", error);
    return NextResponse.json(
      { success: false, errors: ["Payment verification failed. Please contact support."] },
      { status: 500 }
    );
  }
}
