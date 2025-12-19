/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Smart Element Type System - Contract First Architecture
 * نظام أنواع العناصر الذكية - معمارية العقود أولاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines all Zod schemas for smart elements in SoaBra.
 * All smart element data MUST be validated against these schemas.
 * AI generation layer will produce data conforming to these contracts.
 */

import { z } from 'zod';
import { migrateKanbanLegacyData } from '@/utils/kanbanLegacyMigration';

// ─────────────────────────────────────────────────────────────────────────────
// Smart Element Types Enum
// ─────────────────────────────────────────────────────────────────────────────

export const SmartElementTypes = [
  'thinking_board',
  'kanban',
  'voting',
  'brainstorming',
  'timeline',
  'decisions_matrix',
  'gantt',
  'interactive_sheet',
  'mind_map',
  'visual_diagram',
  'project_card',
  'finance_card',
  'csr_card',
  'crm_card',
  'interactive_document',
] as const;

export const SmartElementTypeSchema = z.enum(SmartElementTypes);
export type SmartElementType = z.infer<typeof SmartElementTypeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Base Smart Element Schema
// المخطط الأساسي للعنصر الذكي
// ─────────────────────────────────────────────────────────────────────────────

export const SmartElementBaseSchema = z.object({
  id: z.string(),
  smartType: SmartElementTypeSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
  version: z.number().default(1),
  settings: z.record(z.unknown()).optional(),
});

export type SmartElementBase = z.infer<typeof SmartElementBaseSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// COLLABORATION ELEMENTS - عناصر التعاون
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1. ThinkingBoard - لوحة التفكير
// ─────────────────────────────────────────────────────────────────────────────

export const ThinkingBoardTagSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string(),
});

export const ThinkingBoardDataSchema = z.object({
  label: z.string().default('لوحة التفكير'),
  backgroundColor: z.string().default('#FFFFFF'),
  tags: z.array(ThinkingBoardTagSchema).default([]),
  childElements: z.array(z.string()).default([]), // element IDs contained within
  isLocked: z.boolean().default(false),
  showBordersOnHover: z.boolean().default(true),
  expandable: z.boolean().default(true),
});

export type ThinkingBoardData = z.infer<typeof ThinkingBoardDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Kanban Board - لوحة كانبان
// ─────────────────────────────────────────────────────────────────────────────

export const KanbanCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).default([]),
  assignee: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  comments: z.number().default(0),
  votes: z.number().default(0),
  attachments: z.number().default(0),
  createdAt: z.string().datetime().optional(),
  order: z.number().default(0),
});

export const KanbanColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: z.string().optional(),
  cards: z.array(KanbanCardSchema).default([]),
  limit: z.number().optional(), // WIP limit
  collapsed: z.boolean().default(false),
});

export const KanbanBoardDataSchema = z.object({
  columns: z.array(KanbanColumnSchema).default([
    { id: 'todo', title: 'المهام', cards: [], collapsed: false },
    { id: 'in-progress', title: 'قيد التنفيذ', cards: [], collapsed: false },
    { id: 'done', title: 'منجز', cards: [], collapsed: false },
  ]),
  defaultColumn: z.string().default('todo'),
  allowColumnReorder: z.boolean().default(true),
  allowColumnAdd: z.boolean().default(true),
  allowColumnDelete: z.boolean().default(true),
  showCardCount: z.boolean().default(true),
  showWipLimit: z.boolean().default(false),
  compactMode: z.boolean().default(false),
});

export type KanbanCard = z.infer<typeof KanbanCardSchema>;
export type KanbanColumn = z.infer<typeof KanbanColumnSchema>;
export type KanbanBoardData = z.infer<typeof KanbanBoardDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Voting - التصويت
// ─────────────────────────────────────────────────────────────────────────────

export const VotingOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  votes: z.number().default(0),
  voters: z.array(z.string().uuid()).default([]),
  color: z.string().optional(),
});

export const VotingDataSchema = z.object({
  question: z.string().default('ما رأيك؟'),
  options: z.array(VotingOptionSchema).default([]),
  maxVotesPerUser: z.number().min(1).default(1),
  allowMultipleSelection: z.boolean().default(false),
  showResultsAs: z.enum(['percentage', 'count', 'both']).default('both'),
  showResultsBeforeEnd: z.boolean().default(false),
  anonymous: z.boolean().default(false),
  duration: z.number().optional(), // seconds, undefined = no limit
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  status: z.enum(['draft', 'active', 'paused', 'ended']).default('draft'),
  allowChangeVote: z.boolean().default(true),
});

export type VotingOption = z.infer<typeof VotingOptionSchema>;
export type VotingData = z.infer<typeof VotingDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 4. Brainstorming - محرك العصف الذهني
// ─────────────────────────────────────────────────────────────────────────────

export const BrainstormIdeaSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorId: z.string().uuid().optional(),
  authorName: z.string().optional(),
  createdAt: z.string().datetime(),
  groupId: z.string().optional(),
  votes: z.number().default(0),
  isSelected: z.boolean().default(false),
  linkedElementId: z.string().optional(), // for branching mode
  color: z.string().optional(),
});

export const BrainstormGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string(),
  ideaIds: z.array(z.string()).default([]),
});

export const BrainstormingDataSchema = z.object({
  topic: z.string().default('موضوع العصف الذهني'),
  mode: z.enum(['collaborative', 'silent', 'rapid', 'branching']).default('collaborative'),
  ideas: z.array(BrainstormIdeaSchema).default([]),
  groups: z.array(BrainstormGroupSchema).default([]),
  duration: z.number().optional(), // seconds
  maxIdeasPerUser: z.number().optional(),
  allowVoting: z.boolean().default(true),
  status: z.enum(['setup', 'active', 'reviewing', 'completed']).default('setup'),
  linkedElementId: z.string().optional(), // for branching mode - root element
  revealIdeasOnEnd: z.boolean().default(true), // for silent mode
  rapidModeWordLimit: z.number().default(5), // for rapid mode
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
});

export type BrainstormIdea = z.infer<typeof BrainstormIdeaSchema>;
export type BrainstormGroup = z.infer<typeof BrainstormGroupSchema>;
export type BrainstormingData = z.infer<typeof BrainstormingDataSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// PLANNING ELEMENTS - عناصر التخطيط
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 5. Timeline - خط زمني
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Helper function for default dates
const getDefaultStartDate = () => new Date().toISOString().split('T')[0];
const getDefaultEndDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
};

export const TimelineItemSchema = z.object({
  id: z.string(),
  elementId: z.string().optional(), // linked canvas element
  title: z.string().default('حدث جديد'), // ✅ تغيير من label إلى title
  description: z.string().optional(),
  date: z.string().default(getDefaultStartDate), // ✅ تاريخ بسيط بدون datetime
  endDate: z.string().optional(), // for date ranges
  color: z.string().default('#3DBE8B'),
  icon: z.string().optional(),
  layer: z.number().default(0), // for preventing overlap
  importance: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  completed: z.boolean().default(false),
  // ✅ حقول ربط المشروع
  projectId: z.string().uuid().optional(),
  phaseId: z.string().uuid().optional(),
  type: z.enum(['project_start', 'project_end', 'phase', 'custom']).default('custom'),
});

export const TimelineDataSchema = z.object({
  startDate: z.string().default(getDefaultStartDate), // ✅ قيمة افتراضية
  endDate: z.string().default(getDefaultEndDate), // ✅ قيمة افتراضية
  viewMode: z.enum(['day', 'week', 'month']).default('week'), // ✅ تغيير من unit إلى viewMode
  events: z.array(TimelineItemSchema).default([]), // ✅ تغيير من items إلى events
  linkedProjectId: z.string().uuid().optional(), // ✅ ربط بمشروع من قاعدة البيانات
  showToday: z.boolean().default(true),
  showWeekends: z.boolean().default(true),
  layers: z.number().min(1).max(10).default(3),
  colorByImportance: z.boolean().default(true),
  allowDragDrop: z.boolean().default(true),
  snapToUnit: z.boolean().default(true),
});

export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type TimelineData = z.infer<typeof TimelineDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Decisions Matrix - مصفوفة القرارات/الأهداف
// ─────────────────────────────────────────────────────────────────────────────

export const MatrixRowSchema = z.object({
  id: z.string(),
  label: z.string(), // الخيار أو الهدف
  description: z.string().optional(),
  color: z.string().optional(),
});

export const MatrixColumnSchema = z.object({
  id: z.string(),
  label: z.string(), // المعيار
  description: z.string().optional(),
  weight: z.number().min(0).max(10).default(1),
  type: z.enum(['numeric', 'stars', 'boolean', 'color']).default('numeric'),
});

export const MatrixCellSchema = z.object({
  value: z.union([z.number(), z.string(), z.boolean()]),
  note: z.string().optional(),
});

export const DecisionsMatrixDataSchema = z.object({
  title: z.string().default('مصفوفة القرارات'),
  rows: z.array(MatrixRowSchema).default([]),
  columns: z.array(MatrixColumnSchema).default([]),
  cells: z.record(z.string(), MatrixCellSchema).default({}), // key format: "rowId:colId"
  scoringType: z.enum(['numeric', 'stars', 'colors']).default('numeric'),
  numericRange: z.object({
    min: z.number().default(0),
    max: z.number().default(10),
  }).default({ min: 0, max: 10 }),
  showTotals: z.boolean().default(true),
  showWeightedTotals: z.boolean().default(true),
  autoRank: z.boolean().default(true),
  highlightBest: z.boolean().default(true),
  allowAIAnalysis: z.boolean().default(true),
});

export type MatrixRow = z.infer<typeof MatrixRowSchema>;
export type MatrixColumn = z.infer<typeof MatrixColumnSchema>;
export type MatrixCell = z.infer<typeof MatrixCellSchema>;
export type DecisionsMatrixData = z.infer<typeof DecisionsMatrixDataSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// ANALYSIS ELEMENTS - عناصر التحليل
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 7. Gantt Chart - مخطط جانت
// ─────────────────────────────────────────────────────────────────────────────

export const GanttDependencySchema = z.object({
  taskId: z.string(),
  type: z.enum(['finish-to-start', 'start-to-start', 'finish-to-finish', 'start-to-finish']).default('finish-to-start'),
  lag: z.number().default(0), // days
});

export const GanttTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  progress: z.number().min(0).max(100).default(0),
  color: z.string().optional(),
  assignee: z.string().uuid().optional(),
  assigneeName: z.string().optional(),
  parentId: z.string().optional(), // for subtasks
  dependencies: z.array(GanttDependencySchema).default([]),
  milestone: z.boolean().default(false),
  critical: z.boolean().default(false), // critical path
  linkedElementId: z.string().optional(), // linked canvas element
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const GanttDataSchema = z.object({
  tasks: z.array(GanttTaskSchema).default([]),
  viewMode: z.enum(['day', 'week', 'month', 'quarter']).default('week'),
  showDependencies: z.boolean().default(true),
  showProgress: z.boolean().default(true),
  showCriticalPath: z.boolean().default(false),
  showToday: z.boolean().default(true),
  projectId: z.string().uuid().optional(),
  autoSchedule: z.boolean().default(false),
  workingDays: z.array(z.number().min(0).max(6)).default([0, 1, 2, 3, 4]), // 0=Sunday
  hoursPerDay: z.number().default(8),
});

export type GanttDependency = z.infer<typeof GanttDependencySchema>;
export type GanttTask = z.infer<typeof GanttTaskSchema>;
export type GanttData = z.infer<typeof GanttDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 8. Interactive Sheet - ورقة البيانات التفاعلية
// ─────────────────────────────────────────────────────────────────────────────

export const SheetCellFormatSchema = z.object({
  type: z.enum(['text', 'number', 'currency', 'percentage', 'date', 'boolean']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  verticalAlign: z.enum(['top', 'middle', 'bottom']).optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  fontSize: z.number().optional(),
  wrap: z.boolean().optional(),
});

export const SheetCellSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  formula: z.string().optional(), // e.g., "=SUM(A1:A10)"
  format: SheetCellFormatSchema.optional(),
  note: z.string().optional(),
  validation: z.object({
    type: z.enum(['list', 'number', 'date', 'text']).optional(),
    criteria: z.unknown().optional(),
  }).optional(),
});

export const SheetLinkedElementSchema = z.object({
  cellRef: z.string(), // e.g., "A1"
  elementId: z.string(),
  property: z.string(), // which property to sync
  direction: z.enum(['read', 'write', 'both']).default('read'),
});

export const InteractiveSheetDataSchema = z.object({
  rows: z.number().min(1).max(1000).default(20),
  columns: z.number().min(1).max(100).default(10),
  cells: z.record(z.string(), SheetCellSchema).default({}), // key format: "A1", "B2"
  columnWidths: z.record(z.string(), z.number()).default({}),
  rowHeights: z.record(z.string(), z.number()).default({}),
  frozenRows: z.number().default(0),
  frozenColumns: z.number().default(0),
  linkedElements: z.array(SheetLinkedElementSchema).default([]),
  showGridLines: z.boolean().default(true),
  showRowNumbers: z.boolean().default(true),
  showColumnHeaders: z.boolean().default(true),
  allowFormulas: z.boolean().default(true),
  allowAIAnalysis: z.boolean().default(true),
});

export type SheetCellFormat = z.infer<typeof SheetCellFormatSchema>;
export type SheetCell = z.infer<typeof SheetCellSchema>;
export type SheetLinkedElement = z.infer<typeof SheetLinkedElementSchema>;
export type InteractiveSheetData = z.infer<typeof InteractiveSheetDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 9. Smart Mind Map - خرائط ذهنية ذكية
// ─────────────────────────────────────────────────────────────────────────────

export const MindMapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  parentId: z.string().nullable(), // null for root
  color: z.string().optional(),
  icon: z.string().optional(),
  collapsed: z.boolean().default(false),
  linkedElementId: z.string().optional(),
  notes: z.string().optional(),
  position: z.object({ 
    x: z.number(), 
    y: z.number() 
  }).optional(), // for organic layout
  childIds: z.array(z.string()).default([]),
  order: z.number().default(0), // sibling order
});

export const MindMapConnectionSchema = z.object({
  id: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
  style: z.enum(['solid', 'dashed', 'dotted']).default('dashed'),
});

export const MindMapDataSchema = z.object({
  rootId: z.string().default('root'),
  nodes: z.record(z.string(), MindMapNodeSchema).default({
    root: {
      id: 'root',
      label: 'الفكرة الرئيسية',
      parentId: null,
      childIds: [],
      collapsed: false,
      order: 0,
      color: '#3DA8F5',
    }
  }),
  connections: z.array(MindMapConnectionSchema).default([]), // cross-branch connections
  layout: z.enum(['radial', 'tree-right', 'tree-down', 'organic']).default('radial'),
  branchColors: z.array(z.string()).default([
    '#3DBE8B', '#F6C445', '#E5564D', '#3DA8F5', '#9B59B6', '#1ABC9C'
  ]),
  autoLayout: z.boolean().default(true),
  showConnections: z.boolean().default(true),
  allowAIExpansion: z.boolean().default(true),
  maxDepth: z.number().optional(), // limit expansion depth
});

// Migration function for legacy mind map data
export function migrateMindMapLegacyData(data: unknown): { data: unknown; migrated: boolean } {
  if (!data || typeof data !== 'object') {
    return { data, migrated: false };
  }
  
  const obj = data as Record<string, unknown>;
  let migrated = false;
  
  // Check if migration is needed (old format uses 'text' and 'children')
  if (obj.nodes && typeof obj.nodes === 'object') {
    const nodes = obj.nodes as Record<string, Record<string, unknown>>;
    const migratedNodes: Record<string, Record<string, unknown>> = {};
    
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node && typeof node === 'object') {
        const migratedNode = { ...node };
        
        // Migrate text → label
        if ('text' in node && !('label' in node)) {
          migratedNode.label = node.text;
          delete migratedNode.text;
          migrated = true;
        }
        
        // Migrate children → childIds
        if ('children' in node && !('childIds' in node)) {
          migratedNode.childIds = node.children;
          delete migratedNode.children;
          migrated = true;
        }
        
        // Add parentId if missing
        if (!('parentId' in node)) {
          migratedNode.parentId = nodeId === (obj.rootId || 'root') ? null : findParentId(nodes, nodeId);
          migrated = true;
        }
        
        migratedNodes[nodeId] = migratedNode;
      }
    }
    
    if (migrated) {
      return { 
        data: { ...obj, nodes: migratedNodes }, 
        migrated: true 
      };
    }
  }
  
  return { data, migrated: false };
}

function findParentId(nodes: Record<string, Record<string, unknown>>, targetId: string): string | null {
  for (const [nodeId, node] of Object.entries(nodes)) {
    const children = (node.children || node.childIds) as string[] | undefined;
    if (children?.includes(targetId)) {
      return nodeId;
    }
  }
  return null;
}

export type MindMapNode = z.infer<typeof MindMapNodeSchema>;
export type MindMapConnection = z.infer<typeof MindMapConnectionSchema>;
export type MindMapData = z.infer<typeof MindMapDataSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SMART CARDS - البطاقات الذكية
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 10. Project Card - بطاقة المشروع
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectCardFieldsSchema = z.enum([
  'name', 'status', 'progress', 'budget', 'spent', 'remaining',
  'tasks', 'completedTasks', 'phases', 'completedPhases',
  'startDate', 'endDate', 'owner', 'team', 'priority'
]);

export const ProjectCardDataSchema = z.object({
  projectId: z.string().uuid().optional(),
  displayFields: z.array(ProjectCardFieldsSchema).default([
    'name', 'status', 'progress', 'tasks'
  ]),
  showChart: z.boolean().default(false),
  chartType: z.enum(['progress', 'budget', 'tasks', 'timeline']).default('progress'),
  refreshInterval: z.number().default(0), // 0 = manual, otherwise seconds
  compactMode: z.boolean().default(false),
  showAlerts: z.boolean().default(true),
  alertThresholds: z.object({
    progressWarning: z.number().default(50),
    progressDanger: z.number().default(25),
    budgetWarning: z.number().default(80),
    budgetDanger: z.number().default(95),
  }).default({}),
});

export type ProjectCardFields = z.infer<typeof ProjectCardFieldsSchema>;
export type ProjectCardData = z.infer<typeof ProjectCardDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 11. Finance Card - بطاقة الوضع المالي
// ─────────────────────────────────────────────────────────────────────────────

export const FinanceMetricsSchema = z.enum([
  'budget', 'spent', 'remaining', 'percentage', 'forecast',
  'revenue', 'expenses', 'profit', 'cashFlow', 'roi'
]);

export const FinanceCardDataSchema = z.object({
  projectId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  displayMetrics: z.array(FinanceMetricsSchema).default([
    'budget', 'spent', 'remaining', 'percentage'
  ]),
  showTrend: z.boolean().default(true),
  trendPeriod: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
  showChart: z.boolean().default(true),
  chartType: z.enum(['bar', 'line', 'pie', 'area']).default('bar'),
  alertThreshold: z.number().default(80), // percentage for warnings
  currency: z.string().default('SAR'),
  refreshInterval: z.number().default(0),
  compactMode: z.boolean().default(false),
  showForecast: z.boolean().default(false),
});

export type FinanceMetrics = z.infer<typeof FinanceMetricsSchema>;
export type FinanceCardData = z.infer<typeof FinanceCardDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 12. CSR Card - بطاقة المسؤولية الاجتماعية
// ─────────────────────────────────────────────────────────────────────────────

export const CsrMetricsSchema = z.enum([
  'impact', 'participation', 'budget', 'timeline',
  'beneficiaries', 'volunteers', 'hours', 'satisfaction'
]);

export const CsrCardDataSchema = z.object({
  initiativeId: z.string().uuid().optional(),
  displayMetrics: z.array(CsrMetricsSchema).default([
    'impact', 'participation', 'beneficiaries'
  ]),
  showTimeline: z.boolean().default(false),
  showMap: z.boolean().default(false),
  showPhotos: z.boolean().default(false),
  refreshInterval: z.number().default(0),
  compactMode: z.boolean().default(false),
  impactCategories: z.array(z.string()).default([
    'بيئي', 'اجتماعي', 'تعليمي', 'صحي'
  ]),
});

export type CsrMetrics = z.infer<typeof CsrMetricsSchema>;
export type CsrCardData = z.infer<typeof CsrCardDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 13. CRM Card - بطاقة علاقات العملاء
// ─────────────────────────────────────────────────────────────────────────────

export const CrmMetricsSchema = z.enum([
  'interactions', 'satisfaction', 'revenue', 'retention',
  'leads', 'conversions', 'responseTime', 'nps', 'churn'
]);

export const CrmCardDataSchema = z.object({
  clientId: z.string().uuid().optional(),
  segmentId: z.string().uuid().optional(),
  displayMetrics: z.array(CrmMetricsSchema).default([
    'interactions', 'satisfaction', 'retention'
  ]),
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  showTrend: z.boolean().default(true),
  showChart: z.boolean().default(true),
  chartType: z.enum(['bar', 'line', 'radar', 'funnel']).default('line'),
  refreshInterval: z.number().default(0),
  compactMode: z.boolean().default(false),
  showAlerts: z.boolean().default(true),
  alertThresholds: z.object({
    satisfactionWarning: z.number().default(70),
    retentionWarning: z.number().default(80),
    responseTimeWarning: z.number().default(24), // hours
  }).default({}),
});

export type CrmMetrics = z.infer<typeof CrmMetricsSchema>;
export type CrmCardData = z.infer<typeof CrmCardDataSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE DOCUMENT - المستند التفاعلي
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 14. Interactive Document - المستند التفاعلي
// ─────────────────────────────────────────────────────────────────────────────

export const InteractiveDocumentDataSchema = z.object({
  content: z.string().default(''),
  format: z.enum(['plain', 'markdown']).default('plain'),
  isReadOnly: z.boolean().default(false),
  status: z.enum(['draft', 'review', 'approved', 'rejected', 'completed']).default('draft'),
  showWordCount: z.boolean().default(true),
  wordCount: z.number().default(0),
  charCount: z.number().default(0),
  lastEditedAt: z.string().default(() => new Date().toISOString()),
  createdAt: z.string().default(() => new Date().toISOString()),
  // Workflow integration
  linkedWorkflowNodeId: z.string().optional(),
  workflowStatus: z.enum(['pending', 'in_review', 'approved', 'rejected']).optional(),
  reviewerId: z.string().uuid().optional(),
  reviewerName: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewComments: z.string().optional(),
});

export type InteractiveDocumentData = z.infer<typeof InteractiveDocumentDataSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED TYPE MAP & HELPERS
// خريطة الأنواع الموحدة والمساعدات
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of smart element types to their data schemas
 * Used for runtime validation and type inference
 */
export const SmartElementDataSchemaMap = {
  thinking_board: ThinkingBoardDataSchema,
  kanban: KanbanBoardDataSchema,
  voting: VotingDataSchema,
  brainstorming: BrainstormingDataSchema,
  timeline: TimelineDataSchema,
  decisions_matrix: DecisionsMatrixDataSchema,
  gantt: GanttDataSchema,
  interactive_sheet: InteractiveSheetDataSchema,
  mind_map: MindMapDataSchema,
  visual_diagram: MindMapDataSchema, // يستخدم نفس schema الخريطة الذهنية
  project_card: ProjectCardDataSchema,
  finance_card: FinanceCardDataSchema,
  csr_card: CsrCardDataSchema,
  crm_card: CrmCardDataSchema,
  interactive_document: InteractiveDocumentDataSchema,
} as const;

/**
 * Type-safe data accessor
 * استخرج نوع البيانات بناءً على نوع العنصر الذكي
 */
export type SmartElementDataType<T extends SmartElementType> = z.infer<typeof SmartElementDataSchemaMap[T]>;

/**
 * Union of all smart element data types
 */
export type AnySmartElementData = 
  | ThinkingBoardData
  | KanbanBoardData
  | VotingData
  | BrainstormingData
  | TimelineData
  | DecisionsMatrixData
  | GanttData
  | InteractiveSheetData
  | MindMapData
  | ProjectCardData
  | FinanceCardData
  | CsrCardData
  | CrmCardData
  | InteractiveDocumentData;

// ─────────────────────────────────────────────────────────────────────────────
// Validation Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate smart element data against its schema
 * التحقق من بيانات العنصر الذكي مقابل المخطط الخاص به
 */
export function validateSmartElementData<T extends SmartElementType>(
  type: T,
  data: unknown
): { success: true; data: SmartElementDataType<T> } | { success: false; errors: z.ZodError } {
  const schema = SmartElementDataSchemaMap[type];
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data as SmartElementDataType<T> };
  }
  return { success: false, errors: result.error };
}

/**
 * Get default data for a smart element type
 * الحصول على البيانات الافتراضية لنوع العنصر الذكي
 */
export function getDefaultSmartElementData<T extends SmartElementType>(
  type: T
): SmartElementDataType<T> {
  const schema = SmartElementDataSchemaMap[type];
  return schema.parse({}) as SmartElementDataType<T>;
}

/**
 * Parse and validate smart element data, returning defaults on failure
 * تحليل والتحقق من بيانات العنصر الذكي، إرجاع الافتراضيات عند الفشل
 */
export function parseSmartElementData<T extends SmartElementType>(
  type: T,
  data: unknown
): SmartElementDataType<T> {
  const schema = SmartElementDataSchemaMap[type];

  const input =
    type === 'kanban'
      ? (migrateKanbanLegacyData(data).data as unknown)
      : data;

  const result = schema.safeParse(input);

  if (result.success) {
    return result.data as SmartElementDataType<T>;
  }
  console.warn(`Invalid smart element data for type "${type}", using defaults:`, result.error);
  return getDefaultSmartElementData(type);
}

// ─────────────────────────────────────────────────────────────────────────────
// Smart Element Labels (Arabic)
// ─────────────────────────────────────────────────────────────────────────────

export const SmartElementLabels: Record<SmartElementType, string> = {
  thinking_board: 'لوحة التفكير',
  kanban: 'لوحة كانبان',
  voting: 'التصويت',
  brainstorming: 'العصف الذهني',
  timeline: 'خط زمني',
  decisions_matrix: 'مصفوفة القرارات',
  gantt: 'مخطط جانت',
  interactive_sheet: 'ورقة بيانات',
  mind_map: 'خريطة ذهنية',
  visual_diagram: 'مخطط بصري',
  project_card: 'بطاقة مشروع',
  finance_card: 'بطاقة مالية',
  csr_card: 'بطاقة CSR',
  crm_card: 'بطاقة CRM',
  interactive_document: 'مستند تفاعلي',
};

/**
 * Get category for a smart element type
 */
export const SmartElementCategories: Record<SmartElementType, 'collaboration' | 'planning' | 'analysis' | 'cards' | 'connectors'> = {
  thinking_board: 'collaboration',
  kanban: 'collaboration',
  voting: 'collaboration',
  brainstorming: 'collaboration',
  timeline: 'planning',
  decisions_matrix: 'planning',
  gantt: 'analysis',
  interactive_sheet: 'analysis',
  mind_map: 'analysis',
  visual_diagram: 'analysis',
  project_card: 'cards',
  finance_card: 'cards',
  csr_card: 'cards',
  crm_card: 'cards',
  interactive_document: 'analysis',
};
