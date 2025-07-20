import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter } from 'lucide-react';

interface ProjectsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: ProjectFilterOptions) => void;
}

export interface ProjectFilterOptions {
  status?: string;
  projectType?: string;
  partnership?: string;
  projectManager?: string;
  remainingDays?: string;
}

export const ProjectsFilterDialog: React.FC<ProjectsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter
}) => {
  console.log('ProjectsFilterDialog loaded - no selectedPriority here');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');
  const [selectedPartnership, setSelectedPartnership] = useState<string>('all');
  const [selectedProjectManager, setSelectedProjectManager] = useState<string>('all');
  const [selectedRemainingDays, setSelectedRemainingDays] = useState<string>('all');

  const projectStatuses = [
    { value: 'on-track', label: 'وفق الخطة' },
    { value: 'delayed', label: 'متأخر' },
    { value: 'in-progress', label: 'تحت المعالجة' },
    { value: 'paused', label: 'متوقف' },
    { value: 'not-started', label: 'لم يبدأ' }
  ];

  const projectTypes = [
    { value: 'internal', label: 'داخلي' },
    { value: 'external', label: 'خارجي' }
  ];

  const partnerships = [
    { value: 'independent', label: 'ذاتي' },
    { value: 'collaborative', label: 'تشاركي (يوجد شريك)' }
  ];

  const projectManagers = [
    { value: 'ahmed-salem', label: 'أحمد سالم' },
    { value: 'sara-khalil', label: 'سارة خليل' },
    { value: 'mohammed-ali', label: 'محمد علي' },
    { value: 'fatima-hassan', label: 'فاطمة حسن' },
    { value: 'omar-nasser', label: 'عمر ناصر' }
  ];

  const remainingDaysOptions = [
    { value: 'week', label: 'أسبوع' },
    { value: 'two-weeks', label: 'أسبوعين' },
    { value: 'month', label: 'شهر' },
    { value: 'two-months', label: 'شهرين' },
    { value: 'six-months', label: 'ست أشهر' }
  ];

  const handleApply = () => {
    const filters: ProjectFilterOptions = {
      status: selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined,
      projectType: selectedProjectType && selectedProjectType !== 'all' ? selectedProjectType : undefined,
      partnership: selectedPartnership && selectedPartnership !== 'all' ? selectedPartnership : undefined,
      projectManager: selectedProjectManager && selectedProjectManager !== 'all' ? selectedProjectManager : undefined,
      remainingDays: selectedRemainingDays && selectedRemainingDays !== 'all' ? selectedRemainingDays : undefined
    };
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedStatus('all');
    setSelectedProjectType('all');
    setSelectedPartnership('all');
    setSelectedProjectManager('all');
    setSelectedRemainingDays('all');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <DialogTitle className="sr-only">فلترة المشاريع</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">فلترة المشاريع</h2>
              <p className="text-sm text-black/70">تصفية وبحث المشاريع</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-transparent hover:bg-black/5 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* فلترة حسب حالة المشروع */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">حالة المشروع</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر حالة المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {projectStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب نوع المشروع */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">نوع المشروع</label>
            <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر نوع المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب الشراكة */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">الشراكة</label>
            <Select value={selectedPartnership} onValueChange={setSelectedPartnership}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر نوع الشراكة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {partnerships.map((partnership) => (
                  <SelectItem key={partnership.value} value={partnership.value}>
                    {partnership.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب مدير المشروع */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">مدير المشروع</label>
            <Select value={selectedProjectManager} onValueChange={setSelectedProjectManager}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر مدير المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المديرين</SelectItem>
                {projectManagers.map((manager) => (
                  <SelectItem key={manager.value} value={manager.value}>
                    {manager.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب عدد الأيام المتبقية */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">عدد الأيام المتبقية</label>
            <Select value={selectedRemainingDays} onValueChange={setSelectedRemainingDays}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر فترة الأيام المتبقية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفترات</SelectItem>
                {remainingDaysOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium transition-colors"
          >
            تطبيق الفلترة
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};