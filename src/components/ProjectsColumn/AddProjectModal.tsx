
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import type { ProjectData } from '@/types';
import { ProjectModalHeader } from './AddProjectModal/components/ProjectModalHeader';
import { SimpleProjectForm } from './AddProjectModal/SimpleProjectForm';
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [projectData, setProjectData] = useState({
    name: editingProject?.name || '',
    endDate: editingProject?.deadline || '',
    location: 'internal' as 'internal' | 'external',
  });

  const handleInputChange = (field: string, value: unknown) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!projectData.name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "عنوان الحدث مطلوب",
        variant: "destructive",
      });
      return false;
    }
    if (!projectData.endDate) {
      toast({
        title: "خطأ في التحقق",
        description: "تاريخ الحدث مطلوب",
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
      location: 'internal',
    });
  };

  const handleSaveProject = () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmSaveProject = () => {
    try {
      if (isEditMode && editingProject) {
        const updatedProject: ProjectData = {
          ...editingProject,
          name: projectData.name,
          deadline: projectData.endDate,
        };

        onProjectUpdated?.(updatedProject);
        
        toast({
          title: "تم تحديث الحدث بنجاح",
          description: `تم تحديث "${projectData.name}" بنجاح`,
        });
      } else {
        const newProject: ProjectData = {
          id: Date.now(),
          name: projectData.name,
          description: '',
          owner: 'المستخدم الحالي',
          deadline: projectData.endDate,
          team: [],
          status: 'info',
          budget: 0,
          tasksCount: 0,
        };

        onProjectAdded(newProject);
        
        toast({
          title: "تم إضافة الحدث بنجاح",
          description: `تم إضافة "${projectData.name}" بنجاح`,
        });
      }
      
      resetForm();
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: isEditMode ? "فشل في تحديث الحدث" : "فشل في إضافة الحدث",
        description: "تأكد من البيانات وحاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (projectData.name.trim()) {
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-white border border-gray-200 shadow-2xl"
          style={{
            borderRadius: '24px',
          }}
        >
          <ProjectModalHeader isEditMode={isEditMode} onClose={handleClose} />

          <SimpleProjectForm
            projectData={projectData}
            onInputChange={handleInputChange}
          />

          <ProjectModalFooter
            isEditMode={isEditMode}
            onSave={handleSaveProject}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

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
