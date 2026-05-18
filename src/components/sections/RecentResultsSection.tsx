"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { ResultCard, type ResultCardProps } from "@/components/cards/ResultCard";
import Image from "next/image";

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
  const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);

  return (
    <SectionWrapper title={title} subtitle={subtitle} className="bg-linear-to-b from-[#F4F6F8] to-white">
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {results.map((result) => (
          <div
            key={result.title}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedResult(result)}
          >
            <ResultCard
              {...result}
              onViewMedia={() => onViewMedia?.(result)}
            />
          </div>
        ))}
      </div>

      {/* Gallery View */}
      <div className="mt-12 pt-12 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-[#0B1C2D] mb-8 text-center">
          Gallery Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {results.map((result) => (
            <div
              key={`gallery-${result.title}`}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                <Image
                  src={result.image}
                  alt={result.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Overlay */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-[#0B1C2D] mb-2">
                  {result.title}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-[#C62828]">Winner:</span> {result.winner}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-[#C62828]">Score:</span> {result.score}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
