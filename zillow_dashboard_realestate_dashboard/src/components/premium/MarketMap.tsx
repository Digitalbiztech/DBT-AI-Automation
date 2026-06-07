import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { USStateMap, MapData } from "./USStateMap";
import { Loader2, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/contexts/DataContext";
import { getStateCode } from "@/lib/dataNormalization";

const MARKET_METRICS = [
  { id: "Sales Count", label: "Sales Count", unit: "", isCurrency: false },
  { id: "Median Sale Price", label: "Median Sale Price", unit: "$", isCurrency: true },
  { id: "Total Trans. Value", label: "Total Trans. Value", unit: "$", isCurrency: true },
  { id: "ZHVI", label: "ZHVI Index", unit: "$", isCurrency: true },
  { id: "Sale-to-List Ratio", label: "Sale-to-List Ratio", unit: "", isCurrency: false, isPercent: false },
  { id: "Sold Above List %", label: "Sold Above List %", unit: "%", isCurrency: false, isPercent: true },
  { id: "Forecast Growth", label: "12-Month Forecast", unit: "%", isCurrency: false, isPercent: true },
];

interface MarketMapProps {
  type?: "sales" | "forecast";
  mode?: "sales" | "zhvi";
  defaultMetric?: string;
  title?: string;
  independent?: boolean;
}

export const MarketMap: React.FC<MarketMapProps> = ({ 
  type = "sales", 
  mode = "sales",
  defaultMetric,
  title = "Market Performance Heatmap"
}) => {
  const { filteredRows } = useData();
  const rowsToUse = filteredRows;
  
  const availableMetrics = React.useMemo(() => {
    if (type === "forecast") return MARKET_METRICS.filter(m => m.id === "Forecast Growth");
    
    if (mode === "zhvi") {
      return MARKET_METRICS.filter(m => m.id === "ZHVI");
    }
    
    // mode === "sales"
    return MARKET_METRICS.filter(m => m.id !== "Forecast Growth" && m.id !== "ZHVI");
  }, [type, mode]);

  const [selectedMetric, setSelectedMetric] = useState(defaultMetric || availableMetrics[0].id);
  
  const metricConfig = MARKET_METRICS.find(m => m.id === selectedMetric) || availableMetrics[0];

  const { mapData, stats } = React.useMemo(() => {
    // Filter rows for the selected metric
    const metricRows = rowsToUse.filter(r => r.metric === selectedMetric);
    
    if (metricRows.length === 0) return { mapData: [], stats: { avg: 0, highState: "", lowState: "", count: 0 } };

    const stateValueMap = new Map<string, { value: number; count: number; name: string }>();
    
    metricRows.forEach(row => {
      if (!row.state) return;
      const stateId = getStateCode(row.state);
      if (!stateValueMap.has(stateId)) {
        stateValueMap.set(stateId, { value: 0, count: 0, name: stateId });
      }
      const entry = stateValueMap.get(stateId)!;
      entry.value += row.value;
      entry.count++;
    });

    const processedData: MapData[] = [];
    let totalVal = 0;
    let maxVal = -Infinity;
    let minVal = Infinity;
    let maxState = "N/A";
    let minState = "N/A";

    stateValueMap.forEach((entry, stateId) => {
      const avgValue = entry.value / entry.count;
      processedData.push({
        stateId,
        value: avgValue,
        color: "", // Fill below
        label: entry.name
      });

      totalVal += avgValue;
      if (avgValue > maxVal) { maxVal = avgValue; maxState = entry.name; }
      if (avgValue < minVal) { minVal = avgValue; minState = entry.name; }
    });

    // Apply color scale based on intensity
    const finalData = processedData.map(d => {
      const intensity = maxVal === minVal ? 0.5 : (d.value - minVal) / (maxVal - minVal);
      // Indigo-based scale for a premium look
      const color = intensity < 0.2 ? `rgba(99, 102, 241, 0.15)` :
                    intensity < 0.4 ? `rgba(99, 102, 241, 0.3)` :
                    intensity < 0.6 ? `rgba(99, 102, 241, 0.5)` :
                    intensity < 0.8 ? `rgba(99, 102, 241, 0.7)` :
                    `rgba(99, 102, 241, 0.95)`;
      return { ...d, color };
    });

    return {
      mapData: finalData,
      stats: {
        avg: totalVal / (processedData.length || 1),
        highState: maxState,
        lowState: minState,
        count: metricRows.length
      }
    };
  }, [filteredRows, selectedMetric]);

  const formatValue = (val: number) => {
    if (metricConfig.isCurrency) {
      if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
      return `$${val.toLocaleString()}`;
    }
    if (metricConfig.id.includes("Ratio")) return val.toFixed(3);
    return val.toLocaleString(undefined, { maximumFractionDigits: 1 }) + (metricConfig.unit || "");
  };

  const isCurrency = metricConfig.isCurrency;

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col border border-outline-variant/5 shadow-2xl h-full min-h-[650px]">
      <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold headline-font text-on-surface">{title}</h3>
          <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Regional Distribution for {selectedMetric}
          </p>
        </div>
        
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-auto">
          <TabsList className="bg-surface-container-high/50 p-1 rounded-xl h-11 border border-outline-variant/10">
            {availableMetrics.map(m => (
              <TabsTrigger 
                key={m.id} 
                value={m.id}
                className="text-[10px] font-bold uppercase tracking-widest px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-on-primary"
              >
                {m.label.replace("Sale ", "").replace("Total ", "").replace(" (Nowcast)", "").replace(" Growth", "")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="relative flex-1 bg-[#0a0c10] flex flex-col">
        {mapData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">Synching Geo-Data</p>
          </div>
        ) : (
          <div className="p-6 flex-1 flex flex-col">
            <USStateMap data={mapData} formatValue={formatValue} />
            
            {/* Quick Analytics Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="p-5 bg-surface-container-high/40 backdrop-blur-md rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 flex items-center gap-2">
                  {selectedMetric.includes("Ratio") ? "Global Avg" : "National Median"}
                  <Info className="w-3 h-3 text-on-surface-variant/50" />
                </p>
                <p className="text-2xl font-black text-on-surface">{formatValue(stats.avg)}</p>
              </div>
              <div className="p-5 bg-surface-container-high/40 backdrop-blur-md rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Peak Market</p>
                <p className="text-2xl font-black text-primary truncate" title={stats.highState}>{stats.highState}</p>
              </div>
              <div className="p-5 bg-surface-container-high/40 backdrop-blur-md rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Entry Opportunity</p>
                <p className="text-2xl font-black text-secondary truncate" title={stats.lowState}>{stats.lowState}</p>
              </div>
              <div className="p-5 bg-surface-container-high/40 backdrop-blur-md rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Data Points</p>
                <p className="text-2xl font-black text-on-surface-variant">{stats.count.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-surface-container-high/20 border-t border-outline-variant/5 flex justify-between items-center px-8">
        <p className="text-[10px] text-on-surface-variant italic">
          Hover over individual states for regional deep-dive and localized metrics.
        </p>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-500/20" />
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">Lighter</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">Intense</span>
           </div>
        </div>
      </div>
    </div>
  );
};
