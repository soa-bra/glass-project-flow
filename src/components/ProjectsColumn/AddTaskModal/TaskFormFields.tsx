
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
          className="text-right font-arabic rounded-full bg-black/40 backdrop-blur-md border-white/20 text-white placeholder:text-white/70"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الوصف</Label>
        <Textarea 
          value={taskData.description} 
          onChange={e => onInputChange('description', e.target.value)} 
          placeholder="أدخل وصف المهمة" 
          className="text-right font-arabic min-h-[100px] rounded-xl bg-black/40 backdrop-blur-md border-white/20 text-white placeholder:text-white/70"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right">تاريخ الاستحقاق *</Label>
          <Input 
            type="date" 
            value={taskData.dueDate} 
            onChange={e => onInputChange('dueDate', e.target.value)} 
            className="text-right font-arabic rounded-full bg-black/40 backdrop-blur-md border-white/20 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right">المكلف</Label>
          <Select value={taskData.assignee} onValueChange={value => onInputChange('assignee', value)}>
            <SelectTrigger className="text-right font-arabic rounded-full bg-black/40 backdrop-blur-md border-white/20 text-white">
              <SelectValue placeholder="اختر المكلف" />
            </SelectTrigger>
            <SelectContent>
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
          <SelectTrigger className="text-right font-arabic rounded-full bg-black/40 backdrop-blur-md border-white/20 text-white">
            <SelectValue placeholder="اختر الأولوية" />
          </SelectTrigger>
          <SelectContent>
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
          className="text-right font-arabic rounded-full bg-black/40 backdrop-blur-md border-white/20 text-white file:text-white"
        />
      </div>
    </div>
  );
};
