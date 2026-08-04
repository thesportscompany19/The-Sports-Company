"use client";

import { useEffect, useState } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CoachCard, type CoachCardProps } from "@/components/cards/CoachCard";
import { BookingModal, type BookingItem } from "@/components/form/BookingModal";
import { normalizeFee } from "@/lib/price";
import { coachesStore } from "@/lib/admin-data";
import { getCoachImageBySport } from "@/lib/coach-images";

export type CoachData = Omit<CoachCardProps, "onContact" | "className">;

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
      return list.map((c) => ({ image: getCoachImageBySport(c.sport), name: c.name, sport: c.sport, academy: c.academy, location: c.location, specialization: c.specialization, experience: c.experience, fee: c.fee }));
    } catch {
      return defaultCoaches;
    }
  });

  const [activeCoach, setActiveCoach] = useState<BookingItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookCoach = (coach: CoachData) => {
    const { amount, sessionLabel } = normalizeFee(coach.fee);
    setActiveCoach({
      category: "coach",
      name: coach.name,
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
    if (propCoaches && propCoaches.length > 0) {
      setCoaches(propCoaches);
      return;
    }

    let mounted = true;
    async function fetchCoaches() {
      try {
        const res = await fetch("/api/coaches");
        const data = await res.json();
        if (!mounted) return;
        if (data?.success && Array.isArray(data.coaches)) {
          setCoaches(data.coaches.map((c: any) => ({ image: getCoachImageBySport(c.sport), name: c.name, sport: c.sport, academy: c.academy, location: c.location, specialization: c.specialization, experience: c.experience, fee: c.fee })));
          return;
        }
      } catch (err) {
        // ignore API errors and fallback to local store
      }

      // fallback to local admin store
      try {
        const list = coachesStore.getAll();
        if (mounted) setCoaches(list.map((c) => ({ image: getCoachImageBySport(c.sport), name: c.name, sport: c.sport, academy: c.academy, location: c.location, specialization: c.specialization, experience: c.experience, fee: c.fee })));
      } catch (e) {
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

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const total = coaches.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // keep page in range when coaches or pageSize changes
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
    if (page < 1) setPage(1);
  }, [pageCount, page]);

  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(total, page * pageSize);
  const visible = coaches.slice(startIdx, endIdx);

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
            onContact={() => {
              handleBookCoach(coach);
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
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50">Prev</button>
            <div className="px-2 text-sm">{page} / {pageCount}</div>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
