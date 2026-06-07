import React from "react";
import { cn } from "@/lib/utils";

export const GrowthGraph: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-xl p-6 flex flex-col border border-outline-variant/5">
      <h3 className="text-lg font-bold headline-font text-on-surface mb-2">Regional Growth</h3>
      <p className="text-xs text-on-surface-variant mb-6">5-Year Projected Appreciation (ZHVI)</p>
      
      <div className="flex-1 flex items-end gap-3 h-full min-h-[200px]">
        <div className="flex-1 flex flex-col justify-end gap-1 h-full">
          <div className="relative h-48 w-full border-l border-b border-outline-variant/10">
            {/* SVG Mock Graph */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Grid Lines */}
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-outline-variant/10" strokeWidth="0.5" />
              ))}
              
              {/* Line 1: Midwest (Primary) */}
              <path 
                d="M0,80 Q25,75 50,60 T100,20" 
                fill="none" 
                stroke="#bac3ff" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(186,195,255,0.4)]"
              />
              {/* Line 2: South (Secondary) */}
              <path 
                d="M0,90 Q25,85 50,70 T100,10" 
                fill="none" 
                stroke="#66d9cc" 
                strokeWidth="2" 
                strokeDasharray="4 2"
                opacity="0.8"
              />
              {/* Line 3: West (Tertiary) */}
              <path 
                d="M0,70 Q25,60 50,65 T100,40" 
                fill="none" 
                stroke="#55d7ed" 
                strokeWidth="2" 
                opacity="0.6"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pt-4">
            <span>2024</span>
            <span>2026</span>
            <span>2028</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {[
          { label: "Midwest", color: "bg-surface-tint", value: "+18.5%", active: true },
          { label: "South", color: "bg-primary", value: "+24.2%" },
          { label: "West", color: "bg-tertiary", value: "+12.1%" },
        ].map((item) => (
          <div key={item.label} className={cn(
            "flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer",
            item.active ? "bg-surface-container" : "hover:bg-surface-container-high/50"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn("w-2.5 h-2.5 rounded-full", item.color)}></div>
              <span className="text-xs font-semibold text-on-surface">{item.label}</span>
            </div>
            <span className="text-xs font-bold text-on-surface">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
