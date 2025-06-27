
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
import type { ProjectFormData, ContractPayment } from './AddProjectModal/types';

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
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    owner: '',
    budget: '',
    deadline: '',
    status: 'info',
    team: [],
    tasksCount: 0,
    startDate: '',
    endDate: '',
    manager: '',
    clientType: 'internal',
    tasks: [],
    partnerships: [],
    hasContract: false,
    contractValue: '',
    contractPayments: []
  });

  // تحديث البيانات عند تعديل مشروع موجود
  useEffect(() => {
    if (editingProject) {
      setFormData({
        id: Number(editingProject.id),
        name: editingProject.title,
        description: editingProject.description,
        owner: editingProject.owner,
        budget: editingProject.value,
        deadline: editingProject.date,
        status: editingProject.status,
        team: editingProject.team?.map(t => t.name) || [],
        tasksCount: editingProject.tasksCount,
        startDate: '',
        endDate: editingProject.date,
        manager: editingProject.owner,
        clientType: 'internal',
        tasks: [],
        partnerships: [],
        hasContract: false,
        contractValue: '',
        contractPayments: []
      });
    } else {
      // إعادة تعيين البيانات للمشروع الجديد
      setFormData({
        name: '',
        description: '',
        owner: '',
        budget: '',
        deadline: '',
        status: 'info',
        team: [],
        tasksCount: 0,
        startDate: '',
        endDate: '',
        manager: '',
        clientType: 'internal',
        tasks: [],
        partnerships: [],
        hasContract: false,
        contractValue: '',
        contractPayments: []
      });
      setTasks([]);
    }
  }, [editingProject]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClientDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      clientData: {
        ...prev.clientData,
        name: prev.clientData?.name || '',
        type: prev.clientData?.type || '',
        responsiblePerson: prev.clientData?.responsiblePerson || '',
        phone: prev.clientData?.phone || '',
        email: prev.clientData?.email || '',
        [field]: value
      }
    }));
  };

  const handleAddPayment = () => {
    const newPayment: ContractPayment = {
      id: Date.now(),
      amount: '',
      date: ''
    };
    setFormData(prev => ({
      ...prev,
      contractPayments: [...prev.contractPayments, newPayment]
    }));
  };

  const handleRemovePayment = (id: number) => {
    setFormData(prev => ({
      ...prev,
      contractPayments: prev.contractPayments.filter(p => p.id !== id)
    }));
  };

  const handleUpdatePayment = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contractPayments: prev.contractPayments.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

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
        budget: Number(formData.budget),
        deadline: formData.deadline,
        status: formData.status,
        team: formData.team || [],
        tasksCount: formData.tasksCount || 0
      };
      
      onProjectAdded(projectData);
      onClose();
    }
  };

  const teamMembers = ['أحمد محمد', 'فاطمة علي', 'محمد سعد', 'نورا حسن'];

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
                projectData={{
                  name: formData.name,
                  manager: formData.manager,
                  description: formData.description,
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  budget: formData.budget
                }}
                onInputChange={handleInputChange}
                teamMembers={teamMembers}
              />
            </TabsContent>

            <TabsContent value="client" className="mt-6">
              <ClientForm 
                projectData={{
                  clientType: formData.clientType,
                  clientData: formData.clientData
                }}
                onInputChange={handleInputChange}
                onClientDataChange={handleClientDataChange}
              />
            </TabsContent>

            <TabsContent value="contract" className="mt-6">
              <ContractForm 
                projectData={{
                  hasContract: formData.hasContract,
                  contractValue: formData.contractValue,
                  contractPayments: formData.contractPayments
                }}
                onInputChange={handleInputChange}
                onAddPayment={handleAddPayment}
                onRemovePayment={handleRemovePayment}
                onUpdatePayment={handleUpdatePayment}
              />
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
