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
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from 'recharts';
import { Card } from '@/components/ui/card';

// Mock data for ROI Fan Chart
const roiData = [
  { year: '2024', base: 5, range95: [5, 5], range50: [5, 5] },
  { year: '2025', base: 7, range95: [4, 10], range50: [6, 8] },
  { year: '2026', base: 9, range95: [3, 15], range50: [7, 11] },
  { year: '2027', base: 11, range95: [2, 20], range50: [8, 14] },
  { year: '2028', base: 13, range95: [1, 25], range50: [9, 17] },
  { year: '2029', base: 15, range95: [0, 30], range50: [10, 20] },
];

// Mock data for GRM Bubble Chart
const grmData = [
  { name: 'Downtown Core', price: 120, grm: 8.5, size: 400, color: '#006A6A' },
  { name: 'Suburban Heights', price: 350, grm: 10.2, size: 600, color: '#C9C7BA' },
  { name: 'Westside Mix', price: 480, grm: 9.8, size: 300, color: '#FFB4AB' },
  { name: 'Eastside Industrial', price: 580, grm: 14.1, size: 800, color: '#D0BCFF' },
];

// Mock data for Cash Flow Waterfall
const waterfallData = [
  { name: 'Rental Income', value: 4500, display: '+4500', fill: '#006A6A' },
  { name: 'Mortgage', value: -1600, display: '-1600', fill: '#FFB4AB' },
  { name: 'Property Tax', value: -400, display: '-400', fill: '#FFB4AB' },
  { name: 'Insurance', value: -150, display: '-150', fill: '#FFB4AB' },
  { name: 'Maintenance', value: -250, display: '-250', fill: '#FFB4AB' },
  { name: 'Management Fee', value: -180, display: '-180', fill: '#FFB4AB' },
  { name: 'Net Cash Flow', value: 1720, display: '+1720', fill: '#D0BCFF', isTotal: true },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <p className="text-sm font-bold text-on-surface">
              {entry.name}: <span className="text-primary">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const InvestmentPerformanceCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Projected ROI (Fan Chart) */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Projected ROI (Fan Chart)</h3>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest">Yield Multi-Path Analysis</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roiData}>
              <defs>
                <linearGradient id="color95" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006A6A" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#006A6A" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="color50" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006A6A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#006A6A" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="range95" 
                stroke="transparent" 
                fill="url(#color95)" 
                name="95% Confidence" 
              />
              <Area 
                type="monotone" 
                dataKey="range50" 
                stroke="transparent" 
                fill="url(#color50)" 
                name="50% Confidence" 
              />
              <Line 
                type="monotone" 
                dataKey="base" 
                stroke="#006A6A" 
                strokeWidth={3} 
                dot={{ fill: '#006A6A', r: 4 }} 
                name="Projected ROI"
                unit="%"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gross Rent Multiplier (Bubble Chart) */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative">
        <h3 className="text-lg font-bold text-on-surface mb-1">Gross Rent Multiplier (GRM)</h3>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-6">Price vs Revenue Efficiency</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="price" 
                name="Price" 
                unit="$k" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis 
                type="number" 
                dataKey="grm" 
                name="GRM" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <ZAxis type="number" dataKey="size" range={[100, 1000]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter name="Regions" data={grmData}>
                {grmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} stroke={entry.color} strokeWidth={2} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Cash Flow Waterfall Chart */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative">
        <h3 className="text-lg font-bold text-on-surface mb-1">Cash Flow Waterfall</h3>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-6">Sample Property Unit Economics</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8 }}
              />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="display" position="top" style={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Property Appreciation Forecast */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative">
        <h3 className="text-lg font-bold text-on-surface mb-1">Property Appreciation Forecast</h3>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-6">AI Predictive Modeling</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
                { year: '2020', val: 650 },
                { year: '2021', val: 720 },
                { year: '2022', val: 810 },
                { year: '2023', val: 890 },
                { year: '2024', val: 950, opt: 950, real: 950, cons: 950 },
                { year: '2025', opt: 1100, real: 1020, cons: 980 },
                { year: '2026', opt: 1250, real: 1150, cons: 1020 },
                { year: '2027', opt: 1450, real: 1300, cons: 1080 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="val" stroke="#D0BCFF" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="opt" stroke="#006A6A" strokeWidth={2} strokeDasharray="5 5" name="Optimistic" />
              <Line type="monotone" dataKey="real" stroke="#C9C7BA" strokeWidth={2} strokeDasharray="5 5" name="Realistic" />
              <Line type="monotone" dataKey="cons" stroke="#FFB4AB" strokeWidth={2} strokeDasharray="5 5" name="Conservative" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
