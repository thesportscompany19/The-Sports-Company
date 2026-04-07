"use client";

import { useEffect, useState } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { EventCard, type EventCardProps } from "@/components/cards/EventCard";

export type EventData = Omit<EventCardProps, "onRegister" | "onViewDetails" | "className">;

const fallbackEvents: EventData[] = [
  {
    image: "/images/event-1.png",
    tag: "Cricket",
    title: "Inter-City Cricket Championship 2026",
    date: "April 15, 2026",
    location: "Nehru Stadium, Mumbai",
    entryFee: "₹199 per player",
    prize: "₹50,000 Winner Prize",
  },
  {
    image: "/images/event-2.png",
    tag: "Football",
    title: "Open Ground Football League",
    date: "May 5, 2026",
    location: "Sports Complex, Delhi",
    entryFee: "₹149 per player",
    prize: "₹30,000 Winner Prize",
  },
  {
    image: "/images/event-3.png",
    tag: "Badminton",
    title: "National Badminton Singles Open",
    date: "April 28, 2026",
    location: "Indoor Arena, Bangalore",
    entryFee: "₹99 per player",
    prize: "₹25,000 Winner Prize",
  },
  {
    image: "/images/event-4.png",
    tag: "Athletics",
    title: "City Marathon & Sprint Event",
    date: "June 10, 2026",
    location: "Marine Drive, Mumbai",
    entryFee: "₹249 per player",
    prize: "₹1,00,000 Winner Prize",
  },
];

interface EventsSectionProps {
  title?: string;
  subtitle?: string;
  events?: EventData[];
  onRegister?: (event: EventData) => void;
  onViewDetails?: (event: EventData) => void;
}

export function EventsSection({
  title = "Upcoming Events & Matches",
  subtitle = "Register now and compete with the best athletes",
  events: eventsProp,
  onRegister,
  onViewDetails,
}: EventsSectionProps) {
  const [events, setEvents] = useState<EventData[]>(eventsProp ?? fallbackEvents);
  const [loading, setLoading] = useState(!eventsProp);

  useEffect(() => {
    if (eventsProp) return;

    (async () => {
      try {
        const res = await fetch("/api/events?status=upcoming");
        const data = await res.json();
        if (data.success && data.events.length > 0) {
          setEvents(
            data.events.map((e: EventData & { id?: string }) => ({
              image: e.image,
              tag: e.tag,
              title: e.title,
              date: e.date,
              location: e.location,
              entryFee: e.entryFee,
              prize: e.prize,
            }))
          );
        }
      } catch {
        // Keep fallback events on error
      } finally {
        setLoading(false);
      }
    })();
  }, [eventsProp]);

  return (
    <SectionWrapper id="events" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="size-8 border-2 border-[#C62828]/30 border-t-[#C62828] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.title}
              {...event}
              onRegister={() => onRegister?.(event)}
              onViewDetails={() => onViewDetails?.(event)}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
