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
      task: selectedTask || undefined,
      type: selectedType || undefined,
      importance: selectedImportance || undefined,
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
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border border-black/10 rounded-3xl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-black text-lg font-semibold">
            فلترة المرفقات
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* فلترة حسب المهمة */}
          <div className="space-y-2">
            <Label className="text-black font-medium">المهمة</Label>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger className="rounded-full border-black/20 bg-white/50 text-right">
                <SelectValue placeholder="اختر المهمة" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border border-black/10 rounded-xl">
                <SelectItem value="">جميع المهام</SelectItem>
                {projectTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب النوع */}
          <div className="space-y-2">
            <Label className="text-black font-medium">نوع الملف</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="rounded-full border-black/20 bg-white/50 text-right">
                <SelectValue placeholder="اختر نوع الملف" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border border-black/10 rounded-xl">
                <SelectItem value="">جميع الأنواع</SelectItem>
                {fileTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب الأهمية */}
          <div className="space-y-2">
            <Label className="text-black font-medium">مستوى الأهمية</Label>
            <Select value={selectedImportance} onValueChange={setSelectedImportance}>
              <SelectTrigger className="rounded-full border-black/20 bg-white/50 text-right">
                <SelectValue placeholder="اختر مستوى الأهمية" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border border-black/10 rounded-xl">
                <SelectItem value="">جميع المستويات</SelectItem>
                {importanceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* فلترة حسب التاقز */}
          <div className="space-y-2">
            <Label className="text-black font-medium">التاقز</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer rounded-full transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-black text-white border-black'
                      : 'bg-white/50 text-black border-black/20 hover:bg-black/5'
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

        <div className="flex gap-3 mt-8 justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="rounded-full bg-white/50 border-black/20 text-black hover:bg-black/5"
          >
            إعادة تعيين
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full bg-white/50 border-black/20 text-black hover:bg-black/5"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleApply}
            className="rounded-full bg-black text-white hover:bg-black/80"
          >
            تطبيق الفلترة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};