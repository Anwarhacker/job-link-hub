import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILink extends Document {
  title: string;
  description: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LinkDTO = {
  _id?: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const LinkSchema: Schema<ILink> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "link",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema, "links");

export default Link;
