"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  UserCheck,
  Users,
  Activity,
  Brain,
  ImageIcon,
  Award,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/admin/dashboard/matches", label: "Matches", icon: Trophy },
  { href: "/admin/dashboard/coaches", label: "Coaches", icon: UserCheck },
  { href: "/admin/dashboard/players", label: "Players", icon: Users },
  { href: "/admin/dashboard/results", label: "Results", icon: Activity },
  { href: "/admin/dashboard/wellness", label: "Wellness", icon: Brain },
  { href: "/admin/dashboard/media", label: "Media", icon: ImageIcon },
  { href: "/admin/dashboard/sponsors", label: "Sponsors", icon: Award },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { session, logout } = useAdminAuth();

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative size-11 shrink-0">
            <Image
              src="/images/logo.png"
              alt="The Sports Company"
              fill
              sizes="44px"
              className="object-contain drop-shadow-md"
              priority
              unoptimized
            />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm leading-none">The Sports Company</p>
            <p className="text-white/40 text-[10px] mt-0.5 uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">
          Main Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C62828] rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  active ? "text-[#C62828]" : "text-white/40 group-hover:text-white/60"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="size-3 text-white/30" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <div className="px-3 py-2.5 rounded-lg bg-white/5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-[#C62828]/20 border border-[#C62828]/30 flex items-center justify-center shrink-0">
              <span className="text-[#C62828] text-xs font-bold">
                {session?.name?.[0] ?? "A"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{session?.name ?? "Admin"}</p>
              <p className="text-white/40 text-[10px] truncate">{session?.email ?? ""}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
