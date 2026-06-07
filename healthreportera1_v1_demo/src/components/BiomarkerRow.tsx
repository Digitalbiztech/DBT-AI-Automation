import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Biomarker } from '@/types/lab';
import { getStatusColor, getStatusLabel, getPercentInRange } from '@/lib/statusHelpers';
import { cn } from '@/lib/utils';

interface BiomarkerRowProps { marker: Biomarker; }

export function BiomarkerRow({ marker }: BiomarkerRowProps) {
  const [expanded, setExpanded] = useState(false);
  const colors = getStatusColor(marker.status);
  const pct = getPercentInRange(marker.value, marker.min, marker.max);
  const isOutOfRange = marker.status !== 'normal';
  const hasDetail = !!(marker.detailedAnalysis || marker.clinicalInterpretation || marker.insight);

  return (
    <div className={cn(
      'glass-card rounded-xl p-4 transition-all duration-200 hover:border-border/70 hover:shadow-card group',
      isOutOfRange && 'border-l-2',
      marker.status === 'high' && 'border-l-status-high',
      marker.status === 'low' && 'border-l-status-low',
      marker.status === 'critical' && 'border-l-status-critical',
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <div className={cn('h-2 w-2 rounded-full shrink-0', colors.dot)} />
            <span className="font-semibold text-sm text-foreground">{marker.name}</span>
            {marker.description && marker.description !== marker.name && (
              <span className="text-xs text-muted-foreground hidden sm:inline">— {marker.description}</span>
            )}
            {marker.confidenceScore !== undefined && marker.confidenceScore < 70 && (
              <span className="inline-flex items-center text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md tracking-wide animate-pulse">
                ⚠️ Verification Alert ({marker.confidenceScore}% match)
              </span>
            )}
          </div>

          {/* Range bar */}
          <div className="relative h-2 w-full rounded-full bg-secondary/70 overflow-visible">
            <div className="absolute inset-0 rounded-full bg-status-normal/10" />
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: `hsl(var(--status-${marker.status}))`, opacity: 0.3 }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-all duration-700" style={{ left: `${pct}%` }}>
              <div className="h-4 w-4 rounded-full border-2 border-background shadow-lg transition-transform group-hover:scale-125" style={{ backgroundColor: `hsl(var(--status-${marker.status}))` }} />
            </div>
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span>{marker.min} {marker.unit}</span>
            <span className="text-muted-foreground/50">reference range</span>
            <span>{marker.max} {marker.unit}</span>
          </div>

          {/* Clinical interpretation (short) */}
          {marker.clinicalInterpretation && isOutOfRange && !expanded && (
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed px-3 py-2 rounded-lg bg-accent/5 border border-accent/10 line-clamp-2">
              {marker.clinicalInterpretation}
            </p>
          )}

          {/* Legacy insight fallback */}
          {!marker.clinicalInterpretation && marker.insight && isOutOfRange && !expanded && (
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed px-3 py-2 rounded-lg bg-accent/5 border border-accent/10">
              {marker.insight}
            </p>
          )}

          {/* Expanded detailed analysis */}
          {expanded && hasDetail && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {marker.clinicalInterpretation && (
                <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Clinical Interpretation</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{marker.clinicalInterpretation}</p>
                </div>
              )}
              {marker.detailedAnalysis && (
                <div className="px-3 py-2 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-[10px] font-semibold text-accent uppercase tracking-wide mb-1">Detailed Analysis</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{marker.detailedAnalysis}</p>
                </div>
              )}
              {!marker.clinicalInterpretation && marker.insight && (
                <div className="px-3 py-2 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-xs text-muted-foreground leading-relaxed">{marker.insight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: value + badge + expand */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground leading-none">{marker.value}</span>
            <span className="text-xs font-normal text-muted-foreground ml-1">{marker.unit}</span>
          </div>
          <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-lg tracking-wide', colors.badge)}>
            {getStatusLabel(marker.status).toUpperCase()}
          </span>
          {hasDetail && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{expanded ? 'Less' : 'Details'}</span>
              <ChevronDown className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
