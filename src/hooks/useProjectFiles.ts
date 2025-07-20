import { useState, useEffect, useCallback } from 'react';
import { projectFilesService, ProjectFilesData, FolderData, UserPermission } from '@/services/projectFilesService';
import { ProjectFile } from '@/data/projectFiles';

interface UseProjectFilesReturn {
  // البيانات
  files: ProjectFile[];
  folders: FolderData[];
  permissions: UserPermission[];
  isLoading: boolean;
  
  // عمليات الملفات
  addFiles: (files: Omit<ProjectFile, 'id'>[]) => void;
  updateFile: (fileId: string, updates: Partial<ProjectFile>) => void;
  deleteFile: (fileId: string) => void;
  moveFileToFolder: (fileId: string, folderId?: string) => void;
  
  // عمليات المجلدات
  addFolder: (folder: Omit<FolderData, 'id'>) => string;
  updateFolder: (folderId: string, updates: Partial<FolderData>) => void;
  deleteFolder: (folderId: string) => void;
  
  // عمليات الصلاحيات
  setUserPermissions: (userId: string, fileId: string, permissions: string[]) => void;
  getUserPermissions: (userId: string, fileId: string) => string[];
  getFilteredFiles: (userId: string, projectId?: string) => ProjectFile[];
  
  // استعلامات مفيدة
  getProjectFiles: (projectId?: string) => ProjectFile[];
  getFolderFiles: (folderId: string) => ProjectFile[];
  getUnorganizedFiles: (projectId?: string) => ProjectFile[];
}

export const useProjectFiles = (projectId?: string): UseProjectFilesReturn => {
  const [data, setData] = useState<ProjectFilesData>({
    files: [],
    folders: [],
    permissions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // الاشتراك في تحديثات الخدمة
  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = projectFilesService.subscribe((newData) => {
      setData(newData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // عمليات الملفات
  const addFiles = useCallback((files: Omit<ProjectFile, 'id'>[]) => {
    // إضافة projectId إذا لم يكن موجوداً
    const filesWithProject = files.map(file => ({
      ...file,
      projectId: file.projectId || projectId || 'current'
    }));
    
    projectFilesService.addFiles(filesWithProject);
  }, [projectId]);

  const updateFile = useCallback((fileId: string, updates: Partial<ProjectFile>) => {
    projectFilesService.updateFile(fileId, updates);
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    projectFilesService.deleteFile(fileId);
  }, []);

  const moveFileToFolder = useCallback((fileId: string, folderId?: string) => {
    projectFilesService.moveFileToFolder(fileId, folderId);
  }, []);

  // عمليات المجلدات
  const addFolder = useCallback((folder: Omit<FolderData, 'id'>) => {
    return projectFilesService.addFolder(folder);
  }, []);

  const updateFolder = useCallback((folderId: string, updates: Partial<FolderData>) => {
    projectFilesService.updateFolder(folderId, updates);
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    projectFilesService.deleteFolder(folderId);
  }, []);

  // عمليات الصلاحيات
  const setUserPermissions = useCallback((userId: string, fileId: string, permissions: string[]) => {
    projectFilesService.setUserPermissions(userId, fileId, permissions);
  }, []);

  const getUserPermissions = useCallback((userId: string, fileId: string) => {
    return projectFilesService.getUserPermissions(userId, fileId);
  }, []);

  const getFilteredFiles = useCallback((userId: string, projectId?: string) => {
    return projectFilesService.getFilteredFiles(userId, projectId);
  }, []);

  // استعلامات مفيدة
  const getProjectFiles = useCallback((pid?: string) => {
    return projectFilesService.getProjectFiles(pid || projectId);
  }, [projectId]);

  const getFolderFiles = useCallback((folderId: string) => {
    return data.files.filter(file => file.folderId === folderId);
  }, [data.files]);

  const getUnorganizedFiles = useCallback((pid?: string) => {
    const targetProjectId = pid || projectId;
    return data.files.filter(file => 
      (!targetProjectId || file.projectId === targetProjectId) && 
      !file.folderId
    );
  }, [data.files, projectId]);

  return {
    // البيانات
    files: data.files,
    folders: data.folders,
    permissions: data.permissions,
    isLoading,
    
    // عمليات الملفات
    addFiles,
    updateFile,
    deleteFile,
    moveFileToFolder,
    
    // عمليات المجلدات
    addFolder,
    updateFolder,
    deleteFolder,
    
    // عمليات الصلاحيات
    setUserPermissions,
    getUserPermissions,
    getFilteredFiles,
    
    // استعلامات مفيدة
    getProjectFiles,
    getFolderFiles,
    getUnorganizedFiles
  };
};