import React from "react";
import { JobCard } from "./JobCard";
import { JobOpportunityDTO } from "@/models/JobOpportunity";
import { SearchX } from "lucide-react";

interface JobGridProps {
  jobs: JobOpportunityDTO[];
  loading?: boolean;
  error?: string | null;
}

export const JobGrid: React.FC<JobGridProps> = ({ jobs, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full my-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="w-full h-80 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-1/3 h-4 rounded bg-slate-800" />
              <div className="w-3/4 h-6 rounded bg-slate-800" />
              <div className="w-1/2 h-4 rounded bg-slate-800/60" />
            </div>
            <div className="space-y-2">
              <div className="w-full h-10 rounded bg-slate-800/40" />
              <div className="w-1/3 h-4 rounded bg-slate-800/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full my-8 p-6 text-center rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
        {error}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full my-12 text-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-2">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-semibold text-slate-200">No opportunities found</h4>
        <p className="text-xs text-slate-400">
          Try adjusting your search terms or check back later for newly posted roles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full my-6">
      {jobs.map((job) => (
        <JobCard key={job._id || job.slug || job.title} job={job} />
      ))}
    </div>
  );
};
