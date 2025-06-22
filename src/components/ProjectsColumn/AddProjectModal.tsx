
import React, { useState } from 'react';
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

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: ProjectData) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectAdded,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
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
    if (!projectData.startDate || !projectData.endDate) {
      toast({
        title: "خطأ في التحقق",
        description: "تواريخ المشروع مطلوبة",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSaveProject = () => {
    if (!validateForm()) return;

    try {
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
      
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "فشل في إنشاء المشروع",
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
          className="max-w-4xl h-[65vh] p-0 overflow-hidden font-arabic"
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            zIndex: 9999,
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 rounded-full bg-white/60 hover:bg-white/80 shadow-lg border border-white/40 w-[32px] h-[32px] flex items-center justify-center transition z-10"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <X className="text-gray-700" size={18} />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4">
            <DialogTitle className="text-2xl font-bold text-right font-arabic">
              إضافة مشروع جديد
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden px-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="h-full flex flex-col">
              <TabsList className="bg-transparent gap-2 mb-6 justify-end">
                <TabsTrigger 
                  value="basic" 
                  className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/20 data-[state=inactive]:border data-[state=inactive]:border-white/40 data-[state=inactive]:text-black rounded-full px-4 py-2 font-arabic backdrop-blur-sm"
                >
                  المعلومات الأساسية
                </TabsTrigger>
                <TabsTrigger 
                  value="client" 
                  className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/20 data-[state=inactive]:border data-[state=inactive]:border-white/40 data-[state=inactive]:text-black rounded-full px-4 py-2 font-arabic backdrop-blur-sm"
                >
                  بيانات العميل
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/20 data-[state=inactive]:border data-[state=inactive]:border-white/40 data-[state=inactive]:text-black rounded-full px-4 py-2 font-arabic backdrop-blur-sm"
                >
                  المهام
                </TabsTrigger>
                <TabsTrigger 
                  value="partnerships" 
                  className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/20 data-[state=inactive]:border data-[state=inactive]:border-white/40 data-[state=inactive]:text-black rounded-full px-4 py-2 font-arabic backdrop-blur-sm"
                >
                  الشراكات
                </TabsTrigger>
                <TabsTrigger 
                  value="contract" 
                  className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/20 data-[state=inactive]:border data-[state=inactive]:border-white/40 data-[state=inactive]:text-black rounded-full px-4 py-2 font-arabic backdrop-blur-sm"
                >
                  العقد
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
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

              <div className="flex gap-4 justify-start pt-6 border-t border-white/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-black text-black hover:bg-black/10 font-arabic"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSaveProject}
                  className="bg-black text-white hover:bg-gray-800 font-arabic"
                >
                  حفظ المشروع
                </Button>
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

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من إلغاء إضافة المشروع؟ سيتم فقدان جميع البيانات المدخلة.
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
