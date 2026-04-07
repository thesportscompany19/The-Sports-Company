"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { MatchCard, type MatchCardProps } from "@/components/cards/MatchCard";

type MatchData = Omit<MatchCardProps, "onAction" | "className">;

const UPCOMING_MATCHES: MatchData[] = [
  {
    sport: "Cricket",
    round: "Quarter Final",
    title: "Mumbai Warriors vs Delhi Thunders",
    date: "Mar 25, 2026",
    time: "10:00 AM",
    location: "Wankhede Stadium, Mumbai",
    status: "upcoming",
  },
  {
    sport: "Football",
    round: "Group Stage",
    title: "Bangalore FC vs Chennai United",
    date: "Mar 28, 2026",
    time: "4:00 PM",
    location: "Kanteerava Stadium, Bengaluru",
    status: "upcoming",
  },
  {
    sport: "Badminton",
    round: "Semi Final",
    title: "Priya Sharma vs Ananya Reddy",
    date: "Apr 2, 2026",
    time: "2:30 PM",
    location: "Siri Fort Sports Complex, Delhi",
    status: "upcoming",
  },
];

const COMPLETED_MATCHES: MatchData[] = [
  {
    sport: "Tennis",
    round: "Final",
    title: "Rajesh Kumar vs Arjun Mehta",
    date: "Mar 12, 2026",
    time: "11:00 AM",
    location: "DLTA Complex, New Delhi",
    status: "completed",
  },
  {
    sport: "Athletics",
    round: "100m Final",
    title: "City Sprint Championship",
    date: "Mar 10, 2026",
    time: "7:30 AM",
    location: "Jawaharlal Nehru Stadium, Chennai",
    status: "completed",
  },
  {
    sport: "Cricket",
    round: "Semi Final",
    title: "Hyderabad Hawks vs Pune Strikers",
    date: "Mar 8, 2026",
    time: "9:00 AM",
    location: "Rajiv Gandhi Stadium, Hyderabad",
    status: "completed",
  },
];

const MATCH_TABS = [
  { value: "upcoming", label: "Upcoming Matches" },
  { value: "completed", label: "Completed Matches" },
];

const DATA_MAP: Record<string, MatchData[]> = {
  upcoming: UPCOMING_MATCHES,
  completed: COMPLETED_MATCHES,
};

interface MatchScheduleProps {
  title?: string;
  subtitle?: string;
  onAction?: (match: MatchData) => void;
}

export function MatchSchedule({
  title = "Match Schedule & Results",
  subtitle = "Stay updated with live schedules and past match outcomes",
  onAction,
}: MatchScheduleProps) {
  return (
    <SectionWrapper id="matches" title={title} subtitle={subtitle}>
      <CustomTabs tabs={MATCH_TABS} variant="default" centered>
        {(activeTab) => (
          <div className="space-y-4 mt-6">
            {DATA_MAP[activeTab].map((match) => (
              <MatchCard
                key={match.title}
                {...match}
                onAction={() => onAction?.(match)}
              />
            ))}
          </div>
        )}
      </CustomTabs>
    </SectionWrapper>
  );
}
