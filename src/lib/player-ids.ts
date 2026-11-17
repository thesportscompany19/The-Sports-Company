const SPORT_CODES: Record<string, string> = {
  Athletics: "ATH",
  Badminton: "BDM",
  Basketball: "BSK",
  Chess: "CHS",
  Cricket: "CRI",
  Football: "FTB",
  Hockey: "HKY",
  Pickleball: "PKB",
  Skating: "SKT",
  Swimming: "SWM",
  "Table Tennis": "TTN",
  Tennis: "TNS",
  Volleyball: "VBL",
};

export interface SportPlayerId {
  sport: string;
  playerId: string;
}

export function createSportPlayerIds(playerId: string, sports: string[], createdAt: Date | string): SportPlayerId[] {
  const year = new Date(createdAt).getFullYear();
  const uniquePlayerKey = playerId.toUpperCase();

  return [...new Set(sports)].map((sport) => {
    const code = SPORT_CODES[sport] || sport.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase();
    return { sport, playerId: `${code}-${year}-${uniquePlayerKey}` };
  });
}
