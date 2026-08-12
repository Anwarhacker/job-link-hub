"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ReferralAppDTO } from "@/models/ReferralApp";
import { Plus, Trash2, Edit2, X, RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  adminToken?: string;
}

const empty = { name: "", url: "", bonus: "", referralCode: "", order: 0 };

export const AdminReferralSection: React.FC<Props> = ({ adminToken }) => {
  const [apps, setApps] = useState<ReferralAppDTO[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deletion confirmation state
  const [deletingApp, setDeletingApp] = useState<ReferralAppDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/referrals?all=true", {
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to load referral apps");
      }
    } catch {
      setError("Network error loading referral apps");
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url || !form.bonus) {
      setError("Name, URL and bonus are required");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const url = editingId ? `/api/referrals/${editingId}` : "/api/referrals";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm(empty);
        setEditingId(null);
        await fetchApps();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || `Failed to ${editingId ? "update" : "add"} referral app`);
      }
    } catch {
      setError("Network error saving referral app");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/referrals/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        await fetchApps();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to delete referral app");
      }
    } catch {
      setError("Network error deleting referral app");
    }
  };

  const confirmDeleteApp = async () => {
    if (!deletingApp?._id) return;
    setIsDeleting(true);
    await handleDelete(deletingApp._id);
    setDeletingApp(null);
    setIsDeleting(false);
  };

  const startEdit = (app: ReferralAppDTO) => {
    setEditingId(app._id!);
    setForm({
      name: app.name,
      url: app.url,
      bonus: app.bonus,
      referralCode: app.referralCode ?? "",
      order: app.order ?? 0,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm sm:text-base font-semibold text-slate-200">
          Referral Apps
        </h2>
        <button
          onClick={fetchApps}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          title="Refresh Referrals"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Form — 1 col mobile, 2 col sm, full row lg */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <input
          placeholder="App name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full"
        />
        <input
          placeholder="Referral URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full"
        />
        <input
          placeholder="Bonus (e.g. ₹500)"
          value={form.bonus}
          onChange={(e) => setForm({ ...form, bonus: e.target.value })}
          className="px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full"
        />
        <input
          placeholder="Referral code (optional)"
          value={form.referralCode}
          onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
          className="px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full"
        />
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {error && <p className="col-span-full text-xs text-rose-400">{error}</p>}
      </form>

      {/* List */}
      {loading && apps.length === 0 ? (
        <p className="text-sm text-slate-500">Loading referral apps...</p>
      ) : apps.length === 0 ? (
        <p className="text-sm text-slate-500">No referral apps added yet.</p>
      ) : (
        <div className="divide-y divide-slate-800 border border-slate-800">
          {apps.map((app) => (
            <div
              key={app._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-3 gap-2 hover:bg-slate-900/50 transition-colors"
            >
              {/* Info */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                <span className="text-sm font-medium text-slate-200">{app.name}</span>
                <span className="text-xs text-green-400 font-semibold">{app.bonus}</span>
                {app.referralCode && (
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5">
                    {app.referralCode}
                  </span>
                )}
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-400 truncate max-w-[180px] sm:max-w-[240px] transition-colors"
                >
                  {app.url}
                </a>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => startEdit(app)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
                  title="Edit Referral App"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingApp(app)}
                  className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-900 border border-rose-800/60 transition-colors"
                  title="Delete Referral App"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-semibold">Delete Referral App</h3>
              </div>
              <button
                onClick={() => setDeletingApp(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete <strong>{deletingApp.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingApp(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteApp}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete Referral App"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
