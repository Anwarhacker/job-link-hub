"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobOpportunityDTO } from "@/models/JobOpportunity";
import { VisitorStatsDTO } from "@/models/VisitorStats";
import { AdminNavbar } from "@/components/AdminNavbar";
import { AdminReferralSection } from "@/components/AdminReferralSection";
import { AdminNotes } from "@/components/AdminNotes";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Clock,
  RefreshCw,
  Eye,
  AlertTriangle,
  X,
  Users,
} from "lucide-react";

export default function AdminJobsDashboard() {
  const [jobs, setJobs] = useState<JobOpportunityDTO[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token") || "";
    setAdminToken(token);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

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
    fetchJobs();
    fetchVisitorStats();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${deletingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Job opportunity deleted successfully");
        setDeletingId(null);
        await fetchJobs();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete job");
      }
    } catch (err) {
      console.error("Delete job error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = jobs.length;
  const activeCount = jobs.filter((j) => !j.deadline || new Date(j.deadline) >= new Date()).length;
  const expiredCount = jobs.filter((j) => j.deadline && new Date(j.deadline) < new Date()).length;

  const formatDate = (dInput?: string | Date) => {
    if (!dInput) return "N/A";
    return new Date(dInput).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-2xl animate-fade-in">
            {toast}
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your job & internship opportunities and track app analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchJobs();
                fetchVisitorStats();
              }}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title="Refresh Stats & Jobs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/admin/jobs/create"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Opportunity
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total App Visitors</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-purple-400">
              {visitorStats ? visitorStats.totalVisits.toLocaleString() : "..."}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {visitorStats?.uniqueVisitors
                ? `${visitorStats.uniqueVisitors.toLocaleString()} unique visitors`
                : "Live tracking"}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Opportunities</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">{totalCount}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Active Opportunities</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{activeCount}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Expired Opportunities</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-rose-400">{expiredCount}</p>
          </div>
        </div>

        {/* Notes Section */}
        <section className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-xl">
          <AdminNotes adminToken={adminToken} />
        </section>

        {/* Referral Apps Section */}
        <section className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-xl">
          <AdminReferralSection adminToken={adminToken} />
        </section>

        {/* Jobs Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm">All Job Postings</h3>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              View Public Website <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No job opportunities created yet. Click <strong>+ Add Opportunity</strong> to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Job Title & Company</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Posted Date</th>
                    <th className="py-3.5 px-4">Deadline</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {jobs.map((job) => {
                    const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
                    return (
                      <tr key={job._id || job.slug} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-100">{job.title}</div>
                          <div className="text-xs text-slate-400">{job.companyName}</div>
                        </td>
                        <td className="py-4 px-4 text-slate-300">{job.location}</td>
                        <td className="py-4 px-4 text-slate-400">{formatDate(job.postedDate)}</td>
                        <td className="py-4 px-4 text-slate-400">{formatDate(job.deadline)}</td>
                        <td className="py-4 px-4">
                          {isExpired ? (
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
                              Expired
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/jobs/${job.slug || job._id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/jobs/${job._id}/edit`}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </Link>
                            <button
                              onClick={() => setDeletingId(job._id || null)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-semibold">Delete Opportunity</h3>
              </div>
              <button
                onClick={() => setDeletingId(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete this job opportunity? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/20"
              >
                {isDeleting ? "Deleting..." : "Delete Opportunity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
