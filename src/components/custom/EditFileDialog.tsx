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
import { Badge } from '@/components/ui/badge';
import { X, Plus, Edit3 } from 'lucide-react';
import { ProjectFile } from '@/data/projectFiles';

interface EditFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: ProjectFile | null;
  onSave: (fileId: string, updates: Partial<ProjectFile>) => void;
}

export const EditFileDialog: React.FC<EditFileDialogProps> = ({
  isOpen,
  onClose,
  file,
  onSave
}) => {
  const [name, setName] = useState('');
  const [linkedTask, setLinkedTask] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [importance, setImportance] = useState('');

  useEffect(() => {
    if (file) {
      setName(file.name);
      setLinkedTask(file.linkedTask || '');
      setTags(file.tags || []);
      setImportance(file.classification || '');
    }
  }, [file]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (file && name.trim()) {
      onSave(file.id, {
        name: name.trim(),
        linkedTask,
        tags,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <Edit3 className="w-5 h-5" />
            تعديل الملف
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* اسم الملف */}
          <div className="space-y-2">
            <Label htmlFor="fileName">اسم الملف</Label>
            <Input
              id="fileName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم الملف"
            />
          </div>

          {/* المهمة المرتبطة */}
          <div className="space-y-2">
            <Label htmlFor="linkedTask">المهمة المرتبطة</Label>
            <Input
              id="linkedTask"
              value={linkedTask}
              onChange={(e) => setLinkedTask(e.target.value)}
              placeholder="أدخل اسم المهمة (اختياري)"
            />
          </div>

          {/* التاجات */}
          <div className="space-y-2">
            <Label>التاجات</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="إضافة تاج جديد"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* أهمية الملف */}
          <div className="space-y-2">
            <Label>أهمية الملف</Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger>
                <SelectValue placeholder="اختر مستوى الأهمية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">عالي</SelectItem>
                <SelectItem value="Medium">متوسط</SelectItem>
                <SelectItem value="Low">منخفض</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!name.trim()}
            >
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};