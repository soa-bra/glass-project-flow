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
  priority?: string;
  category?: string;
  tags?: string[];
  dateRange?: string;
}

export const ProjectsFilterDialog: React.FC<ProjectsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const projectStatuses = [
    { value: 'active', label: 'نشط' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'pending', label: 'معلق' },
    { value: 'cancelled', label: 'ملغي' }
  ];

  const priorities = [
    { value: 'high', label: 'عالي' },
    { value: 'medium', label: 'متوسط' },
    { value: 'low', label: 'منخفض' }
  ];

  const categories = [
    { value: 'branding', label: 'علامة تجارية' },
    { value: 'marketing', label: 'تسويق' },
    { value: 'development', label: 'تطوير' },
    { value: 'design', label: 'تصميم' },
    { value: 'consulting', label: 'استشارات' }
  ];

  const dateRanges = [
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'year', label: 'هذا العام' }
  ];

  const availableTags = [
    'عاجل', 'مهم', 'عميل مميز', 'استراتيجي', 'إبداعي', 
    'تقني', 'تحليلي', 'بحثي', 'تطويري', 'ابتكاري'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleApply = () => {
    const filters: ProjectFilterOptions = {
      status: selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined,
      priority: selectedPriority && selectedPriority !== 'all' ? selectedPriority : undefined,
      category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
      dateRange: selectedDateRange && selectedDateRange !== 'all' ? selectedDateRange : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    };
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedCategory('all');
    setSelectedDateRange('all');
    setSelectedTags([]);
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
          {/* فلترة حسب الحالة */}
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

          {/* فلترة حسب الأولوية */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">مستوى الأولوية</label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر مستوى الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب الفئة */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">فئة المشروع</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر فئة المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب التاريخ */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">الفترة الزمنية</label>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفترات</SelectItem>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب التاقز */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">التاقز</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer rounded-full transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-black text-white border-black'
                      : 'bg-white/30 text-black border-black/20 hover:bg-white/40'
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
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
            تطبيق الفلترة
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};