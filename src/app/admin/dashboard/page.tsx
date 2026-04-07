"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDays, Trophy, UserCheck, Users, Activity,
  Brain, ImageIcon, Award, TrendingUp, ArrowRight,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  getAdminStats, matchesStore, type AdminMatch,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

type Stats = ReturnType<typeof getAdminStats> & {
  totalEventsDb: number;
  upcomingEventsDb: number;
};

const EVENT_STATUS_CLASSES = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const MATCH_STATUS_CLASSES = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#0B1C2D]">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={cn("size-11 rounded-xl flex items-center justify-center", color)}>
          <Icon className="size-5 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-[#C62828] opacity-0 group-hover:opacity-100 transition-opacity">
        View all <ArrowRight className="size-3" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { loading } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEvents, setRecentEvents] = useState<DashboardEvent[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<AdminMatch[]>([]);

  const fetchData = useCallback(async () => {
    // Fetch events from API
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        const events: DashboardEvent[] = data.events;
        setRecentEvents(events.slice(0, 5));

        const localStats = getAdminStats();
        setStats({
          ...localStats,
          totalEventsDb: events.length,
          upcomingEventsDb: events.filter((e: DashboardEvent) => e.status === "upcoming").length,
        });
      }
    } catch {
      const localStats = getAdminStats();
      setStats({ ...localStats, totalEventsDb: 0, upcomingEventsDb: 0 });
    }

    setUpcomingMatches(matchesStore.getAll().filter((m) => m.status === "upcoming").slice(0, 4));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="size-8 border-2 border-[#C62828]/30 border-t-[#C62828] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-linear-to-r from-[#0B1C2D] to-[#1a3654] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome to Sports Company Admin</h2>
            <p className="text-white/60 text-sm">
              Here&apos;s what&apos;s happening with your sports platform today.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <TrendingUp className="size-10 text-white/20" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-white/50 text-xs">Upcoming Events</p>
            <p className="text-white text-xl font-bold">{stats.upcomingEventsDb}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-white/50 text-xs">Upcoming Matches</p>
            <p className="text-white text-xl font-bold">{stats.upcomingMatches}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-white/50 text-xs">Active Players</p>
            <p className="text-white text-xl font-bold">{stats.activePlayers}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total Events" value={stats.totalEventsDb} sub={`${stats.upcomingEventsDb} upcoming`} color="bg-blue-500" href="/admin/dashboard/events" />
        <StatCard icon={Trophy} label="Total Matches" value={stats.totalMatches} sub={`${stats.upcomingMatches} upcoming`} color="bg-amber-500" href="/admin/dashboard/matches" />
        <StatCard icon={UserCheck} label="Coaches" value={stats.totalCoaches} sub={`${stats.activeCoaches} active`} color="bg-emerald-500" href="/admin/dashboard/coaches" />
        <StatCard icon={Users} label="Players" value={stats.totalPlayers} sub={`${stats.activePlayers} active`} color="bg-purple-500" href="/admin/dashboard/players" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Results" value={stats.totalResults} sub="recorded outcomes" color="bg-[#C62828]" href="/admin/dashboard/results" />
        <StatCard icon={Brain} label="Wellness" value={stats.totalWellness} sub="providers listed" color="bg-teal-500" href="/admin/dashboard/wellness" />
        <StatCard icon={ImageIcon} label="Media" value={stats.totalMedia} sub="videos & photos" color="bg-indigo-500" href="/admin/dashboard/media" />
        <StatCard icon={Award} label="Sponsors" value={stats.totalSponsors} sub="active partners" color="bg-orange-500" href="/admin/dashboard/sponsors" />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-[#0B1C2D] text-sm">Recent Events</h3>
            <Link
              href="/admin/dashboard/events"
              className="text-xs text-[#C62828] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEvents.map((event) => (
              <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[#0B1C2D]/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="size-4 text-[#0B1C2D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0B1C2D] truncate">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.date} · {event.location}</p>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize shrink-0",
                    EVENT_STATUS_CLASSES[event.status]
                  )}
                >
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-[#0B1C2D] text-sm">Upcoming Matches</h3>
            <Link
              href="/admin/dashboard/matches"
              className="text-xs text-[#C62828] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingMatches.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-400">No upcoming matches.</p>
            )}
            {upcomingMatches.map((match) => (
              <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Trophy className="size-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0B1C2D] truncate">{match.title}</p>
                  <p className="text-xs text-gray-400">
                    {match.date} at {match.time} · {match.round}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize shrink-0",
                    MATCH_STATUS_CLASSES[match.status]
                  )}
                >
                  {match.sport}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-[#0B1C2D] text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/dashboard/events", label: "Add Event", icon: CalendarDays },
            { href: "/admin/dashboard/matches", label: "Add Match", icon: Trophy },
            { href: "/admin/dashboard/coaches", label: "Add Coach", icon: UserCheck },
            { href: "/admin/dashboard/players", label: "View Players", icon: Users },
            { href: "/admin/dashboard/media", label: "Upload Media", icon: ImageIcon },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-[#0B1C2D] font-medium hover:bg-[#0B1C2D] hover:text-white hover:border-[#0B1C2D] transition-all"
            >
              <a.icon className="size-4" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
