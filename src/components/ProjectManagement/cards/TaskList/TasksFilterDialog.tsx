import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter } from 'lucide-react';

interface TasksFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: TaskFilterOptions) => void;
}

export interface TaskFilterOptions {
  status?: string;
  priority?: string;
  assignee?: string;
  search?: string;
}

export const TasksFilterDialog: React.FC<TasksFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'To-Do', label: 'مجدولة' },
    { value: 'In Progress', label: 'قيد التنفيذ' },
    { value: 'Treating', label: 'تحت المعالجة' },
    { value: 'Late', label: 'متأخرة' },
    { value: 'Stopped', label: 'متوقفة' },
    { value: 'Done', label: 'مكتملة' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'urgent', label: 'عاجل' },
    { value: 'high', label: 'مرتفع' },
    { value: 'medium', label: 'متوسط' },
    { value: 'low', label: 'منخفض' }
  ];

  const assigneeOptions = [
    { value: 'all', label: 'جميع الأعضاء' },
    { value: 'أحمد محمد', label: 'أحمد محمد' },
    { value: 'فاطمة علي', label: 'فاطمة علي' },
    { value: 'محمد خالد', label: 'محمد خالد' },
    { value: 'نورا سعد', label: 'نورا سعد' }
  ];

  const handleApply = () => {
    const filters: TaskFilterOptions = {
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      priority: selectedPriority === 'all' ? undefined : selectedPriority,
      assignee: selectedAssignee === 'all' ? undefined : selectedAssignee,
      search: searchTerm.trim() || undefined
    };
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedAssignee('all');
    setSearchTerm('');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-2xl p-0 overflow-hidden z-[9998]"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <DialogTitle className="sr-only">فلترة المهام</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">فلترة المهام</h2>
              <p className="text-sm text-black/70">اختر المرشحات لتصفية المهام</p>
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
          {/* البحث */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">البحث</label>
            <input
              type="text"
              placeholder="ابحث في المهام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* الحالة */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">الحالة</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border border-black/20 shadow-lg">
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* الأولوية */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">الأولوية</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border border-black/20 shadow-lg">
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* المسؤول */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">المسؤول</label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                  <SelectValue placeholder="اختر المسؤول" />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border border-black/20 shadow-lg">
                  {assigneeOptions.map((assignee) => (
                    <SelectItem key={assignee.value} value={assignee.value}>
                      {assignee.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* معاينة المرشحات */}
          <div className="p-4 bg-white/20 rounded-2xl border border-black/10">
            <p className="text-sm text-black/70 mb-2">معاينة المرشحات النشطة:</p>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
                  البحث: {searchTerm}
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
                  الحالة: {statusOptions.find(s => s.value === selectedStatus)?.label}
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
                  الأولوية: {priorityOptions.find(p => p.value === selectedPriority)?.label}
                </span>
              )}
              {selectedAssignee !== 'all' && (
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
                  المسؤول: {selectedAssignee}
                </span>
              )}
              {searchTerm === '' && selectedStatus === 'all' && selectedPriority === 'all' && selectedAssignee === 'all' && (
                <span className="px-3 py-1 bg-black/20 text-black text-xs rounded-full">
                  لا توجد مرشحات نشطة
                </span>
              )}
            </div>
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
            تطبيق المرشحات
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};