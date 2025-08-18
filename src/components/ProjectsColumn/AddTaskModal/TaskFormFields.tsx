
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TaskFormData, teamMembers, priorities } from './types';

interface TaskFormFieldsProps {
  taskData: TaskFormData;
  onInputChange: (field: string, value: string) => void;
  onTaskDataChange: (updater: (prev: TaskFormData) => TaskFormData) => void;
}

export const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  taskData,
  onInputChange,
  onTaskDataChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-arabic text-right">عنوان المهمة *</Label>
        <Input 
          value={taskData.title} 
          onChange={e => onInputChange('title', e.target.value)} 
          placeholder="أدخل عنوان المهمة" 
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الوصف</Label>
        <Textarea 
          value={taskData.description} 
          onChange={e => onInputChange('description', e.target.value)} 
          placeholder="أدخل وصف المهمة" 
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ الاستحقاق *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none justify-start text-left font-normal",
                  !taskData.dueDate && "text-black/50"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {taskData.dueDate ? (
                  format(new Date(taskData.dueDate), "PPP", { locale: ar })
                ) : (
                  <span>اختر تاريخ الاستحقاق</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[10000]" align="start">
              <Calendar 
                mode="single" 
                selected={taskData.dueDate ? new Date(taskData.dueDate) : undefined} 
                onSelect={(date) => onInputChange('dueDate', date ? format(date, 'yyyy-MM-dd') : '')} 
                initialFocus 
                className="p-3 pointer-events-auto" 
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">المكلف</Label>
          <Select value={taskData.assignee} onValueChange={value => onInputChange('assignee', value)}>
            <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
              <SelectValue placeholder="اختر المكلف" />
            </SelectTrigger>
            <SelectContent className="z-[10000] sb-popover-shell text-[#0B0F12] font-arabic">
              {teamMembers.map(member => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الأولوية</Label>
        <Select 
          value={taskData.priority} 
          onValueChange={(value: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important') => 
            onTaskDataChange(prev => ({ ...prev, priority: value }))
          }
        >
          <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
            <SelectValue placeholder="اختر الأولوية" />
          </SelectTrigger>
          <SelectContent className="z-[10000] sb-popover-shell text-[#0B0F12] font-arabic">
            {priorities.map(priority => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">المرفقات</Label>
        <Input 
          type="file" 
          multiple 
          onChange={e => {
            const files = Array.from(e.target.files || []);
            onTaskDataChange(prev => ({
              ...prev,
              attachments: files.map(file => file.name)
            }));
          }} 
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none file:text-black"
        />
      </div>
    </div>
  );
};
