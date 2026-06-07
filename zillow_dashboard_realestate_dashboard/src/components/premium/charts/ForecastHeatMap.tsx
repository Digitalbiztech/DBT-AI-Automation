import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { LayoutGrid, TrendingUp, Info } from 'lucide-react';

export const ForecastHeatMap: React.FC = () => {
  const { filteredRows } = useData();

  const regions = useMemo(() => {
    // Filter for forecast metrics
    const forecastRows = filteredRows.filter(r => r.metric === 'Forecast Growth');
    
    // Group by region and get the latest forecast (usually 12-month)
    const latestDate = [...new Set(forecastRows.map(r => r.date))].sort().pop();
    
    if (!latestDate) return [];

    const latestForecasts = forecastRows.filter(r => r.date === latestDate);
    
    return latestForecasts
      .map(r => ({
        name: r.region,
        value: r.value,
        state: r.state,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 48); // Top 48 metros
  }, [filteredRows]);

  const getHeatColor = (value: number) => {
    if (value > 2.5) return 'bg-emerald-500/80 text-emerald-950 ring-emerald-400/50';
    if (value > 1.5) return 'bg-emerald-400/60 text-emerald-950 ring-emerald-300/40';
    if (value > 0.5) return 'bg-emerald-300/40 text-emerald-900 ring-emerald-200/30';
    if (value > -0.5) return 'bg-amber-300/40 text-amber-900 ring-amber-200/30';
    if (value > -1.5) return 'bg-orange-400/60 text-orange-950 ring-orange-300/40';
    return 'bg-red-500/80 text-red-950 ring-red-400/50';
  };

  if (regions.length === 0) return null;

  return (
    <Card className="p-8 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-1.5 bg-secondary/20 rounded-lg">
                <LayoutGrid className="h-4 w-4 text-secondary" />
             </div>
             <h3 className="text-xl font-bold text-on-surface headline-font">Market Growth Intensity</h3>
          </div>
          <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-medium leading-relaxed">
             1-Year Appreciation Forecast by Metro
          </p>
        </div>
        
        <div className="flex gap-4 items-center bg-surface-container-high/50 p-2 px-4 rounded-2xl border border-outline-variant/10">
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Expansion</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Correction</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {regions.map((region, i) => (
          <div 
            key={region.name}
            className={`p-4 rounded-2xl ring-1 transition-all duration-500 hover:scale-[1.08] hover:z-10 hover:shadow-2xl cursor-default flex flex-col justify-between h-28 group relative overflow-hidden ${getHeatColor(region.value)}`}
            title={`${region.name}: ${region.value}%`}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp className="w-16 h-16" />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60 truncate pr-2">{region.name.split(',')[0]}</span>
              <span className="text-[10px] font-bold bg-black/5 px-1.5 rounded uppercase">{region.state}</span>
            </div>
            <div className="mt-auto relative z-10">
               <span className="text-2xl font-black tracking-tighter leading-none">{region.value > 0 ? '+' : ''}{region.value.toFixed(1)}%</span>
               <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-current opacity-60 rounded-full" 
                    style={{ width: `${Math.min(Math.abs(region.value) * 20, 100)}%` }} 
                  />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-surface-container-high/40 rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-xl mt-1">
               <Info className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface uppercase tracking-widest block mb-1">Forecast Intelligence</span>
              Current modeling suggests high growth intensity in stable Midwest metros, while high-velocity coastal markets are entering a consolidation phase.
            </p>
         </div>
         <button className="whitespace-nowrap px-6 py-3 bg-primary text-on-primary rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform active:scale-95">
           Deep Dive Analytics
         </button>
      </div>
    </Card>
  );
};
