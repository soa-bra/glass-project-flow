import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddTaskModal } from './AddTaskModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ProjectData, TaskData } from '@/types';
import { BasicInfoForm } from './AddProjectModal/BasicInfoForm';
import { ClientForm } from './AddProjectModal/ClientForm';
import { TasksTab } from './AddProjectModal/TasksTab';
import { ContractForm } from './AddProjectModal/ContractForm';
import { PartnershipsTab } from './AddProjectModal/PartnershipsTab';
import type { ProjectFormData, ContractPayment } from './AddProjectModal/types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: ProjectData) => void;
  onProjectUpdated?: (project: ProjectData) => void;
  editingProject?: ProjectData | null;
  isEditMode?: boolean;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectAdded,
  onProjectUpdated,
  editingProject,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [projectData, setProjectData] = useState<ProjectFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    deadline: '',
    manager: '',
    owner: '',
    team: [],
    budget: '',
    status: 'info',
    tasksCount: 0,
    clientType: 'internal',
    tasks: [],
    partnerships: [],
    hasContract: false,
    contractValue: '',
    contractPayments: [{ amount: '', date: '', id: 1 }],
  });

  // تعبئة البيانات عند التعديل
  useEffect(() => {
    if (isEditMode && editingProject) {
      setProjectData({
        name: editingProject.name || '',
        description: editingProject.description || '',
        startDate: '',
        endDate: '',
        deadline: editingProject.deadline || '',
        manager: editingProject.owner || '',
        owner: editingProject.owner || '',
        team: editingProject.team || [],
        budget: editingProject.budget?.toString() || '',
        status: editingProject.status || 'info',
        tasksCount: editingProject.tasksCount || 0,
        clientType: 'internal',
        tasks: [],
        partnerships: [],
        hasContract: false,
        contractValue: '',
        contractPayments: [{ amount: '', date: '', id: 1 }],
      });
    }
  }, [isEditMode, editingProject]);

  const teamMembers = [
    'أحمد محمد',
    'فاطمة علي',
    'خالد الأحمد',
    'نورا السالم',
    'محمد العتيبي',
    'سارة النجار'
  ];

  const handleInputChange = (field: string, value: unknown) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleClientDataChange = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      clientData: { ...prev.clientData!, [field]: value }
    }));
  };

  const validateForm = (): boolean => {
    if (!projectData.name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم المشروع مطلوب",
        variant: "destructive",
      });
      return false;
    }
    if (!projectData.manager) {
      toast({
        title: "خطأ في التحقق",
        description: "مدير المشروع مطلوب",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleGenerateSmartTasks = () => {
    // توليد مهام ذكية بناءً على بيانات المشروع
    const smartTasks: TaskData[] = [
      {
        id: Date.now() + 1,
        title: 'تحليل المتطلبات',
        description: 'تحليل وتوثيق متطلبات المشروع',
        assignee: projectData.manager || teamMembers[0],
        dueDate: projectData.startDate || new Date().toISOString().split('T')[0],
        priority: 'high',
        status: 'pending'
      },
      {
        id: Date.now() + 2,
        title: 'إعداد خطة العمل',
        description: 'وضع خطة زمنية تفصيلية للمشروع',
        assignee: projectData.manager || teamMembers[0],
        dueDate: projectData.startDate || new Date().toISOString().split('T')[0],
        priority: 'high',
        status: 'pending'
      },
      {
        id: Date.now() + 3,
        title: 'مراجعة الميزانية',
        description: 'مراجعة وتوزيع الميزانية على مراحل المشروع',
        assignee: projectData.team?.[0] || teamMembers[1],
        dueDate: projectData.startDate || new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending'
      }
    ];

    setProjectData(prev => ({
      ...prev,
      tasks: [...prev.tasks, ...smartTasks]
    }));

    toast({
      title: "تم توليد المهام بنجاح",
      description: `تم إضافة ${smartTasks.length} مهام جديدة للمشروع`,
    });
  };

  const handleSaveProject = () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmSaveProject = () => {
    try {
      if (isEditMode && editingProject) {
        // تحديث المشروع الموجود
        const updatedProject: ProjectData = {
          ...editingProject,
          name: projectData.name,
          description: projectData.description,
          owner: projectData.manager,
          deadline: projectData.endDate || projectData.deadline,
          team: projectData.team,
          budget: Number(projectData.budget) || editingProject.budget,
          tasksCount: projectData.tasks.length || editingProject.tasksCount,
        };

        onProjectUpdated?.(updatedProject);
        
        toast({
          title: "تم تحديث المشروع بنجاح",
          description: `تم تحديث مشروع "${projectData.name}" بنجاح`,
        });
      } else {
        // إنشاء مشروع جديد
        const newProject: ProjectData = {
          id: Date.now(),
          name: projectData.name,
          description: projectData.description,
          owner: projectData.manager,
          deadline: projectData.endDate,
          team: projectData.team,
          status: 'info',
          budget: Number(projectData.budget) || 0,
          tasksCount: projectData.tasks.length,
        };

        onProjectAdded(newProject);
        
        toast({
          title: "تم إنشاء المشروع بنجاح",
          description: `تم إضافة مشروع "${projectData.name}" بنجاح`,
        });
      }
      
      resetForm();
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: isEditMode ? "فشل في تحديث المشروع" : "فشل في إنشاء المشروع",
        description: "تأكد من البيانات وحاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setProjectData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      deadline: '',
      manager: '',
      owner: '',
      team: [],
      budget: '',
      status: 'info',
      tasksCount: 0,
      clientType: 'internal',
      tasks: [],
      partnerships: [],
      hasContract: false,
      contractValue: '',
      contractPayments: [{ amount: '', date: '', id: 1 }],
    });
    setActiveTab('basic');
  };

  const handleClose = () => {
    if (projectData.name.trim() || projectData.description.trim()) {
      setShowCancelDialog(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const confirmClose = () => {
    resetForm();
    setShowCancelDialog(false);
    onClose();
  };

  const addTask = (task: TaskData) => {
    setProjectData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: Date.now() }]
    }));
  };

  const addPayment = () => {
    setProjectData(prev => ({
      ...prev,
      contractPayments: [
        ...prev.contractPayments,
        { amount: '', date: '', id: prev.contractPayments.length + 1 }
      ]
    }));
  };

  const removePayment = (id: number) => {
    setProjectData(prev => ({
      ...prev,
      contractPayments: prev.contractPayments.filter((payment: ContractPayment) => payment.id !== id)
    }));
  };

  const updatePayment = (id: number, field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      contractPayments: prev.contractPayments.map((p: ContractPayment) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] p-0 overflow-hidden font-arabic"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            zIndex: 9999,
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
          >
            <X className="text-black" size={18} />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-right font-arabic">
              {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="flex flex-col h-full">
              {/* قائمة التبويبات الثابتة */}
              <div className="flex-shrink-0 px-8 pb-4 border-b border-white/20">
                <TabsList className="bg-transparent gap-2 justify-end w-full">
                  <TabsTrigger 
                    value="basic" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
                  >
                    المعلومات الأساسية
                  </TabsTrigger>
                  <TabsTrigger 
                    value="client" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
                  >
                    بيانات العميل
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tasks" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
                  >
                    المهام
                  </TabsTrigger>
                  <TabsTrigger 
                    value="partnerships" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
                  >
                    الشراكات
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contract" 
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-black/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:border data-[state=inactive]:border-white/20 data-[state=inactive]:text-white rounded-full px-4 py-2 font-arabic"
                  >
                    العقد
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* محتوى التبويبات القابل للتمرير */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <TabsContent value="basic" className="mt-0">
                  <BasicInfoForm
                    projectData={projectData}
                    onInputChange={handleInputChange}
                    teamMembers={teamMembers}
                  />
                </TabsContent>

                <TabsContent value="client" className="mt-0">
                  <ClientForm
                    projectData={projectData}
                    onInputChange={handleInputChange}
                    onClientDataChange={handleClientDataChange}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="mt-0">
                  <TasksTab
                    tasks={projectData.tasks}
                    onAddTask={() => setShowAddTaskModal(true)}
                    onGenerateSmartTasks={handleGenerateSmartTasks}
                  />
                </TabsContent>

                <TabsContent value="partnerships" className="mt-0">
                  <PartnershipsTab />
                </TabsContent>

                <TabsContent value="contract" className="mt-0">
                  <ContractForm
                    projectData={projectData}
                    onInputChange={handleInputChange}
                    onAddPayment={addPayment}
                    onRemovePayment={removePayment}
                    onUpdatePayment={updatePayment}
                  />
                </TabsContent>
              </div>

              {/* أزرار الحفظ والإلغاء الثابتة */}
              <div className="flex-shrink-0 px-8 pb-8">
                <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
                  <Button
                    onClick={handleSaveProject}
                    className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full"
                  >
                    {isEditMode ? 'حفظ التعديلات' : 'حفظ المشروع'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/50 font-arabic rounded-full"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onTaskAdded={addTask}
      />

      {/* حوار تأكيد الحفظ */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          dir="rtl"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              {isEditMode ? 'تأكيد التعديل' : 'تأكيد الحفظ'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من حفظ التعديلات على هذا المشروع؟'
                : 'هل أنت متأكد من إنشاء هذا المشروع؟'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveProject} className="font-arabic">
              {isEditMode ? 'حفظ التعديلات' : 'إنشاء المشروع'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          dir="rtl"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من إلغاء التعديل؟ سيتم فقدان جميع التعديلات.'
                : 'هل أنت متأكد من إلغاء إضافة المشروع؟ سيتم فقدان جميع البيانات المدخلة.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">العودة</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="font-arabic">
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
