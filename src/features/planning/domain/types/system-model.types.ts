import { z } from 'zod';

/**
 * Central Integration Data Model
 * Board / Department / Project / Task / Tool / EngineJob / Dependency / State
 */

export const EntityTypeSchema = z.enum([
  'board',
  'department',
  'project',
  'task',
  'tool',
  'engine_job',
  'project_card',
  'task_card',
]);
export type EntityType = z.infer<typeof EntityTypeSchema>;

export const StateSchema = z.enum([
  'draft',
  'planned',
  'active',
  'blocked',
  'paused',
  'completed',
  'cancelled',
  'archived',
  'failed',
]);
export type State = z.infer<typeof StateSchema>;

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export type Priority = z.infer<typeof PrioritySchema>;

export const ComplexitySchema = z.enum(['trivial', 'simple', 'moderate', 'complex', 'critical']);
export type Complexity = z.infer<typeof ComplexitySchema>;

export const DependencyTypeSchema = z.enum([
  'execution',
  'data',
  'technical',
  'operational',
  'time',
]);
export type DependencyType = z.infer<typeof DependencyTypeSchema>;

export const ToolKindSchema = z.enum([
  'board_widget',
  'dashboard_panel',
  'workflow_tool',
  'analysis_tool',
  'integration_tool',
]);
export type ToolKind = z.infer<typeof ToolKindSchema>;

export const EngineJobKindSchema = z.enum([
  'automation',
  'data_processing',
  'orchestration',
  'sync',
  'analytics',
  'validation',
]);
export type EngineJobKind = z.infer<typeof EngineJobKindSchema>;

export const DepartmentProjectRoleSchema = z.enum(['owner', 'supervisor']);
export type DepartmentProjectRole = z.infer<typeof DepartmentProjectRoleSchema>;

export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  state: StateSchema,
  ownerId: z.string().uuid().nullable().optional(),
  priority: PrioritySchema.default('medium'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

export const BoardSchema = BaseEntitySchema.extend({
  entityType: z.literal('board'),
  code: z.string().min(2),
  toolIds: z.array(z.string().uuid()).default([]),
});
export type Board = z.infer<typeof BoardSchema>;

export const DepartmentSchema = BaseEntitySchema.extend({
  entityType: z.literal('department'),
  code: z.string().min(2),
});
export type Department = z.infer<typeof DepartmentSchema>;

export const ProjectSchema = BaseEntitySchema.extend({
  entityType: z.literal('project'),
  departmentLinks: z.array(z.object({
    departmentId: z.string().uuid(),
    role: DepartmentProjectRoleSchema,
  })).default([]),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  budget: z.number().nonnegative().optional(),
  taskIds: z.array(z.string().uuid()).default([]),
});
export type Project = z.infer<typeof ProjectSchema>;

export const TaskSchema = BaseEntitySchema.extend({
  entityType: z.literal('task'),
  linkedProjectId: z.string().uuid(),
  estimatedDuration: z.number().nonnegative(),
  estimatedCost: z.number().nonnegative(),
  complexity: ComplexitySchema,
  requiredTeamSize: z.number().int().positive(),
  dependencyIds: z.array(z.string().uuid()).default([]),
  linkedToolIds: z.array(z.string().uuid()).default([]),
  linkedEngineJobIds: z.array(z.string().uuid()).default([]),
  assigneeId: z.string().uuid().nullable().optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  actualDuration: z.number().nonnegative().optional(),
  actualCost: z.number().nonnegative().optional(),
});
export type Task = z.infer<typeof TaskSchema>;

export const ToolSchema = BaseEntitySchema.extend({
  entityType: z.literal('tool'),
  boardId: z.string().uuid(),
  kind: ToolKindSchema,
  producedByTaskId: z.string().uuid().optional(),
  readsFromEngineJobIds: z.array(z.string().uuid()).default([]),
  triggersEngineJobIds: z.array(z.string().uuid()).default([]),
});
export type Tool = z.infer<typeof ToolSchema>;

export const EngineJobSchema = BaseEntitySchema.extend({
  entityType: z.literal('engine_job'),
  kind: EngineJobKindSchema,
  producedByTaskId: z.string().uuid().optional(),
  triggeredByToolId: z.string().uuid().optional(),
});
export type EngineJob = z.infer<typeof EngineJobSchema>;

export const CardProjectionSchema = z.enum(['compact', 'standard', 'executive']);
export type CardProjection = z.infer<typeof CardProjectionSchema>;

export const ProjectCardSchema = BaseEntitySchema.extend({
  entityType: z.literal('project_card'),
  linkedProjectId: z.string().uuid(),
  projection: CardProjectionSchema.default('standard'),
  boardId: z.string().uuid().optional(),
  visibleMetrics: z.array(z.enum([
    'status',
    'progress',
    'budget',
    'duration',
    'tasks',
    'team_size',
    'risk_score',
  ])).default(['status', 'progress', 'tasks']),
});
export type ProjectCard = z.infer<typeof ProjectCardSchema>;

export const TaskCardSchema = BaseEntitySchema.extend({
  entityType: z.literal('task_card'),
  linkedTaskId: z.string().uuid(),
  linkedProjectId: z.string().uuid(),
  projection: CardProjectionSchema.default('standard'),
  boardId: z.string().uuid().optional(),
  visibleMetrics: z.array(z.enum([
    'state',
    'priority',
    'complexity',
    'estimated_duration',
    'estimated_cost',
    'required_team_size',
    'due_date',
  ])).default(['state', 'priority', 'complexity']),
});
export type TaskCard = z.infer<typeof TaskCardSchema>;

export const DependencySchema = z.object({
  id: z.string().uuid(),
  fromEntityType: EntityTypeSchema,
  fromEntityId: z.string().uuid(),
  toEntityType: EntityTypeSchema,
  toEntityId: z.string().uuid(),
  dependencyType: DependencyTypeSchema,
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});
export type Dependency = z.infer<typeof DependencySchema>;

export const TaskToolEngineLinkSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  toolId: z.string().uuid(),
  engineJobId: z.string().uuid(),
  relationType: z.enum(['produces', 'binds', 'executes']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type TaskToolEngineLink = z.infer<typeof TaskToolEngineLinkSchema>;

export const CentralModelSchema = z.object({
  boards: z.array(BoardSchema).default([]),
  departments: z.array(DepartmentSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  tasks: z.array(TaskSchema).default([]),
  tools: z.array(ToolSchema).default([]),
  engineJobs: z.array(EngineJobSchema).default([]),
  projectCards: z.array(ProjectCardSchema).default([]),
  taskCards: z.array(TaskCardSchema).default([]),
  dependencies: z.array(DependencySchema).default([]),
  taskToolEngineLinks: z.array(TaskToolEngineLinkSchema).default([]),
});
export type CentralModel = z.infer<typeof CentralModelSchema>;
