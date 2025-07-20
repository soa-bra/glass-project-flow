// خدمة إدارة ملفات المشروع المتكاملة
import { ProjectFile } from '@/data/projectFiles';

export interface FolderData {
  id: string;
  name: string;
  parentId?: string;
  filesCount: number;
  createdAt: string;
  color?: string;
  icon?: string;
  files?: ProjectFile[];
}

export interface UserPermission {
  userId: string;
  fileId: string;
  permissions: string[];
}

export interface ProjectFilesData {
  files: ProjectFile[];
  folders: FolderData[];
  permissions: UserPermission[];
}

class ProjectFilesService {
  private data: ProjectFilesData = {
    files: [],
    folders: [],
    permissions: []
  };

  private listeners: Array<(data: ProjectFilesData) => void> = [];

  constructor() {
    // تحميل البيانات الأولية
    this.loadInitialData();
  }

  private loadInitialData() {
    // تحميل ملفات المشروع من المصدر الأساسي
    import('@/data/projectFiles').then(({ projectFiles }) => {
      this.data.files = [...projectFiles];
      this.notifyListeners();
    });
  }

  // الاشتراك في التحديثات
  subscribe(listener: (data: ProjectFilesData) => void) {
    this.listeners.push(listener);
    // إرسال البيانات الحالية فوراً
    listener(this.data);
    
    // إرجاع دالة إلغاء الاشتراك
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.data }));
  }

  // إضافة ملفات جديدة
  addFiles(newFiles: Omit<ProjectFile, 'id'>[]): void {
    const filesWithIds = newFiles.map(file => ({
      ...file,
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    this.data.files = [...this.data.files, ...filesWithIds];
    this.notifyListeners();
  }

  // تحديث ملف
  updateFile(fileId: string, updates: Partial<ProjectFile>): void {
    this.data.files = this.data.files.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    );
    this.notifyListeners();
  }

  // حذف ملف
  deleteFile(fileId: string): void {
    this.data.files = this.data.files.filter(file => file.id !== fileId);
    this.notifyListeners();
  }

  // إضافة مجلد
  addFolder(folder: Omit<FolderData, 'id'>): string {
    const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newFolder: FolderData = {
      ...folder,
      id: folderId
    };

    this.data.folders = [...this.data.folders, newFolder];
    this.notifyListeners();
    return folderId;
  }

  // تحديث مجلد
  updateFolder(folderId: string, updates: Partial<FolderData>): void {
    this.data.folders = this.data.folders.map(folder => 
      folder.id === folderId ? { ...folder, ...updates } : folder
    );
    this.notifyListeners();
  }

  // حذف مجلد
  deleteFolder(folderId: string): void {
    // إزالة الملفات من المجلد
    this.data.files = this.data.files.map(file => 
      file.folderId === folderId ? { ...file, folderId: undefined } : file
    );
    
    // حذف المجلد
    this.data.folders = this.data.folders.filter(folder => folder.id !== folderId);
    this.notifyListeners();
  }

  // نقل ملف إلى مجلد
  moveFileToFolder(fileId: string, folderId?: string): void {
    this.updateFile(fileId, { folderId });
    
    // تحديث عداد الملفات في المجلدات
    this.updateFolderFileCounts();
  }

  private updateFolderFileCounts(): void {
    this.data.folders = this.data.folders.map(folder => ({
      ...folder,
      filesCount: this.data.files.filter(file => file.folderId === folder.id).length,
      files: this.data.files.filter(file => file.folderId === folder.id)
    }));
  }

  // إدارة الصلاحيات
  setUserPermissions(userId: string, fileId: string, permissions: string[]): void {
    const existingIndex = this.data.permissions.findIndex(
      p => p.userId === userId && p.fileId === fileId
    );

    if (existingIndex >= 0) {
      this.data.permissions[existingIndex] = { userId, fileId, permissions };
    } else {
      this.data.permissions.push({ userId, fileId, permissions });
    }
    
    this.notifyListeners();
  }

  // الحصول على صلاحيات مستخدم لملف معين
  getUserPermissions(userId: string, fileId: string): string[] {
    const permission = this.data.permissions.find(
      p => p.userId === userId && p.fileId === fileId
    );
    return permission?.permissions || ['view'];
  }

  // الحصول على الملفات المفلترة حسب الصلاحيات
  getFilteredFiles(userId: string, projectId?: string): ProjectFile[] {
    return this.data.files
      .filter(file => !projectId || file.projectId === projectId)
      .filter(file => {
        const permissions = this.getUserPermissions(userId, file.id);
        return permissions.includes('view');
      });
  }

  // الحصول على جميع البيانات
  getData(): ProjectFilesData {
    this.updateFolderFileCounts();
    return { ...this.data };
  }

  // الحصول على ملفات مشروع معين
  getProjectFiles(projectId?: string): ProjectFile[] {
    if (!projectId) return this.data.files;
    return this.data.files.filter(file => file.projectId === projectId);
  }
}

// إنشاء instance واحد للخدمة
export const projectFilesService = new ProjectFilesService();