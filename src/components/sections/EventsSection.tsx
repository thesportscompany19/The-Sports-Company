"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, IndianRupee, MapPin, Trophy } from "lucide-react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { EventCard, type EventCardProps } from "@/components/cards/EventCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface EventData extends Omit<EventCardProps, "onRegister" | "onViewDetails" | "className"> {
  id?: string;
  status?: string;
}

const fallbackEvents: EventData[] = [
  {
    image: "/images/event-1.png",
    description: "",
    tag: "Cricket",
    title: "Inter-City Cricket Championship 2026",
    date: "April 15, 2026",
    location: "Nehru Stadium, Mumbai",
    entryFee: "₹199 per player",
    prize: "₹50,000 Winner Prize",
  },
  {
    image: "/images/event-2.png",
    description: "",
    tag: "Football",
    title: "Open Ground Football League",
    date: "May 5, 2026",
    location: "Sports Complex, Delhi",
    entryFee: "₹149 per player",
    prize: "₹30,000 Winner Prize",
  },
  {
    image: "/images/event-3.png",
    description: "",
    tag: "Badminton",
    title: "National Badminton Singles Open",
    date: "April 28, 2026",
    location: "Indoor Arena, Bangalore",
    entryFee: "₹99 per player",
    prize: "₹25,000 Winner Prize",
  },
  {
    image: "/images/event-4.png",
    description: "",
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
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    if (eventsProp) return;

    (async () => {
      try {
        const res = await fetch("/api/events?status=upcoming");
        const data = await res.json();
        if (data.success && data.events.length > 0) {
          setEvents(
            data.events.map((e: EventData) => ({
              id: e.id,
              image: e.image,
              description: e.description || "",
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

  function goToRegistration(event: EventData) {
    onRegister?.(event);
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
              key={event.id || event.title}
              {...event}
              onRegister={() => goToRegistration(event)}
              onViewDetails={() => {
                onViewDetails?.(event);
                setSelectedEvent(event);
              }}
            />
          ))}
        </div>
      )}
      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] overflow-y-auto p-0 sm:max-w-2xl">
            <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-gray-100">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                fill
                unoptimized={selectedEvent.image.startsWith("data:")}
                className="object-cover"
              />
            </div>
            <div className="space-y-4 px-4 pb-3 sm:space-y-5 sm:px-6">
              <DialogHeader className="pr-7 text-left">
                <span className="w-fit rounded-full bg-[#C62828]/10 px-3 py-1 text-xs font-semibold text-[#C62828]">
                  {selectedEvent.tag}
                </span>
                <DialogTitle className="break-words text-xl font-bold text-[#0B1C2D] sm:text-2xl">
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  {selectedEvent.description || "Event information and participation details."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-2 sm:p-4">
                <div className="flex min-w-0 items-start gap-3 text-sm text-gray-700">
                  <Calendar className="size-4 shrink-0 text-[#C62828]" />
                  <span className="break-words">{selectedEvent.date}</span>
                </div>
                <div className="flex min-w-0 items-start gap-3 text-sm text-gray-700">
                  <MapPin className="size-4 shrink-0 text-[#C62828]" />
                  <span className="break-words">{selectedEvent.location}</span>
                </div>
                <div className="flex min-w-0 items-start gap-3 text-sm text-gray-700">
                  <IndianRupee className="size-4 shrink-0 text-[#C62828]" />
                  <span className="break-words">{selectedEvent.entryFee}</span>
                </div>
                <div className="flex min-w-0 items-start gap-3 text-sm text-gray-700">
                  <Trophy className="size-4 shrink-0 text-[#C62828]" />
                  <span className="break-words">{selectedEvent.prize}</span>
                </div>
              </div>
            </div>
            <DialogFooter className="mx-0 mb-0 shrink-0 px-4 pb-4 sm:px-6 sm:pb-5">
              <Button
                className="w-full bg-[#C62828] text-white hover:bg-[#a82020] sm:w-auto"
                onClick={() => {
                  setSelectedEvent(null);
                  goToRegistration(selectedEvent);
                }}
              >
                Register for this event
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </SectionWrapper>
  );
}
