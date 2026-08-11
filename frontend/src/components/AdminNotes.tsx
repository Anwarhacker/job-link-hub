"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pin,
  PinOff,
  StickyNote,
  Copy,
  Check,
} from "lucide-react";

type Note = {
  id: string;
  text: string;
  pinned: boolean;
  createdAt: string;
};

export const AdminNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("admin_notes", JSON.stringify(updated));
  };

  const addNote = () => {
    const text = input.trim();
    if (!text) return;
    const note: Note = {
      id: Date.now().toString(),
      text,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    save([note, ...notes]);
    setInput("");
  };

  const deleteNote = (id: string) => save(notes.filter((n) => n.id !== id));

  const togglePin = (id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, pinned: !n.pinned } : n,
    );
    save([
      ...updated.filter((n) => n.pinned),
      ...updated.filter((n) => !n.pinned),
    ]);
  };

  const copyNoteText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNoteId(id);
      window.setTimeout(
        () => setCopiedNoteId((current) => (current === id ? null : current)),
        1500,
      );
    } catch {
      setCopiedNoteId(null);
    }
  };

  const sorted = [
    ...notes.filter((n) => n.pinned),
    ...notes.filter((n) => !n.pinned),
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-sm sm:text-base font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
        <StickyNote className="w-4 h-4 text-yellow-400" />
        Notes
      </h2>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addNote();
            }
          }}
          placeholder="Write a note... (Enter to save)"
          rows={2}
          className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-500/60 resize-none"
        />
        <button
          onClick={addNote}
          className="px-3 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 transition-colors self-stretch flex items-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notes list */}
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">No notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {sorted.map((note) => (
            <div
              key={note.id}
              className={`flex flex-col justify-between gap-2 p-3 border transition-colors ${
                note.pinned
                  ? "bg-yellow-500/5 border-yellow-500/30"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <p className="text-sm text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
                {note.text}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500">
                  {new Date(note.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyNoteText(note.text, note.id)}
                    className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
                    title="Copy"
                  >
                    {copiedNoteId === note.id ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => togglePin(note.id)}
                    className={`p-1 transition-colors ${note.pinned ? "text-yellow-400 hover:text-yellow-300" : "text-slate-500 hover:text-yellow-400"}`}
                    title={note.pinned ? "Unpin" : "Pin"}
                  >
                    {note.pinned ? (
                      <PinOff className="w-3.5 h-3.5" />
                    ) : (
                      <Pin className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
