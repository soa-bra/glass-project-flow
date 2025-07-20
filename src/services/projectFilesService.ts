
import { ProjectFile } from '@/data/projectFiles';

// Event system for data updates
type FileEventType = 'files-added' | 'files-updated' | 'files-deleted' | 'folders-organized';
type FileEventListener = (files: ProjectFile[]) => void;

class ProjectFilesService {
  private files: ProjectFile[] = [];
  private listeners: Map<FileEventType, FileEventListener[]> = new Map();

  constructor(initialFiles: ProjectFile[] = []) {
    this.files = [...initialFiles];
    this.initializeEventTypes();
  }

  private initializeEventTypes() {
    const eventTypes: FileEventType[] = ['files-added', 'files-updated', 'files-deleted', 'folders-organized'];
    eventTypes.forEach(type => {
      this.listeners.set(type, []);
    });
  }

  // Get all files for a project
  getFiles(projectId?: string): ProjectFile[] {
    if (!projectId) return [...this.files];
    return this.files.filter(file => file.projectId === projectId);
  }

  // Add new files
  addFiles(newFiles: ProjectFile[]): void {
    this.files.push(...newFiles);
    this.emit('files-added', this.files);
  }

  // Update file folder assignment
  updateFileFolder(fileId: string, folderId?: string): boolean {
    const fileIndex = this.files.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      this.files[fileIndex] = { ...this.files[fileIndex], folderId };
      this.emit('files-updated', this.files);
      return true;
    }
    return false;
  }

  // Remove files
  removeFiles(fileIds: string[]): void {
    this.files = this.files.filter(file => !fileIds.includes(file.id));
    this.emit('files-deleted', this.files);
  }

  // Get files by folder
  getFilesByFolder(projectId?: string, folderId?: string): ProjectFile[] {
    return this.files.filter(file => 
      (projectId ? file.projectId === projectId : true) &&
      file.folderId === folderId
    );
  }

  // Event listeners
  on(event: FileEventType, listener: FileEventListener): void {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);
  }

  off(event: FileEventType, listener: FileEventListener): void {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      this.listeners.set(event, listeners);
    }
  }

  private emit(event: FileEventType, files: ProjectFile[]): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => listener(files));
  }

  // Update all files at once (for bulk operations)
  setFiles(files: ProjectFile[]): void {
    this.files = [...files];
    this.emit('files-updated', this.files);
  }
}

// Create and export singleton instance
import { projectFiles } from '@/data/projectFiles';
export const projectFilesService = new ProjectFilesService(projectFiles);
