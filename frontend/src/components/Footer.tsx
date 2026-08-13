import React from "react";
import Link from "next/link";
import { Info, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm flex items-start space-x-3 backdrop-blur-sm">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-900 dark:text-slate-200">
              Disclaimer & Transparency Notice
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              This website shares job and internship opportunities for
              informational purposes only. We do not host job application forms
              directly on this domain. Clicking &quot;APPLY NOW&quot; will
              securely redirect you to the official source/company website.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-900 gap-4">
          <p>
            © {new Date().getFullYear()} Job Opportunity Link Hub. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/jobs"
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
            >
              All Jobs
            </Link>
            <span>•</span>
            <Link
              href="/admin/login"
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              Admin Portal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
