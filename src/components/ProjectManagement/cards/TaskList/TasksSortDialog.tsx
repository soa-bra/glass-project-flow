import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TasksSortDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
}

export const TasksSortDialog: React.FC<TasksSortDialogProps> = ({
  isOpen,
  onClose,
  onSort
}) => {
  const [sortField, setSortField] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const sortOptions = [
    { value: 'title', label: 'الاسم' },
    { value: 'priority', label: 'الأولوية' },
    { value: 'stage', label: 'الحالة' },
    { value: 'dueDate', label: 'تاريخ التسليم' },
    { value: 'assignee', label: 'المسؤول' },
    { value: 'attachments', label: 'عدد المرفقات' }
  ];

  const handleApplySort = () => {
    if (sortField) {
      onSort(sortField, sortDirection);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right font-arabic" style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'hsl(var(--ink))',
            fontFamily: 'IBM Plex Sans Arabic'
          }}>
            ترتيب المهام
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-right block" style={{
              color: 'hsl(var(--ink-80))',
              fontFamily: 'IBM Plex Sans Arabic'
            }}>
              ترتيب حسب
            </label>
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-full text-right">
                <SelectValue placeholder="اختر خيار الترتيب" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-right">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-right block" style={{
              color: 'hsl(var(--ink-80))',
              fontFamily: 'IBM Plex Sans Arabic'
            }}>
              اتجاه الترتيب
            </label>
            <Select value={sortDirection} onValueChange={(value: 'asc' | 'desc') => setSortDirection(value)}>
              <SelectTrigger className="w-full text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc" className="text-right">
                  <div className="flex items-center gap-2">
                    <ArrowUp size={16} />
                    تصاعدي
                  </div>
                </SelectItem>
                <SelectItem value="desc" className="text-right">
                  <div className="flex items-center gap-2">
                    <ArrowDown size={16} />
                    تنازلي
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-transparent hover:bg-panel/50 transition-colors"
              style={{
                fontFamily: 'IBM Plex Sans Arabic'
              }}
            >
              إلغاء
            </button>
            <button
              onClick={handleApplySort}
              disabled={!sortField}
              className="px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                fontFamily: 'IBM Plex Sans Arabic'
              }}
            >
              تطبيق الترتيب
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};