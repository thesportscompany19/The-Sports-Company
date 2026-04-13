"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";

export function GoToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className={[
        "fixed bottom-8 right-6 z-50 flex items-center justify-center",
        "w-11 h-11 rounded-full shadow-lg",
        "bg-(--primary-color) text-black/80",
        "border-2 border-white/20",
        "hover:scale-110 hover:shadow-[0_0_16px_rgba(198,40,40,0.5)]",
        "active:scale-95",
        "transition-all duration-300 ease-in-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      <ChevronUp className="size-5 stroke-[2.5]" />
    </button>
  );
}
