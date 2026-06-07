import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  ReferenceArea, ReferenceLine, Tooltip as RechartsTooltip
} from 'recharts';
import { Biomarker } from '@/types/lab';
import { getStatusColor } from '@/lib/statusHelpers';
import { resolveRange } from '@/lib/biomarkerRanges';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface BiomarkerProfileChartProps {
  biomarkers: Biomarker[];
  isMockup?: boolean;
  gender?: string;
}

// 5 categories mapping
const CATEGORY_MAP: Record<string, string> = {
  'Complete Blood Count (CBC)': 'Blood',
  'Hematology': 'Blood',
  'Blood': 'Blood',
  'Comprehensive Metabolic Panel (CMP)': 'Metabolic',
  'Metabolic': 'Metabolic',
  'Lipid Panel': 'Lipid',
  'Lipid': 'Lipid',
  'Thyroid Panel': 'Hormones',
  'Hormones': 'Hormones',
  'Vitamins & Minerals': 'Nutrients',
  'Nutrients': 'Nutrients',
};

function getNormalizedCategory(cat: string): string {
  if (!cat) return 'Metabolic';
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) {
      return val;
    }
  }
  return 'Metabolic';
}

// Normalized value mapper matching reference zones:
// Red (Critical Low): 1.5 - 2.1
// Yellow (Borderline Low): 2.1 - 2.25
// Green (Normal / Optimal): 2.25 - 2.55
// Yellow (Borderline High): 2.55 - 2.7
// Red (Critical High): 2.7 - 3.0
function getNormalizedValue(b: Biomarker, gender?: string): number {
  const val = Number(b.value) || 0;
  const { min, max } = resolveRange(b.name, b.min, b.max, b.value, gender || 'male');
  const status = (b.status || 'normal').toLowerCase();

  if (status === 'normal') {
    const range = max > min ? max - min : 1;
    const pct = Math.max(0, Math.min(1, (val - min) / range));
    return 2.25 + pct * 0.30; // Map [min, max] -> [2.25, 2.55]
  } else if (status === 'low') {
    const ratio = min > 0 ? val / min : 0.5;
    const pct = Math.max(0, Math.min(1, ratio));
    return 2.1 + pct * 0.15; // Map below min to [2.1, 2.25]
  } else if (status === 'critical' && val < min) {
    const ratio = min > 0 ? val / min : 0.5;
    const pct = Math.max(0, Math.min(1, ratio));
    return 1.5 + pct * 0.60; // Map critical low to [1.5, 2.1]
  } else if (status === 'high') {
    const excess = max > 0 ? (val - max) / max : 0.5;
    const pct = Math.max(0, Math.min(1, excess));
    return 2.55 + pct * 0.15; // Map above max to [2.55, 2.7]
  } else if (status === 'critical' || status === 'high') {
    const excess = max > 0 ? (val - max) / max : 0.5;
    const pct = Math.max(0, Math.min(1, excess));
    return 2.7 + pct * 0.30; // Map critical high to [2.7, 3.0]
  }
  return 2.4;
}

export function BiomarkerProfileChart({ biomarkers, isMockup = false, gender = 'male' }: BiomarkerProfileChartProps) {
  // Sort and process biomarkers grouped by category
  const processedData = useMemo(() => {
    if (!biomarkers || biomarkers.length === 0) return [];

    // Grouping
    const groups: Record<string, Biomarker[]> = {
      'Blood': [],
      'Metabolic': [],
      'Lipid': [],
      'Hormones': [],
      'Nutrients': [],
    };

    biomarkers.forEach(b => {
      const normCat = getNormalizedCategory(b.category);
      if (groups[normCat]) {
        groups[normCat].push(b);
      } else {
        groups['Metabolic'].push(b);
      }
    });

    const dataPoints: any[] = [];
    const categories = ['Blood', 'Metabolic', 'Lipid', 'Hormones', 'Nutrients'];

    categories.forEach(cat => {
      groups[cat].forEach(b => {
        const normVal = getNormalizedValue(b, gender);
        const point: any = {
          name: b.name,
          category: cat,
          original: b,
        };
        // Set the value only for the matching category series line
        categories.forEach(c => {
          point[c] = c === cat ? normVal : null;
        });
        dataPoints.push(point);
      });
    });

    return dataPoints;
  }, [biomarkers, gender]);

  if (processedData.length === 0) return null;

  // Custom active dot drawing colored bubble indicator matching the image exactly
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!payload || payload[dataKey] === null) return null;

    const b = payload.original as Biomarker;
    const colors = getStatusColor(b.status);
    return (
      <g key={`dot-${payload.name}-${dataKey}`}>
        <circle cx={cx} cy={cy} r={5} fill={colors.bar} stroke="#ffffff" strokeWidth={1} />
      </g>
    );
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!payload || payload[dataKey] === null) return null;

    const b = payload.original as Biomarker;
    const colors = getStatusColor(b.status);
    return (
      <g key={`active-dot-${payload.name}-${dataKey}`}>
        <circle cx={cx} cy={cy} r={8} fill="transparent" stroke={colors.bar} strokeWidth={2.5} className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <circle cx={cx} cy={cy} r={8} fill="#ffffff" stroke={colors.bar} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={4.5} fill={colors.bar} stroke="none" />
      </g>
    );
  };

  // 5 Lines Colors
  const LINE_COLORS: Record<string, string> = {
    'Blood': '#0da58e',      // Emerald/Teal
    'Metabolic': '#06b6d4',  // Cyan
    'Lipid': '#f59e0b',      // Amber
    'Hormones': '#8b5cf6',   // Purple
    'Nutrients': '#ec4899',  // Pink
  };

  return (
    <div className={isMockup 
      ? "bg-white rounded-[28px] p-6 shadow-sm border border-gray-50"
      : "bg-card rounded-[28px] p-6 shadow-sm border border-border/40"
    }>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className={isMockup ? "text-base font-bold text-gray-800" : "text-sm font-bold text-foreground flex items-center gap-2"}>
            <Activity className="h-4.5 w-4.5 text-[#0da58e]" />
            Systemic Biomarker Profile & Reference Zones
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
            Normalized range profiles across 5 diagnostic categories
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 items-center text-[10px] font-bold">
          {Object.entries(LINE_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5 bg-secondary/35 px-2.5 py-1 rounded-full border border-border/30">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[320px] w-full mt-4 flex select-none">
        
        {/* Left vertical color bar guide matching the image exactly */}
        <div className="absolute left-0 top-[20px] bottom-[50px] w-2 flex flex-col rounded-full overflow-hidden shrink-0 z-10">
          <div className="flex-[3] bg-rose-500/20 border-r border-rose-500" title="Critical High" />
          <div className="flex-[1.5] bg-amber-500/20 border-r border-amber-500" title="High" />
          <div className="flex-[3] bg-emerald-500/20 border-r border-emerald-500" title="Optimal" />
          <div className="flex-[1.5] bg-amber-500/20 border-r border-amber-500" title="Low" />
          <div className="flex-[6] bg-rose-500/20 border-r border-rose-500" title="Critical Low" />
        </div>

        <div className="flex-1 w-full pl-3 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData} margin={{ top: 20, right: 15, left: -25, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isMockup ? "#f1f5f9" : "hsl(var(--border))"} opacity={0.5} />
              
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={50}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis
                domain={[1.5, 3.0]}
                ticks={[1.8, 2.2, 2.4, 2.6, 2.8]}
                tick={{ fontSize: 9, fontWeight: 'bold', fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(tick) => {
                  if (tick === 2.8) return 'Elevated';
                  if (tick === 2.6) return 'High';
                  if (tick === 2.4) return 'Optimal';
                  if (tick === 2.2) return 'Low';
                  if (tick === 1.8) return 'Very Low';
                  return '';
                }}
                axisLine={false}
                tickLine={false}
                width={85}
              />

              {/* Background Reference Zones matching the image */}
              {/* Critical Low (Red) */}
              <ReferenceArea y1={1.5} y2={2.1} fill="#ef4444" fillOpacity={0.03} />
              {/* Borderline Low (Yellow) */}
              <ReferenceArea y1={2.1} y2={2.25} fill="#f59e0b" fillOpacity={0.03} />
              {/* Optimal / Normal (Green) */}
              <ReferenceArea y1={2.25} y2={2.55} fill="#10b981" fillOpacity={0.06} />
              {/* Borderline High (Yellow) */}
              <ReferenceArea y1={2.55} y2={2.7} fill="#f59e0b" fillOpacity={0.03} />
              {/* Critical High (Red) */}
              <ReferenceArea y1={2.7} y2={3.0} fill="#ef4444" fillOpacity={0.03} />

              {/* Dotted threshold dividing lines */}
              <ReferenceLine y={2.1} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} opacity={0.4} />
              <ReferenceLine y={2.25} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1} opacity={0.4} />
              <ReferenceLine y={2.55} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} opacity={0.4} />
              <ReferenceLine y={2.7} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} opacity={0.4} />

              <RechartsTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  
                  // Find first series payload that is not null
                  const activeSeries = payload.find(p => p.value !== null && p.value !== undefined);
                  if (!activeSeries) return null;

                  const d = activeSeries.payload;
                  const b = d.original as Biomarker;
                  const { min, max } = resolveRange(b.name, b.min, b.max, b.value, gender || 'male');
                  const colors = getStatusColor(b.status);

                  return (
                    <div className={isMockup 
                      ? "bg-white rounded-2xl px-4 py-3 text-xs min-w-[200px] shadow-lg border border-gray-100"
                      : "glass-card rounded-2xl px-4 py-3 text-xs min-w-[200px] shadow-lg border border-border/40"
                    }>
                      <div className="flex justify-between items-start gap-2 mb-2 pb-2 border-b border-border/30">
                        <div>
                          <p className="font-extrabold text-foreground text-sm leading-tight">{b.name}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                            {d.category} Panel
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${colors.badge}`}>
                          {b.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs font-semibold">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Actual value:</span>
                          <span className="font-bold text-foreground text-sm">{b.value} {b.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Optimal range:</span>
                          <span className="font-bold text-muted-foreground">{min} – {max} {b.unit}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              {/* 5 lines, connectNulls to connect biomarkers smoothly within each category */}
              {Object.entries(LINE_COLORS).map(([name, color]) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={color}
                  strokeWidth={2.5}
                  connectNulls={true}
                  dot={<CustomDot dataKey={name} />}
                  activeDot={<CustomActiveDot dataKey={name} />}
                  animationDuration={800}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-muted-foreground bg-secondary/20 p-3 rounded-2xl border border-border/20">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <span><strong>Clinical Guide:</strong> The vertical color bar and shaded bands map reference intervals dynamically, allowing immediate visual assessment across distinct panels and units.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] shrink-0 font-bold uppercase tracking-wider">
          <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 animate-pulse" />
          <span>100% Normalized</span>
        </div>
      </div>
    </div>
  );
}
