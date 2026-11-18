import mongoose, { Schema } from "mongoose";

interface IPlayerIdCounter {
  _id: string;
  sequence: number;
}

const PlayerIdCounterSchema = new Schema<IPlayerIdCounter>({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true, default: 0 },
});

export const PlayerIdCounter =
  mongoose.models.PlayerIdCounter ||
  mongoose.model<IPlayerIdCounter>("PlayerIdCounter", PlayerIdCounterSchema);
