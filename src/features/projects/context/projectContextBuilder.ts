import { buildAIContext, type AIContextPermissions, type UnifiedAIContext } from '@/features/ai/context/contextBuilder';
import type { DataLinkSummary } from '@/components/shared/LinkIndicator';

export interface ProjectContextBuilderInput {
  projectId?: string | number | null;
  activeSection: 'financial' | 'projects' | 'legal' | string;
  activeTab?: string | null;
  selectedRecords?: unknown[];
  dataLinks?: DataLinkSummary[];
  permissions?: AIContextPermissions;
  metadata?: Record<string, unknown>;
}

export function buildProjectContext(input: ProjectContextBuilderInput): UnifiedAIContext {
  return buildAIContext({
    boardId: input.projectId == null ? null : String(input.projectId),
    activeSection: input.activeSection,
    activeTab: input.activeTab,
    selectedElements: input.selectedRecords ?? [],
    availableLinks: (input.dataLinks ?? []).map((link) => ({
      id: link.id,
      label: link.label,
      type: link.link_kind,
      ...link.metadata,
    })),
    permissions: input.permissions ?? { role: 'editor' },
    extraContext: {
      projectId: input.projectId == null ? null : String(input.projectId),
      metadata: input.metadata ?? {},
    },
  });
}
