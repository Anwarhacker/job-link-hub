import React from "react";
import { ArrowUpRight } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";
import { LinkDTO } from "@/models/Link";

interface LinkCardProps {
  link: LinkDTO;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-between w-full p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/50 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      <div className="flex items-center space-x-4 min-w-0 pr-2">
        {/* Icon Container */}
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-indigo-500/20 text-indigo-400 group-hover:text-indigo-300 flex items-center justify-center border border-slate-700/50 group-hover:border-indigo-500/40 transition-colors duration-300">
          <DynamicIcon name={link.icon} className="w-5 h-5" />
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold text-slate-100 group-hover:text-white truncate transition-colors duration-200">
            {link.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 truncate transition-colors duration-200 mt-0.5">
            {link.description}
          </p>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0 ml-3 text-slate-500 group-hover:text-indigo-400 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
        <ArrowUpRight className="w-5 h-5" />
      </div>
    </a>
  );
};
