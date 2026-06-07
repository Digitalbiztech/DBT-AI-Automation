import React, { useState, useMemo } from 'react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
  PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { LabPanel, Biomarker, LabReport } from '@/types/lab';
import { getStatusColor, getPercentInRange } from '@/lib/statusHelpers';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { BiomarkerDetailDialog } from './BiomarkerDetailDialog';
export { BiomarkerDetailDialog };

/* ═══════════════════════════════════════
   Panel Bar Chart
   (Used for the panel summary bar graph)
═══════════════════════════════════════ */
interface PanelChartProps { panel: LabPanel; }

export function PanelBarChart({ panel }: PanelChartProps) {
  const data = panel.biomarkers.map((m, index) => ({
    name: m.name, value: m.value, min: m.min, max: m.max, unit: m.unit,
    status: m.status, pct: Math.max(0, getPercentInRange(m.value, m.min, m.max)), index,
  }));

  // Dynamically calculate maximum percentage to adjust Y-axis scale if values are highly elevated (prevent clipping)
  const maxPct = Math.max(100, ...data.map(d => d.pct));

  const CustomBar = (props: any) => {
    const { x, y, width, height, index: idx } = props;
    const item = data[idx];
    const colors = getStatusColor(item.status);
    return (
      <g>
        <defs>
          <linearGradient id={`bar-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.bar} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.bar} stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <rect x={x} y={y} width={width} height={height} fill={`url(#bar-grad-${idx})`} rx={4} />
      </g>
    );
  };

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = panel.biomarkers.find((b) => b.name === payload[0].payload.name);
    if (!item) return null;
    const colors = getStatusColor(item.status);
    return (
      <div className="glass-card rounded-xl px-4 py-3 text-xs min-w-[160px]">
        <p className="font-semibold text-foreground mb-2">{item.name}</p>
        <p className="text-foreground mb-0.5">Value: <span className="font-bold text-primary">{item.value} {item.unit}</span></p>
        <p className="text-muted-foreground mb-2">Range: {item.min}–{item.max} {item.unit}</p>
        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${colors.badge}`}>{item.status.toUpperCase()}</span>
      </div>
    );
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">{panel.name} — Value vs. Reference Range (%)</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
            <YAxis domain={[0, maxPct]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
            <Tooltip content={renderTooltip} cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} />
            <Bar dataKey="pct" shape={<CustomBar />} maxBarSize={32}>
              {data.map((entry) => <Cell key={entry.name} fill={getStatusColor(entry.status).bar} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  );
}

/* ═══════════════════════════════════════
   Status Summary (Radial Donut) — SIDE CARD
═══════════════════════════════════════ */
interface StatusSummaryChartProps { biomarkers: Biomarker[]; }

export function StatusSummaryChart({ biomarkers }: StatusSummaryChartProps) {
  const [selectedMarker, setSelectedMarker] = useState<Biomarker | null>(null);

  const counts = {
    normal: biomarkers.filter((b) => b.status === 'normal').length,
    high: biomarkers.filter((b) => b.status === 'high').length,
    low: biomarkers.filter((b) => b.status === 'low').length,
    critical: biomarkers.filter((b) => b.status === 'critical').length,
  };
  const total = biomarkers.length;
  // Align with standard flat percentage of normal markers used in the rest of the dashboard
  const normalPct = total ? Math.round((counts.normal / total) * 100) : 100;

  const categoryData = useMemo(() => {
    const CATEGORY_COLORS: Record<string, string> = {
      'Complete Blood Count (CBC)': '#0DA58E',
      'Comprehensive Metabolic Panel (CMP)': '#06b6d4',
      'Lipid Panel': '#f59e0b',
      'Thyroid Panel': '#ec4899',
      'Hormones': '#8b5cf6',
      'Vitamins & Minerals': '#34d399',
      'CBC': '#0DA58E',
      'CMP': '#06b6d4',
      'Lipids': '#f59e0b',
      'Thyroid': '#ec4899',
      'Nutrients': '#34d399',
    };
    const DEFAULT_COLORS = ['#0DA58E', '#06b6d4', '#3b82f6', '#34d399', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];

    const groups: Record<string, number> = {};
    biomarkers.forEach(b => {
      const cat = b.category || 'Other';
      groups[cat] = (groups[cat] || 0) + 1;
    });

    return Object.entries(groups).map(([name, count], idx) => ({
      name: name.replace('Panel', '').trim(),
      count,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS[name + ' Panel'] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    }));
  }, [biomarkers]);

  const categoryTotal = categoryData.reduce((acc, curr) => acc + curr.count, 0);

  const abnormalCount = counts.high + counts.low + counts.critical;

  const data = [
    { name: 'Normal', value: counts.normal, fill: 'hsl(var(--status-normal))' },
    { name: 'High', value: counts.high, fill: 'hsl(var(--status-high))' },
    { name: 'Low', value: counts.low, fill: 'hsl(var(--status-low))' },
    { name: 'Critical', value: counts.critical, fill: 'hsl(var(--status-critical))' },
  ].filter((d) => d.value > 0);

  const flagged = biomarkers
    .filter(b => b.status !== 'normal')
    .sort((a, b) => {
      const getPriority = (status: string) => status === 'critical' ? 3 : status === 'high' ? 2 : 1;
      return getPriority(b.status) - getPriority(a.status);
    })
    .slice(0, 3);

  // Determine health string mapping
  let healthGreeting = "Good news — most of your lab values are healthy.";
  if (normalPct < 60) healthGreeting = "Attention needed — several lab values are out of range.";
  else if (normalPct < 85) healthGreeting = "Fair — some lab values need attention.";

  if (total === 0) return null;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="text-left mb-4">
        <h3 className="text-sm font-bold text-foreground">Categories</h3>
      </div>
      
      {/* Categories doughnut custom SVG */}
      <div className="flex items-center gap-6 mb-5 shrink-0 px-2">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="19" stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
            {(() => {
              let acc = 0;
              return categoryData.map((item, idx) => {
                const pct = categoryTotal ? item.count / categoryTotal : 0;
                const C = 2 * Math.PI * 19;
                const dash1 = pct * C;
                const dash2 = C;
                const offset = -acc * C;
                acc += pct;
                return (
                  <circle
                    key={idx}
                    cx="28"
                    cy="28"
                    r="19"
                    stroke={item.color}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${dash1.toFixed(2)} ${dash2.toFixed(2)}`}
                    strokeDashoffset={offset.toFixed(2)}
                  />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground leading-none">{categoryTotal}</span>
            <span className="text-[8px] uppercase text-muted-foreground font-bold tracking-wider mt-0.5">Markers</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          {categoryData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground flex-1 truncate">{item.name}</span>
              <span className="font-bold text-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-border/40 my-3 shrink-0" />

      {/* Summary Explanation */}
      <div className="px-1 mb-4 shrink-0">
        <p className="text-sm text-foreground mb-3">{healthGreeting}</p>
        <div className="flex flex-col gap-2">
          {counts.normal > 0 && (
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-status-normal shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">{counts.normal} marker{counts.normal !== 1 ? 's' : ''}</strong> normal</span>
            </div>
          )}
          {abnormalCount > 0 && (
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-status-high shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">{abnormalCount} marker{abnormalCount !== 1 ? 's' : ''}</strong> needs attention</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Findings */}
      {flagged.length > 0 && (
        <div className="px-1 flex-1 overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Things to Watch</h4>
          <div className="flex flex-col gap-3">
            {flagged.map((m) => {
              const sc = m.status === 'low' ? 'text-status-low' : m.status === 'critical' ? 'text-status-critical' : 'text-status-high';
              const direction = m.status === 'low' ? 'low' : 'high';
              const shortDesc = m.clinicalInterpretation
                ? m.clinicalInterpretation.split('.')[0] + '.'
                : `Your level is slightly ${direction}.`;
              
              return (
                <div 
                  key={m.name} 
                  className="flex flex-col gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setSelectedMarker(m)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0"><AlertTriangle className={cn("h-3.5 w-3.5", sc)} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold text-foreground leading-tight truncate">{m.name}</p>
                        <p className={cn("text-xs font-bold shrink-0", sc)}>
                          {m.value} <span className="text-[9px] font-normal text-muted-foreground">{m.unit}</span>
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-1 mb-2">{shortDesc}</p>
                      
                      {/* Compact Visual Range Indicator */}
                      <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground/70 mb-1">
                        <span>Low</span>
                        <span>Normal</span>
                        <span>High</span>
                      </div>
                      <div className="relative h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                        <div className="h-full w-1/5 bg-status-low/20" />
                        <div className="h-full w-3/5 bg-status-normal/30" />
                        <div className="h-full w-1/5 bg-status-high/20" />
                        {/* Needle dot */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border border-background shadow-sm transition-all duration-700 z-10"
                          style={{
                            left: `${Math.max(0, Math.min(100, getPercentInRange(m.value, m.min, m.max)))}%`,
                            backgroundColor: `hsl(var(--status-${m.status}))`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-muted-foreground/50 mt-1 font-mono">
                        <span className="ml-[20%] -translate-x-1/2">{m.min}</span>
                        <span className="ml-[40%] -translate-x-1/2">{m.max}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <BiomarkerDetailDialog
        marker={selectedMarker}
        onOpenChange={(open) => !open && setSelectedMarker(null)}
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   Body System Overview
═══════════════════════════════════════ */
interface BodySystemOverviewProps { report: LabReport; }

export function BodySystemOverviewChart({ report }: BodySystemOverviewProps) {
  const panelMapping: Record<string, string> = {
    'Complete Blood Count (CBC)': 'Blood',
    'Comprehensive Metabolic Panel (CMP)': 'Metabolic',
    'Lipid Panel': 'Heart',
    'Cardiovascular Panel': 'Heart',
    'Hepatic Panel': 'Liver',
    'Liver Panel': 'Liver',
    'Kidney Panel': 'Kidney',
    'Renal Panel': 'Kidney',
    'Thyroid Panel': 'Thyroid',
    'Hormones': 'Hormones',
    'Vitamins & Minerals': 'Nutrients',
  };

  const data = report.panels
    .filter(panel => panel.biomarkers.length > 0)
    .map((panel) => {
      const normalCount = panel.biomarkers.filter(b => b.status === 'normal').length;
      const lowCount = panel.biomarkers.filter(b => b.status === 'low').length;
      const highCount = panel.biomarkers.filter(b => b.status === 'high').length;
      const criticalCount = panel.biomarkers.filter(b => b.status === 'critical').length;
      
      // Calculate clinical penalty score for the specific body system panel
      const penalty = (lowCount * 1.5) + (highCount * 1.5) + (criticalCount * 6);
      const totalMarkers = panel.biomarkers.length;
      const rawScore = totalMarkers ? 100 - (penalty / totalMarkers) * 100 : 100;
      const score = Math.max(10, Math.min(criticalCount > 0 ? 65 : 100, Math.round(rawScore)));
      
      let systemName = panelMapping[panel.name];
      if (!systemName) {
        // Fallback robust mapping using case-insensitive substring matches
        const lowerName = panel.name.toLowerCase();
        if (lowerName.includes('lipid') || lowerName.includes('cardio') || lowerName.includes('heart')) systemName = 'Heart';
        else if (lowerName.includes('liver') || lowerName.includes('hepatic')) systemName = 'Liver';
        else if (lowerName.includes('kidney') || lowerName.includes('renal')) systemName = 'Kidney';
        else if (lowerName.includes('metabolic') || lowerName.includes('cmp')) systemName = 'Metabolic';
        else if (lowerName.includes('blood') || lowerName.includes('cbc')) systemName = 'Blood';
        else if (lowerName.includes('thyroid')) systemName = 'Thyroid';
        else if (lowerName.includes('hormone') || lowerName.includes('testosterone')) systemName = 'Hormones';
        else if (lowerName.includes('vitamin') || lowerName.includes('mineral') || lowerName.includes('nutrient')) systemName = 'Nutrients';
        else systemName = panel.name.split('(')[0].trim().split(' ')[0];
      }
      
      return {
        system: systemName,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-[13px] font-bold text-foreground mb-4 px-1 flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-primary" />
        Body System Overview
      </h3>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
        {data.map((item) => {
          const segments = Math.round(item.score / 20);
          const isPerfect = item.score === 100;
          const isWarning = item.score < 80;
          
          return (
            <div key={item.system} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                <span className="truncate max-w-[80px] text-foreground/90">{item.system}</span>
                <span className={cn(isPerfect ? "text-status-normal" : isWarning ? "text-status-high" : "text-status-low")}>
                  {item.score}%
                </span>
              </div>
              <div className="flex gap-1 h-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex-1 rounded-[2px] transition-colors duration-500",
                      i < segments 
                        ? (isPerfect ? "bg-status-normal" : isWarning ? "bg-status-high" : "bg-status-low")
                        : "bg-secondary/60"
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Category Distribution Pie
═══════════════════════════════════════ */
interface CategoryPieProps { report: LabReport; }

export function CategoryDistributionChart({ report }: CategoryPieProps) {
  const COLORS = [
    'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))',
    'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))',
  ];
  const data = report.panels.map((p, i) => ({
    name: p.name.split('(')[0].trim(),
    value: p.biomarkers.length,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Biomarkers by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (<div className="glass-card rounded-xl px-3 py-2 text-xs"><span className="font-semibold text-foreground">{d.name}: </span><span className="text-muted-foreground">{d.value} markers</span></div>);
            }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-semibold text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}

/* ═══════════════════════════════════════
   ALL BIOMARKERS — Premium Clinical Card Rows
   (THE CENTER PORTION)
═══════════════════════════════════════ */
interface AllBiomarkersChartProps { biomarkers: Biomarker[]; }

const STATUS_ICON: Record<string, string> = {
  normal:   '✓',
  high:     '↑',
  low:      '↓',
  critical: '!',
};

export function BiomarkerCard({ m, idx, onDetailsClick }: { m: Biomarker; idx: number; onDetailsClick?: (m: Biomarker) => void }) {
  const colors = getStatusColor(m.status);
  
  // Normalize pct for the card's 20-60-20 track
  const rawPct = getPercentInRange(m.value, m.min, m.max);
  let pct = 0;
  if (m.status === 'normal') {
    pct = 20 + (rawPct * 0.6);
  } else if (m.status === 'low') {
    pct = Math.max(5, (m.value / (m.min || 1)) * 20);
  } else {
    // high or critical
    const excess = m.max > 0 ? (m.value - m.max) / m.max : 0.5;
    pct = Math.min(95, 80 + (excess * 15));
  }

  const statusRing: Record<string, string> = {
    normal:   'ring-status-normal/30 bg-status-normal/10 text-status-normal',
    high:     'ring-status-high/30 bg-status-high/10 text-status-high',
    low:      'ring-status-low/30 bg-status-low/10 text-status-low',
    critical: 'ring-status-critical/30 bg-status-critical/10 text-status-critical',
  };
  const statusBadge: Record<string, string> = {
    normal:   'bg-status-normal/15 text-status-normal',
    high:     'bg-status-high/15 text-status-high',
    low:      'bg-status-low/15 text-status-low',
    critical: 'bg-status-critical/15 text-status-critical',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/40 bg-card/60 p-4 transition-all duration-200 hover:border-border/70 hover:shadow-card',
        m.status !== 'normal' && 'border-l-2',
        m.status === 'high' && 'border-l-status-high',
        m.status === 'low' && 'border-l-status-low',
        m.status === 'critical' && 'border-l-status-critical',
      )}
      style={{ animationDelay: `${idx * 0.03}s` }}
    >
      {/* ── Top row ── */}
      <div className="flex items-start gap-3">
        <div className={cn(
          'shrink-0 h-9 w-9 rounded-xl ring-1 flex items-center justify-center text-sm font-bold mt-0.5',
          statusRing[m.status] || statusRing.normal,
        )}>
          {STATUS_ICON[m.status] || '•'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-bold text-foreground leading-tight">{m.name}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Ref: <span className="font-medium text-foreground/70">{m.min} – {m.max} {m.unit}</span>
          </span>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground leading-none">{m.value}</span>
            <span className="text-xs text-muted-foreground ml-1">{m.unit}</span>
          </div>
          <span className={cn('text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider', statusBadge[m.status] || statusBadge.normal)}>
            {m.status}
          </span>
        </div>
      </div>

      {/* ── Range Track with Markers ── */}
      <div className="mt-3 mb-1">
        <div className="relative h-2.5 w-full rounded-full flex overflow-hidden">
          <div className="h-full rounded-l-full" style={{ width: '20%', background: 'hsl(var(--status-low) / 0.20)' }} />
          <div className="h-full" style={{ width: '60%', background: 'hsl(var(--status-normal) / 0.18)' }} />
          <div className="h-full rounded-r-full" style={{ width: '20%', background: 'hsl(var(--status-high) / 0.20)' }} />
          
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `hsl(var(--status-${m.status}) / 0.55)` }}
          />

          {/* Range Markers (The user requested markers at min/max boundaries) */}
          <div className="absolute top-0 left-[20%] h-full w-px bg-background/50 z-10" />
          <div className="absolute top-0 left-[80%] h-full w-px bg-background/50 z-10" />

          {/* Needle dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-background shadow-md transition-all duration-700 z-10"
            style={{
              left: `${pct}%`,
              backgroundColor: `hsl(var(--status-${m.status}))`,
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-1.5">
          <div className="flex gap-4 text-[9px] text-muted-foreground/60 select-none">
             <span>Low ({m.min})</span>
             <span>High ({m.max})</span>
          </div>
          
          <button 
            onClick={() => onDetailsClick?.(m)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/70 hover:bg-secondary text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all border border-border/40"
          >
            <span>Details</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {m.clinicalInterpretation && (
        <div className="mt-3 flex gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
          <span className="shrink-0 text-[10px] font-bold text-primary mt-0.5">AI</span>
          <p className="text-[11px] text-foreground/80 leading-relaxed">{m.clinicalInterpretation}</p>
        </div>
      )}
    </div>
  );
}

export function AllBiomarkersChart({ biomarkers }: AllBiomarkersChartProps) {
  const abnormal = biomarkers.filter(b => b.status !== 'normal');
  const normal = biomarkers.filter(b => b.status === 'normal');

  const normalByCategory = useMemo(() => {
    const groups: Record<string, Biomarker[]> = {};
    normal.forEach(m => {
      const cat = m.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    });
    return groups;
  }, [normal]);

  const categories = Object.keys(normalByCategory).sort();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');

  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const [selectedMarker, setSelectedMarker] = useState<Biomarker | null>(null);

  return (
    <>
      <BiomarkerDetailDialog 
        marker={selectedMarker}
        onOpenChange={(open) => !open && setSelectedMarker(null)}
      />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">All Biomarkers — Range Position</CardTitle>
        <p className="text-[10px] text-muted-foreground mt-0.5">AI interpretation · visual range markers</p>
      </CardHeader>
      
      <CardContent className="pt-0 px-3 pb-4">
        {abnormal.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-status-high uppercase tracking-widest mb-3 px-1">Flagged Markers ({abnormal.length})</p>
            <div className="flex flex-col gap-3">
              {abnormal.map((m, i) => (
                <BiomarkerCard key={m.name} m={m} idx={i} onDetailsClick={setSelectedMarker} />
              ))}
            </div>
          </div>
        )}
        
        {normal.length > 0 && categories.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-bold text-status-normal uppercase tracking-widest mb-3 px-1">Normal Markers ({normal.length})</p>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4 px-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 uppercase tracking-widest",
                      activeCategory === cat 
                        ? "bg-status-normal/15 text-status-normal ring-1 ring-status-normal/40 shadow-sm"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
                    )}
                  >
                    {cat} ({normalByCategory[cat].length})
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {normalByCategory[activeCategory]?.map((m, i) => (
                <BiomarkerCard key={m.name} m={m} idx={i} onDetailsClick={setSelectedMarker} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
