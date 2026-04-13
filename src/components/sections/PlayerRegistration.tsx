"use client";

import { useState, useCallback, useRef } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { FormField } from "@/components/form/FormField";
import { SportsSelectCard } from "@/components/form/SportsSelectCard";
import { RegistrationTermsModal } from "@/components/form/RegistrationTermsModal";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

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

const SPORTS = [
  { name: "Cricket",     icon: "/images/svg/bat.png" },
  { name: "Football",    icon: "/images/svg/football.png" },
  { name: "Basketball",  icon: "/images/svg/basket.png" },
  { name: "Badminton",   icon: "/images/svg/bedminton.png" },
  { name: "Hockey",      icon: "/images/svg/handball.png" },
  { name: "Volleyball",  icon: "/images/svg/hacky.png" },
  { name: "Swimming",    icon: "/images/svg/swimming.png" },
  { name: "Athletics",   icon: "/images/svg/athletics.png" },
  { name: "Tennis",      icon: "/images/svg/ball.png" },
];

interface FormState {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  guardianMobile: string;
  email: string;
  city: string;
  aadhaar: string;
}

interface PlayerRegistrationProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: FormState & { sports: string[] }) => void;
}

export function PlayerRegistration({
  title = "Player Registration",
  subtitle = "Fill in your details to register and start competing",
  onSubmit,
}: PlayerRegistrationProps) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    guardianMobile: "",
    email: "",
    city: "",
    aadhaar: "",
  });

  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  // hold validated payload until user accepts terms
  const pendingPayloadRef = useRef<(FormState & { sports: string[] }) | null>(null);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleSport = (name: string) =>
    setSelectedSports((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic client-side checks
    if (!form.fullName || !form.dob || !form.gender || !form.mobile || !form.email || !form.city || !form.aadhaar) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (selectedSports.length === 0) {
      toast.error("Please select at least one sport.");
      return;
    }

    // Store payload and show terms modal before payment
    pendingPayloadRef.current = { ...form, sports: selectedSports };
    setShowTermsModal(true);
  }, [form, selectedSports, isSubmitting]);

  const handleProceedToPayment = useCallback(async () => {
    setShowTermsModal(false);
    const payload = pendingPayloadRef.current;
    if (!payload) return;

    onSubmit?.(payload);
    setIsSubmitting(true);

    try {
      // 1 — Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please refresh and try again.");
        setIsSubmitting(false);
        return;
      }

      // 2 — Create order on server (also saves player with "pending" status)
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        const msg = orderData.errors?.join(", ") || "Could not create order.";
        toast.error(msg);
        setIsSubmitting(false);
        return;
      }

      // 3 — Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Sports Company",
        description: "Player Registration Fee — ₹99",
        order_id: orderData.orderId,
        prefill: {
          name: payload.fullName,
          email: payload.email,
          contact: payload.mobile,
        },
        theme: { color: "#C62828" },
        handler: async (response: RazorpayResponse) => {
          // 4 — Verify payment on server
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                playerId: orderData.playerId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success("Payment successful! Registration complete.");
              setForm({ fullName: "", dob: "", gender: "", mobile: "", guardianMobile: "", email: "", city: "", aadhaar: "" });
              setSelectedSports([]);
              pendingPayloadRef.current = null;
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
  }, [onSubmit]);

  return (
    <SectionWrapper id="register" title={title} subtitle={subtitle}>
      {/* Terms & Conditions Modal */}
      <RegistrationTermsModal
        open={showTermsModal}
        name={form.fullName}
        sports={selectedSports}
        onContinue={handleProceedToPayment}
        onClose={() => setShowTermsModal(false)}
      />

      <div className="max-w-7xl mx-auto bg-gray-100 rounded-2xl shadow-md p-6 md:p-10">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Personal Details ─────────────────────────────── */}
          <p className="text-sm font-semibold text-[#0B1C2D] uppercase tracking-wide mb-5">
            Personal Details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              id="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              required
              value={form.fullName}
              onChange={handleChange("fullName")}
            />

            <FormField
              id="dob"
              label="Date of Birth"
              type="date"
              required
              value={form.dob}
              onChange={handleChange("dob")}
            />

            {/* Gender — full-width styled select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gender" className="text-sm font-medium text-[#0B1C2D]">
                Gender <span className="text-[#C62828]">*</span>
              </Label>
              <Select
                value={form.gender}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, gender: val }))
                }
              >
                <SelectTrigger
                  id="gender"
                  className="w-full h-12! border border-gray-300 rounded-lg bg-white text-sm text-[#0B1C2D] px-4 focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-[#C62828] transition-all"
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                  <SelectItem value="male" className="text-sm py-2.5 cursor-pointer">Male</SelectItem>
                  <SelectItem value="female" className="text-sm py-2.5 cursor-pointer">Female</SelectItem>
                  <SelectItem value="other" className="text-sm py-2.5 cursor-pointer">Other / Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              id="mobile"
              label="Mobile Number"
              type="tel"
              placeholder="+91 00000 00000"
              required
              value={form.mobile}
              onChange={handleChange("mobile")}
            />

            <FormField
              id="guardianMobile"
              label="Guardian Mobile Number"
              type="tel"
              placeholder="+91 00000 00000"
              value={form.guardianMobile}
              onChange={handleChange("guardianMobile")}
            />

            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={handleChange("email")}
            />

            <FormField
              id="city"
              label="City"
              placeholder="Enter your city"
              required
              value={form.city}
              onChange={handleChange("city")}
            />

            <FormField
              id="aadhaar"
              label="Aadhaar Number"
              placeholder="XXXX XXXX XXXX"
              required
              value={form.aadhaar}
              onChange={handleChange("aadhaar")}
            />
          </div>

          {/* ── Sport Selection ───────────────────────────────── */}
          <p className="text-sm font-semibold text-[#0B1C2D] uppercase tracking-wide mt-10 mb-5">
            Select Your Sport(s)
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {SPORTS.map((sport) => (
              <SportsSelectCard
                key={sport.name}
                name={sport.name}
                icon={sport.icon}
                isSelected={selectedSports.includes(sport.name)}
                onSelect={() => toggleSport(sport.name)}
              />
            ))}
          </div>

          {/* ── CTA ──────────────────────────────────────────── */}
          <div className="mt-8 flex justify-center md:justify-end">
            <PrimaryButton
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 h-auto rounded-lg text-base font-semibold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Pay ₹99 & Register Now"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
}
