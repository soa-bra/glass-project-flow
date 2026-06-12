import { buildAIContext, type UnifiedAIContext } from '@/features/ai/context/contextBuilder';
import type { SmartAssistantCommandId } from './aiGateway.client';

export interface ProjectContextBuilderInput {
  activeSection?: string | null;
  commandId?: SmartAssistantCommandId | null;
  extraContext?: Record<string, unknown> | null;
}

export interface ProjectIntelligenceContext extends UnifiedAIContext {
  workspace: 'project-intelligence';
  commandId: SmartAssistantCommandId | null;
  capturedAt: string;
  guardrails: {
    requiresHumanConfirmation: boolean;
    blocksDirectOperationalExecution: boolean;
  };
}

export function buildProjectIntelligenceContext(
  input: ProjectContextBuilderInput = {},
): ProjectIntelligenceContext {
  const baseContext = buildAIContext({
    activeSection: input.activeSection ?? 'projects',
    extraContext: input.extraContext ?? {},
  });

  return {
    ...baseContext,
    workspace: 'project-intelligence',
    commandId: input.commandId ?? null,
    capturedAt: new Date().toISOString(),
    guardrails: {
      requiresHumanConfirmation: true,
      blocksDirectOperationalExecution: true,
    },
  };
}
