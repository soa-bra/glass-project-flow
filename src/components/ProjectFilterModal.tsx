import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const ProjectFilterModal: React.FC<ProjectFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState({
    status: '',
    owner: '',
    deadline: 'all',
    budget: 'all'
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      status: '',
      owner: '',
      deadline: 'all',
      budget: 'all'
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">فلترة المشاريع</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* الحالة */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">حالة المشروع</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">جميع المشاريع</option>
              <option value="active">نشط</option>
              <option value="completed">مكتمل</option>
              <option value="paused">متوقف</option>
              <option value="planning">تخطيط</option>
            </select>
          </div>

          {/* المالك */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">مالك المشروع</label>
            <select
              value={filters.owner}
              onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">جميع المالكين</option>
              <option value="أحمد محمد">أحمد محمد</option>
              <option value="فاطمة علي">فاطمة علي</option>
              <option value="محمد خالد">محمد خالد</option>
              <option value="نورا سعد">نورا سعد</option>
            </select>
          </div>

          {/* الموعد النهائي */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">الموعد النهائي</label>
            <select
              value={filters.deadline}
              onChange={(e) => setFilters(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">جميع المواعيد</option>
              <option value="this-week">هذا الأسبوع</option>
              <option value="this-month">هذا الشهر</option>
              <option value="overdue">متأخرة</option>
              <option value="next-month">الشهر القادم</option>
            </select>
          </div>

          {/* الميزانية */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">الميزانية</label>
            <select
              value={filters.budget}
              onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">جميع الميزانيات</option>
              <option value="small">أقل من 100,000 ر.س</option>
              <option value="medium">100,000 - 500,000 ر.س</option>
              <option value="large">أكثر من 500,000 ر.س</option>
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