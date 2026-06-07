import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { TrendingUp, Target, Calendar } from 'lucide-react';

const COLORS = ['#006A6A', '#D0BCFF', '#381E72', '#4A4940', '#BAC3FF', '#775652'];

export const ForecastCharts: React.FC = () => {
  const { filteredRows } = useData();

  const { chartData, regions, stats } = useMemo(() => {
    // Filter for forecast metrics
    const forecastRows = filteredRows.filter(r => r.metric === 'Forecast Growth');
    
    if (forecastRows.length === 0) return { chartData: [], regions: [], stats: [] };

    // Group by date
    const dateMap = new Map<string, any>();
    const regionSet = new Set<string>();

    forecastRows.forEach(row => {
      const date = row.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      const entry = dateMap.get(date)!;
      entry[row.region] = row.value;
      regionSet.add(row.region);
    });

    const sortedData = Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const sortedRegions = Array.from(regionSet).sort();
    const displayRegions = sortedRegions.slice(0, 10); // Show up to 10
    
    // Calculate stats for the summary cards
    const latestDate = sortedData[sortedData.length - 1]?.date;
    const latestStats = displayRegions.slice(0, 3).map(region => {
      const val = forecastRows.find(r => r.region === region && r.date === latestDate)?.value || 0;
      return { region, value: val };
    });

    return { 
      chartData: sortedData, 
      regions: displayRegions,
      stats: latestStats
    };
  }, [filteredRows]);

  if (chartData.length === 0) {
    return (
      <Card className="p-12 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl flex flex-col items-center justify-center text-center">
        <Target className="h-12 w-12 text-on-surface-variant/20 mb-4" />
        <p className="text-sm font-bold text-on-surface uppercase tracking-widest">No Forecast Data for Selection</p>
        <p className="text-xs text-on-surface-variant mt-2 max-w-xs">Adjust your filters or try selecting a broad region like 'United States' or a major Metro area.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="p-8 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <TrendingUp className="w-32 h-32 text-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-1.5 bg-primary/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
               </div>
               <h3 className="text-xl font-bold text-on-surface headline-font">Market Appreciation Forecast</h3>
            </div>
            <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-medium leading-relaxed">
               Predictive growth modeling across selected regions
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-surface-container-high/50 px-4 py-2 rounded-xl border border-outline-variant/10">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tracking</span>
                <span className="text-sm font-black text-primary">{regions.length} Regions</span>
             </div>
             <div className="w-px h-8 bg-outline-variant/20" />
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Horizon</span>
                <span className="text-sm font-black text-on-surface">12 Months</span>
             </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {regions.map((region, i) => (
                  <linearGradient key={`grad-${region}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                dy={15}
                tickFormatter={(val) => {
                   const d = new Date(val);
                   return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                unit="%"
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 18, 24, 0.95)', 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  padding: '16px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold', padding: '2px 0' }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '8px' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
              />
              <Legend 
                verticalAlign="top" 
                height={60}
                iconType="circle"
                wrapperStyle={{ paddingTop: '0px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}
              />
              {regions.map((region, i) => (
                <Area
                  key={region}
                  type="monotone"
                  dataKey={region}
                  stroke={COLORS[i % COLORS.length]}
                  fillOpacity={1}
                  fill={`url(#grad-${i})`}
                  strokeWidth={4}
                  strokeLinecap="round"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <Card key={item.region} className="group p-6 bg-surface-container/20 hover:bg-surface-container/40 transition-all border-outline-variant/10 rounded-3xl flex flex-col items-start relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-2 h-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-tertiary'} opacity-50`} />
            <div className="flex items-center gap-2 mb-3 bg-white/5 px-2 py-1 rounded-lg">
               <Calendar className="w-3 h-3 text-on-surface-variant" />
               <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{item.region}</span>
            </div>
            <div className="flex items-end gap-2">
               <p className={`text-4xl font-black headline-font ${item.value >= 0 ? 'text-on-surface' : 'text-red-400'}`}>
                 {item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%
               </p>
               <span className="text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-widest opacity-50">Est. Growth</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
               <div className={`w-8 h-1 rounded-full ${item.value >= 0 ? 'bg-primary' : 'bg-red-400'}`} />
               <p className="text-[9px] text-on-surface-variant font-medium italic">Projected Year-End Appreciation</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
