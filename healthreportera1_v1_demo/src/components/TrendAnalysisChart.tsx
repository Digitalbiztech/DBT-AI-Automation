import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { LabReport, Biomarker } from '@/types/lab';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { getStatusColor } from '@/lib/statusHelpers';

interface TrendAnalysisChartProps {
  reports: LabReport[];
}

export function TrendAnalysisChart({ reports }: TrendAnalysisChartProps) {
  // Extract all unique biomarker names across all reports
  const allBiomarkers = useMemo(() => {
    const names = new Set<string>();
    reports.forEach(r => {
      r.panels.forEach(p => {
        p.biomarkers.forEach(b => names.add(b.name));
      });
    });
    return Array.from(names).sort();
  }, [reports]);

  const [selectedMarker, setSelectedMarker] = useState<string>(allBiomarkers[0] || '');

  // Prepare chart data for the selected biomarker
  const chartData = useMemo(() => {
    if (!selectedMarker) return [];
    
    const data = reports.map((report, index) => {
      let marker: Biomarker | null = null;
      for (const p of report.panels) {
        const found = p.biomarkers.find(b => b.name === selectedMarker);
        if (found) {
          marker = found;
          break;
        }
      }
      
      if (!marker) return null;

      const dateStr = report.labDate || report.collectionDate || `Report ${index + 1}`;
      
      return {
        date: dateStr,
        rawDate: report.labDate || report.collectionDate || new Date(index * 10000000).toISOString(),
        value: marker.value,
        min: marker.min,
        max: marker.max,
        unit: marker.unit,
        status: marker.status
      };
    }).filter(Boolean) as any[];

    // Sort by date chronologically by parsing timestamps
    return data.sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
  }, [reports, selectedMarker]);

  if (reports.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/50 h-[380px]">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Trend Analysis</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Upload at least two lab reports to see how your biomarkers change over time. Click "Compare Report" in the header to add more data.
        </p>
      </div>
    );
  }

  const latestData = chartData[chartData.length - 1];
  const refMin = latestData?.min || 0;
  const refMax = latestData?.max || 100;

  // Detect if the range is missing/fallback [0, 100] to prevent Y-axis blowout
  const hasValidRange = latestData && latestData.min !== undefined && latestData.max !== undefined && !(latestData.min === 0 && latestData.max === 100);

  const actualValues = chartData.map(d => d.value);
  const dataMin = hasValidRange ? Math.min(...actualValues, refMin) : Math.min(...actualValues);
  const dataMax = hasValidRange ? Math.max(...actualValues, refMax) : Math.max(...actualValues);
  const padding = (dataMax - dataMin) * 0.15 || (dataMax * 0.1) || 1;

  // Enforce zero lower bound since biological values cannot be negative
  const yMin = Math.max(0, dataMin - padding);
  const yMax = dataMax + padding;

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-border/40">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30">
        <div>
          <CardTitle className="text-[15px] font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Biomarker Trends
          </CardTitle>
          <p className="text-[11px] text-muted-foreground mt-0.5">Track your metrics over time across multiple reports</p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select value={selectedMarker} onValueChange={setSelectedMarker}>
            <SelectTrigger className="h-9 text-xs bg-background">
              <SelectValue placeholder="Select a biomarker" />
            </SelectTrigger>
            <SelectContent>
              {allBiomarkers.map(name => (
                <SelectItem key={name} value={name} className="text-xs">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {chartData.length < 2 ? (
           <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
             Not enough data points for this specific biomarker across reports.
           </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={[yMin, yMax]} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(v) => Number.isInteger(v) ? v : v.toFixed(1)}
                  width={50}
                />
                
                {/* Reference Range Background (Only render if we have a valid reference range) */}
                {hasValidRange && (
                  <ReferenceArea 
                    y1={refMin} 
                    y2={refMax} 
                    fill="hsl(var(--status-normal))" 
                    fillOpacity={0.08} 
                    ifOverflow="hidden"
                  />
                )}

                <RechartsTooltip 
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const c = getStatusColor(d.status);
                    return (
                      <div className="glass-card rounded-xl px-4 py-3 text-xs min-w-[160px] shadow-lg border border-border/40">
                        <p className="font-semibold text-foreground mb-2">{label}</p>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-bold text-primary">{d.value} {d.unit}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Range:</span>
                          <span>{d.min}–{d.max} {d.unit}</span>
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${c.badge}`}>
                          {d.status.toUpperCase()}
                        </span>
                      </div>
                    );
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (!payload) return null;
                    const color = getStatusColor(payload.status).bar;
                    return <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={5} fill={color} stroke="none" />;
                  }}
                  activeDot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (!payload) return null;
                    const color = getStatusColor(payload.status).bar;
                    return (
                      <g key={`active-dot-${payload.date}`}>
                        <circle cx={cx} cy={cy} r={9} fill="hsl(var(--background))" stroke={color} strokeWidth={2.5} />
                        <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="none" />
                      </g>
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </div>
  );
}
