"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Check,
  ExternalLink,
  Gift,
  Copy,
} from "lucide-react";
import { ReferralAppDTO } from "@/models/ReferralApp";

export const ReferralSlider: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [apps, setApps] = useState<ReferralAppDTO[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApps(data));
  }, []);

  const handleShare = (app: ReferralAppDTO, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const codeText = app.referralCode ? ` | Code: ${app.referralCode}` : "";
    const text = `💰 Earn ${app.bonus} referral bonus on ${app.name}!${codeText} Sign up here: ${app.url}`;
    if (navigator.share) {
      navigator.share({ title: `${app.name} Referral`, text, url: app.url });
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(app._id!);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyCode = (code: string, id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
  };

  if (apps.length === 0) return null;

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/10">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              High Bonus Referral Apps
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Featured
              </span>
            </h3>
            <p className="text-xs text-slate-400 hidden xs:block">
              Earn instant sign-up bonuses using exclusive referral codes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Slider */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-3 pt-1 px-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {apps.map((app) => {
          const initial = app.name.charAt(0).toUpperCase();

          return (
            <div
              key={app._id}
              className="group relative flex-shrink-0 flex flex-col justify-between w-[200px] sm:w-[220px] rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/90 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl overflow-hidden"
            >
              {/* Top Banner Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {/* Header info */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-base flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
                      {initial}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-white text-emerald-400 border border-emerald-500/30 shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {app.bonus}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {app.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      Sign-up Reward Available
                    </p>
                  </div>
                </div>

                {/* Referral Code Box */}
                {app.referralCode ? (
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs group-hover:border-slate-700/80 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                        Referral Code
                      </span>
                      <span className="font-mono text-[11px] font-bold text-blue-400 truncate max-w-[110px]">
                        {app.referralCode}
                      </span>
                    </div>
                    <button
                      onClick={(e) =>
                        handleCopyCode(app.referralCode, app._id!, e)
                      }
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
                      title="Copy referral code"
                    >
                      {copiedCodeId === app._id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="h-2" />
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all text-center"
                >
                  <span>Claim</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={(e) => handleShare(app, e)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                  title="Share referral link"
                >
                  {copiedId === app._id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
