/**
 * Box-Kit — IPF-* input/filter primitives.
 * @specRef Section 6.1 + mem://spec/box-kit-vocabulary
 */
import React from 'react';
import { Search, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const fieldLabelClass = 'text-right text-base font-semibold text-black font-arabic';
const dateTriggerClass = 'flex h-10 w-full items-center justify-between rounded-[24px] border border-black/20 bg-white px-4 py-2 text-right text-base font-normal text-black font-arabic transition-colors outline-none ring-0 focus:border-black focus:outline-none focus:ring-0';

function DateButton({ value, placeholder, onClick }: { value?: string; placeholder: string; onClick?: () => void }) {
  return (
    <button type="button" data-field-trigger="true" onClick={onClick} className={dateTriggerClass}>
      <span className={cn('truncate', value ? 'text-black' : 'font-normal text-[#8A8A8A]')}>
        {value ? format(new Date(value), 'PPP', { locale: ar }) : placeholder}
      </span>
      <CalendarIcon className="h-5 w-5 flex-shrink-0 text-black/65" />
    </button>
  );
}

/** IPF-SRH-01 — Search input */
export const SearchInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}> = ({
  value,
  onChange,
  placeholder = 'بحث…',
  label,
  className,
}) => (
  <label className={cn('flex flex-col gap-2', className)}>
    {label ? <span className={fieldLabelClass}>{label}</span> : null}
    <div className="relative">
      <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A8A8A]" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="ps-12" />
    </div>
  </label>
);

/** IPF-SLT-01 — Select filter */
export type SelectOption = { value: string; label: string };
export const SelectFilter: React.FC<{
  value?: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
}> = ({ value, onChange, options, placeholder = 'اختر…', label, className }) => (
  <label className={cn('flex flex-col gap-2', className)}>
    {label ? <span className={fieldLabelClass}>{label}</span> : null}
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
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
  </label>
);

/** IPF-DAT-01 — Date range filter */
export const DateRangeFilter: React.FC<{
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
  label?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  className?: string;
}> = ({
  from,
  to,
  onChange,
  label,
  fromPlaceholder = 'اختر تاريخ البداية',
  toPlaceholder = 'اختر تاريخ النهاية',
  className,
}) => (
  <div className={cn('flex flex-col gap-2', className)}>
    {label ? <span className={fieldLabelClass}>{label}</span> : null}
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <DateButton value={to} placeholder={toPlaceholder} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={to ? new Date(to) : undefined}
            onSelect={(date) => onChange({ from, to: date ? format(date, 'yyyy-MM-dd') : undefined })}
            initialFocus
            className="pointer-events-auto p-3"
          />
        </PopoverContent>
      </Popover>

      <span className="text-sm text-[#8A8A8A]">→</span>

      <Popover>
        <PopoverTrigger asChild>
          <DateButton value={from} placeholder={fromPlaceholder} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={from ? new Date(from) : undefined}
            onSelect={(date) => onChange({ from: date ? format(date, 'yyyy-MM-dd') : undefined, to })}
            initialFocus
            className="pointer-events-auto p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
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
  <label className={cn('flex flex-col gap-2', className)}>
    {label ? (
      <span className={fieldLabelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
    ) : null}
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
  <label className={cn('flex flex-col gap-2', className)}>
    {label ? (
      <span className={fieldLabelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
    ) : null}
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="min-h-[180px]"
    />
  </label>
);
