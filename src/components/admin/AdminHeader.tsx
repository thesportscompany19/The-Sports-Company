"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/dashboard/events": "Events Management",
  "/admin/dashboard/matches": "Match Schedule",
  "/admin/dashboard/coaches": "Coaches Management",
  "/admin/dashboard/players": "Player Registrations",
  "/admin/dashboard/results": "Recent Results",
  "/admin/dashboard/wellness": "Wellness & Fitness",
  "/admin/dashboard/media": "Media Gallery",
  "/admin/dashboard/sponsors": "Sponsors",
};

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const { session } = useAdminAuth();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-[#0B1C2D]">{title}</h1>
          <p className="text-[11px] text-gray-400">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-400 hover:bg-gray-100 transition-colors">
          <Search className="size-3.5" />
          <span>Search…</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#C62828]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100 ml-1">
          <div className="size-8 rounded-full bg-[#0B1C2D] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {session?.name?.[0] ?? "A"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#0B1C2D] leading-none">
              {session?.name ?? "Admin"}
            </p>
            <p className="text-[10px] text-gray-400">{session?.role ?? "Administrator"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
