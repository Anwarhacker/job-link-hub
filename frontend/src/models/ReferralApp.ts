import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferralApp extends Document {
  name: string;
  url: string;
  bonus: string;
  referralCode: string;
  order: number;
  active: boolean;
}

export type ReferralAppDTO = {
  _id?: string;
  name: string;
  url: string;
  bonus: string;
  referralCode: string;
  order: number;
  active: boolean;
};

const ReferralAppSchema: Schema<IReferralApp> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    bonus: { type: String, required: true, trim: true },
    referralCode: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ReferralApp: Model<IReferralApp> =
  mongoose.models.ReferralApp ||
  mongoose.model<IReferralApp>("ReferralApp", ReferralAppSchema, "referralapps");

export default ReferralApp;
