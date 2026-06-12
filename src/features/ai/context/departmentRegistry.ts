export type AIDepartmentId = 'planning' | 'projects' | 'finance' | 'legal' | 'crm' | 'general';

export interface AIDepartmentDefinition {
  id: AIDepartmentId;
  label: string;
  defaultPermissions: string[];
  sensitiveContextKeys: string[];
}

export const AI_DEPARTMENT_REGISTRY: Record<AIDepartmentId, AIDepartmentDefinition> = {
  planning: {
    id: 'planning',
    label: 'Planning Canvas',
    defaultPermissions: ['canvas.ai.use'],
    sensitiveContextKeys: ['selectedElements', 'availableLinks'],
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['projectId', 'milestones', 'dependencies'],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['budget', 'cost', 'invoice', 'payment', 'revenue'],
  },
  legal: {
    id: 'legal',
    label: 'Legal',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['contract', 'clause', 'compliance', 'policy'],
  },
  crm: {
    id: 'crm',
    label: 'CRM',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['customer', 'email', 'phone', 'address'],
  },
  general: {
    id: 'general',
    label: 'General',
    defaultPermissions: ['canvas.ai.use'],
    sensitiveContextKeys: ['confidential', 'private', 'sensitive'],
  },
};

export const getAIDepartmentDefinition = (departmentId?: AIDepartmentId | null): AIDepartmentDefinition => {
  if (!departmentId) return AI_DEPARTMENT_REGISTRY.general;
  return AI_DEPARTMENT_REGISTRY[departmentId] ?? AI_DEPARTMENT_REGISTRY.general;
};
