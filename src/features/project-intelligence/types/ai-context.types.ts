import type {
  AIToolsAnalysisResult,
  AIToolsSmartSuggestion,
  CanvasBoard,
  CanvasBoardStateSnapshot,
} from '@/features/planning/domain/types';
import type { DataLinkImpact } from './data-link.types';
import type { ProjectEventRow, ProjectIntelligenceDepartment, ProjectRow } from './project-intelligence.types';

export interface UnifiedProjectContextInput {
  projectId: string;
  boardId?: string;
  departments?: ProjectIntelligenceDepartment[];
  includeAuditTrail?: boolean;
}

export interface UnifiedProjectContext {
  project: ProjectRow | null;
  planningBoard?: Pick<CanvasBoard, 'id' | 'name' | 'status'>;
  canvasSnapshot?: CanvasBoardStateSnapshot;
  departments: ProjectIntelligenceDepartment[];
  links: DataLinkImpact[];
  recentEvents: ProjectEventRow[];
  ai: {
    analysis?: AIToolsAnalysisResult;
    suggestions: AIToolsSmartSuggestion[];
    contextSummary: string;
  };
}

export interface AIContextEnvelope {
  projectId: string;
  boardId?: string;
  generatedAt: string;
  context: UnifiedProjectContext;
}
