import { BiomarkerStatus } from '@/types/lab';

export function getStatusColor(status: BiomarkerStatus) {
  switch (status) {
    case 'normal':
      return {
        badge: 'bg-[hsl(var(--status-normal-bg))] text-[hsl(var(--status-normal))]',
        bar: 'hsl(var(--status-normal))',
        dot: 'bg-[hsl(var(--status-normal))]',
      };
    case 'high':
      return {
        badge: 'bg-[hsl(var(--status-high-bg))] text-[hsl(var(--status-high))]',
        bar: 'hsl(var(--status-high))',
        dot: 'bg-[hsl(var(--status-high))]',
      };
    case 'low':
      return {
        badge: 'bg-[hsl(var(--status-low-bg))] text-[hsl(var(--status-low))]',
        bar: 'hsl(var(--status-low))',
        dot: 'bg-[hsl(var(--status-low))]',
      };
    case 'critical':
      return {
        badge: 'bg-[hsl(var(--status-critical-bg))] text-[hsl(var(--status-critical))]',
        bar: 'hsl(var(--status-critical))',
        dot: 'bg-[hsl(var(--status-critical))]',
      };
  }
}

export function getStatusLabel(status: BiomarkerStatus) {
  switch (status) {
    case 'normal': return 'Normal';
    case 'high': return 'High';
    case 'low': return 'Low';
    case 'critical': return 'Critical';
  }
}

export function getPercentInRange(value: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return 50;
  const pct = ((value - min) / range) * 100;
  return Math.max(0, Math.min(100, pct));
}
