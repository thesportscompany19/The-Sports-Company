"use client";

import { Trophy, Users, IndianRupee } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    icon: <Trophy className="size-7 text-white" />,
    number: "1,200+",
    title: "Events Hosted",
    description: "Tournaments and matches organised across India every year",
  },
  {
    icon: <Users className="size-7 text-white" />,
    number: "50,000+",
    title: "Registered Players",
    description: "Athletes across 10+ sports categories competing on our platform",
  },
  {
    icon: <IndianRupee className="size-7 text-white" />,
    number: "₹2 Cr+",
    title: "Prize Money Distributed",
    description: "Total prize pool awarded to winners and runners-up annually",
  },
];

interface ImpactSectionProps {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
}

export function ImpactSection({
  title = "Our Impact",
  subtitle = "Building the future of grassroots sports in India",
  stats = STATS,
}: ImpactSectionProps) {
  return (
    <section className="bg-[#0B1C2D] text-white">
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base">{subtitle}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {stats.map((stat) => (
            <div key={stat.title} className="flex flex-col items-center">
              {/* Icon circle */}
              <div className="bg-[#C62828] rounded-full p-4 inline-flex">
                {stat.icon}
              </div>

              {/* Number */}
              <p className="text-4xl font-bold text-[#C62828] mt-4">
                {stat.number}
              </p>

              {/* Title */}
              <p className="font-medium mt-2">{stat.title}</p>

              {/* Description */}
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
