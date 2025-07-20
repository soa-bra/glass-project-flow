import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterOptions) => void;
  projectTasks?: Array<{ id: string; title: string }>;
  availableTags?: string[];
}

export interface FilterOptions {
  task?: string;
  type?: string;
  importance?: string;
  tags?: string[];
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  projectTasks = [],
  availableTags = []
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedImportance, setSelectedImportance] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fileTypes = [
    { value: 'document', label: 'وثيقة' },
    { value: 'image', label: 'صورة' },
    { value: 'video', label: 'فيديو' },
    { value: 'audio', label: 'صوت' },
    { value: 'archive', label: 'أرشيف' }
  ];

  const importanceLevels = [
    { value: 'High', label: 'عالي' },
    { value: 'Medium', label: 'متوسط' },
    { value: 'Low', label: 'منخفض' }
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleApply = () => {
    const filters: FilterOptions = {
      task: selectedTask && selectedTask !== 'all' ? selectedTask : undefined,
      type: selectedType && selectedType !== 'all' ? selectedType : undefined,
      importance: selectedImportance && selectedImportance !== 'all' ? selectedImportance : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    };
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedTask('');
    setSelectedType('');
    setSelectedImportance('');
    setSelectedTags([]);
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">فلترة المرفقات</h2>
              <p className="text-sm text-black/70">تصفية وبحث المرفقات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-transparent hover:bg-black/5 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* فلترة حسب المهمة */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">المهمة</label>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر المهمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المهام</SelectItem>
                {projectTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب النوع */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">نوع الملف</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر نوع الملف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {fileTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب الأهمية */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-black">مستوى الأهمية</label>
            <Select value={selectedImportance} onValueChange={setSelectedImportance}>
              <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                <SelectValue placeholder="اختر مستوى الأهمية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                {importanceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
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
            onClick={onClose}
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