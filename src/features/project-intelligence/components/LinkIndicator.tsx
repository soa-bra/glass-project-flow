import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataLinkImpact } from '../types/data-link.types';

export interface LinkIndicatorProps {
  impact: DataLinkImpact;
  className?: string;
}

const impactTone: Record<DataLinkImpact['impactLevel'], string> = {
  low: 'border-slate-200 bg-slate-50 text-slate-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  high: 'border-red-200 bg-red-50 text-red-800',
};

export function LinkIndicator({ impact, className }: LinkIndicatorProps) {
  return (
    <div className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium', impactTone[impact.impactLevel], className)}>
      <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{impact.source.department}</span>
      <span aria-hidden="true">→</span>
      <span>{impact.target.department}</span>
      <span className="sr-only">{impact.reason}</span>
    </div>
  );
}
