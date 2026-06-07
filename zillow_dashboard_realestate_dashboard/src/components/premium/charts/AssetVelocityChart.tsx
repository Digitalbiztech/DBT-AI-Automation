import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { getChartData, type RealEstateRow } from '@/lib/dataProcessing';
import { matchesState } from '@/lib/dataNormalization';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-sm font-bold text-on-surface">
              {entry.name}: <span className="text-primary font-black">
                ${entry.value.toLocaleString()}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AssetVelocityChart: React.FC = () => {
  const { allRows, selectedState, selectedCity, selectedZip } = useData();

  const chartData = useMemo(() => {
    // Filter for SFH and Condo metrics
    let sfhRows = allRows.filter(r => r.metric === 'SFH');
    let condoRows = allRows.filter(r => r.metric === 'Condo');

    // Apply geographic filters if active with normalization
    sfhRows = sfhRows.filter(r => matchesState(r.state, selectedState));
    condoRows = condoRows.filter(r => matchesState(r.state, selectedState));

    if (selectedCity.length > 0) {
      sfhRows = sfhRows.filter(r => selectedCity.includes(r.city));
      condoRows = condoRows.filter(r => selectedCity.includes(r.city));
    }
    
    if (selectedZip.length > 0) {
      sfhRows = sfhRows.filter(r => selectedZip.includes(r.zip));
      condoRows = condoRows.filter(r => selectedZip.includes(r.zip));
    }

    if (sfhRows.length === 0 || condoRows.length === 0) return [];
    
    const dates = Array.from(new Set([...sfhRows, ...condoRows].map(r => r.date))).sort();
    
    return dates.map(date => {
      const sfhVals = sfhRows.filter(r => r.date === date).map(r => r.value);
      const condoVals = condoRows.filter(r => r.date === date).map(r => r.value);
      
      const sfhAvg = sfhVals.length > 0 ? sfhVals.reduce((a, b) => a + b, 0) / sfhVals.length : null;
      const condoAvg = condoVals.length > 0 ? condoVals.reduce((a, b) => a + b, 0) / condoVals.length : null;
      
      return {
        date,
        'Single Family': sfhAvg,
        'Condo': condoAvg
      };
    }).filter(d => d['Single Family'] !== null || d['Condo'] !== null);
  }, [allRows, selectedState, selectedCity, selectedZip]);

  if (chartData.length === 0) return (
    <Card className="bg-surface-container/30 backdrop-blur-md border-outline-variant/10 rounded-3xl h-[400px] flex items-center justify-center">
      <p className="text-on-surface-variant font-medium">Select a region to see asset velocity</p>
    </Card>
  );

  return (
    <Card className="bg-surface-container/30 backdrop-blur-md border-outline-variant/10 rounded-3xl overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black headline-font tracking-tight text-on-surface">
              Asset Class Velocity
            </CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-70">
              Single Family vs. Condominium Performance
            </CardDescription>
          </div>
          <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
             <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Market Spread Analysis</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSFH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E676" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCondo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2979FF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                minTickGap={40}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }} />
              <Area
                type="monotone"
                dataKey="Single Family"
                stroke="#00E676"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSFH)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Condo"
                stroke="#2979FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCondo)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
