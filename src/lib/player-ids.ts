import { PlayerIdCounter } from "@/models/PlayerIdCounter";
import { Player, type IPlayer } from "@/models/Player";

export interface SportPlayerId {
  sport: string;
  playerId: string;
}

function sportLabel(sport: string) {
  return sport.trim().replace(/\s+/g, "-");
}

async function nextSportSequence(sport: string) {
  try {
    const counter = await PlayerIdCounter.findOneAndUpdate(
      { _id: sport },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: false }
    );
    if (!counter) throw new Error(`Could not allocate a player ID for ${sport}`);
    return counter.sequence;
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;

    const counter = await PlayerIdCounter.findOneAndUpdate(
      { _id: sport },
      { $inc: { sequence: 1 } },
      { new: true }
    );
    if (!counter) throw new Error(`Could not allocate a player ID for ${sport}`);
    return counter.sequence;
  }
}

export async function createSportPlayerIds(sports: string[]): Promise<SportPlayerId[]> {
  const ids: SportPlayerId[] = [];
  for (const sport of [...new Set(sports)]) {
    const sequence = await nextSportSequence(sport);
    ids.push({
      sport,
      playerId: `${sportLabel(sport)}-${String(sequence).padStart(3, "0")}`,
    });
  }
  return ids;
}

function hasCurrentSportIds(sports: string[], ids: SportPlayerId[]) {
  return sports.every((sport) => {
    const match = ids.find((id) => id.sport === sport);
    return Boolean(match && new RegExp(`^${sportLabel(sport)}-\\d{3,}$`).test(match.playerId));
  });
}

export async function ensurePlayerSportIds(player: IPlayer): Promise<IPlayer> {
  let current = player;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const currentIds = (current.sportPlayerIds || []).map(({ sport, playerId }) => ({ sport, playerId }));
    if (hasCurrentSportIds(current.sports, currentIds)) return current;

    const sportPlayerIds = await createSportPlayerIds(current.sports);
    const updated = await Player.findOneAndUpdate(
      { _id: current._id, __v: current.__v },
      { $set: { sportPlayerIds }, $inc: { __v: 1 } },
      { new: true }
    );
    if (updated) return updated;

    const latest = await Player.findById(current._id);
    if (!latest) throw new Error(`Player ${current._id} was not found while assigning sport IDs`);
    current = latest;
  }

  throw new Error(`Could not assign sport player IDs for player ${current._id}`);
}
