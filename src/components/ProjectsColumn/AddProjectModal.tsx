
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProjectTasksContext } from '@/contexts/ProjectTasksContext';
import type { ProjectData } from '@/types';
import { ProjectModalHeader } from './AddProjectModal/components/ProjectModalHeader';
import { SimpleProjectForm } from './AddProjectModal/SimpleProjectForm';

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

  const handleSaveProject = (data: { date: Date; title: string; type: string }) => {
    try {
      if (isEditMode && editingProject) {
        // تحديث المشروع الموجود
        const updatedProject: ProjectData = {
          ...editingProject,
          name: data.title,
          deadline: data.date.toISOString(),
        };

        onProjectUpdated?.(updatedProject);
        
        toast({
          title: "تم تحديث المشروع بنجاح",
          description: `تم تحديث مشروع "${data.title}" بنجاح`,
        });
      } else {
        // إنشاء مشروع جديد
        const newProject: ProjectData = {
          id: Date.now(),
          name: data.title,
          description: `${data.type} - ${data.title}`,
          owner: 'غير محدد',
          deadline: data.date.toISOString(),
          team: [],
          status: 'info',
          budget: 0,
          tasksCount: 0,
        };

        onProjectAdded(newProject);
        
        toast({
          title: "تم إنشاء المشروع بنجاح",
          description: `تم إضافة مشروع "${data.title}" بنجاح`,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: isEditMode ? "فشل في تحديث المشروع" : "فشل في إنشاء المشروع",
        description: "تأكد من البيانات وحاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] p-0 overflow-hidden font-arabic rounded-[24px] z-[9999]"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <ProjectModalHeader isEditMode={isEditMode} onClose={onClose} />
        
        <div className="p-6">
          <SimpleProjectForm
            onSave={handleSaveProject}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
