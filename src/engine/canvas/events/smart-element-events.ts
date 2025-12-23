/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Smart Element Events Contracts
 * Contract-First Architecture - Sprint 3
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';
import { SmartElementTypeSchema } from '@/types/smart-elements';

// ─────────────────────────────────────────────────────────────────────────────
// Base Event Schema
// ─────────────────────────────────────────────────────────────────────────────

export const SmartElementEventBaseSchema = z.object({
  eventId: z.string().uuid(),
  timestamp: z.string().datetime(),
  boardId: z.string().uuid(),
  elementId: z.string(),
  userId: z.string().uuid().optional(),
  version: z.number().default(1),
});

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle Events
// ─────────────────────────────────────────────────────────────────────────────

export const SmartElementCreatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('smart_element.created'),
  payload: z.object({
    smartType: SmartElementTypeSchema,
    position: z.object({ x: z.number(), y: z.number() }),
    size: z.object({ width: z.number(), height: z.number() }),
    initialData: z.record(z.any()),
    createdBy: z.string().uuid(),
  }),
});

export const SmartElementUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('smart_element.updated'),
  payload: z.object({
    smartType: SmartElementTypeSchema,
    updatedFields: z.array(z.string()),
    previousData: z.record(z.any()),
    newData: z.record(z.any()),
    updatedBy: z.string().uuid(),
  }),
});

export const SmartElementDeletedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('smart_element.deleted'),
  payload: z.object({
    smartType: SmartElementTypeSchema,
    deletedBy: z.string().uuid(),
    finalData: z.record(z.any()),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Kanban Events
// ─────────────────────────────────────────────────────────────────────────────

export const KanbanCardCreatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('kanban.card.created'),
  payload: z.object({
    cardId: z.string(),
    columnId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    assignee: z.string().uuid().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    createdBy: z.string().uuid(),
  }),
});

export const KanbanCardMovedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('kanban.card.moved'),
  payload: z.object({
    cardId: z.string(),
    fromColumnId: z.string(),
    toColumnId: z.string(),
    fromIndex: z.number(),
    toIndex: z.number(),
    movedBy: z.string().uuid(),
  }),
});

export const KanbanCardUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('kanban.card.updated'),
  payload: z.object({
    cardId: z.string(),
    updatedFields: z.array(z.string()),
    previousValues: z.record(z.any()),
    newValues: z.record(z.any()),
    updatedBy: z.string().uuid(),
  }),
});

export const KanbanCardDeletedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('kanban.card.deleted'),
  payload: z.object({
    cardId: z.string(),
    columnId: z.string(),
    deletedBy: z.string().uuid(),
  }),
});

export const KanbanColumnCreatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('kanban.column.created'),
  payload: z.object({
    columnId: z.string(),
    title: z.string(),
    index: z.number(),
    createdBy: z.string().uuid(),
  }),
});

export const KanbanColumnReorderedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('kanban.column.reordered'),
  payload: z.object({
    columnId: z.string(),
    fromIndex: z.number(),
    toIndex: z.number(),
    reorderedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Voting Events
// ─────────────────────────────────────────────────────────────────────────────

export const VotingStartedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('voting.started'),
  payload: z.object({
    question: z.string(),
    optionCount: z.number(),
    duration: z.number().optional(),
    startedBy: z.string().uuid(),
  }),
});

export const VoteCastV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('voting.vote_cast'),
  payload: z.object({
    optionId: z.string(),
    voterId: z.string().uuid(),
    voteCount: z.number(),
    totalVotes: z.number(),
  }),
});

export const VoteRemovedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('voting.vote_removed'),
  payload: z.object({
    optionId: z.string(),
    voterId: z.string().uuid(),
    voteCount: z.number(),
    totalVotes: z.number(),
  }),
});

export const VotingEndedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('voting.ended'),
  payload: z.object({
    winningOptionId: z.string().optional(),
    results: z.array(z.object({
      optionId: z.string(),
      votes: z.number(),
      percentage: z.number(),
    })),
    totalVotes: z.number(),
    endedBy: z.string().uuid().optional(),
    endReason: z.enum(['manual', 'timeout', 'unanimous']),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Brainstorming Events
// ─────────────────────────────────────────────────────────────────────────────

export const BrainstormingStartedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('brainstorming.started'),
  payload: z.object({
    topic: z.string(),
    mode: z.enum(['collaborative', 'silent', 'rapid', 'branching']),
    duration: z.number().optional(),
    maxIdeasPerUser: z.number().optional(),
    startedBy: z.string().uuid(),
  }),
});

export const BrainstormIdeaAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('brainstorming.idea_added'),
  payload: z.object({
    ideaId: z.string(),
    content: z.string(),
    groupId: z.string().optional(),
    authorId: z.string().uuid(),
  }),
});

export const BrainstormIdeaVotedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('brainstorming.idea_voted'),
  payload: z.object({
    ideaId: z.string(),
    voterId: z.string().uuid(),
    voteCount: z.number(),
  }),
});

export const BrainstormIdeaGroupedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('brainstorming.idea_grouped'),
  payload: z.object({
    ideaId: z.string(),
    previousGroupId: z.string().optional(),
    newGroupId: z.string(),
    groupedBy: z.string().uuid(),
  }),
});

export const BrainstormingEndedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('brainstorming.ended'),
  payload: z.object({
    totalIdeas: z.number(),
    selectedIdeas: z.array(z.string()),
    endedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Events
// ─────────────────────────────────────────────────────────────────────────────

export const TimelineItemAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('timeline.item_added'),
  payload: z.object({
    itemId: z.string(),
    label: z.string(),
    date: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    linkedElementId: z.string().optional(),
    addedBy: z.string().uuid(),
  }),
});

export const TimelineItemMovedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('timeline.item_moved'),
  payload: z.object({
    itemId: z.string(),
    previousDate: z.string().datetime(),
    newDate: z.string().datetime(),
    previousEndDate: z.string().datetime().optional(),
    newEndDate: z.string().datetime().optional(),
    movedBy: z.string().uuid(),
  }),
});

export const TimelineItemLinkedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('timeline.item_linked'),
  payload: z.object({
    itemId: z.string(),
    linkedElementId: z.string(),
    linkedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Decisions Matrix Events
// ─────────────────────────────────────────────────────────────────────────────

export const MatrixRowAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('matrix.row_added'),
  payload: z.object({
    rowId: z.string(),
    label: z.string(),
    addedBy: z.string().uuid(),
  }),
});

export const MatrixColumnAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('matrix.column_added'),
  payload: z.object({
    columnId: z.string(),
    label: z.string(),
    weight: z.number().default(1),
    addedBy: z.string().uuid(),
  }),
});

export const MatrixCellUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('matrix.cell_updated'),
  payload: z.object({
    rowId: z.string(),
    columnId: z.string(),
    previousValue: z.union([z.number(), z.string()]).optional(),
    newValue: z.union([z.number(), z.string()]),
    updatedBy: z.string().uuid(),
  }),
});

export const MatrixWeightChangedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('matrix.weight_changed'),
  payload: z.object({
    columnId: z.string(),
    previousWeight: z.number(),
    newWeight: z.number(),
    changedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Gantt Events
// ─────────────────────────────────────────────────────────────────────────────

export const GanttTaskAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('gantt.task_added'),
  payload: z.object({
    taskId: z.string(),
    name: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    parentId: z.string().optional(),
    addedBy: z.string().uuid(),
  }),
});

export const GanttTaskUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('gantt.task_updated'),
  payload: z.object({
    taskId: z.string(),
    updatedFields: z.array(z.string()),
    previousValues: z.record(z.any()),
    newValues: z.record(z.any()),
    updatedBy: z.string().uuid(),
  }),
});

export const GanttProgressUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('gantt.progress_updated'),
  payload: z.object({
    taskId: z.string(),
    previousProgress: z.number(),
    newProgress: z.number(),
    updatedBy: z.string().uuid(),
  }),
});

export const GanttDependencyAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('gantt.dependency_added'),
  payload: z.object({
    fromTaskId: z.string(),
    toTaskId: z.string(),
    dependencyType: z.enum(['finish-to-start', 'start-to-start', 'finish-to-finish', 'start-to-finish']),
    addedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Mind Map Events
// ─────────────────────────────────────────────────────────────────────────────

export const MindMapNodeAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('mindmap.node_added'),
  payload: z.object({
    nodeId: z.string(),
    parentId: z.string().nullable(),
    label: z.string(),
    addedBy: z.string().uuid(),
  }),
});

export const MindMapNodeMovedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('mindmap.node_moved'),
  payload: z.object({
    nodeId: z.string(),
    previousParentId: z.string().nullable(),
    newParentId: z.string().nullable(),
    movedBy: z.string().uuid(),
  }),
});

export const MindMapNodeCollapsedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('mindmap.node_collapsed'),
  payload: z.object({
    nodeId: z.string(),
    collapsed: z.boolean(),
    collapsedBy: z.string().uuid(),
  }),
});

export const MindMapNodeLinkedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('mindmap.node_linked'),
  payload: z.object({
    nodeId: z.string(),
    linkedElementId: z.string(),
    linkedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Sheet Events
// ─────────────────────────────────────────────────────────────────────────────

export const SheetCellUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('sheet.cell_updated'),
  payload: z.object({
    cellRef: z.string(),
    previousValue: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
    newValue: z.union([z.string(), z.number(), z.boolean(), z.null()]),
    formula: z.string().optional(),
    updatedBy: z.string().uuid(),
  }),
});

export const SheetRangeUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('sheet.range_updated'),
  payload: z.object({
    startCell: z.string(),
    endCell: z.string(),
    cellCount: z.number(),
    updatedBy: z.string().uuid(),
  }),
});

export const SheetElementLinkedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('sheet.element_linked'),
  payload: z.object({
    cellRef: z.string(),
    linkedElementId: z.string(),
    property: z.string(),
    linkedBy: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Smart Cards Events
// ─────────────────────────────────────────────────────────────────────────────

export const SmartCardLinkedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('smartcard.linked'),
  payload: z.object({
    cardType: z.enum(['project_card', 'finance_card', 'csr_card', 'crm_card']),
    linkedEntityId: z.string().uuid(),
    linkedEntityType: z.string(),
    linkedBy: z.string().uuid(),
  }),
});

export const SmartCardRefreshedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('smartcard.refreshed'),
  payload: z.object({
    cardType: z.enum(['project_card', 'finance_card', 'csr_card', 'crm_card']),
    dataSnapshot: z.record(z.any()),
    refreshedBy: z.string().uuid().optional(),
    refreshTrigger: z.enum(['manual', 'auto', 'webhook']),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Root Connector Events
// ─────────────────────────────────────────────────────────────────────────────

export const ConnectorCreatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('connector.created'),
  payload: z.object({
    startElementId: z.string(),
    endElementId: z.string(),
    startAnchor: z.enum(['top', 'right', 'bottom', 'left', 'center']),
    endAnchor: z.enum(['top', 'right', 'bottom', 'left', 'center']),
    createdBy: z.string().uuid(),
  }),
});

export const ConnectorUpdatedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('connector.updated'),
  payload: z.object({
    updatedFields: z.array(z.string()),
    previousValues: z.record(z.any()),
    newValues: z.record(z.any()),
    updatedBy: z.string().uuid(),
  }),
});

export const ConnectorAISuggestionAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('connector.ai_suggestion_added'),
  payload: z.object({
    suggestionId: z.string(),
    suggestionType: z.string(),
    label: z.string(),
    confidence: z.number().min(0).max(1).optional(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Thinking Board Events
// ─────────────────────────────────────────────────────────────────────────────

export const ThinkingBoardChildAddedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('thinkingboard.child_added'),
  payload: z.object({
    childElementId: z.string(),
    childType: z.string(),
    addedBy: z.string().uuid(),
  }),
});

export const ThinkingBoardChildRemovedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('thinkingboard.child_removed'),
  payload: z.object({
    childElementId: z.string(),
    removedBy: z.string().uuid(),
  }),
});

export const ThinkingBoardLockedV1Schema = SmartElementEventBaseSchema.extend({
  name: z.literal('thinkingboard.locked'),
  payload: z.object({
    locked: z.boolean(),
    lockedBy: z.string().uuid(),
  }),
});

// ═══════════════════════════════════════════════════════════════════════════
// Event Registry & Types
// ═══════════════════════════════════════════════════════════════════════════

export const SmartElementEventSchemas = {
  // Lifecycle
  'smart_element.created': SmartElementCreatedV1Schema,
  'smart_element.updated': SmartElementUpdatedV1Schema,
  'smart_element.deleted': SmartElementDeletedV1Schema,
  
  // Kanban
  'kanban.card.created': KanbanCardCreatedV1Schema,
  'kanban.card.moved': KanbanCardMovedV1Schema,
  'kanban.card.updated': KanbanCardUpdatedV1Schema,
  'kanban.card.deleted': KanbanCardDeletedV1Schema,
  'kanban.column.created': KanbanColumnCreatedV1Schema,
  'kanban.column.reordered': KanbanColumnReorderedV1Schema,
  
  // Voting
  'voting.started': VotingStartedV1Schema,
  'voting.vote_cast': VoteCastV1Schema,
  'voting.vote_removed': VoteRemovedV1Schema,
  'voting.ended': VotingEndedV1Schema,
  
  // Brainstorming
  'brainstorming.started': BrainstormingStartedV1Schema,
  'brainstorming.idea_added': BrainstormIdeaAddedV1Schema,
  'brainstorming.idea_voted': BrainstormIdeaVotedV1Schema,
  'brainstorming.idea_grouped': BrainstormIdeaGroupedV1Schema,
  'brainstorming.ended': BrainstormingEndedV1Schema,
  
  // Timeline
  'timeline.item_added': TimelineItemAddedV1Schema,
  'timeline.item_moved': TimelineItemMovedV1Schema,
  'timeline.item_linked': TimelineItemLinkedV1Schema,
  
  // Decisions Matrix
  'matrix.row_added': MatrixRowAddedV1Schema,
  'matrix.column_added': MatrixColumnAddedV1Schema,
  'matrix.cell_updated': MatrixCellUpdatedV1Schema,
  'matrix.weight_changed': MatrixWeightChangedV1Schema,
  
  // Gantt
  'gantt.task_added': GanttTaskAddedV1Schema,
  'gantt.task_updated': GanttTaskUpdatedV1Schema,
  'gantt.progress_updated': GanttProgressUpdatedV1Schema,
  'gantt.dependency_added': GanttDependencyAddedV1Schema,
  
  // Mind Map
  'mindmap.node_added': MindMapNodeAddedV1Schema,
  'mindmap.node_moved': MindMapNodeMovedV1Schema,
  'mindmap.node_collapsed': MindMapNodeCollapsedV1Schema,
  'mindmap.node_linked': MindMapNodeLinkedV1Schema,
  
  // Interactive Sheet
  'sheet.cell_updated': SheetCellUpdatedV1Schema,
  'sheet.range_updated': SheetRangeUpdatedV1Schema,
  'sheet.element_linked': SheetElementLinkedV1Schema,
  
  // Smart Cards
  'smartcard.linked': SmartCardLinkedV1Schema,
  'smartcard.refreshed': SmartCardRefreshedV1Schema,
  
  // Root Connector
  'connector.created': ConnectorCreatedV1Schema,
  'connector.updated': ConnectorUpdatedV1Schema,
  'connector.ai_suggestion_added': ConnectorAISuggestionAddedV1Schema,
  
  // Thinking Board
  'thinkingboard.child_added': ThinkingBoardChildAddedV1Schema,
  'thinkingboard.child_removed': ThinkingBoardChildRemovedV1Schema,
  'thinkingboard.locked': ThinkingBoardLockedV1Schema,
} as const;

// Type exports
export type SmartElementEventName = keyof typeof SmartElementEventSchemas;
export type SmartElementEvent<T extends SmartElementEventName> = z.infer<typeof SmartElementEventSchemas[T]>;

// Validation helper
export function validateSmartElementEvent<T extends SmartElementEventName>(
  eventName: T,
  data: unknown
): SmartElementEvent<T> {
  const schema = SmartElementEventSchemas[eventName];
  return schema.parse(data) as SmartElementEvent<T>;
}

// Event factory
export function createSmartElementEvent<T extends SmartElementEventName>(
  eventName: T,
  data: Omit<SmartElementEvent<T>, 'eventId' | 'timestamp' | 'version' | 'name'>
): SmartElementEvent<T> {
  const baseData = {
    eventId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    version: 1,
    name: eventName,
    ...data,
  };
  return validateSmartElementEvent(eventName, baseData);
}
