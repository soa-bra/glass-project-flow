import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type {
  ProjectEventInsert,
  PublishProjectEventInput,
  PublishProjectEventResult,
  SyncQueueInsert,
} from '../types/project-intelligence.types';
import { recordProjectIntelligenceAudit } from './auditLog.service';

async function requireActorId(inputActorId?: string): Promise<string> {
  if (inputActorId) return inputActorId;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
}

/**
 * Orchestration-only event bus: records the project event and enqueues downstream sync.
 * It does not execute canvas/domain mutations; callers must pass already-approved facts.
 */
export async function publishProjectEvent(
  input: PublishProjectEventInput,
): Promise<PublishProjectEventResult> {
  const actorId = await requireActorId(input.actorId);

  const eventRow: ProjectEventInsert = {
    project_id: input.projectId,
    board_id: input.boardId ?? null,
    actor_id: actorId,
    aggregate_type: input.aggregateType,
    aggregate_id: input.aggregateId,
    event_type: input.eventType,
    event_kind: input.eventKind,
    payload: (input.payload ?? {}) as Json,
  };

  const { data: event, error: eventError } = await supabase
    .from('project_events')
    .insert(eventRow)
    .select('*')
    .single();

  if (eventError) throw eventError;

  let syncQueueItem: PublishProjectEventResult['syncQueueItem'];
  if (input.sync) {
    if (!input.boardId) {
      throw new Error('boardId is required when enqueueing sync_queue items.');
    }

    const syncRow: SyncQueueInsert = {
      board_id: input.boardId,
      project_id: input.projectId,
      created_by: actorId,
      entity_table: input.sync.entityTable,
      entity_id: input.sync.entityId ?? input.aggregateId,
      operation: input.sync.operation ?? input.eventType,
      status: 'pending',
      payload: {
        projectEventId: event.id,
        projectId: input.projectId,
        boardId: input.boardId,
        eventType: input.eventType,
        eventKind: input.eventKind,
        ...(input.sync.payload ?? {}),
      } as Json,
    };

    const { data: queued, error: syncError } = await supabase
      .from('sync_queue')
      .insert(syncRow)
      .select('*')
      .single();

    if (syncError) throw syncError;
    syncQueueItem = queued;
  }

  await recordProjectIntelligenceAudit({
    action: 'project_intelligence.project_event.publish',
    resourceType: 'project_event',
    resourceId: event.id,
    scopeType: input.boardId ? 'board' : 'project',
    scopeId: input.boardId ?? input.projectId,
    metadata: {
      projectId: input.projectId,
      boardId: input.boardId,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      eventType: input.eventType,
      syncQueueId: syncQueueItem?.id,
    },
  });

  return { event, syncQueueItem };
}

export const projectEventBusService = {
  publish: publishProjectEvent,
};
