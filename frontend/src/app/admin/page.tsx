"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LinkDTO } from "@/models/Link";
import { AdminLinkForm } from "@/components/AdminLinkForm";
import { AdminLinkList } from "@/components/AdminLinkList";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { Lock, LogOut, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [links, setLinks] = useState<LinkDTO[]>([]);
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

  useEffect(() => {
    if (adminToken !== null) {
      fetchAllLinks();
    }
  }, [adminToken, fetchAllLinks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!passwordInput.trim()) {
      setAuthError("Please enter your admin password");
      return;
    }

    const token = passwordInput.trim();
    sessionStorage.setItem("admin_token", token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setAdminToken(null);
    setPasswordInput("");
    setLinks([]);
    setEditingLink(null);
  };

  const handleFormSubmit = async (linkData: Partial<LinkDTO> | Partial<LinkDTO>[]) => {
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
      }

      if (editingLink && editingLink._id) {
        // PUT update single link
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
        // POST create (single or bulk array)
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
        headers["Authorization"] = `Bearer ${adminToken}`;
      }

      const res = await fetch(`/api/links/${link._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ active: !link.active }),
      });

      if (res.ok) {
        showToast(
          `Link "${link.title}" is now ${!link.active ? "Active" : "Inactive"}`
        );
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
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
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
    } catch (err) {
      console.error("Delete link error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (adminToken === null) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Link Manager</h1>
            <p className="text-xs text-slate-400">
              Enter your admin password to access the control panel.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all duration-200"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/anwar"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Back to Public Bio <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
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
            onClick={fetchAllLinks}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1 transition-colors"
            title="Refresh links"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/anwar"
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
