import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
interface ProjectsSortDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySort: (sortOptions: ProjectSortOptions) => void;
}
export interface ProjectSortOptions {
  sortBy: 'name' | 'deadline' | 'status' | 'manager' | 'tasks' | 'team' | 'budget';
  direction: 'asc' | 'desc';
}
export const ProjectsSortDialog: React.FC<ProjectsSortDialogProps> = ({
  isOpen,
  onClose,
  onApplySort
}) => {
  const [selectedSortBy, setSelectedSortBy] = useState<string>('deadline');
  const [selectedDirection, setSelectedDirection] = useState<string>('asc');
  const sortCriteria = [{
    value: 'name',
    label: 'الاسم'
  }, {
    value: 'deadline',
    label: 'تاريخ التسليم'
  }, {
    value: 'status',
    label: 'الحالة'
  }, {
    value: 'manager',
    label: 'مدير المشروع'
  }, {
    value: 'tasks',
    label: 'عدد المهام'
  }, {
    value: 'team',
    label: 'عدد أعضاء الفريق'
  }, {
    value: 'budget',
    label: 'ميزانية المشروع'
  }];
  const sortDirections = [{
    value: 'asc',
    label: 'تصاعدي',
    icon: ArrowUp
  }, {
    value: 'desc',
    label: 'تنازلي',
    icon: ArrowDown
  }];
  const handleApply = () => {
    const sortOptions: ProjectSortOptions = {
      sortBy: selectedSortBy as ProjectSortOptions['sortBy'],
      direction: selectedDirection as ProjectSortOptions['direction']
    };
    onApplySort(sortOptions);
    onClose();
  };
  const handleReset = () => {
    setSelectedSortBy('deadline');
    setSelectedDirection('asc');
  };
  const handleClose = () => {
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden z-[9998]" style={{
      background: 'rgba(255,255,255,0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
    }}>
        <DialogTitle className="sr-only">ترتيب المشاريع</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">ترتيب المشاريع</h2>
              <p className="text-sm text-black/70">اختر معيار وطريقة الترتيب</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition justify-self-end">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* ترتيب حسب */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">ترتيب حسب</label>
            <Select value={selectedSortBy} onValueChange={setSelectedSortBy}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر معيار الترتيب" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white border border-black/20 shadow-lg">
                {sortCriteria.map(criteria => <SelectItem key={criteria.value} value={criteria.value}>
                    {criteria.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* اتجاه الترتيب */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">اتجاه الترتيب</label>
            <div className="flex bg-transparent border border-black/10 rounded-full p-1 w-fit mx-auto">
              {sortDirections.map(direction => {
              const IconComponent = direction.icon;
              return <button key={direction.value} onClick={() => setSelectedDirection(direction.value)} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors font-arabic flex items-center gap-2 ${selectedDirection === direction.value ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}>
                    <IconComponent className="w-4 h-4" />
                    <span>{direction.label}</span>
                  </button>;
            })}
            </div>
          </div>

          {/* معاينة الترتيب */}
          <div className="p-4 bg-white/20 rounded-2xl border border-black/10">
            <p className="text-sm text-black/70 mb-2">معاينة الترتيب:</p>
            <p className="text-sm font-medium text-black">
              {sortCriteria.find(c => c.value === selectedSortBy)?.label} - {sortDirections.find(d => d.value === selectedDirection)?.label}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button onClick={handleReset} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors">
            إعادة تعيين
          </button>
          <button onClick={handleClose} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors">
            إلغاء
          </button>
          <button onClick={handleApply} className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium transition-colors">
            تطبيق الترتيب
          </button>
        </div>
      </DialogContent>
    </Dialog>;
};