"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Shield } from "lucide-react";
import { toast } from "sonner";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface WellnessBookingModalProps {
  open: boolean;
  item: WellnessData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export type WellnessType = "psychologists" | "counselors" | "gyms";

export interface WellnessData {
  image: string;
  name: string;
  specialization: string;
  location: string;
  experience: string;
  sessionLabel: string;
  fee: string;
  amount: number;
  type: WellnessType;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function formatRupee(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function WellnessBookingModal({ open, item, onClose, onSuccess }: WellnessBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePay = useCallback(async () => {
    if (!item) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    const discountPercent = 50;
    const discountedAmount = Math.round(item.amount * (1 - discountPercent / 100));

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please refresh and try again.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/payments/wellness/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: item.name,
          providerType: item.type,
          specialization: item.specialization,
          location: item.location,
          experience: item.experience,
          sessionLabel: item.sessionLabel,
          amount: discountedAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.errors?.join(", ") || "Unable to create booking. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "The Sports Company",
        description: `Wellness session booking for ${item.name}`,
        order_id: data.orderId,
        prefill: {
          name: item.name,
          email: "",
          contact: "",
        },
        theme: { color: "#C62828" },
        handler: async (razorpayResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/wellness/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                bookingId: data.bookingId,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success("Payment successful! Your wellness session is booked.");
              onSuccess();
            } else {
              toast.error(verifyData.errors?.join(", ") || "Payment verification failed.");
            }
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }, [item, isSubmitting, onSuccess]);

  if (!item) return null;

  const discountPercent = 50;
  const discountedAmount = Math.round(item.amount * (1 - discountPercent / 100));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="p-0 overflow-hidden border-0 shadow-2xl w-[min(96vw,860px)] max-w-[860px] rounded-[32px]">
        <DialogHeader className="bg-[#0B1C2D] px-6 pt-6 pb-4 text-white">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Shield className="size-5 text-[#C62828]" />
              <div>
                <DialogTitle className="text-xl font-semibold">Confirm Wellness Booking</DialogTitle>
                <p className="text-sm text-gray-200">Pay with Razorpay to complete your session booking.</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-white px-6 py-5 space-y-5">
          <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="text-lg font-semibold text-[#0B1C2D]">{item.name}</p>
              </div>
              <span className="rounded-full bg-[#C62828]/10 px-3 py-1 text-xs font-semibold text-[#C62828]">
                {item.sessionLabel}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 border border-gray-100">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Specialization</p>
                <p className="mt-2 text-sm text-[#0B1C2D]">{item.specialization}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-gray-100">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Location</p>
                <p className="mt-2 text-sm text-[#0B1C2D]">{item.location}</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border border-[#C62828]/10 bg-[#FDF2F2] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#C62828] font-semibold">Original Fee</p>
                  <p className="mt-2 text-2xl font-semibold text-[#0B1C2D] line-through">{formatRupee(item.amount)}</p>
                </div>
                <div className="rounded-2xl bg-[#C62828] px-3 py-2 text-white text-sm font-semibold">
                  50% OFF
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 border border-gray-100">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Discounted Payable</p>
                  <p className="mt-2 text-2xl font-semibold text-[#0B1C2D]">{formatRupee(discountedAmount)}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-gray-100">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">You Save</p>
                  <p className="mt-2 text-2xl font-semibold text-[#0B1C2D]">{formatRupee(item.amount - discountedAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogDescription className="text-sm text-gray-500">
            This booking will be processed through Razorpay. The pay amount already includes a 50% discount on the session fee.
          </DialogDescription>
        </div>

        <DialogFooter className="gap-3 px-6 pb-6 pt-4">
          <Button variant="outline" onClick={onClose} className="h-11 px-5">
            Cancel
          </Button>
          <PrimaryButton onClick={handlePay} className="h-11 px-6" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : `Pay ${formatRupee(discountedAmount)}`}
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
