
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import type { ProjectData } from '@/types';
import { ProjectModalHeader } from './AddProjectModal/components/ProjectModalHeader';
import { SimpleProjectForm } from './AddProjectModal/SimpleProjectForm';
import { ProjectModalFooter } from './AddProjectModal/components/ProjectModalFooter';

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
  
  const [projectData, setProjectData] = useState({
    name: editingProject?.name || '',
    endDate: editingProject?.deadline || '',
    type: 'internal' as 'internal' | 'external'
  });

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type: 'internal' | 'external') => {
    setProjectData(prev => ({ ...prev, type }));
  };

  const validateForm = () => {
    if (!projectData.name.trim()) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى إدخال عنوان المشروع",
        variant: "destructive",
      });
      return false;
    }
    if (!projectData.endDate) {
      toast({
        title: "خطأ في النموذج", 
        description: "يرجى اختيار تاريخ المشروع",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setProjectData({
      name: '',
      endDate: '',
      type: 'internal'
    });
  };

  const handleSaveProject = () => {
    if (!validateForm()) return;
    
    try {
      if (isEditMode && editingProject) {
        const updatedProject: ProjectData = {
          ...editingProject,
          name: projectData.name,
          deadline: projectData.endDate,
        };

        onProjectUpdated?.(updatedProject);
        
        toast({
          title: "تم تحديث المشروع بنجاح",
          description: `تم تحديث مشروع "${projectData.name}" بنجاح`,
        });
      } else {
        const newProject: ProjectData = {
          id: Date.now(),
          name: projectData.name,
          description: '',
          owner: '',
          deadline: projectData.endDate,
          team: [],
          status: 'info',
          budget: 0,
          tasksCount: 0,
        };

        onProjectAdded(newProject);
        
        toast({
          title: "تم إنشاء المشروع بنجاح",
          description: `تم إضافة مشروع "${projectData.name}" بنجاح`,
        });
      }
      
      resetForm();
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
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-lg p-0 overflow-hidden font-arabic"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <ProjectModalHeader isEditMode={isEditMode} onClose={handleClose} />

        <SimpleProjectForm 
          projectData={projectData}
          onInputChange={handleInputChange}
          onTypeChange={handleTypeChange}
        />

        <ProjectModalFooter
          isEditMode={isEditMode}
          onSave={handleSaveProject}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
