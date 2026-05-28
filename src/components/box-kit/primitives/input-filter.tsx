/**
 * Box-Kit — IPF-* input/filter primitives.
 * @specRef Section 6.1 + mem://spec/box-kit-vocabulary
 */
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/** IPF-SRH-01 — Search input */
export const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; className?: string }> = ({
  value,
  onChange,
  placeholder = 'بحث…',
  className,
}) => (
  <div className={cn('relative', className)}>
    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/45" />
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="ps-9" />
  </div>
);

/** IPF-SLT-01 — Select filter */
export type SelectOption = { value: string; label: string };
export const SelectFilter: React.FC<{
  value?: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, options, placeholder = 'اختر…', className }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={className}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((o) => (
        <SelectItem key={o.value} value={o.value}>
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/** IPF-DAT-01 — Date range filter (lightweight native inputs) */
export const DateRangeFilter: React.FC<{
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
  className?: string;
}> = ({ from, to, onChange, className }) => (
  <div className={cn('flex items-center gap-2', className)}>
    <Input type="date" value={from ?? ''} onChange={(e) => onChange({ from: e.target.value, to })} className="w-auto" />
    <span className="text-xs text-black/45">→</span>
    <Input type="date" value={to ?? ''} onChange={(e) => onChange({ from, to: e.target.value })} className="w-auto" />
  </div>
);

/** IPF-TGL-01 — Toggle group */
export const ToggleGroup: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  className?: string;
}> = ({ value, onChange, options, className }) => (
  <div className={cn('inline-flex rounded-[20px] border border-black/20 bg-white p-1', className)}>
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={cn(
          'rounded-[16px] px-3 py-1 text-xs transition-colors',
          value === o.value ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black'
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/** IPF-TXT-01 — Labeled text input */
export const TextField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'tel' | 'url' | 'password';
  required?: boolean;
  className?: string;
}> = ({ value, onChange, label, placeholder, type = 'text', required, className }) => (
  <label className={cn('flex flex-col gap-1.5', className)}>
    {label && (
      <span className="text-right text-xs font-medium text-black/60 font-arabic">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
    )}
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
  </label>
);

/** IPF-TXA-01 — Multi-line textarea */
export const TextAreaField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}> = ({ value, onChange, label, placeholder, rows = 3, required, className }) => (
  <label className={cn('flex flex-col gap-1.5', className)}>
    {label && (
      <span className="text-right text-xs font-medium text-black/60 font-arabic">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
    )}
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
    />
  </label>
);
