
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SimpleProjectFormProps {
  projectData: {
    name: string;
    endDate: string;
    location: 'internal' | 'external';
  };
  onInputChange: (field: string, value: unknown) => void;
}

export const SimpleProjectForm: React.FC<SimpleProjectFormProps> = ({
  projectData,
  onInputChange,
}) => {
  return (
    <div className="space-y-8 px-8 py-6">
      {/* التاريخ */}
      <div className="space-y-3">
        <Label className="text-lg font-medium text-gray-900 font-arabic block text-right">
          التاريخ
        </Label>
        <div className="relative">
          <Input
            type="date"
            value={projectData.endDate}
            onChange={(e) => onInputChange('endDate', e.target.value)}
            className="w-full h-14 text-right font-arabic bg-gray-50 border-gray-200 rounded-xl px-4 text-gray-500"
            placeholder="اختر تاريخ الحدث"
          />
        </div>
      </div>

      {/* عنوان الحدث */}
      <div className="space-y-3">
        <Label className="text-lg font-medium text-gray-900 font-arabic block text-right">
          عنوان الحدث
        </Label>
        <Input
          value={projectData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="w-full h-14 text-right font-arabic bg-gray-50 border-gray-200 rounded-xl px-4"
          placeholder="أدخل عنوان الحدث"
        />
      </div>

      {/* الموقع */}
      <div className="space-y-3">
        <Label className="text-lg font-medium text-gray-900 font-arabic block text-right">
          الموقع
        </Label>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant={projectData.location === 'external' ? 'default' : 'outline'}
            onClick={() => onInputChange('location', 'external')}
            className={`h-12 px-6 rounded-full font-arabic ${
              projectData.location === 'external'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            خارجي
          </Button>
          <Button
            type="button"
            variant={projectData.location === 'internal' ? 'default' : 'outline'}
            onClick={() => onInputChange('location', 'internal')}
            className={`h-12 px-6 rounded-full font-arabic ${
              projectData.location === 'internal'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            داخلي
          </Button>
        </div>
      </div>
    </div>
  );
};
