import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Biomarker } from '@/types/lab';
import { getPercentInRange } from '@/lib/statusHelpers';

interface BiomarkerDetailDialogProps {
  marker: Biomarker | null;
  onOpenChange: (open: boolean) => void;
}

export function BiomarkerDetailDialog({ marker, onOpenChange }: BiomarkerDetailDialogProps) {
  if (!marker) return null;

  const pct = getPercentInRange(marker.value, marker.min, marker.max);

  return (
    <Dialog open={!!marker} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl sm:rounded-2xl">
        <div className="flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-5 pb-4 border-b border-border/40 bg-card/40">
            <DialogTitle className="text-lg font-bold text-foreground pr-8 leading-tight">
              {marker.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detailed information about {marker.name}
            </DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <div className={cn(
                "flex flex-col",
                marker.status === 'low' ? "text-status-low" : 
                marker.status === 'critical' ? "text-status-critical" : 
                "text-status-high"
              )}>
                <div className="flex items-baseline gap-1">
                  {marker.status === 'low' ? <ChevronDown className="h-5 w-5" strokeWidth={3} /> : <ChevronUp className="h-5 w-5" strokeWidth={3} />}
                  <span className="text-2xl font-black tracking-tighter">{marker.value}</span>
                  <span className="text-sm font-medium mt-1">{marker.unit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 px-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            
            {/* Description */}
            {(marker.description || marker.clinicalInterpretation || marker.insight) && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-md w-fit text-xs font-semibold text-foreground/80 mb-1">
                  <Info className="h-3.5 w-3.5" />
                  What's {marker.name.split(' (')[0].split(' ')[0]}?
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed px-1">
                  {marker.description || marker.clinicalInterpretation || marker.insight}
                </p>
              </div>
            )}

            {/* Range Visualization */}
            <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                  Your Levels of {marker.name.split(' (')[0]}
                </div>
                <span className="text-xs font-medium text-status-normal bg-status-normal/10 px-2 py-0.5 rounded-full">Optimal Range</span>
              </div>

              {/* 3-Zone Track */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                  <span className="w-1/3 text-left">Low</span>
                  <span className="w-1/3 text-center">Optimal</span>
                  <span className="w-1/3 text-right">High</span>
                </div>

                <div className="relative h-3 w-full rounded-full flex overflow-visible my-1">
                  {/* LOW zone */}
                  <div className="h-full rounded-l-full" style={{ width: '20%', background: 'hsl(var(--status-low) / 0.25)' }} />
                  {/* NORMAL zone */}
                  <div className="h-full" style={{ width: '60%', background: 'hsl(var(--status-normal) / 0.25)' }} />
                  {/* HIGH zone */}
                  <div className="h-full rounded-r-full" style={{ width: '20%', background: 'hsl(var(--status-high) / 0.25)' }} />
                  
                  {/* Filled progress */}
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${getEffectivePct(marker)}%`, 
                      background: `hsl(var(--status-${marker.status}) / 0.6)` 
                    }}
                  />
                  
                  {/* Range Markers (the requested "range marker") */}
                  <div className="absolute top-0 left-[20%] h-full w-px bg-background/50 z-10" />
                  <div className="absolute top-0 left-[80%] h-full w-px bg-background/50 z-10" />

                  {/* Needle dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-1000"
                    style={{
                      left: `${getEffectivePct(marker)}%`,
                    }}
                  >
                     <div className="h-4 w-4 rounded-full border-[3px] border-background shadow-md" style={{ backgroundColor: `hsl(var(--status-${marker.status}))` }} />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-medium text-muted-foreground/80 mt-1 px-1">
                  <span className="ml-[20%] -translate-x-1/2">{marker.min}</span>
                  <span className="ml-[80%] -translate-x-1/2">{marker.max}</span>
                </div>
              </div>

              {/* Detailed Analysis Box */}
              {marker.detailedAnalysis && (
                <div className="mt-5 p-4 rounded-lg bg-[hsl(var(--status-high)_/_0.05)] border border-[hsl(var(--status-high)_/_0.15)] text-[13px] text-foreground/85 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {marker.status === 'low' ? <ChevronDown className="h-4 w-4 text-status-low" /> : <ChevronUp className="h-4 w-4 text-status-high" />}
                    </div>
                    <div>
                      {marker.detailedAnalysis}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer text */}
          <div className="px-6 py-4 bg-secondary/20 border-t border-border/40 text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
            <p>Descriptions are intended to provide a broad overview of lab results range, and are not a direct, personalized interpretation of your specific results. If you have any questions or concerns related to this dashboard or a possible medical condition, seek the advice of your healthcare provider. Never disregard the advice of your healthcare provider.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper to normalize pct for the UI zones
function getEffectivePct(marker: Biomarker) {
  const rawPct = getPercentInRange(marker.value, marker.min, marker.max);
  
  if (marker.status === 'normal') {
    return 20 + (rawPct * 0.6);
  } else if (marker.status === 'low') {
    if (marker.min > 0) {
       return Math.max(5, (marker.value / marker.min) * 20);
    }
    return 10;
  } else {
    // high or critical
    if (marker.max > 0) {
      const excess = (marker.value - marker.max) / marker.max;
      return Math.min(95, 80 + (excess * 20));
    }
    return 90;
  }
}
