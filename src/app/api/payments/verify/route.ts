import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Player } from "@/models/Player";
import { ensurePlayerSportIds } from "@/lib/player-ids";
import { sendPaymentEmails } from "@/lib/payment-email";
import { sendPaymentWhatsApp } from "@/lib/payment-whatsapp";

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
    const pendingPlayer = await Player.findById(playerId);
    if (!pendingPlayer) {
      return NextResponse.json(
        { success: false, errors: ["Player not found."] },
        { status: 404 }
      );
    }

    if (pendingPlayer.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, errors: ["Payment order does not match this registration."] },
        { status: 400 }
      );
    }

    let player = await ensurePlayerSportIds(pendingPlayer);
    if (player.paymentStatus !== "paid") {
      const updatedPlayer = await Player.findOneAndUpdate(
        { _id: playerId, paymentStatus: { $ne: "paid" } },
        { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      if (!updatedPlayer) {
        const alreadyPaidPlayer = await Player.findById(playerId);
        if (!alreadyPaidPlayer || alreadyPaidPlayer.paymentStatus !== "paid") {
          return NextResponse.json(
            { success: false, errors: ["Player not found."] },
            { status: 404 }
          );
        }
        player = alreadyPaidPlayer;
      } else {
        player = updatedPlayer;
      }
    }

    if (!player.sportPlayerIds?.length) {
      return NextResponse.json(
        { success: false, errors: ["Could not assign player IDs. Please contact support."] },
        { status: 500 }
      );
    }

    const sportIdDetails = Object.fromEntries(
      player.sportPlayerIds.map(({ sport, playerId: sportPlayerId }: { sport: string; playerId: string }) => [
        `${sport} Player ID`,
        sportPlayerId,
      ])
    );
    try {
      await sendPaymentEmails({
        category: "registration", customerName: player.fullName, customerEmail: player.email,
        customerPhone: player.mobile, serviceName: "Player Registration", referenceId: String(player._id),
        orderId: player.razorpayOrderId || razorpay_order_id, paymentId: razorpay_payment_id,
        amount: 99, currency: "INR", details: {
          "Player name": player.fullName,
          Sports: player.sports.join(", "),
          ...sportIdDetails,
          City: player.city,
          "Date of birth": player.dob,
          ...(player.coachName ? { Coach: player.coachName } : {}),
        },
      });
    } catch (emailError) { console.error("Registration payment email error:", emailError); }
    try {
      await sendPaymentWhatsApp({
        category: "registration", customerName: player.fullName, customerEmail: player.email,
        customerPhone: player.mobile, serviceName: "Player Registration", referenceId: String(player._id),
        orderId: player.razorpayOrderId || razorpay_order_id, paymentId: razorpay_payment_id,
        amount: 99, currency: "INR", details: {
          "Player name": player.fullName,
          Sports: player.sports.join(", "),
          ...sportIdDetails,
          City: player.city,
          "Date of birth": player.dob,
        },
      });
    } catch (whatsappError) { console.error("Registration WhatsApp error:", whatsappError); }

    return NextResponse.json({
      success: true,
      message: "Payment verified and registration complete!",
      playerId: player._id,
      sportPlayerIds: player.sportPlayerIds,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, errors: ["Payment verification failed. Please contact support."] },
      { status: 500 }
    );
  }
}
