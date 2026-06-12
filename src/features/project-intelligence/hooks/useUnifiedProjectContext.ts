import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ProjectEventRow } from '../types/project-intelligence.types';
import type { UnifiedProjectContext, UnifiedProjectContextInput } from '../types/ai-context.types';
import { getCrossDepartmentImpacts } from '../services/crossDepartmentLink.service';

interface UnifiedProjectContextState {
  context: UnifiedProjectContext | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

function buildContextSummary(input: UnifiedProjectContextInput, eventCount: number, linkCount: number): string {
  return [
    `Project ${input.projectId}`,
    input.boardId ? `board ${input.boardId}` : 'without board filter',
    `${eventCount} recent events`,
    `${linkCount} cross-department links`,
  ].join(' · ');
}

export function useUnifiedProjectContext(input: UnifiedProjectContextInput): UnifiedProjectContextState {
  const [context, setContext] = useState<UnifiedProjectContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const departments = useMemo(() => input.departments ?? [], [input.departments]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const projectQuery = supabase
        .from('projects')
        .select('*')
        .eq('id', input.projectId)
        .maybeSingle();

      let eventQuery = supabase
        .from('project_events')
        .select('*')
        .eq('project_id', input.projectId)
        .order('created_at', { ascending: false })
        .limit(25);

      if (input.boardId) eventQuery = eventQuery.eq('board_id', input.boardId);

      const [projectResult, eventsResult, links] = await Promise.all([
        projectQuery,
        eventQuery,
        getCrossDepartmentImpacts({
          projectId: input.projectId,
          boardId: input.boardId,
          limit: 100,
        }),
      ]);

      if (projectResult.error) throw projectResult.error;
      if (eventsResult.error) throw eventsResult.error;

      const recentEvents = (eventsResult.data ?? []) as ProjectEventRow[];
      setContext({
        project: projectResult.data,
        departments,
        links,
        recentEvents,
        ai: {
          suggestions: [],
          contextSummary: buildContextSummary(input, recentEvents.length, links.length),
        },
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught : new Error('Failed to load unified project context'));
    } finally {
      setIsLoading(false);
    }
  }, [departments, input]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { context, isLoading, error, refresh };
}
