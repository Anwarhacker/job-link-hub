import React from "react";
import { LinkDTO } from "@/models/Link";
import { DynamicIcon } from "./DynamicIcon";
import { Edit2, Trash2, ExternalLink, Hash, Eye, EyeOff } from "lucide-react";

interface AdminLinkListProps {
  links: LinkDTO[];
  onEdit: (link: LinkDTO) => void;
  onDelete: (link: LinkDTO) => void;
  onToggleActive?: (link: LinkDTO) => void;
}

export const AdminLinkList: React.FC<AdminLinkListProps> = ({
  links,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  if (links.length === 0) {
    return (
      <div className="w-full text-center p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
        No links created yet. Use the form above to add your first link.
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
        <span>Link Cards ({links.length})</span>
        <span>Order & Status</span>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link._id || link.url}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border transition-all ${
              link.active
                ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                : "bg-slate-950/60 border-slate-900/80 opacity-70"
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0 w-full sm:w-auto mb-3 sm:mb-0">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-slate-700/50">
                <DynamicIcon name={link.icon} className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-100 truncate">
                    {link.title}
                  </h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      link.active
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {link.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {link.description}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline mt-1 truncate max-w-xs"
                >
                  {link.url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Actions & Order */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div className="flex items-center text-xs text-slate-400 gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Hash className="w-3 h-3 text-slate-500" />
                <span>Order: {link.order}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                {onToggleActive && (
                  <button
                    type="button"
                    onClick={() => onToggleActive(link)}
                    title={link.active ? "Deactivate link" : "Activate link"}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {link.active ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onEdit(link)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/50 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(link)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
