"use client";

import React, { useEffect, useState, useCallback } from "react";
import { NoteDTO } from "@/models/Note";
import {
  Plus,
  Trash2,
  Pin,
  PinOff,
  StickyNote,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

interface AdminNotesProps {
  adminToken?: string;
}

export const AdminNotes: React.FC<AdminNotesProps> = ({ adminToken }) => {
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [input, setInput] = useState("");
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = adminToken || (typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [adminToken]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to load notes");
      }
    } catch {
      setError("Network error loading notes");
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async () => {
    const text = input.trim();
    if (!text || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify({ text, pinned: false }),
      });

      if (res.ok) {
        setInput("");
        await fetchNotes();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to add note");
      }
    } catch {
      setError("Network error adding note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete note");
      }
    } catch {
      setError("Network error deleting note");
    }
  };

  const togglePin = async (id: string) => {
    const target = notes.find((n) => n._id === id);
    if (!target) return;

    const newPinned = !target.pinned;
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, pinned: newPinned } : n))
    );

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify({ pinned: newPinned }),
      });
      if (!res.ok) {
        // Rollback on error
        await fetchNotes();
      }
    } catch {
      await fetchNotes();
    }
  };

  const copyNoteText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNoteId(id);
      window.setTimeout(
        () => setCopiedNoteId((current) => (current === id ? null : current)),
        1500
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm sm:text-base font-semibold text-slate-200 flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-yellow-400" />
          Notes
        </h2>
        <button
          onClick={fetchNotes}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          title="Refresh Notes"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded">
          {error}
        </div>
      )}

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
          disabled={isSubmitting}
          className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-500/60 resize-none disabled:opacity-50"
        />
        <button
          onClick={addNote}
          disabled={isSubmitting || !input.trim()}
          className="px-3.5 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 transition-colors self-stretch flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notes list */}
      {loading && notes.length === 0 ? (
        <p className="text-sm text-slate-500">Loading notes...</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-slate-500">No notes saved in database yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {sorted.map((note) => (
            <div
              key={note._id}
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
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyNoteText(note.text, note._id!)}
                    className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
                    title="Copy"
                  >
                    {copiedNoteId === note._id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => togglePin(note._id!)}
                    className={`p-1 transition-colors ${
                      note.pinned
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-slate-500 hover:text-yellow-400"
                    }`}
                    title={note.pinned ? "Unpin" : "Pin"}
                  >
                    {note.pinned ? (
                      <PinOff className="w-3.5 h-3.5" />
                    ) : (
                      <Pin className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteNote(note._id!)}
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
