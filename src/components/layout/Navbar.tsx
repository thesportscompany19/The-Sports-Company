"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  navItems: NavItem[];
}

const HEADER_HEIGHT = 64; // matches h-16 sticky header

function scrollToSection(href: string) {
  if (href === "#" || href === "#home" || href === "") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (href.startsWith("#")) {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}

export function Navbar({ navItems }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const [activeHref, setActiveHref] = React.useState("#");

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setActiveHref(href);
      scrollToSection(href);
    }
  };

  const handleMobileClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setOpen(false);
    handleClick(e, href);
  };

  return (
    <nav aria-label="Main navigation">
      {/* Desktop nav */}
      <ul className="hidden nav:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={[
                  "relative px-3 py-2 text-base font-medium rounded-md transition-colors",
                  isActive
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-(--primary-color)" />
                )}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Mobile nav */}
      <div className="nav:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 bg-(--secondary-color) border-white/10"
          >
            <SheetTitle className="text-white text-lg font-bold px-2">
              Menu
            </SheetTitle>
            <nav aria-label="Mobile navigation" className="mt-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = activeHref === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleMobileClick(e, item.href)}
                        className={[
                          "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "text-white bg-white/15 border-l-2 border-(--primary-color)"
                            : "text-gray-200 hover:text-white hover:bg-white/10",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
