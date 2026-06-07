interface NavItem {
  icon: string;
  label: string;
  path: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: "dashboard", label: "ZHVI", path: "/" },
  { icon: "analytics", label: "Analytics Dashboard", path: "/executive", active: true },

  { icon: "database", label: "Data Workspace", path: "/data-workspace" },
  { icon: "psychology", label: "GenAI Insights", path: "#" },
];

import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export const PremiumSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest flex flex-col py-6 z-50 border-r border-outline-variant/10">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              architecture
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-surface-tint tracking-tighter headline-font">RealEstate IQ</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium opacity-60">
              Intelligence Engine
            </span>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/" && location.pathname === "/");
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 tracking-tight transition-all duration-200 headline-font",
                isActive
                  ? "text-surface-tint relative before:absolute before:left-0 before:w-1 before:h-8 before:bg-surface-tint before:rounded-full font-semibold bg-primary/5"
                  : "text-on-surface-variant opacity-70 hover:bg-surface-container-low hover:opacity-100"
              )}
            >
              <span 
                className="material-symbols-outlined text-[22px]" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 mt-auto">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant opacity-70 headline-font tracking-tight hover:bg-surface-container-low hover:opacity-100 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span className="text-sm">Settings</span>
        </a>
      </div>
    </aside>
  );
};
