import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type ProjectEventKind = 'financial' | 'project' | 'legal' | 'task' | 'ai' | 'system';

export interface EmitProjectEventInput {
  eventType: string;
  eventKind: ProjectEventKind;
  aggregateType: string;
  aggregateId: string;
  projectId?: string | null;
  boardId?: string | null;
  payload?: Record<string, unknown>;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (value: string | null | undefined): value is string => Boolean(value && UUID_PATTERN.test(value));

class ProjectEventBusService {
  async emitProjectEvent(input: EmitProjectEventInput): Promise<string | undefined> {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('project:event', { detail: input }));
    }

    if (!isUuid(input.projectId)) {
      return undefined;
    }

    const { data: userData } = await supabase.auth.getUser();
    const actorId = userData.user?.id;
    if (!isUuid(actorId)) {
      return undefined;
    }

    const { data, error } = await supabase
      .from('project_events')
      .insert({
        actor_id: actorId,
        aggregate_id: input.aggregateId,
        aggregate_type: input.aggregateType,
        board_id: input.boardId ?? null,
        event_kind: input.eventKind,
        event_type: input.eventType,
        payload: (input.payload ?? {}) as Json,
        project_id: input.projectId,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to emit project event: ${error.message}`);
    }

    return data.id;
  }
}

export const projectEventBus = new ProjectEventBusService();
export default projectEventBus;
