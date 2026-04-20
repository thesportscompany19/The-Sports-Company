"use client";

import { cn } from "@/lib/utils";

export interface RulesData {
  overview: string;
  ageCategories: string[];
  scoringSystem: string[];
  disqualificationRules: string[];
}

interface RulesContentProps {
  data: RulesData;
  className?: string;
}

export function RulesContent({ data, className }: RulesContentProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm p-6 mt-6 space-y-8",
        className
      )}
    >
      {/* Overview */}
      <section>
        <h3 className="font-semibold text-[#0B1C2D] text-base mb-2">
          Overview
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{data.overview}</p>
      </section>

      {/* Age Categories */}
      <section>
        <h3 className="font-semibold text-[#0B1C2D] text-base mb-2">
          Age Categories
        </h3>
        <div className="flex flex-wrap gap-3 mt-2">
          {data.ageCategories.map((cat) => (
            <span
              key={cat}
              className="bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-[#0B1C2D]"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center mt-6">
        * Rules are subject to change. Please check with the tournament organiser for the latest version.
      </p>
    </div>
  );
}
