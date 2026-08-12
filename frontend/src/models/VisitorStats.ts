import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorStats extends Document {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisitedAt: Date;
}

export type VisitorStatsDTO = {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisitedAt?: string;
};

const VisitorStatsSchema: Schema<IVisitorStats> = new Schema(
  {
    totalVisits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    lastVisitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VisitorStats: Model<IVisitorStats> =
  mongoose.models.VisitorStats ||
  mongoose.model<IVisitorStats>("VisitorStats", VisitorStatsSchema, "visitorstats");

export default VisitorStats;
