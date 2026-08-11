import React from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  name?: string;
  tagline?: string;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = "Anwar Patel",
  tagline = "Developer • Creator • CSE",
  avatarUrl = "/profile.png",
}) => {
  return (
    <header className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
      {/* Avatar Container with Glow & Gradient Ring */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-80 transition duration-500"></div>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
          <Image
            src={avatarUrl}
            alt={name}
            width={112}
            height={112}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* Name and Tagline */}
      <div className="space-y-1.5 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-sans">
          {name}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
          {tagline}
        </p>
      </div>
    </header>
  );
};
