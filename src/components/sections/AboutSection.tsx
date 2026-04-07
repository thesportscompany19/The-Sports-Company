"use client";

import {
  Trophy,
  Users,
  GraduationCap,
  ShoppingBag,
  Target,
  MapPin,
  Star,
  Flame,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const PILLARS = [
  {
    icon: <Users className="size-6 text-[#C62828]" />,
    title: "Players",
    desc: "Providing exposure and competitive opportunities to athletes at every level.",
  },
  {
    icon: <GraduationCap className="size-6 text-[#C62828]" />,
    title: "Coaches & Academies",
    desc: "Connecting certified coaches and academies with the next generation of talent.",
  },
  {
    icon: <ShoppingBag className="size-6 text-[#C62828]" />,
    title: "Local Merchants",
    desc: "Integrating local sports merchants into a thriving sports ecosystem.",
  },
  {
    icon: <Star className="size-6 text-[#C62828]" />,
    title: "Scholarships",
    desc: "Encouraging and supporting deserving athletes through structured scholarship programmes.",
  },
];

const STATS = [
  { icon: <Trophy className="size-5 text-[#C62828]" />, value: "10+", label: "Sports" },
  { icon: <Flame className="size-5 text-[#C62828]" />, value: "Multi-City", label: "Tournaments" },
  { icon: <Globe className="size-5 text-[#C62828]" />, value: "Pan-India", label: "Expansion" },
  { icon: <Target className="size-5 text-[#C62828]" />, value: "1 Vision", label: "Future Champions" },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-[#F4F6F8] py-20 px-4 md:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">

        {/* ── Section label ───────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="h-px w-10 bg-[#C62828]" />
          <span className="text-[#C62828] text-xs font-bold uppercase tracking-widest">
            Who We Are
          </span>
          <span className="h-px w-10 bg-[#C62828]" />
        </div>

        {/* ── Heading ─────────────────────────────────────── */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1C2D] leading-tight">
            About{" "}
            <span className="relative inline-block">
              The Sports Company
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#C62828] rounded-full" />
            </span>
          </h2>
          <p className="mt-5 text-gray-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Building a complete sports ecosystem where players, coaches, academies, and local
            communities grow together — from Tricity to all of India.
          </p>
        </div>

        {/* ── Main content grid ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* Left — Visual card */}
          <div className="relative">
            {/* Background decorative block */}
            <div className="absolute -top-4 -left-4 w-32 h-32 rounded-2xl bg-[#C62828]/8 -z-10" />
            <div className="absolute -bottom-4 -right-4 w-48 h-48 rounded-2xl bg-[#0B1C2D]/5 -z-10" />

            <div className="rounded-2xl bg-[#0B1C2D] overflow-hidden shadow-2xl">
              {/* Top visual banner */}
              <div className="relative bg-linear-to-br from-[#0B1C2D] to-[#132d47] px-8 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C62828] shadow-lg">
                    <Trophy className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">TSC</p>
                    <p className="text-gray-400 text-xs">The Sports Company</p>
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold leading-snug mb-2">
                  We don&apos;t just organize games —{" "}
                  <span className="text-[#C62828]">we build future athletes.</span>
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Multi-sport tournaments designed to push limits and create real pathways
                  for the future champions of India.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 bg-[#0F2840] px-5 py-4"
                  >
                    <div className="shrink-0 bg-[#C62828]/15 rounded-lg p-2">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-white font-bold text-base leading-none">{stat.value}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mission strip */}
              <div className="flex items-center gap-3 px-6 py-4 bg-[#C62828]">
                <MapPin className="size-5 text-white shrink-0" />
                <p className="text-white text-sm font-medium">
                  Starting from <strong>Tricity</strong>, expanding across all of India
                </p>
              </div>
            </div>
          </div>

          {/* Right — Text content */}
          <div className="space-y-6">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              <strong className="text-[#0B1C2D]">The Sports Company (TSC)</strong> is dedicated to
              building a complete and powerful sports ecosystem where players, coaches, academies,
              and local sports communities grow together. We are not just tournament organizers
              — we are creating a platform that connects talent with opportunity.
            </p>

            <p className="text-gray-600 text-base leading-relaxed">
              At TSC, we organize multi-sport tournaments designed to deliver a highly competitive
              environment, helping players push their limits and prepare for national and
              international levels. Our focus goes beyond just matches — we aim to{" "}
              <span className="text-[#0B1C2D] font-semibold">nurture talent</span>,
              promote local players on bigger platforms, and create real pathways for{" "}
              <span className="text-[#C62828] font-semibold">future champions of India</span>.
            </p>

            {/* Key points */}
            <ul className="space-y-3 pt-1">
              {[
                "Competitive tournaments at local, regional & national levels",
                "Structured pathways from grassroots to global stages",
                "A unified platform for athletes, coaches & academies",
                "Scholarship programmes for deserving athletes",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-[#C62828] shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm md:text-base">{point}</span>
                </li>
              ))}
            </ul>

            {/* Vision quote block */}
            <div className="relative bg-[#0B1C2D] rounded-xl px-6 py-5 mt-2">
              <span className="absolute top-3 left-4 text-[#C62828] text-4xl font-serif leading-none select-none">&ldquo;</span>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed pl-5 italic">
                Our vision is to create an environment where every player dares to dream bigger
                — not just to compete locally, but to{" "}
                <strong className="text-white not-italic">represent India on the global stage</strong>.
              </p>
            </div>

            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("register");
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 64;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
            >
              Join the Movement
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        {/* ── What we support pillars ─────────────────────── */}
        <div className="border-t border-gray-100 pt-14">
          <div className="text-center mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-[#0B1C2D]">
              What We Actively Support
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Four pillars driving our mission forward
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="group relative flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-[#C62828]/30 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                {/* Number */}
                <span className="absolute top-4 right-5 text-5xl font-black text-[#0B1C2D]/5 select-none leading-none">
                  0{i + 1}
                </span>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C62828]/10 border border-[#C62828]/15 group-hover:bg-[#C62828]/15 transition-colors">
                  {pillar.icon}
                </div>
                <h4 className="text-[#0B1C2D] font-bold text-base">{pillar.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
