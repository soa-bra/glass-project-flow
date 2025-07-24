import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
interface BasicInfoFormProps {
  projectData: {
    name: string;
    manager: string;
    description: string;
    startDate: string;
    endDate: string;
    budget: string;
    team: string[];
  };
  onInputChange: (field: string, value: unknown) => void;
  teamMembers: string[];
}
export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  projectData,
  onInputChange,
  teamMembers
}) => {
  const handleTeamMemberToggle = (member: string) => {
    const currentTeam = projectData.team || [];
    const isSelected = currentTeam.includes(member);
    if (isSelected) {
      onInputChange('team', currentTeam.filter(m => m !== member));
    } else {
      onInputChange('team', [...currentTeam, member]);
    }
  };
  return <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">اسم المشروع *</Label>
          <Input value={projectData.name} onChange={e => onInputChange('name', e.target.value)} placeholder="أدخل اسم المشروع" className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">مدير المشروع *</Label>
          <Select value={projectData.manager} onValueChange={value => onInputChange('manager', value)}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors">
              <SelectValue placeholder="اختر مدير المشروع" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map(member => <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">وصف المشروع</Label>
        <Textarea value={projectData.description} onChange={e => onInputChange('description', e.target.value)} className="text-right font-arabic min-h-[100px]" placeholder="أدخل وصف المشروع" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ البدء *</Label>
          <Input type="date" value={projectData.startDate} onChange={e => onInputChange('startDate', e.target.value)} className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ التسليم المتوقع *</Label>
          <Input type="date" value={projectData.endDate} onChange={e => onInputChange('endDate', e.target.value)} className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الميزانية (ر.س)</Label>
        <Input type="number" value={projectData.budget} onChange={e => onInputChange('budget', e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
      </div>

      <div className="space-y-4">
        <Label className="font-arabic text-right">أعضاء الفريق</Label>
        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {teamMembers.map(member => <div key={member} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`team-${member}`} checked={projectData.team?.includes(member) || false} onCheckedChange={() => handleTeamMemberToggle(member)} className="data-[state=checked]:bg-black data-[state=checked]:border-black" />
              <Label htmlFor={`team-${member}`} className="font-arabic text-sm cursor-pointer">
                {member}
              </Label>
            </div>)}
        </div>
        {projectData.team && projectData.team.length > 0 && <div className="text-sm text-gray-600 font-arabic text-right">
            تم اختيار {projectData.team.length} من أعضاء الفريق
          </div>}
      </div>
    </div>;
};