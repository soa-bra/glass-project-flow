
import { useState, useEffect, useCallback } from 'react';
import { ProjectFile } from '@/data/projectFiles';
import { projectFilesService } from '@/services/projectFilesService';

export const useProjectFiles = (projectId?: string) => {
  const [files, setFiles] = useState<ProjectFile[]>(() => 
    projectFilesService.getFiles(projectId)
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Update files when service data changes
  const handleFilesUpdate = useCallback((updatedFiles: ProjectFile[]) => {
    const projectFiles = projectId 
      ? updatedFiles.filter(f => f.projectId === projectId)
      : updatedFiles;
    setFiles(projectFiles);
    setRefreshTrigger(prev => prev + 1);
  }, [projectId]);

  useEffect(() => {
    // Subscribe to all file events
    projectFilesService.on('files-added', handleFilesUpdate);
    projectFilesService.on('files-updated', handleFilesUpdate);
    projectFilesService.on('files-deleted', handleFilesUpdate);
    projectFilesService.on('folders-organized', handleFilesUpdate);

    // Cleanup subscriptions
    return () => {
      projectFilesService.off('files-added', handleFilesUpdate);
      projectFilesService.off('files-updated', handleFilesUpdate);
      projectFilesService.off('files-deleted', handleFilesUpdate);
      projectFilesService.off('folders-organized', handleFilesUpdate);
    };
  }, [handleFilesUpdate]);

  // Methods to interact with files
  const addFiles = useCallback((newFiles: ProjectFile[]) => {
    projectFilesService.addFiles(newFiles);
  }, []);

  const removeFiles = useCallback((fileIds: string[]) => {
    projectFilesService.removeFiles(fileIds);
  }, []);

  const updateFileFolder = useCallback((fileId: string, folderId?: string) => {
    return projectFilesService.updateFileFolder(fileId, folderId);
  }, []);

  const getFilesByFolder = useCallback((folderId?: string) => {
    return projectFilesService.getFilesByFolder(projectId, folderId);
  }, [projectId]);

  return {
    files,
    refreshTrigger,
    addFiles,
    removeFiles,
    updateFileFolder,
    getFilesByFolder
  };
};
