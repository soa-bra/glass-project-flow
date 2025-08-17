import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface SimpleProjectFormProps {
  projectData: {
    name: string;
    endDate: string;
    type: 'internal' | 'external';
  };
  onInputChange: (field: string, value: string) => void;
  onTypeChange: (type: 'internal' | 'external') => void;
}

export const SimpleProjectForm: React.FC<SimpleProjectFormProps> = ({
  projectData,
  onInputChange,
  onTypeChange,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Date Field */}
      <div className="space-y-2">
        <Label className="text-right font-arabic text-black font-medium">
          التاريخ
        </Label>
        <div className="relative">
          <Input
            type="date"
            value={projectData.endDate}
            onChange={(e) => onInputChange('endDate', e.target.value)}
            className="w-full h-12 rounded-2xl bg-white/60 border border-black/10 text-right font-arabic pr-12 placeholder:text-black/40"
            placeholder="اختر تاريخ المشروع"
          />
          <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
        </div>
      </div>

      {/* Project Title */}
      <div className="space-y-2">
        <Label className="text-right font-arabic text-black font-medium">
          عنوان المشروع
        </Label>
        <Input
          type="text"
          value={projectData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="w-full h-12 rounded-2xl bg-white/60 border border-black/10 text-right font-arabic px-4 placeholder:text-black/40"
          placeholder="أدخل عنوان المشروع"
        />
      </div>

      {/* Project Type */}
      <div className="space-y-2">
        <Label className="text-right font-arabic text-black font-medium">
          النوع
        </Label>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            onClick={() => onTypeChange('external')}
            className={`px-6 py-2 rounded-full font-arabic text-sm ${
              projectData.type === 'external'
                ? 'bg-black text-white'
                : 'bg-white/60 text-black border border-black/10 hover:bg-white/80'
            }`}
          >
            خارجي
          </Button>
          <Button
            type="button"
            onClick={() => onTypeChange('internal')}
            className={`px-6 py-2 rounded-full font-arabic text-sm ${
              projectData.type === 'internal'
                ? 'bg-black text-white'
                : 'bg-white/60 text-black border border-black/10 hover:bg-white/80'
            }`}
          >
            داخلي
          </Button>
        </div>
      </div>
    </div>
  );
};