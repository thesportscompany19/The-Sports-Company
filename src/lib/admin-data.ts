// ─── Types ────────────────────────────────────────────────────────────────────

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type MatchStatus = "upcoming" | "completed";
export type PlayerStatus = "active" | "pending" | "inactive";
export type SponsorTier = "title" | "gold" | "silver" | "bronze";
export type WellnessType = "psychologists" | "counselors" | "gyms";
export type MediaType = "videos" | "photos";

export interface AdminEvent {
  id: string;
  image: string;
  tag: string;
  title: string;
  date: string;
  location: string;
  entryFee: string;
  prize: string;
  status: EventStatus;
  createdAt: string;
}

export interface AdminMatch {
  id: string;
  sport: string;
  round: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: MatchStatus;
  score: string;
}

export interface AdminCoach {
  id: string;
  image: string;
  name: string;
  sport: string;
  academy: string;
  location: string;
  specialization: string;
  experience: string;
  fee: string;
  status: "active" | "inactive";
}

export interface AdminPlayer {
  id: string;
  name: string;
  email: string;
  phone: string;
  sport: string;
  gender: string;
  age: string;
  registeredAt: string;
  status: PlayerStatus;
}

export interface AdminResult {
  id: string;
  sport: string;
  event: string;
  winner: string;
  runner: string;
  date: string;
  score: string;
  venue: string;
}

export interface AdminSponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  website: string;
  logo: string;
  status: "active" | "inactive";
}

export interface AdminWellness {
  id: string;
  image: string;
  name: string;
  type: WellnessType;
  specialization: string;
  location: string;
  experience: string;
  fee: string;
  status: "active" | "inactive";
}

export interface AdminMedia {
  id: string;
  thumbnail: string;
  title: string;
  tag: string;
  type: MediaType;
  duration: string;
  date: string;
  status: "published" | "draft";
}

// ─── Generic localStorage store factory ───────────────────────────────────────

function createStore<T extends { id: string }>(key: string, seed: T[]) {
  const STORAGE_KEY = `tida_admin_${key}`;

  function load(): T[] {
    if (typeof window === "undefined") return seed;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(stored) as T[];
    } catch {
      return seed;
    }
  }

  function save(data: T[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function genId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  return {
    getAll: load,
    getById: (id: string) => load().find((x) => x.id === id) ?? null,
    add: (item: Omit<T, "id">): T => {
      const newItem = { ...item, id: genId() } as T;
      const data = load();
      data.unshift(newItem);
      save(data);
      return newItem;
    },
    update: (id: string, updates: Partial<Omit<T, "id">>): T | null => {
      const data = load();
      const idx = data.findIndex((x) => x.id === id);
      if (idx === -1) return null;
      data[idx] = { ...data[idx], ...updates };
      save(data);
      return data[idx];
    },
    remove: (id: string): boolean => {
      const data = load();
      const next = data.filter((x) => x.id !== id);
      save(next);
      return next.length < data.length;
    },
    reset: () => save(seed),
  };
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_EVENTS: AdminEvent[] = [
  { id: "evt-1", image: "/images/event-1.png", tag: "Cricket", title: "Inter-City Cricket Championship 2026", date: "April 15, 2026", location: "Nehru Stadium, Mumbai", entryFee: "₹199 per player", prize: "₹50,000 Winner Prize", status: "upcoming", createdAt: "2026-01-10" },
  { id: "evt-2", image: "/images/event-2.png", tag: "Football", title: "Open Ground Football League", date: "May 5, 2026", location: "Sports Complex, Delhi", entryFee: "₹149 per player", prize: "₹30,000 Winner Prize", status: "upcoming", createdAt: "2026-01-12" },
  { id: "evt-3", image: "/images/event-3.png", tag: "Badminton", title: "National Badminton Singles Open", date: "April 28, 2026", location: "Indoor Arena, Bangalore", entryFee: "₹99 per player", prize: "₹25,000 Winner Prize", status: "upcoming", createdAt: "2026-01-15" },
  { id: "evt-4", image: "/images/event-4.png", tag: "Athletics", title: "City Marathon & Sprint Event", date: "June 10, 2026", location: "Marine Drive, Mumbai", entryFee: "₹249 per player", prize: "₹1,00,000 Winner Prize", status: "upcoming", createdAt: "2026-01-20" },
  { id: "evt-5", image: "/images/event-1.png", tag: "Tennis", title: "Summer Tennis Open 2026", date: "March 10, 2026", location: "DLTA Complex, New Delhi", entryFee: "₹299 per player", prize: "₹40,000 Winner Prize", status: "completed", createdAt: "2025-12-10" },
  { id: "evt-6", image: "/images/event-2.png", tag: "Hockey", title: "Junior Hockey League Cup", date: "July 20, 2026", location: "Dhyan Chand Stadium, Delhi", entryFee: "₹179 per player", prize: "₹35,000 Winner Prize", status: "upcoming", createdAt: "2026-02-01" },
];

const SEED_MATCHES: AdminMatch[] = [
  { id: "mch-1", sport: "Cricket", round: "Quarter Final", title: "Mumbai Warriors vs Delhi Thunders", date: "Mar 25, 2026", time: "10:00 AM", location: "Wankhede Stadium, Mumbai", status: "upcoming", score: "" },
  { id: "mch-2", sport: "Football", round: "Group Stage", title: "Bangalore FC vs Chennai United", date: "Mar 28, 2026", time: "4:00 PM", location: "Kanteerava Stadium, Bengaluru", status: "upcoming", score: "" },
  { id: "mch-3", sport: "Badminton", round: "Semi Final", title: "Priya Sharma vs Ananya Reddy", date: "Apr 2, 2026", time: "2:30 PM", location: "Siri Fort Sports Complex, Delhi", status: "upcoming", score: "" },
  { id: "mch-4", sport: "Tennis", round: "Final", title: "Rajesh Kumar vs Arjun Mehta", date: "Mar 12, 2026", time: "11:00 AM", location: "DLTA Complex, New Delhi", status: "completed", score: "6-4, 7-5" },
  { id: "mch-5", sport: "Athletics", round: "Finals", title: "100M Sprint Championship", date: "Mar 8, 2026", time: "9:00 AM", location: "Jawaharlal Nehru Stadium", status: "completed", score: "10.3s" },
  { id: "mch-6", sport: "Cricket", round: "Semi Final", title: "Chennai Super Kings vs Kolkata Knights", date: "Apr 10, 2026", time: "3:00 PM", location: "M. A. Chidambaram Stadium, Chennai", status: "upcoming", score: "" },
];

const SEED_COACHES: AdminCoach[] = [
  { id: "cch-1", image: "/images/event-1.png", name: "Ravi Shastri", sport: "Cricket", academy: "National Cricket Academy", location: "Mumbai, Maharashtra", specialization: "Batting", experience: "15 Years", fee: "₹2,500 / Session", status: "active" },
  { id: "cch-2", image: "/images/event-2.png", name: "Sunil Chhetri", sport: "Football", academy: "Elite Football Academy", location: "Bengaluru, Karnataka", specialization: "Attacking Play", experience: "12 Years", fee: "₹2,000 / Session", status: "active" },
  { id: "cch-3", image: "/images/event-3.png", name: "Saina Nehwal", sport: "Badminton", academy: "Gopichand Badminton Academy", location: "Hyderabad, Telangana", specialization: "Singles", experience: "18 Years", fee: "₹3,000 / Session", status: "active" },
  { id: "cch-4", image: "/images/event-4.png", name: "Milkha Singh", sport: "Athletics", academy: "SAI Athletics Centre", location: "Patiala, Punjab", specialization: "Sprinting", experience: "20 Years", fee: "₹1,800 / Session", status: "active" },
  { id: "cch-5", image: "/images/event-1.png", name: "Pullela Gopichand", sport: "Badminton", academy: "Gopichand Academy", location: "Hyderabad, Telangana", specialization: "Doubles", experience: "25 Years", fee: "₹4,000 / Session", status: "active" },
  { id: "cch-6", image: "/images/event-2.png", name: "Igor Štimac", sport: "Football", academy: "AIFF Academy", location: "New Delhi", specialization: "Defense", experience: "10 Years", fee: "₹2,200 / Session", status: "inactive" },
];

const SEED_PLAYERS: AdminPlayer[] = [
  { id: "plr-1", name: "Diya Gupta", email: "rosybansal@gmail.com", phone: "+91 62395 38243", sport: "Table Tennis", gender: "Female", age: "12", registeredAt: "2026-04-10", status: "active" },
  { id: "plr-2", name: "Ram Nath", email: "ramnath45@rediffmail.com", phone: "+91 78767 30764", sport: "Table Tennis", gender: "Male", age: "70", registeredAt: "2026-04-12", status: "active" },
  { id: "plr-3", name: "Vikkhamjyot Kaur", email: "mpreetmaan@yahoo.co.in", phone: "+91 98050 98202", sport: "Table Tennis", gender: "Female", age: "14", registeredAt: "2026-04-15", status: "active" },
  { id: "plr-4", name: "Manya", email: "paru.sally@gmail.com", phone: "+91 97804 70937", sport: "Table Tennis", gender: "Female", age: "14", registeredAt: "2026-04-18", status: "active" },
  { id: "plr-5", name: "Anirudh Sally", email: "paru.sally@gmail.com", phone: "+91 97804 70937", sport: "Table Tennis", gender: "Male", age: "9", registeredAt: "2026-04-20", status: "active" },
  { id: "plr-6", name: "Aarav Garg", email: "mukeshgarg1881@gmail.com", phone: "+91 94661 16346", sport: "Table Tennis", gender: "Male", age: "14", registeredAt: "2026-04-22", status: "active" },
  { id: "plr-7", name: "Sameeksha Negi", email: "ravinder1110@gmail.com", phone: "+91 89681 08860", sport: "Table Tennis", gender: "Female", age: "14", registeredAt: "2026-04-25", status: "active" },
  { id: "plr-8", name: "Sarbjit Singh", email: "sskyear4010@yahoo.com", phone: "+91 70095 47623", sport: "Table Tennis", gender: "Male", age: "65", registeredAt: "2026-05-01", status: "active" },
  { id: "plr-9", name: "Nihar Saini", email: "nayarasaini19@gmail.com", phone: "+91 83077 32765", sport: "Table Tennis", gender: "Male", age: "13", registeredAt: "2026-05-02", status: "active" },
  { id: "plr-10", name: "Athak", email: "rupk@aol.in", phone: "+91 85699 21821", sport: "Table Tennis", gender: "Male", age: "14", registeredAt: "2026-05-03", status: "active" },
  { id: "plr-11", name: "Manreet Kaur", email: "manvinder.kamboj@gmail.com", phone: "+91 98880 36004", sport: "Table Tennis", gender: "Female", age: "15", registeredAt: "2026-05-04", status: "active" },
  { id: "plr-12", name: "Satvik Sharma", email: "satviksharma7614@gmail.com", phone: "+91 94661 11701", sport: "Table Tennis", gender: "Male", age: "13", registeredAt: "2026-05-05", status: "active" },
  { id: "plr-13", name: "Kartik Oberoi", email: "kamal143ob@gmail.com", phone: "+91 74048 59540", sport: "Table Tennis", gender: "Male", age: "14", registeredAt: "2026-05-06", status: "active" },
  { id: "plr-14", name: "Prisha Gupta", email: "nitinenti123@gmail.com", phone: "+91 98763 27841", sport: "Table Tennis", gender: "Female", age: "13", registeredAt: "2026-05-07", status: "active" },
  { id: "plr-15", name: "Dr O P Nagpal", email: "omjyoti2324@gmail.com", phone: "+91 98141 10415", sport: "Table Tennis", gender: "Male", age: "61", registeredAt: "2026-05-08", status: "active" },
  { id: "plr-16", name: "Dipanshu Chandel", email: "vicky08081984@gmail.com", phone: "+91 78075 88267", sport: "Table Tennis", gender: "Male", age: "15", registeredAt: "2026-05-09", status: "active" },
  { id: "plr-17", name: "Naman Kumar", email: "namank1506@gmail.com", phone: "+91 82955 50577", sport: "Table Tennis", gender: "Male", age: "19", registeredAt: "2026-05-09", status: "active" },
  { id: "plr-18", name: "Ahaana Vats", email: "jyotisharma82@gmail.com", phone: "+91 82830 86210", sport: "Table Tennis", gender: "Female", age: "9", registeredAt: "2026-05-10", status: "active" },
  { id: "plr-19", name: "Prabhveer Singh", email: "prabhveer.virk@email.com", phone: "+91 77194 82829", sport: "Table Tennis", gender: "Male", age: "17", registeredAt: "2026-05-10", status: "active" },
  { id: "plr-20", name: "Ruhaan Saini", email: "ravish.digitalmarketing@gmail.com", phone: "+91 98888 99903", sport: "Table Tennis", gender: "Male", age: "9", registeredAt: "2026-05-10", status: "active" },
  { id: "plr-21", name: "Khwahish", email: "kchanchan486@yahoo.co.in", phone: "+91 99880 72486", sport: "Table Tennis", gender: "Female", age: "14", registeredAt: "2026-05-10", status: "active" },
  { id: "plr-22", name: "Namish", email: "nikshep889@gmail.com", phone: "+91 99143 84654", sport: "Table Tennis", gender: "Male", age: "13", registeredAt: "2026-05-10", status: "active" },
  { id: "plr-23", name: "Rani", email: "goswamirani148@gmail.com", phone: "+91 83074 00589", sport: "Table Tennis", gender: "Female", age: "24", registeredAt: "2026-05-11", status: "active" },
  { id: "plr-24", name: "Yatharth", email: "shikharao@gmail.com", phone: "+91 88725 95736", sport: "Table Tennis", gender: "Male", age: "8", registeredAt: "2026-05-11", status: "active" },
  { id: "plr-25", name: "Abhijit Singh", email: "amarjit27singh@gmail.com", phone: "+91 70095 38056", sport: "Table Tennis", gender: "Male", age: "15", registeredAt: "2026-05-11", status: "active" },
  { id: "plr-26", name: "Saksham Goyal", email: "sakshamgoyal2400@gmail.com", phone: "+91 90232 90264", sport: "Table Tennis", gender: "Male", age: "13", registeredAt: "2026-05-11", status: "active" },
  { id: "plr-27", name: "Mehak", email: "arunkumarngh@gmail.com", phone: "+91 94682 92444", sport: "Table Tennis", gender: "Female", age: "12", registeredAt: "2026-05-11", status: "active" },
  { id: "plr-28", name: "Hetaksh Goyal", email: "amitgoyal0007@yahoo.co.in", phone: "+91 98789 40007", sport: "Table Tennis", gender: "Male", age: "9", registeredAt: "2026-05-11", status: "active" },
  { id: "plr-29", name: "Lavish", email: "ajaybakshi569@gmail.com", phone: "+91 97291 20601", sport: "Table Tennis", gender: "Male", age: "13", registeredAt: "2026-05-11", status: "active" },
];

const SEED_RESULTS: AdminResult[] = [
  { id: "res-1", sport: "Tennis", event: "Summer Tennis Open 2026", winner: "Rajesh Kumar", runner: "Arjun Mehta", date: "Mar 12, 2026", score: "6-4, 7-5", venue: "DLTA Complex, New Delhi" },
  { id: "res-2", sport: "Athletics", event: "100M Sprint Championship", winner: "Sanjay Patel", runner: "Rahul Doshi", date: "Mar 8, 2026", score: "10.3s vs 10.5s", venue: "Jawaharlal Nehru Stadium" },
  { id: "res-3", sport: "Cricket", event: "City T20 Cup", winner: "Mumbai Warriors", runner: "Pune Chargers", date: "Feb 28, 2026", score: "174/5 vs 167/8", venue: "Brabourne Stadium, Mumbai" },
  { id: "res-4", sport: "Football", event: "City Football Derby", winner: "Bangalore FC", runner: "Hyderabad Heroes", date: "Feb 15, 2026", score: "3-1", venue: "Kanteerava Stadium, Bengaluru" },
  { id: "res-5", sport: "Badminton", event: "National Badminton Open", winner: "Saina Nehwal", runner: "P.V. Sindhu", date: "Feb 5, 2026", score: "21-18, 21-15", venue: "Siri Fort Sports Complex" },
];

const SEED_SPONSORS: AdminSponsor[] = [
  { id: "spr-1", name: "SportZone India", tier: "title", website: "https://sportzone.in", logo: "/images/event-1.png", status: "active" },
  { id: "spr-2", name: "Athletic Pro", tier: "gold", website: "https://athleticpro.com", logo: "/images/event-2.png", status: "active" },
  { id: "spr-3", name: "FitGear Plus", tier: "silver", website: "https://fitgear.in", logo: "/images/event-3.png", status: "active" },
  { id: "spr-4", name: "RunFast Shoes", tier: "bronze", website: "https://runfast.com", logo: "/images/event-4.png", status: "inactive" },
  { id: "spr-5", name: "Power Energy Drink", tier: "gold", website: "https://powerdrink.in", logo: "/images/event-1.png", status: "active" },
];

const SEED_WELLNESS: AdminWellness[] = [
  { id: "wln-1", image: "/images/event-1.png", name: "Dr. Anjali Mehta", type: "psychologists", specialization: "Sports Psychologist", location: "Mumbai, Maharashtra", experience: "12 years", fee: "₹1,200 / Session", status: "active" },
  { id: "wln-2", image: "/images/event-2.png", name: "Dr. Karthik Reddy", type: "psychologists", specialization: "Performance Psychologist", location: "Hyderabad, Telangana", experience: "9 years", fee: "₹1,500 / Session", status: "active" },
  { id: "wln-3", image: "/images/event-3.png", name: "Meena Joshi", type: "counselors", specialization: "Mental Health Counselor", location: "Pune, Maharashtra", experience: "7 years", fee: "₹800 / Session", status: "active" },
  { id: "wln-4", image: "/images/event-4.png", name: "PowerFit Gym", type: "gyms", specialization: "Strength & Conditioning", location: "Delhi, NCR", experience: "Est. 2010", fee: "₹2,500 / Month", status: "active" },
  { id: "wln-5", image: "/images/event-1.png", name: "Dr. Priya Iyer", type: "counselors", specialization: "Performance Counselor", location: "Chennai, Tamil Nadu", experience: "5 years", fee: "₹700 / Session", status: "inactive" },
];

const SEED_MEDIA: AdminMedia[] = [
  { id: "med-1", thumbnail: "/images/event-1.png", title: "Inter-City Cricket Championship 2026 — Match Highlights", tag: "Cricket", type: "videos", duration: "4:32", date: "Mar 20, 2026", status: "published" },
  { id: "med-2", thumbnail: "/images/event-2.png", title: "Football League — Best Goals of the Tournament", tag: "Football", type: "videos", duration: "6:14", date: "Mar 15, 2026", status: "published" },
  { id: "med-3", thumbnail: "/images/event-3.png", title: "Cricket Championship — Action Shots", tag: "Cricket", type: "photos", duration: "", date: "Mar 10, 2026", status: "published" },
  { id: "med-4", thumbnail: "/images/event-4.png", title: "City Marathon — Finish Line Moments", tag: "Athletics", type: "photos", duration: "", date: "Mar 5, 2026", status: "draft" },
  { id: "med-5", thumbnail: "/images/event-1.png", title: "Badminton Open — Semi Final Recap", tag: "Badminton", type: "videos", duration: "3:50", date: "Feb 28, 2026", status: "published" },
];

// ─── Exported stores ──────────────────────────────────────────────────────────

export const eventsStore = createStore<AdminEvent>("events", SEED_EVENTS);
export const matchesStore = createStore<AdminMatch>("matches", SEED_MATCHES);
export const coachesStore = createStore<AdminCoach>("coaches", SEED_COACHES);
export const playersStore = createStore<AdminPlayer>("players", SEED_PLAYERS);
export const resultsStore = createStore<AdminResult>("results", SEED_RESULTS);
export const sponsorsStore = createStore<AdminSponsor>("sponsors", SEED_SPONSORS);
export const wellnessStore = createStore<AdminWellness>("wellness", SEED_WELLNESS);
export const mediaStore = createStore<AdminMedia>("media", SEED_MEDIA);

// ─── Stats helper ─────────────────────────────────────────────────────────────

export function getAdminStats() {
  return {
    totalEvents: eventsStore.getAll().length,
    upcomingEvents: eventsStore.getAll().filter((e) => e.status === "upcoming").length,
    totalMatches: matchesStore.getAll().length,
    upcomingMatches: matchesStore.getAll().filter((m) => m.status === "upcoming").length,
    totalCoaches: coachesStore.getAll().length,
    activeCoaches: coachesStore.getAll().filter((c) => c.status === "active").length,
    totalPlayers: playersStore.getAll().length,
    activePlayers: playersStore.getAll().filter((p) => p.status === "active").length,
    totalResults: resultsStore.getAll().length,
    totalSponsors: sponsorsStore.getAll().length,
    totalMedia: mediaStore.getAll().length,
    totalWellness: wellnessStore.getAll().length,
  };
}
