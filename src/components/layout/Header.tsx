"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Navbar, type NavItem } from "@/components/layout/Navbar";
import { ArrowRight } from "lucide-react";

interface HeaderProps {
  logoText?: string;
  logoSubtext?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Sports", href: "#sports" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Register", href: "#register" },
  { label: "Coaches", href: "#coaches" },
  { label: "Matches", href: "#matches" },
  { label: "Rules", href: "#rules" },
  { label: "Wellness", href: "#wellness" },
  { label: "Media", href: "#media" },
];

export function Header({
  logoText = "The Sports Company",
  logoSubtext = "Your Complete Sports Ecosystem",
  navItems = defaultNavItems,
  ctaLabel,
  ctaHref = "#register",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#042457] border-b border-white/10 backdrop-blur-sm">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative size-16 shrink-0">
            <Image
              src="/images/logo.png"
              alt="The Sports Company"
              fill
              sizes="120px"
              className="object-contain drop-shadow-md"
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold text-white tracking-tight">
              {logoText}
            </span>
            <span className="text-[11px] text-(--primary-color) font-medium tracking-wide">
              {logoSubtext}
            </span>
          </div>
        </Link>

        {/* Nav + CTA */}
        <div className="flex items-center gap-4">
          <Navbar navItems={navItems} />
          {ctaLabel && (
            <Link href={ctaHref} className="hidden lg:block">
              <PrimaryButton className="text-sm font-medium px-4">
                {ctaLabel}
                <ArrowRight className="ml-1 size-4" />
              </PrimaryButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
