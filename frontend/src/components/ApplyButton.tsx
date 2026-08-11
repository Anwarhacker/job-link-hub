import React from "react";
import { ExternalLink, Rocket, Lock } from "lucide-react";

interface ApplyButtonProps {
  applicationUrl: string;
  sourceName: string;
  deadline?: string | Date;
  stickyMobile?: boolean;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({
  applicationUrl,
  sourceName,
  deadline,
  stickyMobile = false,
}) => {
  const isExpired = deadline ? new Date(deadline) < new Date() : false;

  if (isExpired) {
    return (
      <div
        className={`w-full space-y-2.5 ${
          stickyMobile
            ? "sticky bottom-3 z-30 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl"
            : ""
        }`}
      >
        <button
          disabled
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 font-bold text-sm sm:text-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
        >
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          <span>APPLICATION CLOSED</span>
        </button>
        <p className="text-center text-[11px] sm:text-xs text-rose-400 font-medium">
          The deadline for this opportunity has passed.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full space-y-2.5 ${
        stickyMobile
          ? "sticky bottom-3 z-30 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800/90 shadow-2xl"
          : ""
      }`}
    >
      {/* Primary Apply Button */}
      <a
        href={applicationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-500/40 text-center"
      >
        <Rocket className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce flex-shrink-0" />
        <span>APPLY NOW</span>
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 flex-shrink-0" />
      </a>

      {/* Source attribution link */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400 pt-0.5">
        <span>🔗 Original Source:</span>
        <a
          href={applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-400 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
        >
          {sourceName} <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </div>
    </div>
  );
};
