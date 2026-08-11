"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Home, LogOut, ShieldCheck, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const AdminNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 overflow-x-auto">
        {/* Left Branding & Links */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <Link href="/admin/jobs" className="flex items-center space-x-1.5 text-white font-bold text-sm sm:text-base">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="hidden xs:inline">Admin Portal</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/"
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                pathname === "/"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Home</span>
            </Link>

            <Link
              href="/admin/jobs"
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                pathname === "/admin/jobs"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Jobs</span>
            </Link>

            <Link
              href="/admin/jobs/create"
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                pathname === "/admin/jobs/create"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Job</span>
            </Link>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          <ThemeToggle />

          <Link
            href="/"
            target="_blank"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>Live Site</span> <ExternalLink className="w-3 h-3 text-blue-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
