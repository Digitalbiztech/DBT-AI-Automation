import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { matchesState } from '@/lib/dataNormalization';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{data.subject}</p>
        <p className="text-lg font-black text-primary">
          {data.growth.toFixed(1)}% <span className="text-[10px] text-on-surface-variant font-normal uppercase tracking-tighter">YoY Growth</span>
        </p>
        <p className="text-xs text-on-surface-variant/60 font-medium">
          Typical: ${Math.round(data.value / 1000)}k
        </p>
      </div>
    );
  }
  return null;
};

export const BedroomAffinityRadar: React.FC = () => {
  const { allRows, selectedState, selectedCity, selectedZip } = useData();

  const radarData = useMemo(() => {
    const brMetrics = ['1BR', '2BR', '3BR', '4BR', '5BR'];
    const results = [];

    for (const metric of brMetrics) {
      let rows = allRows.filter(r => r.metric === metric);
      
      rows = rows.filter(r => matchesState(r.state, selectedState));
      if (selectedCity.length > 0) rows = rows.filter(r => selectedCity.includes(r.city));
      if (selectedZip.length > 0) rows = rows.filter(r => selectedZip.includes(r.zip));
      
      rows = rows.sort((a, b) => a.date.localeCompare(b.date));
      if (rows.length < 13) continue;

      const latest = rows[rows.length - 1];
      const latestDate = new Date(latest.date);
      const yearAgoDate = new Date(latestDate.setFullYear(latestDate.getFullYear() - 1)).toISOString().split('T')[0];
      
      const yearAgo = rows.reduce((prev, curr) => {
        return (Math.abs(new Date(curr.date).getTime() - new Date(yearAgoDate).getTime()) < 
                Math.abs(new Date(prev.date).getTime() - new Date(yearAgoDate).getTime()) ? curr : prev);
      });

      if (latest && yearAgo && yearAgo.value > 0) {
        const growth = ((latest.value - yearAgo.value) / yearAgo.value) * 100;
        results.push({
          subject: metric,
          growth: growth,
          value: latest.value
        });
      }
    }

    return results;
  }, [allRows, selectedState, selectedCity, selectedZip]);

  if (radarData.length === 0) return null;

  return (
    <Card className="bg-surface-container/30 backdrop-blur-md border-outline-variant/10 rounded-3xl overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-black headline-font tracking-tight text-on-surface">
          Bedroom Affinity
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-secondary opacity-70">
          YoY Appreciation by Unit Capacity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[350px] p-0 overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="54%" outerRadius="62%" data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 900 }} 
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={['auto', 'auto']} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
            />
            <Radar
              name="Growth %"
              dataKey="growth"
              stroke="#FFA000"
              fill="#FFA000"
              fillOpacity={0.5}
              strokeWidth={3}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
