"use client";

import React, { useState } from "react";
import { JobOpportunityDTO } from "@/models/JobOpportunity";
import { ApplyButton } from "./ApplyButton";
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  ListChecks,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

interface JobDetailsProps {
  job: JobOpportunityDTO;
}

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const [copiedCompany, setCopiedCompany] = useState(false);
  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "N/A";
    return new Date(dateInput).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCopyCompany = () => {
    navigator.clipboard.writeText(job.companyName);
    setCopiedCompany(true);
    setTimeout(() => setCopiedCompany(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <div className="pt-2">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Opportunities
        </Link>
      </div>

      {/* Main Job Card Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl backdrop-blur-xl space-y-8">
        {/* Header Section */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {job.jobType || "Full Time"}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {job.workType || "On-site"}
            </span>
            {isExpired && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                EXPIRED
              </span>
            )}
            {job.instagramUrl && (
              <a
                href={job.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800/60 inline-flex items-center gap-1.5 hover:bg-pink-200 dark:hover:bg-pink-900/80 transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" /> Posted on Instagram
              </a>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{job.companyName}</span>
            <button
              type="button"
              onClick={handleCopyCompany}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1 text-xs"
              title="Copy company name"
            >
              {copiedCompany ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Name</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Location
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{job.location}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Experience
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200">{job.experience || "0-1 Years"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Salary
            </span>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">{job.salary || "Not Disclosed"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Deadline
            </span>
            <p className={`text-xs sm:text-sm font-semibold ${isExpired ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-200"}`}>
              {formatDate(job.deadline)}
            </p>
          </div>
        </div>

        {/* About the Role / Description */}
        {job.description && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /> About the Role
            </h2>
            <div className="text-sm sm:text-base text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60">
              {job.description}
            </div>
          </div>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Key Responsibilities
            </h2>
            <ul className="space-y-2.5">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm sm:text-base text-slate-800 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 mt-2 flex-shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Eligibility */}
        {job.eligibility && job.eligibility.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Eligibility Requirements
            </h2>
            <ul className="space-y-2.5">
              {job.eligibility.map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm sm:text-base text-slate-800 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Key Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="skill-pill px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-sm flex items-center justify-center"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta Timestamps */}
        <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Opportunity posted on {formatDate(job.postedDate)}</span>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <ApplyButton
            applicationUrl={job.applicationUrl}
            sourceName={job.sourceName}
            deadline={job.deadline}
            stickyMobile
          />
        </div>
      </div>
    </div>
  );
};
