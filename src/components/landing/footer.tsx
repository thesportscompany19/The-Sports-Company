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
  { icon: <Facebook className="size-4" />, label: "Facebook",  href: "#" },
  { icon: <Twitter  className="size-4" />, label: "Twitter",   href: "#" },
  { icon: <Instagram className="size-4" />, label: "Instagram", href: "#" },
  { icon: <Linkedin className="size-4" />, label: "LinkedIn",  href: "#" },
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
                src="/images/logo.svg"
                alt="The Sports Company"
                fill
                sizes="64px"
                className="object-contain drop-shadow-lg"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white leading-tight">
                The <span className="text-[#C62828]">Sports Company</span>
              </h3>
              <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">Your Complete Sports Ecosystem</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
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
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-[#C62828] transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — For Players */}
        <div>
          <h4 className="font-semibold text-white mb-4">For Players</h4>
          <ul className="space-y-2">
            {PLAYER_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-[#C62828] transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="size-4 text-[#C62828] shrink-0 mt-0.5" />
              <span>
                The Sports Company Pvt. Ltd., 4th Floor, SB Road,
                <br />
                Pune, Maharashtra – 411016
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <Phone className="size-4 text-[#C62828] shrink-0" />
              <a href="tel:+917901845116" className="hover:text-[#C62828] transition-colors">
                +91 79018 45116
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="size-4 text-[#C62828] shrink-0" />
              <a href="mailto:support@thesportscompany.co.in" className="hover:text-[#C62828] transition-colors">
                 support@thesportscompany.co.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 The Sports Company. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Admin Login"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-[#C62828] transition-colors"
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

