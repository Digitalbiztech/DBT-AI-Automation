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
  BarChart,
  Bar,
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
                {entry.value >= 1000000 ? `${(entry.value / 1000000).toFixed(2)}M` : 
                 entry.value >= 1000 ? entry.value.toLocaleString() : entry.value}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard: React.FC<{ title: string; subtitle: string; metric: string; data: any[]; regions: string[]; isCurrency?: boolean }> = React.memo(({ title, subtitle, metric, data, regions, isCurrency }) => (
  <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-bold text-on-surface mb-1">{title}</h3>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
          {regions.map((region, index) => (
            <Line
              key={region}
              type="monotone"
              dataKey={region}
              stroke={`hsl(${index * 137.5 % 360}, 70%, 70%)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
));

export const MarketDetailedMetrics: React.FC = () => {
  const { allRows, filteredRows } = useData();

  const groupedData = useMemo(() => {
    const groups: Record<string, RealEstateRow[]> = {};
    for (const row of filteredRows) {

      if (!row.metric) continue;
      if (!groups[row.metric]) groups[row.metric] = [];
      groups[row.metric].push(row);
    }
    return groups;
  }, [allRows]);

  const renderSection = (title: string, metrics: string[]) => {
    const available = metrics.filter(m => groupedData[m]);
    if (available.length === 0) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] whitespace-nowrap">{title}</h2>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {available.map(metric => {
            const metricRows = groupedData[metric];
            const topRegions = getTopRegions(metricRows, 3);
            const finalRegions = metricRows.some(r => r.region === 'United States')
              ? (topRegions.includes('United States') ? topRegions : ['United States', ...topRegions.slice(0, 2)])
              : topRegions;

            return (
              <MetricCard 
                key={metric}
                title={metric}
                subtitle="Regional High-Res Performance"
                metric={metric}
                data={getChartData(metricRows, 'home_value')}
                regions={finalRegions}
                isCurrency={metric.includes('Price') || metric.includes('Value')}
              />
            );
          })}
        </div>

      </div>
    );
  };

  if (allRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-surface-container/10 border border-dashed border-outline-variant/20 rounded-3xl">
        <p className="text-on-surface-variant font-medium">Please load integrated data to view detailed metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-12">
      {renderSection("For-Sale Listings Data", ["Inventory", "New Listings", "Pending Listings", "Median List Price"])}
      {renderSection("Sales Performance Data", ["Sales Count", "Median Sale Price", "Total Trans. Value", "Sale-to-List Ratio", "Sold Above List %"])}
      {renderSection("Market Intelligence", ["Market Temp", "Forecast"])}
    </div>
  );
};
