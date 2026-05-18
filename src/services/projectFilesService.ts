import { ProjectFile } from '@/data/projectFiles';
import { withAuthorizationAndAudit } from '@/services/central/withAuthorizationAndAudit';

const STORAGE_KEY = 'project-files-service-v2';

export interface FolderData { id: string; name: string; parentId?: string; filesCount: number; createdAt: string; color?: string; icon?: string; files?: ProjectFile[]; metadata?: Record<string, unknown>; }
export interface UserPermission { userId: string; fileId: string; permissions: string[]; updatedAt: string; }
export interface FileStorageRef { fileId: string; bucket: string; path: string; provider: 'supabase-storage' | 's3' | 'local'; }
export interface ProjectFilesData { files: ProjectFile[]; folders: FolderData[]; permissions: UserPermission[]; storageRefs: FileStorageRef[]; metadata: { schemaVersion: number; updatedAt: string; }; }

class ProjectFilesService {
  private data: ProjectFilesData = { files: [], folders: [], permissions: [], storageRefs: [], metadata: { schemaVersion: 2, updatedAt: new Date().toISOString() } };
  private listeners: Array<(data: ProjectFilesData) => void> = [];
  constructor() { this.loadFromPersistence(); }

  private loadFromPersistence() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) this.data = JSON.parse(raw) as ProjectFilesData;
    this.notifyListeners();
  }
  private persist() { this.data.metadata.updatedAt = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); }
  subscribe(listener: (data: ProjectFilesData) => void) { this.listeners.push(listener); listener(this.data); return () => { this.listeners = this.listeners.filter((l) => l !== listener); }; }
  private notifyListeners() { this.listeners.forEach((listener) => listener({ ...this.data })); }

  addFiles = withAuthorizationAndAudit({ permission: 'project.files.write', resource_type: 'project_file', action: 'project.files.add' }, async (newFiles: Omit<ProjectFile, 'id'>[]): Promise<void> => {
    const filesWithIds = newFiles.map((file) => ({ ...file, id: `file_${crypto.randomUUID()}` }));
    this.data.files = [...this.data.files, ...filesWithIds];
    this.persist(); this.notifyListeners();
  });

  async updateFile(fileId: string, updates: Partial<ProjectFile>): Promise<void> { this.data.files = this.data.files.map((f) => f.id === fileId ? { ...f, ...updates } : f); this.persist(); this.notifyListeners(); }
  deleteFile = withAuthorizationAndAudit({ permission: 'project.files.delete', resource_type: 'project_file', action: 'project.files.delete' }, async (fileId: string): Promise<void> => {
    this.data.files = this.data.files.filter((f) => f.id !== fileId); this.data.permissions = this.data.permissions.filter((p) => p.fileId !== fileId); this.data.storageRefs = this.data.storageRefs.filter((s) => s.fileId !== fileId); this.persist(); this.notifyListeners();
  }, { resolveResourceId: ([fileId]) => fileId });

  addFolder(folder: Omit<FolderData, 'id'>): string { const folderId = `folder_${crypto.randomUUID()}`; this.data.folders = [...this.data.folders, { ...folder, id: folderId }]; this.persist(); this.notifyListeners(); return folderId; }
  async updateFolder(folderId: string, updates: Partial<FolderData>): Promise<void> { this.data.folders = this.data.folders.map((f) => f.id === folderId ? { ...f, ...updates } : f); this.persist(); this.notifyListeners(); }
  async deleteFolder(folderId: string): Promise<void> { this.data.files = this.data.files.map((f) => f.folderId === folderId ? { ...f, folderId: undefined } : f); this.data.folders = this.data.folders.filter((f) => f.id !== folderId); this.persist(); this.notifyListeners(); }
  async moveFileToFolder(fileId: string, folderId?: string): Promise<void> { await this.updateFile(fileId, { folderId }); this.updateFolderFileCounts(); this.persist(); this.notifyListeners(); }
  private updateFolderFileCounts(): void { this.data.folders = this.data.folders.map((folder) => ({ ...folder, filesCount: this.data.files.filter((file) => file.folderId === folder.id).length, files: this.data.files.filter((file) => file.folderId === folder.id) })); }

  setUserPermissions = withAuthorizationAndAudit({ permission: 'project.files.permissions', resource_type: 'project_file_permission', action: 'project.files.permissions.set' }, async (userId: string, fileId: string, permissions: string[]): Promise<void> => {
    const idx = this.data.permissions.findIndex((p) => p.userId === userId && p.fileId === fileId);
    const row = { userId, fileId, permissions, updatedAt: new Date().toISOString() };
    if (idx >= 0) this.data.permissions[idx] = row; else this.data.permissions.push(row);
    this.persist(); this.notifyListeners();
  }, { resolveResourceId: ([, fileId]) => fileId });

  getUserPermissions(userId: string, fileId: string): string[] { return this.data.permissions.find((p) => p.userId === userId && p.fileId === fileId)?.permissions || ['view']; }
  getFilteredFiles(userId: string, projectId?: string): ProjectFile[] { return this.data.files.filter((f) => !projectId || f.projectId === projectId).filter((f) => this.getUserPermissions(userId, f.id).includes('view')); }
  getData(): ProjectFilesData { this.updateFolderFileCounts(); return { ...this.data }; }
  getProjectFiles(projectId?: string): ProjectFile[] { return !projectId ? this.data.files : this.data.files.filter((f) => f.projectId === projectId); }
}
export const projectFilesService = new ProjectFilesService();
