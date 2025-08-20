import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { SceneGraph } from '../lib/canvas/utils/scene-graph';
import { ConnectionManager } from '../lib/canvas/controllers/connection-manager';

export interface WF01MappingResult {
  type: 'project' | 'phase' | 'task' | 'dependency' | 'skipped';
  sourceId: string;
  sourceType: string;
  targetData?: Record<string, any>;
  confidence: number;
  reason: string;
  suggestions?: string[];
}

export interface WF01Statistics {
  totalElements: number;
  mappedElements: number;
  skippedElements: number;
  successRate: number;
  breakdown: {
    phases: number;
    tasks: number;
    dependencies: number;
    skipped: number;
  };
}

export interface WF01Response {
  success: boolean;
  mappingResults: WF01MappingResult[];
  projectStructure: any;
  statistics: WF01Statistics;
  recommendations: string[];
  error?: string;
}

interface UseWF01GeneratorProps {
  sceneGraph: SceneGraph;
  connectionManager: ConnectionManager;
  boardId: string;
}

export function useWF01Generator({
  sceneGraph,
  connectionManager,
  boardId
}: UseWF01GeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<WF01Response | null>(null);

  const captureSnapshot = () => {
    const elements = sceneGraph.getAllNodes().map(node => ({
      id: node.id,
      type: node.type,
      content: (node as any).content || '',
      position: node.transform.position,
      size: node.size,
      style: node.style,
      metadata: node.metadata || {}
    }));

    const links = connectionManager.getConnections().map(conn => ({
      id: conn.id,
      from_object_id: conn.fromPoint.nodeId,
      to_object_id: conn.toPoint.nodeId,
      style: conn.style,
      label: conn.title
    }));

    return { elements, links };
  };

  const generateProject = async (): Promise<WF01Response> => {
    setIsGenerating(true);
    
    try {
      // Step 1: Capture current canvas state
      const snapshot = captureSnapshot();
      
      console.log(`WF-01: Captured ${snapshot.elements.length} elements and ${snapshot.links.length} links`);

      // Step 2: Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('المستخدم غير مسجل الدخول');
      }

      // Step 3: Call WF-01 mapping function
      const { data, error } = await supabase.functions.invoke('wf01-map', {
        body: {
          elements: snapshot.elements,
          links: snapshot.links,
          boardId,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message || 'فشل في تحليل عناصر اللوح');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'استجابة غير صحيحة من خدمة التحليل');
      }

      console.log(`WF-01: Generated project with ${data.statistics.successRate}% success rate`);
      
      setLastResult(data);
      return data;

    } catch (error) {
      console.error('WF-01 Generation Error:', error);
      
      const errorResult: WF01Response = {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير متوقع',
        mappingResults: [],
        projectStructure: null,
        statistics: {
          totalElements: 0,
          mappedElements: 0,
          skippedElements: 0,
          successRate: 0,
          breakdown: { phases: 0, tasks: 0, dependencies: 0, skipped: 0 }
        },
        recommendations: ['تأكد من وجود عناصر في اللوح قبل التحليل']
      };
      
      setLastResult(errorResult);
      return errorResult;
      
    } finally {
      setIsGenerating(false);
    }
  };

  const applyProjectStructure = async (projectStructure: any): Promise<boolean> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('المستخدم غير مسجل الدخول');
      }

      // Create the main project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectStructure.project.name,
          description: projectStructure.project.description,
          status: projectStructure.project.status,
          settings: projectStructure.project.metadata,
          owner_id: user.id
        })
        .select()
        .single();

      if (projectError || !project) {
        throw new Error('فشل في إنشاء المشروع');
      }

      // Create phases
      if (projectStructure.phases && projectStructure.phases.length > 0) {
        const { error: phasesError } = await supabase
          .from('project_phases')
          .insert(
            projectStructure.phases.map((phase: any) => ({
              ...phase,
              project_id: project.id
            }))
          );

        if (phasesError) {
          console.error('Error creating phases:', phasesError);
        }
      }

      // Create tasks
      if (projectStructure.tasks && projectStructure.tasks.length > 0) {
        const { error: tasksError } = await supabase
          .from('project_tasks')
          .insert(
            projectStructure.tasks.map((task: any) => ({
              ...task,
              project_id: project.id,
              created_by: user.id
            }))
          );

        if (tasksError) {
          console.error('Error creating tasks:', tasksError);
        }
      }

      console.log(`WF-01: Successfully created project with ID ${project.id}`);
      return true;

    } catch (error) {
      console.error('Apply Project Structure Error:', error);
      return false;
    }
  };

  const validateCanvas = (): { isValid: boolean; issues: string[] } => {
    const elements = sceneGraph.getAllNodes();
    const connections = connectionManager.getConnections();
    const issues: string[] = [];

    if (elements.length === 0) {
      issues.push('اللوح فارغ - أضف بعض العناصر أولاً');
    }

    if (elements.length < 3) {
      issues.push('عدد العناصر قليل - أضف المزيد للحصول على نتائج أفضل');
    }

    const hasFrames = elements.some(el => 
      el.type === 'frame' || el.metadata?.smartElementType === 'Frame'
    );
    
    if (!hasFrames) {
      issues.push('لا توجد إطارات عمل - أضف إطارات لتمثيل مراحل المشروع');
    }

    const hasStickies = elements.some(el => 
      el.type === 'sticky' || 
      el.metadata?.smartElementType === 'StickyNote' ||
      (el.type === 'text' && el.content && el.content.length > 5)
    );

    if (!hasStickies) {
      issues.push('لا توجد ملاحظات لاصقة - أضف ملاحظات لتمثيل المهام');
    }

    if (connections.length === 0 && elements.length > 5) {
      issues.push('لا توجد روابط - أضف روابط لتمثيل التبعيات');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const getCanvasInfo = () => {
    const elements = sceneGraph.getAllNodes();
    const connections = connectionManager.getConnections();
    
    const elementTypes = elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalElements: elements.length,
      totalConnections: connections.length,
      elementTypes,
      estimatedMappable: Object.entries(elementTypes).reduce((sum, [type, count]) => {
        if (['frame', 'sticky', 'text'].includes(type)) return sum + count;
        return sum;
      }, 0) + connections.length
    };
  };

  return {
    // State
    isGenerating,
    lastResult,
    
    // Actions
    generateProject,
    applyProjectStructure,
    
    // Utilities
    validateCanvas,
    getCanvasInfo,
    captureSnapshot,
    
    // Reset
    clearResult: () => setLastResult(null)
  };
}