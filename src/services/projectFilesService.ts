import { ProjectFile } from '@/data/projectFiles';
import { supabase } from '@/integrations/supabase/client';
import { withAuthorizationAndAudit } from '@/services/central/withAuthorizationAndAudit';

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

const createFile = withAuthorizationAndAudit(
  { permission: 'project.files.write', resource_type: 'project_file', action: 'project.file.create' },
  async (file: Omit<ProjectFile, 'id'>) => {
    const payload = {
      project_id: file.projectId,
      file_name: file.name,
      file_type: file.type,
      file_size: String(file.size ?? ''),
      uploaded_by: file.uploadedBy,
      storage_ref: (file as any).storageRef ?? null,
      metadata: { ...file },
    } as never;
    const { data, error } = await supabase.from('project_files').insert(payload).select('*').single();
    if (error) throw error;
    return data;
  },
);

const updateFileRecord = withAuthorizationAndAudit(
  { permission: 'project.files.write', resource_type: 'project_file', action: 'project.file.update' },
  async (fileId: string, updates: Partial<ProjectFile>) => {
    const { data, error } = await supabase
      .from('project_files')
      .update({ file_name: updates.name, file_type: updates.type, metadata: updates } as never)
      .eq('id', fileId)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },
);

const removeFileRecord = withAuthorizationAndAudit(
  { permission: 'project.files.write', resource_type: 'project_file', action: 'project.file.delete' },
  async (fileId: string) => {
    const { error } = await supabase.from('project_files').delete().eq('id', fileId);
    if (error) throw error;
  },
);

class ProjectFilesService {
  private listeners: Array<(data: ProjectFilesData) => void> = [];

  private async getPersistedData(projectId?: string): Promise<ProjectFilesData> {
    let q = supabase.from('project_files').select('*');
    if (projectId) q = q.eq('project_id', projectId);
    const { data: filesRows, error } = await q;
    if (error) throw error;
    const files: ProjectFile[] = (filesRows ?? []).map((row: any) => ({ id: row.id, ...(row.metadata ?? {}), projectId: row.project_id }));
    const permissions: UserPermission[] = files.flatMap((f: any) => ((f.permissions ?? []) as UserPermission[]));
    return { files, folders: [], permissions };
  }

  subscribe(listener: (data: ProjectFilesData) => void) {
    this.listeners.push(listener);
    void this.getData().then(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private async notifyListeners() {
    const data = await this.getData();
    this.listeners.forEach(listener => listener(data));
  }

  async addFiles(newFiles: Omit<ProjectFile, 'id'>[]): Promise<void> {
    for (const file of newFiles) await createFile(file);
    await this.notifyListeners();
  }

  async updateFile(fileId: string, updates: Partial<ProjectFile>): Promise<void> {
    await updateFileRecord(fileId, updates);
    await this.notifyListeners();
  }

  async deleteFile(fileId: string): Promise<void> {
    await removeFileRecord(fileId);
    await this.notifyListeners();
  }

  async addFolder(_folder: Omit<FolderData, 'id'>): Promise<string> { return `folder_virtual_${Date.now()}`; }
  async updateFolder(_folderId: string, _updates: Partial<FolderData>): Promise<void> {}
  async deleteFolder(_folderId: string): Promise<void> {}
  async moveFileToFolder(fileId: string, folderId?: string): Promise<void> { await this.updateFile(fileId, { folderId } as any); }

  setUserPermissions = withAuthorizationAndAudit(
    { permission: 'project.files.permissions', resource_type: 'project_file', action: 'project.file.permissions.set' },
    async (userId: string, fileId: string, permissions: string[]): Promise<void> => {
      const { error } = await supabase
        .from('project_file_permissions')
        .upsert({ user_id: userId, file_id: fileId, permissions } as never, { onConflict: 'user_id,file_id' });
      if (error) throw error;
      await this.notifyListeners();
    },
  );

  async getUserPermissions(userId: string, fileId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('project_file_permissions')
      .select('permissions')
      .eq('user_id', userId)
      .eq('file_id', fileId)
      .maybeSingle();
    if (error) throw error;
    return (data as any)?.permissions || ['view'];
  }

  async getFilteredFiles(userId: string, projectId?: string): Promise<ProjectFile[]> {
    const data = await this.getPersistedData(projectId);
    const checks = await Promise.all(data.files.map(async (file) => ({ file, perms: await this.getUserPermissions(userId, file.id) })));
    return checks.filter(c => c.perms.includes('view')).map(c => c.file);
  }

  async getData(): Promise<ProjectFilesData> { return this.getPersistedData(); }
  async getProjectFiles(projectId?: string): Promise<ProjectFile[]> { return (await this.getPersistedData(projectId)).files; }
}

export const projectFilesService = new ProjectFilesService();
