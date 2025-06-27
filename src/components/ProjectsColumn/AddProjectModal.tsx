
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { BasicInfoForm } from './AddProjectModal/BasicInfoForm';
import { ClientForm } from './AddProjectModal/ClientForm';
import { ContractForm } from './AddProjectModal/ContractForm';
import { TasksTab } from './AddProjectModal/TasksTab';
import { PartnershipsTab } from './AddProjectModal/PartnershipsTab';
import { AddTaskModal } from './AddTaskModal';
import type { ProjectData, TaskData } from '@/types';
import { Project } from '@/types/project';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: ProjectData) => void;
  editingProject?: Project | null;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectAdded,
  editingProject
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    name: '',
    description: '',
    owner: '',
    budget: 0,
    deadline: '',
    status: 'active',
    team: [],
    tasksCount: 0
  });

  // تحديث البيانات عند تعديل مشروع موجود
  useEffect(() => {
    if (editingProject) {
      setFormData({
        id: Number(editingProject.id),
        name: editingProject.title,
        description: editingProject.description,
        owner: editingProject.owner,
        budget: Number(editingProject.value),
        deadline: editingProject.date,
        status: editingProject.status,
        team: editingProject.team?.map(t => t.name) || [],
        tasksCount: editingProject.tasksCount
      });
    } else {
      // إعادة تعيين البيانات للمشروع الجديد
      setFormData({
        name: '',
        description: '',
        owner: '',
        budget: 0,
        deadline: '',
        status: 'active',
        team: [],
        tasksCount: 0
      });
      setTasks([]);
    }
  }, [editingProject]);

  const handleTaskAdded = (newTask: TaskData) => {
    setTasks(prev => [...prev, newTask]);
    setFormData(prev => ({
      ...prev,
      tasksCount: (prev.tasksCount || 0) + 1
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.owner && formData.budget && formData.deadline) {
      const projectData: ProjectData = {
        id: editingProject ? Number(editingProject.id) : Date.now(),
        name: formData.name,
        description: formData.description || '',
        owner: formData.owner,
        budget: formData.budget,
        deadline: formData.deadline,
        status: formData.status || 'active',
        team: formData.team || [],
        tasksCount: formData.tasksCount || 0
      };
      
      onProjectAdded(projectData);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-arabic" 
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold text-right font-arabic">
              {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100/50">
              <TabsTrigger value="basic" className="font-arabic">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="client" className="font-arabic">معلومات العميل</TabsTrigger>
              <TabsTrigger value="contract" className="font-arabic">تفاصيل العقد</TabsTrigger>
              <TabsTrigger value="tasks" className="font-arabic">المهام</TabsTrigger>
              <TabsTrigger value="partnerships" className="font-arabic">الشراكات</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <BasicInfoForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
              />
            </TabsContent>

            <TabsContent value="client" className="mt-6">
              <ClientForm />
            </TabsContent>

            <TabsContent value="contract" className="mt-6">
              <ContractForm />
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <TasksTab 
                tasks={tasks}
                onAddTask={() => setShowAddTaskModal(true)}
              />
            </TabsContent>

            <TabsContent value="partnerships" className="mt-6">
              <PartnershipsTab />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onTaskAdded={handleTaskAdded}
      />
    </>
  );
};
