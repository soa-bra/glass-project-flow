/**
 * نافذة تصفية عامة
 */
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

export interface FilterOption {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

interface GenericFilterPopoverProps {
  filters: FilterOption[];
  onApply: (values: Record<string, string>) => void;
  onReset: () => void;
  triggerButton?: React.ReactNode;
  resultCount?: number;
}

export const GenericFilterPopover: React.FC<GenericFilterPopoverProps> = ({
  filters, onApply, onReset, triggerButton, resultCount
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(values);
    setOpen(false);
    const activeFilters = Object.values(values).filter(v => v && v !== 'all').length;
    toast.success(`تم تطبيق ${activeFilters} فلتر${resultCount !== undefined ? ` • ${resultCount} نتيجة` : ''}`);
  };

  const handleReset = () => {
    setValues({});
    onReset();
    setOpen(false);
    toast.success('تم إعادة تعيين الفلاتر');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="font-arabic rounded-full">
            <Filter className="h-4 w-4 ml-2" />
            تصفية
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white/90 backdrop-blur-xl rounded-2xl border border-black/10" align="end">
        <div className="space-y-4">
          <h4 className="font-semibold text-black font-arabic">تصفية متقدمة</h4>
          {filters.map(filter => (
            <div key={filter.name} className="space-y-1">
              <Label className="text-sm text-black/70 font-arabic">{filter.label}</Label>
              <Select value={values[filter.name] || ''} onValueChange={v => setValues(prev => ({ ...prev, [filter.name]: v }))}>
                <SelectTrigger className="bg-white/50 border-black/10 rounded-xl font-arabic">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {filter.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleApply} size="sm" className="flex-1 bg-black text-white rounded-full font-arabic">تطبيق</Button>
            <Button onClick={handleReset} size="sm" variant="outline" className="flex-1 rounded-full font-arabic">إعادة تعيين</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
