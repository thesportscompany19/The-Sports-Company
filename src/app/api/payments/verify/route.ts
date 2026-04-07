import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Player } from "@/models/Player";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, playerId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !playerId) {
      return NextResponse.json(
        { success: false, errors: ["Missing payment verification parameters."] },
        { status: 400 }
      );
    }

    // --- Verify signature ---
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

    if (expectedSignature !== razorpay_signature) {
      // Mark payment as failed
      await connectToDatabase();
      await Player.findByIdAndUpdate(playerId, { paymentStatus: "failed" });
      return NextResponse.json(
        { success: false, errors: ["Payment verification failed. Signature mismatch."] },
        { status: 400 }
      );
    }

    // --- Update player payment status ---
    await connectToDatabase();
    const player = await Player.findByIdAndUpdate(
      playerId,
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!player) {
      return NextResponse.json(
        { success: false, errors: ["Player not found."] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and registration complete!",
      playerId: player._id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, errors: ["Payment verification failed. Please contact support."] },
      { status: 500 }
    );
  }
}
