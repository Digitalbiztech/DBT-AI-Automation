import React from 'react';
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
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

// Mock data constants for fallback
const ratioDataMock = [
  { month: 'Jan', ratio: 98.5 },
  { month: 'Feb', ratio: 99.2 },
  { month: 'Mar', ratio: 102.1 },
  { month: 'Apr', ratio: 101.5 },
  { month: 'May', ratio: 101.2 },
  { month: 'Jun', ratio: 99.8 },
  { month: 'Jul', ratio: 99.5 },
  { month: 'Aug', ratio: 102.8 },
  { month: 'Sep', ratio: 103.2 },
  { month: 'Oct', ratio: 100.5 },
  { month: 'Nov', ratio: 101.8 },
  { month: 'Dec', ratio: 101.5 },
];

const inventoryDataMock = [
  { month: 'Jan', newListings: 150, pendingSales: 120 },
  { month: 'Feb', newListings: 450, pendingSales: 280 },
  { month: 'Mar', newListings: 380, pendingSales: 320 },
  { month: 'Apr', newListings: 480, pendingSales: 410 },
  { month: 'May', newListings: 520, pendingSales: 450 },
  { month: 'Jun', newListings: 210, pendingSales: 380 },
  { month: 'Jul', newListings: 180, pendingSales: 340 },
  { month: 'Aug', newListings: 380, pendingSales: 420 },
  { month: 'Sep', newListings: 420, pendingSales: 390 },
  { month: 'Oct', newListings: 390, pendingSales: 350 },
  { month: 'Nov', newListings: 250, pendingSales: 210 },
  { month: 'Dec', newListings: 50, pendingSales: 40 },
];


const daysOnMarketData = [
  { month: 'Jan', days: 15 },
  { month: 'Feb', days: 18 },
  { month: 'Mar', days: 22 },
  { month: 'Apr', days: 25 },
  { month: 'May', days: 20 },
  { month: 'Jun', days: 18 },
  { month: 'Jul', days: 22 },
  { month: 'Aug', days: 25 },
  { month: 'Sep', days: 28 },
  { month: 'Oct', days: 30 },
  { month: 'Nov', days: 32 },
  { month: 'Dec', days: 35 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-sm font-bold text-on-surface">
              {entry.name}: <span className="text-primary">{entry.value}</span>
              {entry.unit || ''}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MarketHealthCharts: React.FC = () => {
  const { filteredRows, selectedRegion, selectedState, selectedCity, selectedZip } = useData();

  // Determine grouping dimension for comparison
  const groupingKey = React.useMemo(() => {
    if (selectedRegion.length > 1) return 'region';
    if (selectedState.length > 1) return 'state';
    if (selectedCity.length > 1) return 'city';
    if (selectedZip.length > 1) return 'zip';
    return null;
  }, [selectedRegion, selectedState, selectedCity, selectedZip]);

  const seriesKeys = React.useMemo(() => {
    if (!groupingKey) return ['National'];
    if (groupingKey === 'region') return selectedRegion;
    if (groupingKey === 'state') return selectedState;
    if (groupingKey === 'city') return selectedCity;
    if (groupingKey === 'zip') return selectedZip;
    return ['National'];
  }, [groupingKey, selectedRegion, selectedState, selectedCity, selectedZip]);

  const colors = ["#D0BCFF", "#006A6A", "#381E72", "#BA1A1A", "#6366F1", "#F59E0B", "#10B981", "#EC4899"];

  // Aggregate data by month and grouping key
  const aggregatedData = React.useMemo(() => {
    const byMonthGroup = new Map<string, Map<string, {
      salesCount: number;
      salePrice: number;
      priceCount: number;
      transactionValue: number;
      saleToListRatio: number;
      ratioCount: number;
      aboveListPct: number;
    }>>();

    filteredRows.forEach(r => {
      const month = r.date.slice(0, 7);
      const group = groupingKey ? r[groupingKey as keyof typeof r] as string : 'National';
      if (!group) return;

      if (!byMonthGroup.has(month)) byMonthGroup.set(month, new Map());
      const groupsInMonth = byMonthGroup.get(month)!;
      
      if (!groupsInMonth.has(group)) {
        groupsInMonth.set(group, {
          salesCount: 0, salePrice: 0, priceCount: 0,
          transactionValue: 0, saleToListRatio: 0, ratioCount: 0, aboveListPct: 0
        });
      }
      
      const entry = groupsInMonth.get(group)!;
      if (r.metric === 'Sales Count') entry.salesCount += r.value;
      if (r.metric === 'Median Sale Price') { entry.salePrice += r.value; entry.priceCount++; }
      if (r.metric === 'Total Trans. Value') entry.transactionValue += r.value;
      if (r.metric === 'Sale-to-List Ratio') { entry.saleToListRatio += r.value; entry.ratioCount++; }
      if (r.metric === 'Sold Above List %') entry.aboveListPct += r.value;
    });

    const months = Array.from(byMonthGroup.keys()).sort();
    return months.map(month => {
      const groupsInMonth = byMonthGroup.get(month)!;
      const row: any = { month };
      seriesKeys.forEach(group => {
        const entry = groupsInMonth.get(group);
        if (entry) {
          row[`salesCount_${group}`] = entry.salesCount;
          row[`salePrice_${group}`] = entry.priceCount > 0 ? entry.salePrice / entry.priceCount : 0;
          row[`transactionValue_${group}`] = entry.transactionValue;
          row[`saleToListRatio_${group}`] = entry.ratioCount > 0 ? entry.saleToListRatio / entry.ratioCount : 0;
          row[`aboveListPct_${group}`] = entry.aboveListPct;
        }
      });
      return row;
    });
  }, [filteredRows, groupingKey, seriesKeys]);

  const latest = aggregatedData[aggregatedData.length - 1] || {};
  
  // Calculate aggregated "latest" values across all selected series for the badges
  const summary = React.useMemo(() => {
    let salesCount = 0;
    let salePrice = 0;
    let transactionValue = 0;
    let saleToListRatio = 0;
    let aboveListPct = 0;
    let count = 0;

    seriesKeys.forEach(key => {
      if (latest[`salesCount_${key}`] !== undefined) {
        salesCount += latest[`salesCount_${key}`];
        salePrice += latest[`salePrice_${key}`];
        transactionValue += latest[`transactionValue_${key}`];
        saleToListRatio += latest[`saleToListRatio_${key}`];
        aboveListPct += latest[`aboveListPct_${key}`];
        count++;
      }
    });

    if (count > 1 && (groupingKey === 'state' || groupingKey === 'region')) {
      // For prices and ratios, take average across groups if multiple selected
      salePrice /= count;
      saleToListRatio /= count;
      aboveListPct /= count;
    }

    return { salesCount, salePrice, transactionValue, saleToListRatio, aboveListPct };
  }, [latest, seriesKeys, groupingKey]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Sales Count (Nowcast) */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative group">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Sales Count (Nowcast)</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-tight max-w-[200px]">
              Estimated unique properties sold, accounting for reporting latency.
            </p>
          </div>
          <div className="px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-bold text-primary">{summary.salesCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aggregatedData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              {seriesKeys.map((key, i) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={`salesCount_${key}`} 
                  stroke={colors[i % colors.length]} 
                  fill={colors[i % colors.length]} 
                  fillOpacity={0.1} 
                  strokeWidth={3} 
                  name={key} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sale Price */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative group">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Sale Price (Median)</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-tight max-w-[200px]">
              The price at which homes across geographies were sold.
            </p>
          </div>
          <div className="px-3 py-1 bg-secondary/10 rounded-full">
            <span className="text-xs font-bold text-secondary">${(summary.salePrice / 1000).toFixed(0)}k</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                domain={['auto', 'auto']} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              {seriesKeys.map((key, i) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={`salePrice_${key}`} 
                  stroke={colors[i % colors.length]} 
                  strokeWidth={3} 
                  dot={false} 
                  name={key} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Total Transaction Value */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative group">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Total Transaction Value</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-tight max-w-[200px]">
              Total dollar value of all homes sold (Mean Price x Sales Count).
            </p>
          </div>
          <div className="px-3 py-1 bg-tertiary/10 rounded-full">
            <span className="text-xs font-bold text-tertiary">${(summary.transactionValue / 1000000).toFixed(1)}M</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aggregatedData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              {seriesKeys.map((key, i) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={`transactionValue_${key}`} 
                  stroke={colors[i % colors.length]} 
                  fill={colors[i % colors.length]} 
                  fillOpacity={0.1} 
                  strokeWidth={3} 
                  name={key} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sale-to-List Ratio */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative group">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Sale-to-List Ratio</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-tight max-w-[200px]">
              Ratio of sale vs. final list price (Mean/Median).
            </p>
          </div>
          <div className="px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-bold text-primary">{summary.saleToListRatio.toFixed(1)}%</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregatedData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                domain={['auto', 'auto']} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              {seriesKeys.map((key, i) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={`saleToListRatio_${key}`} 
                  stroke={colors[i % colors.length]} 
                  strokeWidth={3} 
                  dot={false} 
                  name={key} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Percent of Sales Below/Above List */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative group md:col-span-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Sales Above List %</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-tight max-w-[200px]">
              Share of sales where sale price was above the final list price.
            </p>
          </div>
          <div className="px-3 py-1 bg-error/10 rounded-full">
            <span className="text-xs font-bold text-error">{summary.aboveListPct.toFixed(1)}%</span>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aggregatedData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              {seriesKeys.map((key, i) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={`aboveListPct_${key}`} 
                  stroke={colors[i % colors.length]} 
                  fill={colors[i % colors.length]} 
                  fillOpacity={0.1} 
                  strokeWidth={3} 
                  name={key} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

