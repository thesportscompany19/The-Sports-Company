"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import {
  ShieldCheck,
  BadgeIndianRupee,
  UserCheck,
  HeartPulse,
  Scale,
  Lock,
  Trophy,
  PhoneCall,
  ArrowRight,
  X,
} from "lucide-react";

interface KeyPoint {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const KEY_POINTS: KeyPoint[] = [
  {
    icon: <BadgeIndianRupee className="size-5" />,
    title: "Registration Fee — ₹99 (One-Time)",
    desc: "A non-refundable fee of ₹99 activates your player profile and grants access to all events, matches & resources on the platform.",
  },
  {
    icon: <UserCheck className="size-5" />,
    title: "Identity & Age Verification",
    desc: "Your Aadhaar number is used solely for age and identity verification. Participants must be 6+ years of age.",
  },
  {
    icon: <Trophy className="size-5" />,
    title: "Sport Participation & Fair Play",
    desc: "You may register for multiple sports. The Sports Company reserves the right to disqualify players violating fair-play norms.",
  },
  {
    icon: <HeartPulse className="size-5" />,
    title: "Medical Fitness Declaration",
    desc: "By proceeding, you confirm you are medically fit to participate. The platform is not liable for injuries during training or competition.",
  },
  {
    icon: <Scale className="size-5" />,
    title: "Code of Conduct",
    desc: "All players, coaches, and guardians must maintain respectful conduct. Harassment or unsportsmanlike behaviour results in suspension.",
  },
  {
    icon: <Lock className="size-5" />,
    title: "Data Privacy & Security",
    desc: "Your personal data is encrypted and never sold to third parties. It is used solely for registration, communication, and platform improvements.",
  },
  {
    icon: <ShieldCheck className="size-5" />,
    title: "Payment Security",
    desc: "Payments are processed via Razorpay — a PCI-DSS certified gateway. We never store card or UPI details.",
  },
  {
    icon: <PhoneCall className="size-5" />,
    title: "Support & Grievance Redressal",
    desc: "For payment or registration issues, email support@thesportscompany.in. Resolution within 3–5 business days.",
  },
];

interface RegistrationTermsModalProps {
  open: boolean;
  name: string;
  sports: string[];
  onContinue: () => void;
  onClose: () => void;
}

export function RegistrationTermsModal({
  open,
  name,
  sports,
  onContinue,
  onClose,
}: RegistrationTermsModalProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!open) setScrolled(false);
  }, [open]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) setScrolled(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="p-0 overflow-hidden border-0 shadow-2xl
          w-[calc(100%-1.5rem)]
          sm:w-[90vw]
          sm:max-w-180
          max-h-[92dvh]
          flex flex-col
          rounded-2xl"
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="relative bg-[#0B1C2D] px-6 pt-6 pb-5 shrink-0">
          {/* Red top accent */}
          <span className="absolute top-0 left-0 right-0 h-0.75 bg-[#C62828] rounded-t-2xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          >
            <X className="size-4" />
          </button>

          {/* Title row */}
          <div className="flex items-start gap-3 pr-8">
            <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-[#C62828]/15 border border-[#C62828]/30 mt-0.5">
              <ShieldCheck className="size-5 text-[#C62828]" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl font-bold leading-snug">
                Registration Terms & Key Points
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-1">
                Please read carefully before proceeding to payment
              </p>
            </div>
          </div>

          {/* Player + sports summary */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/10">
              <UserCheck className="size-3.5 text-[#C62828]" />
              {name || "Player"}
            </span>
            {sports.slice(0, 5).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 bg-[#C62828]/15 text-red-300 text-xs px-2.5 py-1.5 rounded-full border border-[#C62828]/20"
              >
                <Trophy className="size-3" />
                {s}
              </span>
            ))}
            {sports.length > 5 && (
              <span className="text-gray-400 text-xs px-1">+{sports.length - 5} more</span>
            )}
          </div>
        </div>

        {/* ── Scrollable Body ─────────────────────────────── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-white"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#C62828 #f1f1f1" }}
        >
          <div className="px-6 py-5 space-y-5">
            {/* Intro note */}
            <div className="flex gap-3 items-start bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <ShieldCheck className="size-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[#0B1C2D] text-sm leading-relaxed">
                By clicking{" "}
                <strong className="text-[#C62828]">Continue to Pay</strong>, you acknowledge
                and agree to the following terms and conditions set by{" "}
                <strong>The Sports Company</strong>.
              </p>
            </div>

            {/* Key points — 2-column grid on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KEY_POINTS.map((point, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-[#C62828]/30 hover:bg-red-50/40 transition-colors"
                >
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[#0B1C2D]/6 border border-[#0B1C2D]/8 text-[#C62828] mt-0.5">
                    {point.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0B1C2D] leading-snug">{point.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            {!scrolled && (
              <p className="text-center text-xs text-gray-400 animate-pulse pb-1">
                ↓ Scroll to review all points
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Legal links */}
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-[#C62828] underline underline-offset-2 hover:no-underline font-medium"
              >
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a
                href="#"
                className="text-[#C62828] underline underline-offset-2 hover:no-underline font-medium"
              >
                Privacy Policy
              </a>
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-10 px-5 text-sm border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400"
              >
                Cancel
              </Button>
              <PrimaryButton
                onClick={onContinue}
                className="h-10 px-6 text-sm font-semibold gap-2 shadow-sm"
              >
                Continue to Pay ₹99
                <ArrowRight className="size-4" />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
