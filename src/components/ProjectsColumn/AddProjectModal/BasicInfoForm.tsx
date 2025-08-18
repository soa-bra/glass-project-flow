
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
        <div className="space-y-2">
          <Label className="font-arabic text-right">اسم المشروع <span className="text-red-500">*</span></Label>
          <Input
            value={projectData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
            placeholder="أدخل اسم المشروع"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">مدير المشروع <span className="text-red-500">*</span></Label>
          <Select value={projectData.manager} onValueChange={(value) => onInputChange('manager', value)}>
            <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
              <SelectValue placeholder="اختر مدير المشروع" />
            </SelectTrigger>
            <SelectContent 
              className="z-[10000] text-[#0B0F12] font-arabic"
              style={{
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
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
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none min-h-[100px]"
          placeholder="أدخل وصف المشروع"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ البدء <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none justify-start text-left font-normal",
                  !projectData.startDate && "text-black/50"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {projectData.startDate ? (
                  format(new Date(projectData.startDate), "PPP", { locale: ar })
                ) : (
                  <span>اختر تاريخ البدء</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[10000]" align="start">
              <Calendar 
                mode="single" 
                selected={projectData.startDate ? new Date(projectData.startDate) : undefined} 
                onSelect={(date) => onInputChange('startDate', date ? format(date, 'yyyy-MM-dd') : '')} 
                initialFocus 
                className="p-3 pointer-events-auto" 
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ التسليم المتوقع <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none justify-start text-left font-normal",
                  !projectData.endDate && "text-black/50"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {projectData.endDate ? (
                  format(new Date(projectData.endDate), "PPP", { locale: ar })
                ) : (
                  <span>اختر تاريخ التسليم</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[10000]" align="start">
              <Calendar 
                mode="single" 
                selected={projectData.endDate ? new Date(projectData.endDate) : undefined} 
                onSelect={(date) => onInputChange('endDate', date ? format(date, 'yyyy-MM-dd') : '')} 
                initialFocus 
                className="p-3 pointer-events-auto" 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الميزانية (ر.س)</Label>
        <Input
          type="number"
          value={projectData.budget}
          onChange={(e) => onInputChange('budget', e.target.value)}
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
          placeholder="0"
        />
      </div>

      <div className="space-y-4">
        <Label className="font-arabic text-right">أعضاء الفريق</Label>
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
