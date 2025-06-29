
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoFormProps {
  projectData: {
    name: string;
    manager: string;
    description: string;
    startDate: string;
    endDate: string;
    budget: string;
  };
  onInputChange: (field: string, value: unknown) => void;
  teamMembers: string[];
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  projectData,
  onInputChange,
  teamMembers,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">اسم المشروع *</Label>
          <Input
            value={projectData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="text-right font-arabic"
            placeholder="أدخل اسم المشروع"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">مدير المشروع *</Label>
          <Select value={projectData.manager} onValueChange={(value) => onInputChange('manager', value)}>
            <SelectTrigger className="text-right font-arabic">
              <SelectValue placeholder="اختر مدير المشروع" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">وصف المشروع</Label>
        <Textarea
          value={projectData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="text-right font-arabic min-h-[100px]"
          placeholder="أدخل وصف المشروع"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ البدء *</Label>
          <Input
            type="date"
            value={projectData.startDate}
            onChange={(e) => onInputChange('startDate', e.target.value)}
            className="text-right font-arabic"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ التسليم المتوقع *</Label>
          <Input
            type="date"
            value={projectData.endDate}
            onChange={(e) => onInputChange('endDate', e.target.value)}
            className="text-right font-arabic"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الميزانية (ر.س)</Label>
        <Input
          type="number"
          value={projectData.budget}
          onChange={(e) => onInputChange('budget', e.target.value)}
          className="text-right font-arabic"
          placeholder="0"
        />
      </div>
    </div>
  );
};
