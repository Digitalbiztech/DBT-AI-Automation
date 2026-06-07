import React from "react";
import { cn } from "@/lib/utils";

export const PremiumTopBar: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/15 flex justify-between items-center px-8">
      <div className="flex items-center bg-surface-container-low px-4 py-1.5 rounded-full w-96 border border-outline-variant/10">
        <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/50 w-full ml-2"
          placeholder="Search markets, assets, or ZIPs..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-outline-variant/15 pr-6">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[22px]">refresh</span>
          </button>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors relative">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-secondary-container rounded-full ring-2 ring-surface"></span>
          </button>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[22px]">help</span>
          </button>
        </div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full border border-primary-container/40 flex items-center justify-center bg-primary-container/20 group-hover:border-primary-container transition-all">
             <span className="material-symbols-outlined text-surface-tint text-lg">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
