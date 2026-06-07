import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { getChartData, getTopRegions, type RealEstateRow } from '@/lib/dataProcessing';


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-sm font-bold text-on-surface">
              {entry.name}: <span className="text-primary">
                {entry.value >= 1000 ? entry.value.toLocaleString() : entry.value}
              </span>
              {entry.unit || ''}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricSection: React.FC<{ metric: string; rows: RealEstateRow[]; allRows: RealEstateRow[] }> = React.memo(({ metric, rows, allRows }) => {
  const type = rows[0]?.type || 'home_value';
  const chartData = useMemo(() => getChartData(rows, type as any), [rows, type]);
  const topRegions = useMemo(() => getTopRegions(rows, 5), [rows]);
  
  return (
    <section key={metric} className="space-y-6">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-outline-variant/20" />
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{metric}</h2>
        <div className="h-px flex-1 bg-outline-variant/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Line Chart */}
        <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface mb-1">{metric} Velocity</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest">Historical Performance by Region</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                {topRegions.map((region, index) => (
                  <Line
                    key={region}
                    type="monotone"
                    dataKey={region}
                    stroke={`hsl(${index * 137.5 % 360}, 70%, 70%)`}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Composition/Bar Chart for recent state */}
        <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface mb-1">Regional Comparison</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest">Latest Data Snapshot</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-6)} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="date" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '9px' }} />
                {topRegions.slice(0, 3).map((region, index) => (
                  <Bar
                    key={region}
                    dataKey={region}
                    fill={`hsl(${index * 137.5 % 360}, 50%, 60%)`}
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
});

export const MarketTrendsCharts: React.FC = () => {
  const { allRows } = useData();

  const groupedData = useMemo(() => {
    const groups: Record<string, RealEstateRow[]> = {};
    for (const row of allRows) {
      if (!row.metric) continue;
      if (!groups[row.metric]) groups[row.metric] = [];
      groups[row.metric].push(row);
    }
    return groups;
  }, [allRows]);

  const availableMetrics = useMemo(() => Object.keys(groupedData), [groupedData]);

  if (allRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-surface-container/10 border border-dashed border-outline-variant/20 rounded-3xl">
        <p className="text-on-surface-variant font-medium">Please load dataset samples to view market trends</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {availableMetrics.map((metric) => (
        <MetricSection 
          key={metric} 
          metric={metric} 
          rows={groupedData[metric]} 
          allRows={allRows}
        />
      ))}
    </div>
  );
};

