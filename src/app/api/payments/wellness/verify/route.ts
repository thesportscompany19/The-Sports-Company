import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { WellnessBooking } from "@/models/WellnessBooking";
import { sendPaymentEmails } from "@/lib/payment-email";
import { sendPaymentWhatsApp } from "@/lib/payment-whatsapp";

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

    try {
      await sendPaymentEmails({
        category: "wellness", customerName: booking.customerName, customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone, providerName: booking.providerName, providerEmail: booking.providerEmail,
        serviceName: `${booking.providerName} - ${booking.sessionLabel}`, referenceId: String(booking._id),
        orderId: booking.razorpayOrderId || razorpay_order_id, paymentId: razorpay_payment_id,
        amount: booking.amount, currency: "INR", details: { Type: booking.providerType, Location: booking.location, Specialization: booking.specialization },
      });
    } catch (emailError) { console.error("Wellness payment email error:", emailError); }
    try {
      await sendPaymentWhatsApp({
        category: "wellness", customerName: booking.customerName, customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone, providerName: booking.providerName, providerEmail: booking.providerEmail,
        serviceName: `${booking.providerName} - ${booking.sessionLabel}`, referenceId: String(booking._id),
        orderId: booking.razorpayOrderId || razorpay_order_id, paymentId: razorpay_payment_id,
        amount: booking.amount, currency: "INR", details: { Type: booking.providerType, Location: booking.location, Specialization: booking.specialization },
      });
    } catch (whatsappError) { console.error("Wellness WhatsApp error:", whatsappError); }

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
