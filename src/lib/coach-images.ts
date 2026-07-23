export const sportCoachImages: Record<string, string> = {
  Cricket: "/images/event-1.png",
  Football: "/images/event-2.png",
  Badminton: "/images/event-3.png",
  Tennis: "/images/tennis.png",
  Basketball: "/images/event-4.png",
  Athletics: "/images/sports-banner.png",
  Hockey: "/images/hackey.jpg",
  Volleyball: "/images/vallyball.jpeg",
  Wrestling: "/images/event-4.png",
  Chess: "/images/chess.jpeg",
};

export function getCoachImageBySport(sport: string) {
  return sportCoachImages[sport] || "/images/sports-banner.png";
}
