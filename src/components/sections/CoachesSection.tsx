"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CoachCard, type CoachCardProps } from "@/components/cards/CoachCard";
import { BookingModal, type BookingItem } from "@/components/form/BookingModal";
import { normalizeFee } from "@/lib/price";
import { coachesStore } from "@/lib/admin-data";
import { getCoachImageBySport } from "@/lib/coach-images";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type CoachData = Omit<CoachCardProps, "onContact" | "onGalleryOpen" | "className"> & { providerEmail?: string };

const defaultCoaches: CoachData[] = [
  { image: getCoachImageBySport("Cricket"), name: "Ravi Shastri", sport: "Cricket", academy: "National Cricket Academy", location: "Mumbai, Maharashtra", specialization: "Batting", experience: "15 Years", fee: "₹2,500 / Session" },
  { image: getCoachImageBySport("Football"), name: "Sunil Chhetri", sport: "Football", academy: "Elite Football Academy", location: "Bengaluru, Karnataka", specialization: "Attacking Play", experience: "12 Years", fee: "₹2,000 / Session" },
  { image: getCoachImageBySport("Badminton"), name: "Saina Nehwal", sport: "Badminton", academy: "Gopichand Badminton Academy", location: "Hyderabad, Telangana", specialization: "Singles", experience: "18 Years", fee: "₹3,000 / Session" },
  { image: getCoachImageBySport("Athletics"), name: "Milkha Singh", sport: "Athletics", academy: "SAI Athletics Centre", location: "Patiala, Punjab", specialization: "Sprinting", experience: "20 Years", fee: "₹1,800 / Session" },
  { image: getCoachImageBySport("Wrestling"), name: "Satpal Singh", sport: "Wrestling", academy: "Haryana Sports Academy", location: "Sonipat, Haryana", specialization: "Freestyle", experience: "22 Years", fee: "₹1,500 / Session" },
  { image: getCoachImageBySport("Badminton"), name: "Pullela Gopichand", sport: "Badminton", academy: "Gopichand Academy", location: "Hyderabad, Telangana", specialization: "Doubles & Singles", experience: "25 Years", fee: "₹3,500 / Session" },
];

interface CoachesSectionProps {
  title?: string;
  subtitle?: string;
  coaches?: CoachData[];
  onContact?: (coach: CoachData) => void;
}

export function CoachesSection({
  title = "Coaches & Academies",
  subtitle = "Train with the best — find certified coaches near you",
  coaches: propCoaches,
  onContact,
}: CoachesSectionProps) {
  const [coaches, setCoaches] = useState<CoachData[]>(() => {
    try {
      const list = coachesStore.getAll();
      return list.map((c) => ({ image: getCoachImageBySport(c.sport), providerEmail: c.email, name: c.name, sport: c.sport, academy: c.academy, location: c.location, specialization: c.specialization, experience: c.experience, fee: c.fee }));
    } catch {
      return defaultCoaches;
    }
  });

  const [activeCoach, setActiveCoach] = useState<BookingItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [galleryCoach, setGalleryCoach] = useState<CoachData | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  const galleryImages = galleryCoach?.galleryImages?.length
    ? galleryCoach.galleryImages
    : galleryCoach ? [galleryCoach.image] : [];
  const coachDiscountAmount = galleryCoach
    ? Math.round(normalizeFee(galleryCoach.fee).amount * 0.5)
    : 0;

  function openGallery(coach: CoachData) {
    setGalleryCoach(coach);
    setGalleryIndex(0);
  }

  function scrollGallery(direction: -1 | 1) {
    const track = galleryTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    if (galleryCoach && galleryTrackRef.current) {
      galleryTrackRef.current.scrollTo({ left: 0 });
    }
  }, [galleryCoach]);

  const handleBookCoach = (coach: CoachData) => {
    const { amount, sessionLabel } = normalizeFee(coach.fee);
    setActiveCoach({
      category: "coach",
      name: coach.name,
      providerEmail: coach.providerEmail,
      sport: coach.sport,
      academy: coach.academy,
      specialization: coach.specialization,
      location: coach.location,
      experience: coach.experience,
      sessionLabel,
      fee: coach.fee,
      amount,
    });
    setShowBookingModal(true);
  };

  useEffect(() => {
    if (propCoaches && propCoaches.length > 0) return;

    let mounted = true;
    async function fetchCoaches() {
      try {
        const res = await fetch("/api/coaches", { cache: "no-store" });
        const data = await res.json();
        if (!mounted) return;
        if (data?.success && Array.isArray(data.coaches)) {
          setCoaches(data.coaches.map((coach: CoachData & { email?: string }) => ({
            ...coach,
            image: coach.galleryImages?.[0] || coach.image || getCoachImageBySport(coach.sport),
            providerEmail: coach.email,
          })));
          return;
        }
      } catch {
        // ignore API errors and fallback to local store
      }

      // fallback to local admin store
      try {
        const list = coachesStore.getAll();
        if (mounted) setCoaches(list.map((coach) => ({
          image: getCoachImageBySport(coach.sport),
          providerEmail: coach.email,
          name: coach.name,
          sport: coach.sport,
          academy: coach.academy,
          location: coach.location,
          specialization: coach.specialization,
          experience: coach.experience,
          fee: coach.fee,
        })));
      } catch {
        // keep defaults
      }
    }

    fetchCoaches();

    function onStorage(e: StorageEvent) {
      if (!e.key) return;
      if (e.key === "tida_admin_coaches_update" || e.key.startsWith("tida_admin_coaches")) {
        fetchCoaches();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => { mounted = false; window.removeEventListener("storage", onStorage); };
  }, [propCoaches]);

  const displayedCoaches = propCoaches && propCoaches.length > 0
    ? propCoaches.map((coach) => ({
      ...coach,
      image: coach.galleryImages?.[0] || coach.image || getCoachImageBySport(coach.sport),
    }))
    : coaches;

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const total = displayedCoaches.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(total, currentPage * pageSize);
  const visible = displayedCoaches.slice(startIdx, endIdx);

  return (
    <SectionWrapper id="coaches" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-medium text-[#2E7D32] border border-[#C8E6C9] shadow-sm">
          Save 50% on coaching sessions today
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((coach) => (
          <CoachCard
            key={`${coach.name}-${coach.academy}`}
            {...coach}
            discountLabel="50% Discount"
            onGalleryOpen={() => openGallery(coach)}
            onContact={() => {
              openGallery(coach);
              onContact?.(coach);
            }}
          />
        ))}
      </div>

      <BookingModal
        open={showBookingModal}
        item={activeCoach}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => setShowBookingModal(false)}
      />

      <Dialog
        open={Boolean(galleryCoach)}
        onOpenChange={(open) => {
          if (!open) setGalleryCoach(null);
        }}
      >
        {galleryCoach && (
          <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] flex-col gap-0 overflow-y-auto p-0 sm:max-w-4xl">
            <DialogHeader className="shrink-0 px-4 pb-3 pt-4 pr-12 sm:px-6 sm:pt-5">
              <DialogTitle className="text-lg font-semibold text-[#0B1C2D] sm:text-xl">
                {galleryCoach.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <Images className="size-4 shrink-0" />
                {galleryCoach.academy} · {galleryImages.length} {galleryImages.length === 1 ? "photo" : "photos"}
              </DialogDescription>
            </DialogHeader>
            <div
              ref={galleryTrackRef}
              className="flex h-[min(32dvh,240px)] shrink-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth bg-[#0B1C2D] [scrollbar-width:thin] sm:h-[min(38dvh,320px)]"
              onScroll={(event) => {
                const track = event.currentTarget;
                setGalleryIndex(Math.round(track.scrollLeft / track.clientWidth));
              }}
              aria-label={`${galleryCoach.name} photo gallery`}
            >
              {galleryImages.map((src, index) => (
                <div key={`${src}-${index}`} className="relative h-full min-w-full shrink-0 snap-center">
                  <Image
                    src={src}
                    alt={`${galleryCoach.name} and ${galleryCoach.academy}, photo ${index + 1}`}
                    fill
                    unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
                    sizes="(max-width: 640px) 100vw, 896px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0 rounded-full"
                disabled={galleryIndex <= 0}
                onClick={() => scrollGallery(-1)}
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <span className="text-sm font-medium text-gray-600" aria-live="polite">
                {galleryIndex + 1} / {galleryImages.length}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0 rounded-full"
                disabled={galleryIndex >= galleryImages.length - 1}
                onClick={() => scrollGallery(1)}
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
            <div className="max-h-[28dvh] shrink-0 space-y-3 overflow-y-auto border-t border-gray-100 px-4 py-3 sm:max-h-[24dvh] sm:px-6 sm:py-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Academy</p>
                  <p className="mt-1 break-words text-sm font-medium text-[#0B1C2D]">{galleryCoach.academy}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Sport &amp; specialization</p>
                  <p className="mt-1 break-words text-sm font-medium text-[#0B1C2D]">{galleryCoach.sport} · {galleryCoach.specialization}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Location</p>
                  <p className="mt-1 break-words text-sm font-medium text-[#0B1C2D]">{galleryCoach.location}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Experience &amp; session fee</p>
                  <p className="mt-1 break-words text-sm font-medium text-[#0B1C2D]">{galleryCoach.experience} · {galleryCoach.fee}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                50% discount · Pay {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(coachDiscountAmount)} after confirmation.
              </p>
            </div>
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setGalleryCoach(null)}>
                Close details
              </Button>
              <Button
                className="w-full bg-[#C62828] text-white hover:bg-[#a82020] sm:w-auto"
                onClick={() => {
                  const coach = galleryCoach;
                  setGalleryCoach(null);
                  handleBookCoach(coach);
                }}
              >
                Continue to booking
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-[#0B1C2D]">{startIdx + 1}</span> — <span className="font-medium text-[#0B1C2D]">{endIdx}</span> of <span className="font-medium text-[#0B1C2D]">{total}</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500">Rows:</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded-md px-2 py-1 text-sm">
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>

          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50">Prev</button>
            <div className="px-2 text-sm">{currentPage} / {pageCount}</div>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={currentPage === pageCount} className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
