"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, DollarSign, Share2, Check } from "lucide-react";
import { ReferralAppDTO } from "@/models/ReferralApp";

export const ReferralSlider: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [apps, setApps] = useState<ReferralAppDTO[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApps(data));
  }, []);

  const handleShare = (app: ReferralAppDTO) => {
    const codeText = app.referralCode ? ` | Code: ${app.referralCode}` : "";
    const text = `💰 Earn ${app.bonus} referral bonus on ${app.name}!${codeText} Sign up here: ${app.url}`;
    if (navigator.share) {
      navigator.share({ title: `${app.name} Referral`, text, url: app.url });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(app._id!);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (apps.length === 0) return null;

  return (
    <div className="space-y-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
          High Referral Bonus Apps
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {apps.map((app) => (
          <div
            key={app._id}
            className="flex-shrink-0 flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors overflow-hidden w-[130px] sm:w-[145px] md:w-[155px]"
          >
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1.5 px-3 pt-3 pb-2.5 flex-1"
            >
              <span className="text-xs sm:text-sm font-semibold text-white leading-tight">{app.name}</span>
              <span className="text-[11px] sm:text-xs font-bold text-green-400">{app.bonus} bonus</span>
              {app.referralCode && (
                <span className="text-[10px] sm:text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 self-start leading-tight break-all">
                  {app.referralCode}
                </span>
              )}
            </a>
            <button
              onClick={() => handleShare(app)}
              className="flex items-center justify-center gap-1 py-2 text-[10px] sm:text-[11px] font-medium border-t border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {copied === app._id ? (
                <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></>
              ) : (
                <><Share2 className="w-3 h-3" />Share</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
