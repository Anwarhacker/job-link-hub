"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LinkDTO } from "@/models/Link";
import { VisitorStatsDTO } from "@/models/VisitorStats";
import { AdminLinkForm } from "@/components/AdminLinkForm";
import { AdminLinkList } from "@/components/AdminLinkList";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { Lock, LogOut, RefreshCw, ExternalLink, ShieldCheck, Users, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [links, setLinks] = useState<LinkDTO[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStatsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkDTO | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setAdminToken(saved);
    }
  }, []);

  const fetchAllLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/links?all=true", {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error("Admin fetch links error:", err);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  const fetchVisitorStats = async () => {
    try {
      const res = await fetch("/api/stats/visitor");
      if (res.ok) {
        const data = await res.json();
        setVisitorStats(data);
      }
    } catch (err) {
      console.error("Fetch visitor stats error:", err);
    }
  };

  useEffect(() => {
    if (adminToken !== null) {
      fetchAllLinks();
      fetchVisitorStats();
    }
  }, [adminToken, fetchAllLinks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        setAdminToken(data.token);
        setPasswordInput("");
      } else {
        setAuthError(data.error || "Invalid password");
      }
    } catch {
      setAuthError("Login failed. Check server connection.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    sessionStorage.removeItem("admin_token");
    setAdminToken(null);
  };

  const handleFormSubmit = async (linkData: Partial<LinkDTO> | Partial<LinkDTO>[]) => {
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken) {
        headers.Authorization = `Bearer ${adminToken}`;
      }

      if (editingLink && editingLink._id) {
        const res = await fetch(`/api/links/${editingLink._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(linkData),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update link");
        }

        showToast("Link updated successfully!");
        setEditingLink(null);
      } else {
        const res = await fetch("/api/links", {
          method: "POST",
          headers,
          body: JSON.stringify(linkData),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create link(s)");
        }

        if (Array.isArray(linkData)) {
          showToast(`${linkData.length} links created successfully!`);
        } else {
          showToast("New link added successfully!");
        }
      }

      await fetchAllLinks();
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (link: LinkDTO) => {
    if (!link._id) return;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken) {
        headers.Authorization = `Bearer ${adminToken}`;
      }

      const res = await fetch(`/api/links/${link._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ active: !link.active }),
      });

      if (res.ok) {
        showToast(`Link "${link.title}" ${link.active ? "deactivated" : "activated"}`);
        await fetchAllLinks();
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLink || !deletingLink._id) return;

    setIsDeleting(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken) {
        headers.Authorization = `Bearer ${adminToken}`;
      }

      const res = await fetch(`/api/links/${deletingLink._id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete link");
      }

      showToast("Link deleted successfully");
      setDeletingLink(null);
      await fetchAllLinks();
    } catch (err: unknown) {
      console.error("Delete link error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete link");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admin Access</h1>
            <p className="text-xs text-slate-400">
              Enter password to access the Bio Link Admin Dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium text-center">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-colors"
            >
              Authenticate Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-2xl flex items-center gap-2 animate-fade-in">
          <ShieldCheck className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Link Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, reorder, and add single or multiple link cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchAllLinks();
              fetchVisitorStats();
            }}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1 transition-colors"
            title="Refresh links & stats"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            View Live Bio <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Visitor Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Total App Visits</span>
            <p className="text-2xl font-extrabold text-purple-400 mt-0.5">
              {visitorStats ? visitorStats.totalVisits.toLocaleString() : "..."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Unique Visitors</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">
              {visitorStats ? visitorStats.uniqueVisitors.toLocaleString() : "..."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <section>
        <AdminLinkForm
          editingLink={editingLink}
          onSubmit={handleFormSubmit}
          onCancelEdit={() => setEditingLink(null)}
          isSubmitting={isSubmitting}
        />
      </section>

      <section className="space-y-4 pt-4">
        <AdminLinkList
          links={links}
          onEdit={(link) => setEditingLink(link)}
          onDelete={(link) => setDeletingLink(link)}
          onToggleActive={handleToggleActive}
        />
      </section>

      <DeleteConfirm
        isOpen={Boolean(deletingLink)}
        link={deletingLink}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLink(null)}
        isDeleting={isDeleting}
      />
    </main>
  );
}
