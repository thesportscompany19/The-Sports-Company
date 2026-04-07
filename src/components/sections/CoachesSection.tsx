"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CoachCard, type CoachCardProps } from "@/components/cards/CoachCard";

export type CoachData = Omit<CoachCardProps, "onContact" | "className">;

const defaultCoaches: CoachData[] = [
  {
    image: "/images/event-1.png",
    name: "Ravi Shastri",
    sport: "Cricket",
    academy: "National Cricket Academy",
    location: "Mumbai, Maharashtra",
    specialization: "Batting",
    experience: "15 Years",
    fee: "₹2,500 / Session",
  },
  {
    image: "/images/event-2.png",
    name: "Sunil Chhetri",
    sport: "Football",
    academy: "Elite Football Academy",
    location: "Bengaluru, Karnataka",
    specialization: "Attacking Play",
    experience: "12 Years",
    fee: "₹2,000 / Session",
  },
  {
    image: "/images/event-3.png",
    name: "Saina Nehwal",
    sport: "Badminton",
    academy: "Gopichand Badminton Academy",
    location: "Hyderabad, Telangana",
    specialization: "Singles",
    experience: "18 Years",
    fee: "₹3,000 / Session",
  },
  {
    image: "/images/event-4.png",
    name: "Milkha Singh",
    sport: "Athletics",
    academy: "SAI Athletics Centre",
    location: "Patiala, Punjab",
    specialization: "Sprinting",
    experience: "20 Years",
    fee: "₹1,800 / Session",
  },
  {
    image: "/images/event-1.png",
    name: "Satpal Singh",
    sport: "Wrestling",
    academy: "Haryana Sports Academy",
    location: "Sonipat, Haryana",
    specialization: "Freestyle",
    experience: "22 Years",
    fee: "₹1,500 / Session",
  },
  {
    image: "/images/event-2.png",
    name: "Pullela Gopichand",
    sport: "Badminton",
    academy: "Gopichand Academy",
    location: "Hyderabad, Telangana",
    specialization: "Doubles & Singles",
    experience: "25 Years",
    fee: "₹3,500 / Session",
  },
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
  coaches = defaultCoaches,
  onContact,
}: CoachesSectionProps) {
  return (
    <SectionWrapper id="coaches" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <CoachCard
            key={`${coach.name}-${coach.academy}`}
            {...coach}
            onContact={() => onContact?.(coach)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
