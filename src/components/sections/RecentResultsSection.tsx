"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { ResultCard, type ResultCardProps } from "@/components/cards/ResultCard";

export type ResultData = Omit<ResultCardProps, "onViewMedia" | "className">;

const defaultResults: ResultData[] = [
  {
    image: "/images/event-1.png",
    title: "Winter Tennis Championship",
    winner: "Rajesh Kumar",
    score: "6-4, 6-3",
  },
  {
    image: "/images/event-2.png",
    title: "City Football Cup 2026",
    winner: "FC United Mumbai",
    score: "3-1",
  },
  {
    image: "/images/event-3.png",
    title: "State Badminton Open",
    winner: "Priya Sharma",
    score: "21-15, 21-18",
  },
  {
    image: "/images/event-4.png",
    title: "National Sprint Championship",
    winner: "Arjun Mehta",
    score: "10.45s",
  },
];

interface RecentResultsSectionProps {
  title?: string;
  subtitle?: string;
  results?: ResultData[];
  onViewMedia?: (result: ResultData) => void;
}

export function RecentResultsSection({
  title = "Recent Results",
  subtitle = "Catch up on the latest match outcomes and highlights",
  results = defaultResults,
  onViewMedia,
}: RecentResultsSectionProps) {
  return (
    <SectionWrapper title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((result) => (
          <ResultCard
            key={result.title}
            {...result}
            onViewMedia={() => onViewMedia?.(result)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
