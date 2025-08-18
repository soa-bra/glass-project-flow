
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import { AddTaskModal } from './AddTaskModal';
import type { ProjectData, TaskData } from '@/types';
import { useProjectForm } from './AddProjectModal/hooks/useProjectForm';
import { useSmartTasks } from './AddProjectModal/hooks/useSmartTasks';
import { ProjectModalHeader } from './AddProjectModal/components/ProjectModalHeader';
import { ProjectModalTabs } from './AddProjectModal/components/ProjectModalTabs';
import { ProjectModalFooter } from './AddProjectModal/components/ProjectModalFooter';
import { ProjectModalDialogs } from './AddProjectModal/components/ProjectModalDialogs';

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
  const { addTasksToProject } = useProjectTasksContext();
  const [activeTab, setActiveTab] = useState('basic');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    projectData,
    handleInputChange,
    handleClientDataChange,
    validateForm,
    resetForm,
    addTask,
    addPayment,
    removePayment,
    updatePayment,
  } = useProjectForm(editingProject, isEditMode);

  const { generateSmartTasks } = useSmartTasks();

  const teamMembers = [
    'أحمد محمد',
    'فاطمة علي',
    'خالد الأحمد',
    'نورا السالم',
    'محمد العتيبي',
    'سارة النجار'
  ];

  const handleGenerateSmartTasks = () => {
    const smartTasks = generateSmartTasks(projectData, teamMembers);
    smartTasks.forEach(task => addTask(task));
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
        
        // إضافة المهام للمشروع
        if (projectData.tasks.length > 0) {
          addTasksToProject(editingProject.id.toString(), projectData.tasks);
        }
        
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
        
        // إضافة المهام للمشروع الجديد
        if (projectData.tasks.length > 0) {
          addTasksToProject(newProject.id.toString(), projectData.tasks);
        }
        
        toast({
          title: "تم إنشاء المشروع بنجاح",
          description: `تم إضافة مشروع "${projectData.name}" بنجاح`,
        });
      }
      
      resetForm();
      setShowConfirmDialog(false);
      setActiveTab('basic');
      onClose();
    } catch (error) {
      toast({
        title: isEditMode ? "فشل في تحديث المشروع" : "فشل في إنشاء المشروع",
        description: "تأكد من البيانات وحاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (projectData.name.trim() || projectData.description.trim()) {
      setShowCancelDialog(true);
    } else {
      resetForm();
      setActiveTab('basic');
      onClose();
    }
  };

  const confirmClose = () => {
    resetForm();
    setShowCancelDialog(false);
    setActiveTab('basic');
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="max-w-4xl p-0 overflow-hidden font-arabic transition-all duration-500 ease-out"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            zIndex: 9999,
            transformOrigin: 'top center',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 'auto',
            maxHeight: '90vh',
          }}
        >
          <ProjectModalHeader 
            isEditMode={isEditMode} 
            onClose={handleClose}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <ProjectModalTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            projectData={projectData}
            onInputChange={handleInputChange}
            onClientDataChange={handleClientDataChange}
            onAddTask={() => setShowAddTaskModal(true)}
            onGenerateSmartTasks={handleGenerateSmartTasks}
            onAddPayment={addPayment}
            onRemovePayment={removePayment}
            onUpdatePayment={updatePayment}
            teamMembers={teamMembers}
          />

          <ProjectModalFooter
            isEditMode={isEditMode}
            onSave={handleSaveProject}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onTaskAdded={addTask}
      />

      <ProjectModalDialogs
        showConfirmDialog={showConfirmDialog}
        onConfirmDialogChange={setShowConfirmDialog}
        showCancelDialog={showCancelDialog}  
        onCancelDialogChange={setShowCancelDialog}
        isEditMode={isEditMode}
        onConfirmSave={confirmSaveProject}
        onConfirmCancel={confirmClose}
      />
    </>
  );
};
