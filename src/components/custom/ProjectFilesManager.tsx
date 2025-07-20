import React, { useState, useCallback } from 'react';
import { DocumentsGrid } from './DocumentsGrid';
import { FileUploadModal } from './FileUploadModal';
import { FolderOrganizationModal } from './FolderOrganizationModal';
import { PermissionsModal } from './PermissionsModal';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen, Shield } from 'lucide-react';
import { ProjectFile, getProjectFiles } from '@/data/projectFiles';

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // دالة لتحديث الشبكة عند إضافة ملفات جديدة
  const handleFilesAdded = useCallback((newFiles: ProjectFile[]) => {
    setRefreshTrigger(prev => prev + 1);
    setShowUploadModal(false);
  }, []);

  // دالة لحفظ الملفات المرفوعة
  const handleSaveUpload = useCallback((data: {
    files: File[];
    title: string;
    linkedTasks: string[];
    projectId: string;
  }) => {
    console.log('تم رفع الملفات:', data);
    // هنا يمكن إضافة منطق إضافي للحفظ في النظام الخلفي
  }, []);

  // دالة لحفظ تنظيم المجلدات
  const handleSaveFolders = useCallback(() => {
    console.log('تم حفظ تنظيم المجلدات');
    setRefreshTrigger(prev => prev + 1);
    setShowFolderModal(false);
  }, []);

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

      {/* شبكة الملفات الرئيسية */}
      <DocumentsGrid 
        projectId={projectId}
        key={refreshTrigger} // لإجبار إعادة الرسم عند تحديث الملفات
      />

      {/* نافذة رفع الملفات */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleSaveUpload}
        onFilesAdded={handleFilesAdded}
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