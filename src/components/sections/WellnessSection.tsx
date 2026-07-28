"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { WellnessCard, type WellnessCardProps } from "@/components/cards/WellnessCard";
import { WellnessBookingModal } from "@/components/form/WellnessBookingModal";
import { Brain, Heart, Dumbbell } from "lucide-react";
import { wellnessStore, type AdminWellness, type WellnessType } from "@/lib/admin-data";

type WellnessData = Omit<WellnessCardProps, "onBook" | "className"> & { type: WellnessType };

const WELLNESS_TABS = [
  { value: "psychologists", label: "Sports Psychologists", icon: <Brain className="size-4" /> },
  { value: "counselors",    label: "Counselors",           icon: <Heart className="size-4" /> },
  { value: "gyms",          label: "Gyms",                 icon: <Dumbbell className="size-4" /> },
];

const PAGE_SIZE = 6;

function normalizeFee(fee: string): { sessionLabel: string; amount: number } {
  const label = fee.toLowerCase().includes("month") ? "Monthly" : "Per Session";
  const match = fee.replace(/,/g, "").match(/(\d+)/);
  const amount = match ? Number(match[0]) : 0;
  return { sessionLabel: label, amount };
}

function mapWellnessData(item: AdminWellness): WellnessData {
  const { amount, sessionLabel } = normalizeFee(item.fee);
  return {
    image: item.image || "/images/event-1.png",
    name: item.name,
    specialization: item.specialization,
    location: item.location,
    experience: item.experience,
    fee: item.fee,
    amount,
    sessionLabel,
    type: item.type,
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
  const [activeItem, setActiveItem] = useState<WellnessData | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [wellnessItems, setWellnessItems] = useState<WellnessData[]>([]);
  const [pageIndexes, setPageIndexes] = useState<Record<WellnessType, number>>({
    psychologists: 1,
    counselors: 1,
    gyms: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadWellness = () => {
    const items = wellnessStore.getAll()
      .filter((item) => item.status === "active")
      .map(mapWellnessData);
    setWellnessItems(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWellness();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "tida_admin_wellness" || event.key === null) {
        loadWellness();
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
    setActiveItem(item);
    setShowBookingModal(true);
  };

  const handlePageChange = (tab: WellnessType, nextPage: number) => {
    setPageIndexes((prev) => ({ ...prev, [tab]: nextPage }));
  };

  return (
    <SectionWrapper id="wellness" title={title} subtitle={subtitle}>
      <CustomTabs tabs={WELLNESS_TABS} variant="dark" centered scrollable>
        {(activeTab) => {
          const activeType = activeTab as WellnessType;
          const allItems = itemsByType[activeType] ?? [];
          const page = pageIndexes[activeType] ?? 1;
          const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
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
                      onBook={() => handleBook(item)}
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

      <WellnessBookingModal
        open={showBookingModal}
        item={activeItem}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => setShowBookingModal(false)}
      />
    </SectionWrapper>
  );
}
