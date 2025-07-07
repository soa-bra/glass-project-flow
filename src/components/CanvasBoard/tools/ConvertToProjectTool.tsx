import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GitBranch, Folder, Calendar, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConvertToProjectToolProps {
  selectedTool: string;
  onConvert: (projectData: {
    name: string;
    description: string;
    category: string;
    deadline: string;
    assignees: string[];
  }) => void;
}

export const ConvertToProjectTool: React.FC<ConvertToProjectToolProps> = ({ 
  selectedTool, 
  onConvert 
}) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  if (selectedTool !== 'convert-project') return null;

  const handleConvert = () => {
    if (projectName.trim()) {
      onConvert({
        name: projectName.trim(),
        description: description.trim(),
        category,
        deadline,
        assignees: []
      });
    }
  };

  const categories = [
    { value: 'brand', label: 'العلامة التجارية' },
    { value: 'marketing', label: 'التسويق' },
    { value: 'design', label: 'التصميم' },
    { value: 'research', label: 'البحث' },
    { value: 'strategy', label: 'الاستراتيجية' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-4 h-4" />
          <span className="text-sm font-medium font-arabic">تحويل لمشروع</span>
        </div>
        <div className="text-sm font-arabic text-gray-600">
          حول الكانفس الحالي إلى مشروع منظم
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium font-arabic">اسم المشروع</label>
          <Input
            placeholder="أدخل اسم المشروع..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium font-arabic">الوصف</label>
          <Textarea
            placeholder="وصف مختصر للمشروع..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium font-arabic">الفئة</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="اختر فئة المشروع" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium font-arabic">الموعد النهائي</label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <Button
        onClick={handleConvert}
        disabled={!projectName.trim()}
        className="w-full text-sm font-arabic"
      >
        <Folder className="w-4 h-4 mr-2" />
        إنشاء المشروع
      </Button>

      <div className="text-xs text-gray-500 font-arabic space-y-1">
        <div>📋 سيتم إنشاء مهام من العناصر الموجودة</div>
        <div>📅 يمكن تعديل التفاصيل لاحقاً في لوحة المشاريع</div>
        <div>👥 يمكن إضافة أعضاء الفريق بعد الإنشاء</div>
      </div>
    </div>
  );
};