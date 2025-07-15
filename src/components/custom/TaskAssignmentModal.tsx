import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Users, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'منخفضة' | 'متوسطة' | 'عالية';
  status: 'جديدة' | 'قيد التنفيذ' | 'مكتملة';
}

interface HREmployee {
  id: string;
  name: string;
  position: string;
  experience: string;
}

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeId: string, taskIds: string[]) => void;
}

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Mock data for HR employees not in project team
  const hrEmployees: HREmployee[] = [
    { id: '1', name: 'سارة أحمد', position: 'أخصائية موارد بشرية', experience: '3 سنوات' },
    { id: '2', name: 'عبدالله محمد', position: 'محلل موارد بشرية', experience: '5 سنوات' },
    { id: '3', name: 'لينا خالد', position: 'مدير موارد بشرية مساعد', experience: '7 سنوات' },
    { id: '4', name: 'يوسف علي', position: 'أخصائي تطوير مواهب', experience: '4 سنوات' }
  ];

  // Mock data for project tasks
  const projectTasks: Task[] = [
    { id: '1', title: 'مراجعة ملفات الموظفين الجدد', priority: 'عالية', status: 'جديدة' },
    { id: '2', title: 'إعداد تقييمات الأداء الربعية', priority: 'متوسطة', status: 'قيد التنفيذ' },
    { id: '3', title: 'تحديث سياسات الشركة', priority: 'متوسطة', status: 'جديدة' },
    { id: '4', title: 'تنظيم ورشة تدريبية للقيادة', priority: 'عالية', status: 'جديدة' },
    { id: '5', title: 'مراجعة عقود العمل', priority: 'منخفضة', status: 'جديدة' },
    { id: '6', title: 'إعداد خطة التوظيف للربع القادم', priority: 'عالية', status: 'قيد التنفيذ' }
  ];

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSave = () => {
    if (selectedEmployee && selectedTasks.length > 0) {
      onSave(selectedEmployee, selectedTasks);
      // Reset form
      setSelectedEmployee('');
      setSelectedTasks([]);
      onClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'bg-red-100 text-red-800';
      case 'متوسطة': return 'bg-yellow-100 text-yellow-800';
      case 'منخفضة': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديدة': return 'bg-blue-100 text-blue-800';
      case 'قيد التنفيذ': return 'bg-orange-100 text-orange-800';
      case 'مكتملة': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white/10 backdrop-blur-lg border border-black/20 rounded-3xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-2xl font-bold text-black">إسناد مهام للموارد البشرية</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-black/10"
          >
            <X className="h-5 w-5 text-black" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black flex items-center gap-2">
              <Users className="h-4 w-4" />
              اختيار موظف الموارد البشرية
            </label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="bg-white/20 border border-black/30 rounded-full text-black">
                <SelectValue placeholder="اختر موظف من قسم الموارد البشرية" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-black/20 rounded-2xl">
                {hrEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id} className="rounded-xl">
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-black">{employee.name}</span>
                      <span className="text-sm text-black/70">{employee.position} • {employee.experience}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              اختيار المهام المطلوب إسنادها ({selectedTasks.length} مهام محددة)
            </label>
            <div className="bg-white/10 border border-black/20 rounded-2xl p-4">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {projectTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start space-x-3 p-3 rounded-xl bg-white/20 border border-black/10 hover:bg-white/30 transition-colors"
                    >
                      <Checkbox
                        id={task.id}
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <label
                          htmlFor={task.id}
                          className="font-medium text-black cursor-pointer"
                        >
                          {task.title}
                        </label>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Summary */}
          {selectedEmployee && selectedTasks.length > 0 && (
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
              <h4 className="font-semibold text-black mb-2">ملخص الإسناد:</h4>
              <p className="text-sm text-black/80">
                سيتم إسناد <span className="font-bold">{selectedTasks.length}</span> مهام إلى{' '}
                <span className="font-bold">
                  {hrEmployees.find(emp => emp.id === selectedEmployee)?.name}
                </span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!selectedEmployee || selectedTasks.length === 0}
              className="flex-1 bg-black text-white rounded-full hover:bg-black/90 disabled:opacity-50"
            >
              إسناد المهام
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/20 border border-black/30 text-black rounded-full hover:bg-white/30"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};