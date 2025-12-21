/**
 * Invoice Filters Widget
 * فلترة وبحث متقدم في الفواتير
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { statusLabels } from '../../domain';
import type { InvoiceStatus } from '../../domain';

export interface InvoiceFiltersState {
  search: string;
  status: InvoiceStatus | 'all';
  dateFrom: string;
  dateTo: string;
}

interface InvoiceFiltersProps {
  filters: InvoiceFiltersState;
  onFiltersChange: (filters: InvoiceFiltersState) => void;
  onReset: () => void;
}

export const defaultFilters: InvoiceFiltersState = {
  search: '',
  status: 'all',
  dateFrom: '',
  dateTo: '',
};

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' || 
    filters.dateFrom || 
    filters.dateTo;

  const updateFilter = <K extends keyof InvoiceFiltersState>(
    key: K, 
    value: InvoiceFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>فلترة وبحث</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Status Filter */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => updateFilter('status', value as InvoiceStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {(Object.entries(statusLabels) as [InvoiceStatus, string][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Input
          type="date"
          placeholder="من تاريخ"
          value={filters.dateFrom}
          onChange={(e) => updateFilter('dateFrom', e.target.value)}
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="إلى تاريخ"
          value={filters.dateTo}
          onChange={(e) => updateFilter('dateTo', e.target.value)}
        />
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 ml-1" />
            مسح الفلاتر
          </Button>
        </div>
      )}
    </div>
  );
};
