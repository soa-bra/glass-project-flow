
import React, { useState } from 'react';
import { DocumentsGrid } from './DocumentsGrid';
import { FileUploadModal } from './FileUploadModal';
import { FolderOrganizationModal } from './FolderOrganizationModal';
import { PermissionsModal } from './PermissionsModal';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen, Shield } from 'lucide-react';
import { useProjectFiles } from '@/hooks/useProjectFiles';

interface ProjectFilesManagerProps {
  projectId?: string;
  projectTasks?: Array<{
    id: string;
    title: string;
  }>;
}

export const ProjectFilesManager: React.FC<ProjectFilesManagerProps> = ({
  projectId = 'current',
  projectTasks = []
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Use the hook to get real-time file updates
  const { refreshTrigger } = useProjectFiles(projectId);

  // دالة لحفظ الملفات المرفوعة
  const handleSaveUpload = (data: {
    files: File[];
    title: string;
    linkedTasks: string[];
    projectId: string;
  }) => {
    console.log('تم رفع الملفات:', data);
    setShowUploadModal(false);
  };

  // دالة لحفظ تنظيم المجلدات
  const handleSaveFolders = () => {
    console.log('تم حفظ تنظيم المجلدات');
    setShowFolderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* شريط الأدوات */}
      <div className="flex gap-3 justify-end">
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Upload className="w-4 h-4 ml-2" />
          رفع ملفات جديدة
        </Button>
        
        <Button
          onClick={() => setShowFolderModal(true)}
          variant="outline"
        >
          <FolderOpen className="w-4 h-4 ml-2" />
          تنظيم المجلدات
        </Button>
        
        <Button
          onClick={() => setShowPermissionsModal(true)}
          variant="outline"
        >
          <Shield className="w-4 h-4 ml-2" />
          إدارة الصلاحيات
        </Button>
      </div>

      {/* شبكة الملفات الرئيسية - الآن تتحدث تلقائياً */}
      <DocumentsGrid 
        projectId={projectId}
      />

      {/* نافذة رفع الملفات */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleSaveUpload}
        projectTasks={projectTasks}
        projectId={projectId}
      />

      {/* نافذة تنظيم المجلدات */}
      <FolderOrganizationModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSave={handleSaveFolders}
      />

      {/* نافذة إدارة الصلاحيات */}
      <PermissionsModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        projectId={projectId}
      />
    </div>
  );
};
