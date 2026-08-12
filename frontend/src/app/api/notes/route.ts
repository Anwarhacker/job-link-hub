import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/models/Note";
import { getAdminFromRequest } from "@/lib/auth";

let memoryNotes: Array<{
  _id: string;
  text: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}> = [];

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();

    if (!db) {
      const sorted = [...memoryNotes].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return NextResponse.json(sorted, { headers: { "X-Demo-Mode": "true" } });
    }

    const notes = await Note.find({}).sort({ pinned: -1, createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { text, pinned = false } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (!db) {
      const newNote = {
        _id: `mem-note-${Date.now()}`,
        text: text.trim(),
        pinned: Boolean(pinned),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryNotes.unshift(newNote);
      return NextResponse.json(newNote, { status: 201, headers: { "X-Demo-Mode": "true" } });
    }

    const note = await Note.create({
      text: text.trim(),
      pinned: Boolean(pinned),
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
