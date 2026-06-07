import React from "react";
import { cn } from "@/lib/utils";

interface MarketData {
  region: string;
  zhvi: string;
  yoy: string;
  inventory: "Low" | "Mod" | "Critical";
  inventoryValue: number;
  status: "Strong Buy" | "Growth" | "Hot Market";
}

import { useData } from "@/contexts/DataContext";
import { calculateGrowth } from "@/lib/dataProcessing";

export const MarketDeepDive: React.FC = () => {
  const { allRows, filteredRows } = useData();
  
  const growthData = React.useMemo(() => {
    const zhviRows = filteredRows.filter(r => 
      r.metric === 'ZHVI' || 
      r.type === 'home_value' || 
      !r.metric // fallback for legacy data
    );
    return calculateGrowth(zhviRows, filteredRows)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [allRows]);


  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/5">
      <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/30">
        <h3 className="text-lg font-bold headline-font text-on-surface">Market Cluster Deep Dive</h3>
        <button className="text-surface-tint text-xs font-bold flex items-center gap-2 uppercase tracking-widest hover:bg-surface-tint/10 px-3 py-1.5 rounded-lg transition-colors">
          Configure Columns <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Market Region</th>
              <th className="px-6 py-4">Current ZHVI</th>
              <th className="px-6 py-4">YoY Change</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4">Sales Performance</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface">
            {growthData.length > 0 ? growthData.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface-container/60 transition-colors border-b border-outline-variant/5 group">
                <td className="px-6 py-5 font-semibold text-on-surface">{row.region}</td>
                <td className="px-6 py-5 headline-font font-medium">${Math.round(row.value).toLocaleString()}</td>
                <td className={cn(
                  "px-6 py-5 font-bold",
                  (row.yoyGrowth || 0) >= 0 ? "text-surface-tint" : "text-error"
                )}>
                  {(row.yoyGrowth || 0) >= 0 ? "+" : ""}{row.yoyGrowth?.toFixed(1)}%
                </td>
                <td className="px-6 py-5 text-on-surface-variant font-medium">{row.state || "—"}</td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
                    (row.yoyGrowth || 0) > 10
                      ? "bg-surface-tint/10 text-surface-tint border-surface-tint/20" 
                      : "bg-muted/20 text-on-surface-variant border-border/30"
                  )}>
                    {(row.yoyGrowth || 0) > 10 ? "Hot Market" : "Stable Area"}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant opacity-40">
                  No data points available in the current context.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 flex justify-center bg-surface-container/10 border-t border-outline-variant/5">
          <button className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] hover:text-surface-tint transition-colors">
              View All Market Clusters
          </button>
      </div>
    </div>
  );
};
