import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
import type { ProjectData } from '@/types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: ProjectData) => void;
}

interface ProjectFormData extends ProjectData {
  startDate: string;
  endDate: string;
  manager: string;
  clientType: 'internal' | 'external';
  clientData?: {
    name: string;
    type: string;
    responsiblePerson: string;
    phone: string;
    email: string;
  };
  tasks: unknown[];
  partnerships: unknown[];
  hasContract: boolean;
  contractValue: string;
  contractPayments: unknown[];
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
    manager: '',
    team: [],
    budget: '',
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
      const newProject = {
        id: `project-${Date.now()}`,
        title: projectData.name,
        description: projectData.description,
        owner: projectData.manager,
        value: projectData.budget || '0',
        daysLeft: Math.ceil((new Date(projectData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        tasksCount: projectData.tasks.length,
        status: 'info' as const,
        date: new Date().toLocaleDateString('ar-SA'),
        isOverBudget: false,
        hasOverdueTasks: false,
        team: projectData.team.map(name => ({ name })),
        progress: 0,
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
      manager: '',
      team: [],
      budget: '',
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

  const addTask = (task: unknown) => {
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
      contractPayments: prev.contractPayments.filter(payment => payment.id !== id)
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
                <TabsContent value="basic" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-arabic text-right">اسم المشروع *</Label>
                      <Input
                        value={projectData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-right font-arabic"
                        placeholder="أدخل اسم المشروع"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-arabic text-right">مدير المشروع *</Label>
                      <Select value={projectData.manager} onValueChange={(value) => handleInputChange('manager', value)}>
                        <SelectTrigger className="text-right font-arabic">
                          <SelectValue placeholder="اختر مدير المشروع" />
                        </SelectTrigger>
                        <SelectContent>
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
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="text-right font-arabic min-h-[100px]"
                      placeholder="أدخل وصف المشروع"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-arabic text-right">تاريخ البدء *</Label>
                      <Input
                        type="date"
                        value={projectData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="text-right font-arabic"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-arabic text-right">تاريخ التسليم المتوقع *</Label>
                      <Input
                        type="date"
                        value={projectData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="text-right font-arabic"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-arabic text-right">الميزانية (ر.س)</Label>
                    <Input
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="text-right font-arabic"
                      placeholder="0"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="client" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <Label className="font-arabic text-right text-lg">نوع المشروع</Label>
                    <div className="flex gap-4 justify-end">
                      <Button
                        type="button"
                        variant={projectData.clientType === 'internal' ? 'default' : 'outline'}
                        onClick={() => handleInputChange('clientType', 'internal')}
                        className="font-arabic"
                      >
                        مشروع داخلي
                      </Button>
                      <Button
                        type="button"
                        variant={projectData.clientType === 'external' ? 'default' : 'outline'}
                        onClick={() => {
                          handleInputChange('clientType', 'external');
                          if (!projectData.clientData) {
                            setProjectData(prev => ({
                              ...prev,
                              clientData: {
                                name: '',
                                type: '',
                                responsiblePerson: '',
                                phone: '',
                                email: '',
                              }
                            }));
                          }
                        }}
                        className="font-arabic"
                      >
                        لصالح عميل
                      </Button>
                    </div>
                  </div>

                  {projectData.clientType === 'external' && (
                    <div className="space-y-6 p-6 rounded-lg border border-white/40" style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}>
                      <h3 className="text-lg font-bold font-arabic text-right">بيانات العميل</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="font-arabic text-right">اسم الكيان *</Label>
                          <Input
                            value={projectData.clientData?.name || ''}
                            onChange={(e) => handleClientDataChange('name', e.target.value)}
                            className="text-right font-arabic"
                            placeholder="أدخل اسم الكيان"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="font-arabic text-right">نوع الكيان</Label>
                          <Select 
                            value={projectData.clientData?.type || ''} 
                            onValueChange={(value) => handleClientDataChange('type', value)}
                          >
                            <SelectTrigger className="text-right font-arabic">
                              <SelectValue placeholder="اختر نوع الكيان" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">فرد</SelectItem>
                              <SelectItem value="company">شركة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="font-arabic text-right">اسم المسؤول *</Label>
                          <Input
                            value={projectData.clientData?.responsiblePerson || ''}
                            onChange={(e) => handleClientDataChange('responsiblePerson', e.target.value)}
                            className="text-right font-arabic"
                            placeholder="أدخل اسم المسؤول"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="font-arabic text-right">رقم التواصل *</Label>
                          <Input
                            value={projectData.clientData?.phone || ''}
                            onChange={(e) => handleClientDataChange('phone', e.target.value)}
                            className="text-right font-arabic"
                            placeholder="+966xxxxxxxxx"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-arabic text-right">البريد الإلكتروني *</Label>
                        <Input
                          type="email"
                          value={projectData.clientData?.email || ''}
                          onChange={(e) => handleClientDataChange('email', e.target.value)}
                          className="text-right font-arabic"
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tasks" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => setShowAddTaskModal(true)}
                        className="bg-black text-white hover:bg-gray-800 font-arabic"
                      >
                        إضافة مهمة +
                      </Button>
                      <h3 className="text-lg font-bold font-arabic">مهام المشروع</h3>
                    </div>
                    
                    {projectData.tasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 font-arabic">
                        لا توجد مهام مضافة بعد
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projectData.tasks.map((task, index) => (
                          <div key={index} className="p-4 border border-white/40 rounded-lg" style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                          }}>
                            <h4 className="font-bold font-arabic text-right">{task.title}</h4>
                            <p className="text-sm text-gray-600 font-arabic text-right mt-1">{task.description}</p>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 font-arabic">
                              <span>المكلف: {task.assignee}</span>
                              <span>تاريخ الاستحقاق: {task.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="partnerships" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button className="bg-black text-white hover:bg-gray-800 font-arabic">
                        إضافة شريك +
                      </Button>
                      <h3 className="text-lg font-bold font-arabic">الشراكات</h3>
                    </div>
                    
                    <div className="text-center py-8 text-gray-500 font-arabic">
                      لا توجد شراكات مضافة بعد
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="mt-0 space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Label className="font-arabic text-right">يوجد عقد لهذا المشروع</Label>
                      <input
                        type="checkbox"
                        checked={projectData.hasContract}
                        onChange={(e) => handleInputChange('hasContract', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>

                    {projectData.hasContract && (
                      <div className="space-y-6 p-6 rounded-lg border border-white/40" style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}>
                        <div className="space-y-2">
                          <Label className="font-arabic text-right">قيمة العقد (ر.س)</Label>
                          <Input
                            type="number"
                            value={projectData.contractValue}
                            onChange={(e) => handleInputChange('contractValue', e.target.value)}
                            className="text-right font-arabic"
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Button
                              type="button"
                              onClick={addPayment}
                              className="bg-black text-white hover:bg-gray-800 font-arabic"
                            >
                              إضافة دفعة +
                            </Button>
                            <Label className="font-arabic text-right text-lg">دفعات العقد</Label>
                          </div>

                          <div className="space-y-3">
                            {projectData.contractPayments.map((payment) => (
                              <div key={payment.id} className="grid grid-cols-3 gap-4 p-3 bg-white/10 rounded-lg">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removePayment(payment.id)}
                                  className="w-8 h-8 p-0"
                                >
                                  🗑️
                                </Button>
                                
                                <div className="space-y-1">
                                  <Label className="text-xs font-arabic">تاريخ الدفع</Label>
                                  <Input
                                    type="date"
                                    value={payment.date}
                                    onChange={(e) => {
                                      setProjectData(prev => ({
                                        ...prev,
                                        contractPayments: prev.contractPayments.map(p =>
                                          p.id === payment.id ? { ...p, date: e.target.value } : p
                                        )
                                      }));
                                    }}
                                    className="text-right font-arabic text-sm"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-xs font-arabic text-right">
                                    المبلغ - دفعة {payment.id}
                                  </Label>
                                  <Input
                                    type="number"
                                    value={payment.amount}
                                    onChange={(e) => {
                                      setProjectData(prev => ({
                                        ...prev,
                                        contractPayments: prev.contractPayments.map(p =>
                                          p.id === payment.id ? { ...p, amount: e.target.value } : p
                                        )
                                      }));
                                    }}
                                    className="text-right font-arabic text-sm"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
