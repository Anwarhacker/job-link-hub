"use client";

import React, { useState } from "react";
import Link from "next/link";
import { JobOpportunityDTO } from "@/models/JobOpportunity";
import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

interface JobCardProps {
  job: JobOpportunityDTO;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [copiedCompany, setCopiedCompany] = useState(false);
  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "N/A";
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCopyCompany = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(job.companyName);
    setCopiedCompany(true);
    setTimeout(() => setCopiedCompany(false), 2000);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl backdrop-blur-md overflow-hidden bg-white dark:bg-slate-900/70 border ${
        isExpired
          ? "border-slate-200 dark:border-slate-800/80 opacity-75 hover:border-slate-300 dark:hover:border-slate-700"
          : "border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-blue-500/10"
      }`}
    >
      {/* Top Header & Badges */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="w-full">
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                {job.jobType || "Full Time"}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                {job.workType || "On-site"}
              </span>
              {isExpired && (
                <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> EXPIRED
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
              {job.title}
            </h3>

            {/* Company Name with Copy Button */}
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{job.companyName}</span>
              </p>

              <button
                type="button"
                onClick={handleCopyCompany}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                title="Copy company name"
              >
                {copiedCompany ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              {copiedCompany && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Location & Meta info */}
        <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800/60 py-2.5">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span className="truncate">{job.experience || "0-1 Years"}</span>
            </div>
            {job.salary && (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px] sm:text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 flex-shrink-0">
                {job.salary}
              </span>
            )}
          </div>
        </div>

        {/* Skill Badges */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {job.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="skill-pill text-[10px] sm:text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full shadow-xs flex items-center justify-center"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 py-0.5">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer with Dates & Action */}
      <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800/80 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5">
        <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span>Posted: {formatDate(job.postedDate)}</span>
          </div>
          {job.deadline && (
            <div
              className={`flex items-center gap-1 ${isExpired ? "text-rose-600 dark:text-rose-400 font-medium" : ""}`}
            >
              <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span>Deadline: {formatDate(job.deadline)}</span>
            </div>
          )}
        </div>

        <Link
          href={`/jobs/${job.slug || job._id}`}
          className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 group-hover:translate-x-0.5 text-center"
        >
          <span className="text-white">VIEW OPPORTUNITY</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>
    </div>
  );
};
