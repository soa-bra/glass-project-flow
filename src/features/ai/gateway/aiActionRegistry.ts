import type { SmartElementType } from '@/types/smart-elements';
import type { CanvasAIPermissionScope } from '@/features/planning/hooks/useCanvasAIPermissions';

export type AIActionSensitivity = 'low' | 'medium' | 'high';
export type SmartElementsAIAction = CanvasAIPermissionScope;

export type AIActionName =
  | 'analyze_project_impact'
  | 'convert_to_tasks'
  | 'generate_smart_doc'
  | 'suggest_connections'
  | 'generate'
  | 'analyze'
  | 'transform';

export type AIActionInputKind =
  | 'prompt'
  | 'selectedElements'
  | 'preferredType'
  | 'targetType'
  | 'boardId'
  | 'projectId'
  | 'humanApproval'
  | 'availableLinks';

export interface AIActionDefinition {
  action: AIActionName;
  edgeAction: SmartElementsAIAction;
  description: string;
  inputs: AIActionInputKind[];
  requiredPermissions: string[];
  sensitivity: AIActionSensitivity;
}

export const AI_ACTION_REGISTRY: Record<AIActionName, AIActionDefinition> = {
  analyze_project_impact: {
    action: 'analyze_project_impact',
    edgeAction: 'analyze',
    description: 'Analyze selected planning elements and explain their impact on the current project context.',
    inputs: ['selectedElements', 'prompt', 'boardId', 'projectId'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'medium',
  },
  convert_to_tasks: {
    action: 'convert_to_tasks',
    edgeAction: 'transform',
    description: 'Convert selected ideas, decisions, or roadmap items into actionable smart tasks.',
    inputs: ['selectedElements', 'targetType', 'prompt', 'boardId', 'projectId', 'humanApproval'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'high',
  },
  generate_smart_doc: {
    action: 'generate_smart_doc',
    edgeAction: 'generate',
    description: 'Generate a smart document or smart element draft from a natural-language prompt.',
    inputs: ['prompt', 'preferredType', 'boardId', 'projectId'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'medium',
  },
  suggest_connections: {
    action: 'suggest_connections',
    edgeAction: 'analyze',
    description: 'Suggest meaningful links and dependencies between selected smart elements.',
    inputs: ['selectedElements', 'availableLinks', 'prompt', 'boardId', 'projectId'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'low',
  },
  generate: {
    action: 'generate',
    edgeAction: 'generate',
    description: 'Legacy smart-elements generation action.',
    inputs: ['prompt', 'preferredType', 'boardId', 'projectId'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'medium',
  },
  analyze: {
    action: 'analyze',
    edgeAction: 'analyze',
    description: 'Legacy smart-elements analysis action.',
    inputs: ['selectedElements', 'prompt', 'boardId', 'projectId'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'medium',
  },
  transform: {
    action: 'transform',
    edgeAction: 'transform',
    description: 'Legacy smart-elements transformation action.',
    inputs: ['selectedElements', 'targetType', 'prompt', 'boardId', 'projectId', 'humanApproval'],
    requiredPermissions: ['canvas.ai.use', 'project.ai.use'],
    sensitivity: 'high',
  },
};

export const getAIActionDefinition = (action: AIActionName): AIActionDefinition => AI_ACTION_REGISTRY[action];

export const getSmartElementsAIAction = (action: AIActionName): SmartElementsAIAction => getAIActionDefinition(action).edgeAction;

export type AIActionContext = {
  boardId?: string | null;
  projectId?: string | null;
  preferredType?: SmartElementType | null;
  targetType?: SmartElementType | null;
  activeSection?: string | null;
  activeTab?: string | null;
  permissions?: Record<string, unknown> | null;
  availableLinks?: Array<Record<string, unknown>> | null;
  humanApproval?: {
    approved: boolean;
    approverId?: string | null;
    approvedAt?: string | null;
    approvalReason?: string | null;
  } | null;
  [key: string]: unknown;
};
