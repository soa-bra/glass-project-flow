import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { X, Plus, Edit3 } from 'lucide-react';
import { ProjectFile } from '@/data/projectFiles';

interface EditFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: ProjectFile | null;
  onSave: (fileId: string, updates: Partial<ProjectFile>) => void;
  projectTasks?: Array<{
    id: string;
    title: string;
  }>;
}

export const EditFileDialog: React.FC<EditFileDialogProps> = ({
  isOpen,
  onClose,
  file,
  onSave,
  projectTasks = []
}) => {
  const [name, setName] = useState('');
  const [linkedTask, setLinkedTask] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [importance, setImportance] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (file) {
      setName(file.name);
      setLinkedTask(file.linkedTask || '');
      setTags(file.tags || []);
      setImportance(file.classification || '');
      // استخراج المهام المربوطة من التاجات
      const linkedTaskTitles = file.tags?.filter(tag => 
        projectTasks.some(task => task.title === tag)
      ) || [];
      const linkedTaskIds = linkedTaskTitles.map(title => 
        projectTasks.find(task => task.title === title)?.id
      ).filter(Boolean) as string[];
      setSelectedTasks(linkedTaskIds);
    }
  }, [file, projectTasks]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSave = () => {
    if (file && name.trim()) {
      // دمج التاجات العادية مع المهام المختارة
      const taskTags = selectedTasks.map(taskId => 
        projectTasks.find(task => task.id === taskId)?.title || ''
      ).filter(Boolean);
      
      const allTags = [...tags, ...taskTags];
      
      onSave(file.id, {
        name: name.trim(),
        linkedTask,
        tags: allTags,
        classification: importance as any
      });
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] p-0 overflow-hidden font-arabic"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
        }}
      >
        <DialogTitle className="sr-only">تعديل الملف</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">تعديل الملف</h2>
              <p className="text-sm text-black/70">تعديل معلومات وإعدادات الملف</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* اسم الملف */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                اسم الملف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم الملف"
                className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
              />
            </div>


            {/* التاجات */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">
                التاجات
              </label>
              <p className="text-xs text-black/70">
                إدارة تاجات الملف لتسهيل البحث والتصنيف
              </p>
              
              {/* عرض التاجات المضافة */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <BaseBadge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </BaseBadge>
                  ))}
                </div>
              )}

              {/* إضافة تاج جديد */}
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="إضافة تاج جديد"
                  className="flex-1 px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="px-4 py-3 bg-black/10 hover:bg-black/20 disabled:bg-black/5 disabled:cursor-not-allowed rounded-2xl flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إضافة
                </button>
              </div>
            </div>

            {/* أهمية الملف */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">
                أهمية الملف
              </label>
              <p className="text-xs text-black/70">
                تحديد مستوى أهمية الملف في المشروع
              </p>
              <Select value={importance} onValueChange={setImportance}>
                <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black focus:outline-none focus:border-black transition-colors">
                  <SelectValue placeholder="اختر مستوى الأهمية" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-black/20 rounded-2xl shadow-xl z-[10000]">
                  <SelectItem value="High">عالي - ملف مهم جداً</SelectItem>
                  <SelectItem value="Medium">متوسط - ملف مهم</SelectItem>
                  <SelectItem value="Low">منخفض - ملف عادي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ربط المهام */}
            {projectTasks.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-black">
                  ربط بالمهام (اختياري)
                </label>
                <p className="text-xs text-black/70 mb-3">
                  يمكنك ربط هذا الملف بمهام محددة في المشروع
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {projectTasks.map((task) => (
                    <label key={task.id} className="flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-2xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskToggle(task.id)}
                        className="w-4 h-4 text-black border-black/30 rounded focus:ring-black"
                      />
                      <span className="text-sm text-black font-medium">{task.title}</span>
                    </label>
                  ))}
                </div>
                {selectedTasks.length > 0 && (
                  <p className="text-xs text-black/70">
                    تم تحديد {selectedTasks.length} مهمة
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-6 py-3 bg-black hover:bg-black/90 disabled:bg-black/50 disabled:cursor-not-allowed rounded-full text-white font-medium transition-colors"
          >
            حفظ التغييرات
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};