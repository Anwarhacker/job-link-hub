import React from "react";
import { LinkCard } from "./LinkCard";
import { LinkDTO } from "@/models/Link";

interface LinkListProps {
  links: LinkDTO[];
  loading?: boolean;
  error?: string | null;
}

export const LinkList: React.FC<LinkListProps> = ({ links, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-[600px] space-y-3.5 px-4 my-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-[74px] rounded-2xl bg-slate-900/40 border border-slate-800/50 animate-pulse flex items-center p-4 space-x-4"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/60" />
            <div className="flex-1 space-y-2">
              <div className="w-1/3 h-4 rounded bg-slate-800/80" />
              <div className="w-2/3 h-3 rounded bg-slate-800/40" />
            </div>
            <div className="w-5 h-5 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[600px] px-4 my-8 text-center">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="w-full max-w-[600px] px-4 my-10 text-center">
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-400 space-y-2">
          <p className="text-base font-medium">No links available yet.</p>
          <p className="text-xs text-slate-500">Check back soon for new updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] px-4 my-6 space-y-3.5 mx-auto">
      {links.map((link) => (
        <LinkCard key={link._id || link.url} link={link} />
      ))}
    </div>
  );
};
