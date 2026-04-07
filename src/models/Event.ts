import mongoose, { Schema, Document } from "mongoose";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface IEvent extends Document {
  image: string;
  tag: string;
  title: string;
  date: string;
  location: string;
  entryFee: string;
  prize: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    image: { type: String, default: "/images/event-1.png" },
    tag: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    entryFee: { type: String, required: true, trim: true },
    prize: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
