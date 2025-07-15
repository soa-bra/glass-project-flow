import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const TaskFilterModal: React.FC<TaskFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    status: '',
    dateRange: 'all'
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      assignee: '',
      priority: '',
      status: '',
      dateRange: 'all'
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">فلترة المهام</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* المسؤول */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">المسؤول</label>
            <select
              value={filters.assignee}
              onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">جميع الأعضاء</option>
              <option value="أحمد محمد">أحمد محمد</option>
              <option value="فاطمة علي">فاطمة علي</option>
              <option value="محمد خالد">محمد خالد</option>
              <option value="نورا سعد">نورا سعد</option>
            </select>
          </div>

          {/* الأولوية */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">الأولوية</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">جميع الأولويات</option>
              <option value="urgent">عاجل</option>
              <option value="high">مرتفع</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
          </div>

          {/* الحالة */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">جميع الحالات</option>
              <option value="todo">مجدولة</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="treating">تحت المعالجة</option>
              <option value="late">متأخرة</option>
              <option value="stopped">متوقفة</option>
              <option value="completed">مكتملة</option>
            </select>
          </div>

          {/* الفترة الزمنية */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">الفترة الزمنية</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">جميع المهام</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="overdue">متأخرة</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 text-black border-black/20 hover:bg-black/5"
          >
            إعادة تعيين
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-black text-white hover:bg-black/80"
          >
            تطبيق الفلاتر
          </Button>
        </div>
      </div>
    </div>
  );
};