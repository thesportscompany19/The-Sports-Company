import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const QUICK_LINKS = [
  "Sports Categories",
  "Events & Tournaments",
  "Coaches & Academies",
  "Rules & Regulations",
  "Wellness & Fitness",
];

const PLAYER_LINKS = [
  "Register",
  "Dashboard",
  "Match Schedule",
  "Profile",
  "Payment History",
];

const SOCIAL = [
  { icon: <Facebook className="size-4" />, label: "Facebook", href: "https://www.facebook.com/profile.php?id=61581648660299" },
  { icon: <Twitter className="size-4" />, label: "Twitter", href: "#" },
  { icon: <Instagram className="size-4" />, label: "Instagram", href: "https://www.instagram.com/thesportscompany19/?hl=en" },
  { icon: <Linkedin className="size-4" />, label: "LinkedIn", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#0B1C2D] text-white">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative size-16 shrink-0">
              <Image
                src="/images/logo.png"
                alt="The Sports Company"
                fill
                sizes="64px"
                className="object-contain drop-shadow-lg"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                The <span className="text-(--primary-color)">Sports Company</span>
              </h3>
              <p className="text-white/60 text-[11px] uppercase tracking-wider mt-0.5">
                Your Complete Sports Ecosystem
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            India's premier grassroots sports platform — connecting players, coaches, and tournaments across the country.
          </p>
          <div className="flex gap-3 mt-1">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="size-8 rounded-md bg-white/10 flex items-center justify-center text-gray-300 hover:bg-[#C62828] hover:text-white transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-4 tracking-wide">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-gray-300 text-sm hover:text-(--primary-color) transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — For Players */}
        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-4 tracking-wide">
            For Players
          </h4>
          <ul className="space-y-2">
            {PLAYER_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-gray-300 text-sm hover:text-(--primary-color) transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-4 tracking-wide">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <MapPin className="size-4 text-(--primary-color) shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                The Sports Company Pvt. Ltd., 4th Floor, SB Road,
                <br />
                Pune, Maharashtra – 411016
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Phone className="size-4 text-(--primary-color) shrink-0" />
              <a href="tel:+917901845116" className="hover:text-(--primary-color) transition-colors">
                +91 79018 45116
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-300">
              <Mail className="size-4 text-(--primary-color) shrink-0" />
              <a href="mailto:support@thesportscompany.co.in" className="hover:text-(--primary-color) transition-colors">
                 support@thesportscompany.co.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          <p>© 2026 The Sports Company. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {["Privacy Policy", "Terms of Service", "Admin Login"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-(--primary-color) transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

