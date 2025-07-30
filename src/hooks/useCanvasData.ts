/**
 * @fileoverview Canvas data management hook with API integration
 * Handles data persistence, synchronization, and real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { toast } from 'sonner';

interface CanvasProject {
  id: string;
  name: string;
  description?: string;
  elements: CanvasElement[];
  settings: {
    gridSize: number;
    snapToGrid: boolean;
    backgroundColor: string;
    showGrid: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    collaborators: string[];
  };
}

interface UseCanvasDataProps {
  projectId?: string;
  autoSave?: boolean;
  saveInterval?: number;
}

export function useCanvasData({
  projectId,
  autoSave = true,
  saveInterval = 5000
}: UseCanvasDataProps = {}) {
  const [project, setProject] = useState<CanvasProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load project data
  const loadProject = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      const savedData = localStorage.getItem(`canvas-project-${id}`);
      
      if (savedData) {
        const projectData = JSON.parse(savedData);
        setProject({
          ...projectData,
          metadata: {
            ...projectData.metadata,
            createdAt: new Date(projectData.metadata.createdAt),
            updatedAt: new Date(projectData.metadata.updatedAt)
          }
        });
        toast.success('تم تحميل المشروع بنجاح');
      } else {
        // Create new project
        const newProject: CanvasProject = {
          id,
          name: `مشروع جديد ${new Date().toLocaleDateString('ar')}`,
          description: '',
          elements: [],
          settings: {
            gridSize: 20,
            snapToGrid: false,
            backgroundColor: '#ffffff',
            showGrid: true
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            collaborators: []
          }
        };
        setProject(newProject);
        await saveProject(newProject);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('فشل في تحميل المشروع');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save project data
  const saveProject = useCallback(async (projectData?: CanvasProject) => {
    const dataToSave = projectData || project;
    if (!dataToSave) return;

    setSaving(true);
    try {
      // Update metadata
      const updatedProject = {
        ...dataToSave,
        metadata: {
          ...dataToSave.metadata,
          updatedAt: new Date(),
          version: dataToSave.metadata.version + 1
        }
      };

      // Simulate API call - replace with actual API integration
      localStorage.setItem(
        `canvas-project-${updatedProject.id}`, 
        JSON.stringify(updatedProject)
      );

      setProject(updatedProject);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      if (!projectData) {
        toast.success('تم حفظ المشروع بنجاح');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('فشل في حفظ المشروع');
    } finally {
      setSaving(false);
    }
  }, [project]);

  // Update project elements
  const updateElements = useCallback((elements: CanvasElement[]) => {
    if (!project) return;

    setProject(prev => prev ? {
      ...prev,
      elements
    } : null);
    setHasUnsavedChanges(true);
  }, [project]);

  // Update project settings
  const updateSettings = useCallback((settings: Partial<CanvasProject['settings']>) => {
    if (!project) return;

    setProject(prev => prev ? {
      ...prev,
      settings: { ...prev.settings, ...settings }
    } : null);
    setHasUnsavedChanges(true);
  }, [project]);

  // Export project data
  const exportProject = useCallback(() => {
    if (!project) return;

    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('تم تصدير المشروع بنجاح');
  }, [project]);

  // Import project data
  const importProject = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string);
        
        // Validate project structure
        if (!projectData.id || !projectData.elements || !Array.isArray(projectData.elements)) {
          throw new Error('Invalid project format');
        }

        setProject({
          ...projectData,
          metadata: {
            ...projectData.metadata,
            createdAt: new Date(projectData.metadata.createdAt),
            updatedAt: new Date(projectData.metadata.updatedAt)
          }
        });
        
        toast.success('تم استيراد المشروع بنجاح');
      } catch (error) {
        console.error('Failed to import project:', error);
        toast.error('فشل في استيراد المشروع - تأكد من صحة الملف');
      }
    };
    reader.readAsText(file);
  }, []);

  // Get project templates
  const getTemplates = useCallback(() => {
    return [
      {
        id: 'brainstorm',
        name: 'قالب العصف الذهني',
        description: 'قالب للجلسات الإبداعية وتوليد الأفكار',
        elements: [
          {
            id: 'template-title',
            type: 'text' as const,
            position: { x: 50, y: 50 },
            size: { width: 300, height: 60 },
            content: 'جلسة العصف الذهني',
            style: { fontSize: 24, fontWeight: 'bold' as const, textAlign: 'center' as const }
          },
          {
            id: 'template-idea-1',
            type: 'sticky' as const,
            position: { x: 100, y: 150 },
            size: { width: 150, height: 100 },
            content: 'فكرة رقم 1',
            style: { backgroundColor: '#fef3c7' }
          }
        ]
      },
      {
        id: 'planning',
        name: 'قالب التخطيط',
        description: 'قالب لتخطيط المشاريع والمهام',
        elements: [
          {
            id: 'template-kanban',
            type: 'smart-element' as const,
            position: { x: 50, y: 50 },
            size: { width: 600, height: 400 },
            content: 'لوحة كانبان',
            data: { elementType: 'kanban-board' }
          }
        ]
      }
    ];
  }, []);

  // Apply template
  const applyTemplate = useCallback((templateId: string) => {
    const templates = getTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (template && project) {
      updateElements(template.elements);
      toast.success(`تم تطبيق قالب ${template.name}`);
    }
  }, [project, updateElements, getTemplates]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges || !project) return;

    const saveTimeout = setTimeout(() => {
      saveProject();
    }, saveInterval);

    return () => clearTimeout(saveTimeout);
  }, [autoSave, hasUnsavedChanges, project, saveInterval, saveProject]);

  // Load project on mount
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  return {
    // State
    project,
    loading,
    saving,
    lastSaved,
    hasUnsavedChanges,

    // Actions
    loadProject,
    saveProject,
    updateElements,
    updateSettings,
    exportProject,
    importProject,
    applyTemplate,

    // Templates
    templates: getTemplates(),

    // Utilities
    getProjectInfo: () => project ? {
      name: project.name,
      elementsCount: project.elements.length,
      lastModified: project.metadata.updatedAt,
      version: project.metadata.version
    } : null
  };
}