import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  text: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteDTO = {
  _id?: string;
  text: string;
  pinned: boolean;
  createdAt: string;
  updatedAt?: string;
};

const NoteSchema: Schema<INote> = new Schema(
  {
    text: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema, "notes");

export default Note;
