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
    <div className="fixed inset-0 z-[99999] bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '24px'
      }} className="p-8 w-full max-w-md mx-4 shadow-2xl shadow-black/10 font-arabic">
        <div className="flex items-center justify-between mb-6 relative">
          <h3 className="text-2xl font-bold text-right text-black font-arabic">فلترة المشاريع</h3>
          <button
            onClick={onClose}
            className="absolute top-0 left-0 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition"
          >
            <X size={18} className="text-black" />
          </button>
        </div>

        <div className="space-y-4">
          {/* الحالة */}
          <div>
            <label className="block text-sm font-bold text-black mb-3 text-right font-arabic">حالة المشروع</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-4 border border-black/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/50 bg-white/50 backdrop-blur-sm font-arabic text-right"
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
            <label className="block text-sm font-bold text-black mb-3 text-right font-arabic">مالك المشروع</label>
            <select
              value={filters.owner}
              onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full p-4 border border-black/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/50 bg-white/50 backdrop-blur-sm font-arabic text-right"
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
            <label className="block text-sm font-bold text-black mb-3 text-right font-arabic">الموعد النهائي</label>
            <select
              value={filters.deadline}
              onChange={(e) => setFilters(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full p-4 border border-black/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/50 bg-white/50 backdrop-blur-sm font-arabic text-right"
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
            <label className="block text-sm font-bold text-black mb-3 text-right font-arabic">الميزانية</label>
            <select
              value={filters.budget}
              onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full p-4 border border-black/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/50 bg-white/50 backdrop-blur-sm font-arabic text-right"
            >
              <option value="all">جميع الميزانيات</option>
              <option value="small">أقل من 100,000 ر.س</option>
              <option value="medium">100,000 - 500,000 ر.س</option>
              <option value="large">أكثر من 500,000 ر.س</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 text-black border-black/30 hover:bg-black/10 rounded-xl font-arabic py-3"
          >
            إعادة تعيين
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-black text-white hover:bg-black/80 rounded-xl font-arabic py-3"
          >
            تطبيق الفلاتر
          </Button>
        </div>
      </div>
    </div>
  );
};