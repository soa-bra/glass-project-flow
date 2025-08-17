
import React from 'react';
import { UnifiedInput, UnifiedTextarea, UnifiedSelect } from '@/components/ui/UnifiedInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  teamMembers,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <UnifiedInput
            label="اسم المشروع *"
            value={projectData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="أدخل اسم المشروع"
            fullWidth
          />
        </div>
        
        <div>
          <UnifiedSelect
            label="مدير المشروع *"
            value={projectData.manager}
            onChange={(e) => onInputChange('manager', e.target.value)}
            placeholder="اختر مدير المشروع"
            options={teamMembers.map(member => ({ value: member, label: member }))}
            fullWidth
          />
        </div>
      </div>

      <div>
        <UnifiedTextarea
          label="وصف المشروع"
          value={projectData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="أدخل وصف المشروع"
          rows={4}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <UnifiedInput
            label="تاريخ البدء *"
            type="date"
            value={projectData.startDate}
            onChange={(e) => onInputChange('startDate', e.target.value)}
            fullWidth
          />
        </div>
        
        <div>
          <UnifiedInput
            label="تاريخ التسليم المتوقع *"
            type="date"
            value={projectData.endDate}
            onChange={(e) => onInputChange('endDate', e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <div>
        <UnifiedInput
          label="الميزانية (ر.س)"
          type="number"
          value={projectData.budget}
          onChange={(e) => onInputChange('budget', e.target.value)}
          placeholder="0"
          fullWidth
        />
      </div>

      <div className="space-y-4">
        <div className="font-medium text-ink text-right font-arabic">أعضاء الفريق</div>
        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {teamMembers.map((member) => (
            <div key={member} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`team-${member}`}
                checked={projectData.team?.includes(member) || false}
                onCheckedChange={() => handleTeamMemberToggle(member)}
                className="data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <Label 
                htmlFor={`team-${member}`} 
                className="font-arabic text-sm cursor-pointer"
              >
                {member}
              </Label>
            </div>
          ))}
        </div>
        {projectData.team && projectData.team.length > 0 && (
          <div className="text-sm text-gray-600 font-arabic text-right">
            تم اختيار {projectData.team.length} من أعضاء الفريق
          </div>
        )}
      </div>
    </div>
  );
};
