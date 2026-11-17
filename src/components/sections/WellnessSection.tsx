"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { WellnessCard, type WellnessCardProps } from "@/components/cards/WellnessCard";
import { BookingModal, type WellnessBookingItem } from "@/components/form/BookingModal";
import { normalizeFee } from "@/lib/price";
import { Brain, Heart, Dumbbell, MapPin, Sparkles } from "lucide-react";
import { wellnessStore, type AdminWellness, type WellnessType } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type WellnessData = Omit<WellnessCardProps, "onBook" | "onDetails" | "className"> & {
  id?: string;
  description?: string;
  type: WellnessType;
  providerEmail?: string;
};

const WELLNESS_TABS = [
  { value: "psychologists", label: "Sports Psychologists", icon: <Brain className="size-4" />, accent: "red" as const },
  { value: "counselors",    label: "Counselors",           icon: <Heart className="size-4" />, accent: "blue" as const },
  { value: "gyms",          label: "Gyms",                 icon: <Dumbbell className="size-4" />, accent: "green" as const },
];

const PAGE_SIZE = 6;

function mapWellnessData(item: AdminWellness): WellnessData {
  const { amount, sessionLabel } = normalizeFee(item.fee);
  return {
    id: item.id,
    image: item.image || "/images/event-1.png",
    name: item.name,
    description: item.description || "",
    specialization: item.specialization,
    location: item.location,
    experience: item.experience,
    fee: item.fee,
    amount,
    sessionLabel,
    type: item.type,
    providerEmail: item.email,
  };
}

interface WellnessSectionProps {
  title?: string;
  subtitle?: string;
}

export function WellnessSection({
  title = "Wellness & Fitness",
  subtitle = "Connect with certified professionals to support your athletic journey",
}: WellnessSectionProps) {
  const [activeItem, setActiveItem] = useState<WellnessBookingItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<WellnessData | null>(null);
  const [wellnessItems, setWellnessItems] = useState<WellnessData[]>([]);
  const [pageIndexes, setPageIndexes] = useState<Record<WellnessType, number>>({
    psychologists: 1,
    counselors: 1,
    gyms: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadWellness = async () => {
    try {
      const response = await fetch("/api/wellness", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.providers)) {
        throw new Error(data.errors?.join(", ") || "Unable to load wellness providers.");
      }
      setWellnessItems(data.providers.map((provider: AdminWellness) => mapWellnessData(provider)));
    } catch (error) {
      console.error("Fetch wellness providers error:", error);
      setWellnessItems(wellnessStore.getAll()
        .filter((item) => item.status === "active")
        .map(mapWellnessData));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadWellness();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "tida_admin_wellness" || event.key === "tida_admin_wellness_update" || event.key === null) {
        void loadWellness();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const itemsByType = useMemo(
    () => ({
      psychologists: wellnessItems.filter((item) => item.type === "psychologists"),
      counselors: wellnessItems.filter((item) => item.type === "counselors"),
      gyms: wellnessItems.filter((item) => item.type === "gyms"),
    }),
    [wellnessItems]
  );

  const handleBook = (item: WellnessData) => {
    const { amount, sessionLabel } = normalizeFee(item.fee);
    setActiveItem({
      category: "wellness",
      type: item.type,
      name: item.name,
      providerEmail: item.providerEmail,
      specialization: item.specialization,
      location: item.location,
      experience: item.experience,
      sessionLabel,
      fee: item.fee,
      amount,
    });
    setSelectedProvider(null);
    setShowBookingModal(true);
  };

  const handleProviderBooking = () => {
    if (!selectedProvider) return;
    handleBook(selectedProvider);
  };

  const handlePageChange = (tab: WellnessType, nextPage: number) => {
    setPageIndexes((prev) => ({ ...prev, [tab]: nextPage }));
  };

  return (
    <SectionWrapper id="wellness" title={title} subtitle={subtitle}>
      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-medium text-[#2E7D32] border border-[#C8E6C9] shadow-sm">
          Save 50% on wellness bookings today
        </span>
      </div>

      <CustomTabs tabs={WELLNESS_TABS} centered fullWidth>
        {(activeTab) => {
          const activeType = activeTab as WellnessType;
          const allItems = itemsByType[activeType] ?? [];
          const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
          const page = Math.min(pageIndexes[activeType] ?? 1, totalPages);
          const visibleItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <div key={index} className="h-80 rounded-xl bg-gray-100 animate-pulse" />
                  ))
                ) : visibleItems.length ? (
                  visibleItems.map((item) => (
                    <WellnessCard
                      key={`${item.type}-${item.name}`}
                      {...item}
                      discountLabel="50% Discount"
                      onDetails={() => setSelectedProvider(item)}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white/80 p-8 text-center text-gray-500">
                    No wellness providers are available for this category yet.
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    Showing {visibleItems.length} of {allItems.length} providers
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => handlePageChange(activeType, Math.max(1, page - 1))}
                      className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => handlePageChange(activeType, pageNumber)}
                        className={`min-w-[2rem] rounded-md px-3 py-2 text-sm font-medium transition ${
                          pageNumber === page
                            ? "bg-[#0B1C2D] text-white shadow-sm"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => handlePageChange(activeType, Math.min(totalPages, page + 1))}
                      className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </CustomTabs>

      <BookingModal
        open={showBookingModal}
        item={activeItem}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => setShowBookingModal(false)}
      />

      <Dialog
        open={Boolean(selectedProvider)}
        onOpenChange={(open) => {
          if (!open) setSelectedProvider(null);
        }}
      >
        {selectedProvider && (
          <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
            <div className="relative h-40 shrink-0 bg-gray-100 sm:h-56">
              <Image
                src={selectedProvider.image}
                alt={`${selectedProvider.name} banner`}
                fill
                sizes="(max-width: 640px) 100vw, 672px"
                unoptimized={selectedProvider.image.startsWith("data:")}
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-[#0B1C2D] shadow sm:bottom-4 sm:left-4">
                <Sparkles className="size-3.5 text-[#C62828]" />
                {selectedProvider.type === "gyms" ? "Gym" : selectedProvider.type.slice(0, -1)}
              </span>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
              <DialogHeader className="pr-7 text-left">
                <DialogTitle className="text-xl font-bold text-[#0B1C2D] sm:text-2xl">
                  {selectedProvider.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  {selectedProvider.description || selectedProvider.specialization}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Specialization</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0B1C2D]">{selectedProvider.specialization}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Experience</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0B1C2D]">{selectedProvider.experience}</p>
                </div>
                <div className="flex min-w-0 items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700 sm:col-span-2 sm:p-4">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#C62828]" />
                  <span className="break-words">{selectedProvider.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-[#C62828]/15 bg-[#FDF2F2] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{selectedProvider.sessionLabel}</p>
                  <p className="mt-1 text-lg font-bold text-[#0B1C2D]">{selectedProvider.fee}</p>
                </div>
                <span className="w-fit rounded-full bg-[#E8F5E9] px-3 py-1.5 text-xs font-semibold text-[#2E7D32]">50% booking discount</span>
              </div>
            </div>
            <DialogFooter className="mx-0 mb-0 shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:px-6 sm:py-4">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSelectedProvider(null)}>
                Back to providers
              </Button>
              <Button className="w-full bg-[#C62828] text-white hover:bg-[#a82020] sm:w-auto" onClick={handleProviderBooking}>
                Continue to booking
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </SectionWrapper>
  );
}
