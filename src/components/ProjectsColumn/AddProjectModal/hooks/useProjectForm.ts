
import { useState, useEffect } from 'react';
import { ProjectFormData, ContractPayment, PartnerData } from '../types';
import type { ProjectData, TaskData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useProjectForm = (
  editingProject?: ProjectData | null,
  isEditMode: boolean = false
) => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
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

  const handleInputChange = (field: string, value: unknown) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    // إخفاء رسائل الخطأ عند بدء ملء الحقول
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleClientDataChange = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      clientData: { ...prev.clientData!, [field]: value }
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!projectData.name.trim()) {
      errors.push("اسم المشروع");
    }
    if (!projectData.manager) {
      errors.push("مدير المشروع");
    }
    if (!projectData.startDate) {
      errors.push("تاريخ البدء");
    }
    if (!projectData.endDate) {
      errors.push("تاريخ التسليم المتوقع");
    }
    
    // التحقق من بيانات العميل الخارجي
    if (projectData.clientType === 'external' && projectData.clientData) {
      if (!projectData.clientData.name?.trim()) {
        errors.push("اسم الكيان (العميل)");
      }
      if (!projectData.clientData.type) {
        errors.push("نوع الكيان (العميل)");
      }
      if (!projectData.clientData.responsiblePerson?.trim()) {
        errors.push("اسم ممثل الكيان (العميل)");
      }
      if (!projectData.clientData.email?.trim()) {
        errors.push("البريد الإلكتروني (العميل)");
      }
    }
    
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      return false;
    }
    
    return true;
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
    setValidationErrors([]);
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

  const addPartnership = (partnership: PartnerData) => {
    setProjectData(prev => ({
      ...prev,
      partnerships: [...prev.partnerships, partnership]
    }));
  };

  const editPartnership = (id: number, partnership: PartnerData) => {
    setProjectData(prev => ({
      ...prev,
      partnerships: prev.partnerships.map(p => p.id === id ? partnership : p)
    }));
  };

  const deletePartnership = (id: number) => {
    setProjectData(prev => ({
      ...prev,
      partnerships: prev.partnerships.filter(p => p.id !== id)
    }));
  };

  return {
    projectData,
    validationErrors,
    handleInputChange,
    handleClientDataChange,
    validateForm,
    resetForm,
    addTask,
    addPayment,
    removePayment,
    updatePayment,
    addPartnership,
    editPartnership,
    deletePartnership,
  };
};
