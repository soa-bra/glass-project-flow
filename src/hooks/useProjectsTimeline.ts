import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * NOTE (P1): The legacy `project_phases` table was dropped during the central
 * model migration. This hook now reads from the central `projects` table and
 * exposes an empty `phases` array — the timeline UI keeps working but only
 * shows project start/end markers until a real phases concept lands in P3.
 */
export interface ProjectWithPhases {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  phases: ProjectPhase[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
}

export interface TimelineEventFromProject {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  color: string;
  layer: number;
  projectId: string;
  phaseId?: string;
  type: 'project_start' | 'project_end' | 'phase';
}

const PHASE_COLORS = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9b87f5', '#0EA5E9'];

export const useProjectsTimeline = () => {
  const [projects, setProjects] = useState<ProjectWithPhases[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, description, state, start_date, due_date, budget')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Map central `projects` shape to the legacy ProjectWithPhases shape.
      // `state` -> `status`, `due_date` -> `end_date`, phases stay empty until
      // a real phases concept is added in P3.
      const mapped: ProjectWithPhases[] = (projectsData ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.state,
        start_date: p.start_date,
        end_date: p.due_date,
        budget: p.budget == null ? null : Number(p.budget),
        phases: [],
      }));

      setProjects(mapped);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('فشل في جلب المشاريع');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // تحويل المشروع إلى أحداث للخط الزمني
  const convertProjectToTimelineEvents = useCallback((project: ProjectWithPhases): TimelineEventFromProject[] => {
    const events: TimelineEventFromProject[] = [];
    const today = new Date().toISOString().split('T')[0];

    // حدث بداية المشروع
    if (project.start_date) {
      events.push({
        id: `project-start-${project.id}`,
        title: `بداية: ${project.name}`,
        description: project.description || undefined,
        date: project.start_date,
        color: '#3DBE8B',
        layer: 0,
        projectId: project.id,
        type: 'project_start'
      });
    }

    // حدث نهاية المشروع
    if (project.end_date) {
      events.push({
        id: `project-end-${project.id}`,
        title: `نهاية: ${project.name}`,
        description: project.description || undefined,
        date: project.end_date,
        color: '#E5564D',
        layer: 0,
        projectId: project.id,
        type: 'project_end'
      });
    }

    // أحداث المراحل
    project.phases.forEach((phase, index) => {
      if (phase.start_date) {
        events.push({
          id: `phase-${phase.id}`,
          title: phase.name,
          description: phase.description || undefined,
          date: phase.start_date,
          endDate: phase.end_date || undefined,
          color: PHASE_COLORS[index % PHASE_COLORS.length],
          layer: index + 1,
          projectId: project.id,
          phaseId: phase.id,
          type: 'phase'
        });
      }
    });

    return events;
  }, []);

  // جلب أحداث مشروع معين
  const getProjectTimelineEvents = useCallback((projectId: string): TimelineEventFromProject[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return convertProjectToTimelineEvents(project);
  }, [projects, convertProjectToTimelineEvents]);

  // جلب أحداث جميع المشاريع
  const getAllProjectsTimelineEvents = useCallback((): TimelineEventFromProject[] => {
    return projects.flatMap(convertProjectToTimelineEvents);
  }, [projects, convertProjectToTimelineEvents]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProjectTimelineEvents,
    getAllProjectsTimelineEvents,
    convertProjectToTimelineEvents
  };
};
