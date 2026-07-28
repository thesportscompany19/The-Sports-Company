"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { WellnessCard, type WellnessCardProps } from "@/components/cards/WellnessCard";
import { WellnessBookingModal } from "@/components/form/WellnessBookingModal";
import { Brain, Heart, Dumbbell } from "lucide-react";

type WellnessType = "psychologists" | "counselors" | "gyms";

type WellnessData = Omit<WellnessCardProps, "onBook" | "className"> & { type: WellnessType };

const PSYCHOLOGISTS: WellnessData[] = [
  {
    image: "/images/Image%20(Dr.%20Anjali%20Mehta).png",
    name: "Dr. Anjali Mehta",
    specialization: "Sports Psychologist",
    location: "Mumbai, Maharashtra",
    experience: "12 years experience",
    sessionLabel: "Per Session",
    fee: "₹1,200",
    amount: 1200,
    type: "psychologists",
  },
  {
    image: "/images/Image%20(Dr.%20Karthik%20Reddy).png",
    name: "Dr. Karthik Reddy",
    specialization: "Performance Psychologist",
    location: "Hyderabad, Telangana",
    experience: "9 years experience",
    sessionLabel: "Per Session",
    fee: "₹1,500",
    amount: 1500,
    type: "psychologists",
  },
  {
    image: "/images/result-1.png",
    name: "Dr. Preethi Nair",
    specialization: "Mental Conditioning Coach",
    location: "Bengaluru, Karnataka",
    experience: "7 years experience",
    sessionLabel: "Per Session",
    fee: "₹1,000",
    amount: 1000,
    type: "psychologists",
  },
];

const COUNSELORS: WellnessData[] = [
  {
    image: "/images/Image%20(Dr.%20Karthik%20Reddy).png",
    name: "Ms. Ritu Sharma",
    specialization: "Sports Counselor",
    location: "Delhi, NCR",
    experience: "8 years experience",
    sessionLabel: "Per Session",
    fee: "₹800",
    amount: 800,
    type: "counselors",
  },
  {
    image: "/images/Image%20(Dr.%20Anjali%20Mehta).png",
    name: "Mr. Arun Pillai",
    specialization: "Career & Wellness Counselor",
    location: "Chennai, Tamil Nadu",
    experience: "6 years experience",
    sessionLabel: "Per Session",
    fee: "₹750",
    amount: 750,
    type: "counselors",
  },
  {
    image: "/images/result-1.png",
    name: "Ms. Sonal Joshi",
    specialization: "Youth Sports Counselor",
    location: "Pune, Maharashtra",
    experience: "5 years experience",
    sessionLabel: "Per Session",
    fee: "₹700",
    amount: 700,
    type: "counselors",
  },
];

const GYMS: WellnessData[] = [
  {
    image: "/images/event-1.png",
    name: "FitZone Sports Arena",
    specialization: "Strength & Conditioning",
    location: "Andheri, Mumbai",
    experience: "Equipment for 20+ sports",
    sessionLabel: "Monthly",
    fee: "₹2,500",
    amount: 2500,
    type: "gyms",
  },
  {
    image: "/images/event-2.png",
    name: "ProAthletics Gym",
    specialization: "Athletic Performance Training",
    location: "Koramangala, Bengaluru",
    experience: "NSCA-certified trainers",
    sessionLabel: "Monthly",
    fee: "₹3,000",
    amount: 3000,
    type: "gyms",
  },
  {
    image: "/images/event-3.png",
    name: "Champions Fitness Hub",
    specialization: "Functional & Sports Fitness",
    location: "Connaught Place, Delhi",
    experience: "Olympic-standard equipment",
    sessionLabel: "Monthly",
    fee: "₹2,200",
    amount: 2200,
    type: "gyms",
  },
];

const DATA_MAP: Record<string, WellnessData[]> = {
  psychologists: PSYCHOLOGISTS,
  counselors: COUNSELORS,
  gyms: GYMS,
};

const WELLNESS_TABS = [
  { value: "psychologists", label: "Sports Psychologists", icon: <Brain className="size-4" /> },
  { value: "counselors",    label: "Counselors",           icon: <Heart className="size-4" /> },
  { value: "gyms",          label: "Gyms",                 icon: <Dumbbell className="size-4" /> },
];

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

  const handleBook = (item: WellnessData) => {
    setActiveItem(item);
    setShowBookingModal(true);
  };

  return (
    <SectionWrapper id="wellness" title={title} subtitle={subtitle}>
      <CustomTabs tabs={WELLNESS_TABS} variant="dark" centered scrollable>
        {(activeTab) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {DATA_MAP[activeTab].map((item) => (
              <WellnessCard
                key={item.name}
                {...item}
                onBook={() => handleBook(item)}
              />
            ))}
          </div>
        )}
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
