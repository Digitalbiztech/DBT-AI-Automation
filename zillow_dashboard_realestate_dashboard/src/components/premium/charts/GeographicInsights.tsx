import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { GeographicAppreciationMap } from './GeographicAppreciationMap';

// Mock data for Top 10 Zip Codes
const zipCodeData = [
  { zip: '10011', value: 1200000, display: '$1.2M' },
  { zip: '90210', value: 950000, display: '$950K' },
  { zip: '60614', value: 875000, display: '$875K' },
  { zip: '02138', value: 675000, display: '$675K' },
  { zip: '30309', value: 560000, display: '$560K' },
  { zip: '33139', value: 450000, display: '$450K' },
  { zip: '75201', value: 380000, display: '$380K' },
  { zip: '94110', value: 345000, display: '$345K' },
  { zip: '98101', value: 310000, display: '$310K' },
  { zip: '20001', value: 290000, display: '$290K' },
].sort((a, b) => b.value - a.value);

// Mock data for Demographics
const demographicData = [
  { name: '<25', value: 10, fill: '#D0BCFF' },
  { name: '25-34', value: 20, fill: '#006A6A' },
  { name: '35-54', value: 45, fill: '#381E72' },
  { name: '55+', value: 25, fill: '#FFB4AB' },
];

// Mock data for Seasonality Radar
const seasonalityData = [
  { month: 'Jan', sales: 0.8 },
  { month: 'Feb', sales: 1.2 },
  { month: 'Mar', sales: 2.1 },
  { month: 'Apr', sales: 2.5 },
  { month: 'May', sales: 2.8 },
  { month: 'Jun', sales: 3.2 },
  { month: 'Jul', sales: 2.9 },
  { month: 'Aug', sales: 2.6 },
  { month: 'Sep', sales: 1.9 },
  { month: 'Oct', sales: 1.5 },
  { month: 'Nov', sales: 1.1 },
  { month: 'Dec', sales: 0.9 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label || payload[0].name}</p>
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

export const GeographicInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Dynamic Appreciation Map */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative md:col-span-2 shadow-2xl">
        <GeographicAppreciationMap />
      </Card>

      {/* Top 10 Zip Codes */}
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative">
        <h3 className="text-lg font-bold text-on-surface mb-1">Top 10 Zip Codes</h3>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-6">Valuation Leadership by Region</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={zipCodeData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#381E72" />
                  <stop offset="100%" stopColor="#D0BCFF" />
                </linearGradient>
              </defs>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="zip" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Demographic Breakdown & Seasonality */}
      <div className="flex flex-col gap-6">
        <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative h-1/2">
          <h3 className="text-lg font-bold text-on-surface mb-1">Demographic Breakdown</h3>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">Buyer Age Archetypes</p>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 text-center">
                <span className="text-xl font-black text-on-surface">25.4K</span>
                <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Total Buyers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl overflow-hidden relative h-1/2">
          <h3 className="text-lg font-bold text-on-surface mb-1">Seasonality Radar</h3>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">Monthly Sales Velocity Variance</p>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={seasonalityData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8 }} />
                <Radar
                  name="Sales Volume"
                  dataKey="sales"
                  stroke="#006A6A"
                  fill="#006A6A"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
