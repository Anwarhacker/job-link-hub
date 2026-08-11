"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { JobGrid } from "@/components/JobGrid";
import { JobOpportunityDTO } from "@/models/JobOpportunity";
import { Briefcase, Calendar, ArrowUpDown } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpportunityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "24h" | "7d" | "30d">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const fetchJobs = useCallback(async (query: string = searchQuery, dFilter: string = dateFilter, sort: string = sortOrder) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (dFilter && dFilter !== "all") params.set("dateFilter", dFilter);
      if (sort) params.set("sort", sort);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load jobs");
      }
      const data = await res.json();
      setJobs(data);
    } catch (err: unknown) {
      console.error("Fetch jobs error:", err);
      setError(err instanceof Error ? err.message : "Error loading jobs");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, dateFilter, sortOrder]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchJobs(query, dateFilter, sortOrder);
  };

  const handleDateFilterChange = (filter: "all" | "24h" | "7d" | "30d") => {
    setDateFilter(filter);
    fetchJobs(searchQuery, filter, sortOrder);
  };

  const handleSortChange = (sort: "latest" | "oldest") => {
    setSortOrder(sort);
    fetchJobs(searchQuery, dateFilter, sort);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">All Career Opportunities</h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Explore and filter open job listings and internships.</p>
            </div>
          </div>

          <SearchBar onSearch={handleSearch} placeholder="Search by title, company, location or skill..." />

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <span className="px-2 text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Posted Date:
              </span>
              <button
                onClick={() => handleDateFilterChange("all")}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  dateFilter === "all" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => handleDateFilterChange("24h")}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  dateFilter === "24h" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Past 24 Hours
              </button>
              <button
                onClick={() => handleDateFilterChange("7d")}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  dateFilter === "7d" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Past 7 Days
              </button>
              <button
                onClick={() => handleDateFilterChange("30d")}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  dateFilter === "30d" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Past 30 Days
              </button>
            </div>

            <div className="flex items-center bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value as "latest" | "oldest")}
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
              >
                <option value="latest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Newest First</option>
                <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <JobGrid jobs={jobs} loading={loading} error={error} />
      </main>

      <Footer />
    </div>
  );
}
