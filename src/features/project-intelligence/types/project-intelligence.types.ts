import type { Database, Json } from '@/integrations/supabase/types';
import type {
  AIToolsAnalysisResult,
  AIToolsSmartSuggestion,
  CanvasBoard,
  CanvasBoardStateSnapshot,
} from '@/features/planning/domain/types';

export type ProjectEventRow = Database['public']['Tables']['project_events']['Row'];
export type ProjectEventInsert = Database['public']['Tables']['project_events']['Insert'];
export type SyncQueueRow = Database['public']['Tables']['sync_queue']['Row'];
export type SyncQueueInsert = Database['public']['Tables']['sync_queue']['Insert'];
export type ProjectRow = Database['public']['Tables']['projects']['Row'];

export type ProjectIntelligenceDepartment =
  | 'planning'
  | 'projects'
  | 'finance'
  | 'hr'
  | 'marketing'
  | 'clients'
  | 'legal'
  | 'reports'
  | 'archive'
  | string;

export type ProjectIntelligenceEventKind =
  | 'planning_context_changed'
  | 'department_link_changed'
  | 'ai_context_requested'
  | 'permission_scope_checked'
  | 'audit_recorded'
  | string;

export interface ProjectEventPayload {
  sourceDepartment?: ProjectIntelligenceDepartment;
  targetDepartments?: ProjectIntelligenceDepartment[];
  planningBoard?: Pick<CanvasBoard, 'id' | 'name' | 'status'>;
  canvasSnapshot?: CanvasBoardStateSnapshot;
  aiAnalysis?: AIToolsAnalysisResult;
  aiSuggestions?: AIToolsSmartSuggestion[];
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PublishProjectEventInput {
  projectId: string;
  boardId?: string | null;
  actorId?: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventKind: ProjectIntelligenceEventKind;
  payload?: ProjectEventPayload;
  sync?: {
    entityTable: string;
    entityId?: string;
    operation?: string;
    payload?: Record<string, unknown>;
  };
}

export interface PublishProjectEventResult {
  event: ProjectEventRow;
  syncQueueItem?: SyncQueueRow;
}

export type JsonRecord = Record<string, unknown> & Json;
