/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Smart Elements Store - Contract-First Architecture
 * متجر العناصر الذكية - معمارية العقود أولاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This store manages all smart element operations with full type safety.
 * All data is validated against Zod schemas before being stored.
 */

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { useCanvasStore } from './canvasStore';
import {
  type SmartElementType,
  type SmartElementDataType,
  type AnySmartElementData,
  type KanbanCard,
  type KanbanColumn,
  type VotingOption,
  type BrainstormIdea,
  type BrainstormGroup,
  type TimelineItem,
  type MatrixRow,
  type MatrixColumn,
  type MatrixCell,
  type GanttTask,
  type MindMapNode,
  type MindMapConnection,
  type SheetCell,
  type AISuggestion,
  SmartElementDataSchemaMap,
  getDefaultSmartElementData,
  parseSmartElementData,
  validateSmartElementData,
} from '@/types/smart-elements';
import { migrateKanbanLegacyData } from '@/utils/kanbanLegacyMigration';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SmartElementEntry {
  elementId: string;
  smartType: SmartElementType;
  data: AnySmartElementData;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface SmartElementsState {
  // Storage
  smartElements: Record<string, SmartElementEntry>;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Core CRUD Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add a new smart element to the canvas
   * إضافة عنصر ذكي جديد إلى اللوحة
   */
  addSmartElement: <T extends SmartElementType>(
    type: T,
    position: { x: number; y: number },
    initialData?: Partial<SmartElementDataType<T>>,
    size?: { width: number; height: number }
  ) => string;
  
  /**
   * Get smart element data by canvas element ID
   * الحصول على بيانات العنصر الذكي
   */
  getSmartElementData: <T extends SmartElementType>(elementId: string) => SmartElementDataType<T> | null;
  
  /**
   * Update smart element data
   * تحديث بيانات العنصر الذكي
   */
  updateSmartElementData: <T extends SmartElementType>(
    elementId: string,
    dataUpdates: Partial<SmartElementDataType<T>>
  ) => void;
  
  /**
   * Delete smart element
   * حذف العنصر الذكي
   */
  deleteSmartElement: (elementId: string) => void;
  
  /**
   * Get smart element type
   */
  getSmartElementType: (elementId: string) => SmartElementType | null;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Kanban Board Actions - إجراءات لوحة كانبان
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Move a card between columns
   * نقل بطاقة بين الأعمدة
   */
  moveKanbanCard: (
    elementId: string,
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    toIndex: number
  ) => void;
  
  /**
   * Add a new card to a column
   * إضافة بطاقة جديدة إلى عمود
   */
  addKanbanCard: (
    elementId: string,
    columnId: string,
    card: Partial<KanbanCard>
  ) => string;
  
  /**
   * Update a card
   * تحديث بطاقة
   */
  updateKanbanCard: (
    elementId: string,
    cardId: string,
    updates: Partial<KanbanCard>
  ) => void;
  
  /**
   * Delete a card
   * حذف بطاقة
   */
  deleteKanbanCard: (elementId: string, cardId: string) => void;
  
  /**
   * Add a new column
   * إضافة عمود جديد
   */
  addKanbanColumn: (elementId: string, column: Partial<KanbanColumn>) => string;
  
  /**
   * Update a column
   * تحديث عمود
   */
  updateKanbanColumn: (
    elementId: string,
    columnId: string,
    updates: Partial<KanbanColumn>
  ) => void;
  
  /**
   * Delete a column
   * حذف عمود
   */
  deleteKanbanColumn: (elementId: string, columnId: string) => void;
  
  /**
   * Reorder columns
   * إعادة ترتيب الأعمدة
   */
  reorderKanbanColumns: (elementId: string, columnIds: string[]) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Voting Actions - إجراءات التصويت
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Cast a vote
   * التصويت
   */
  castVote: (elementId: string, optionId: string, userId: string) => boolean;
  
  /**
   * Remove a vote
   * إلغاء التصويت
   */
  removeVote: (elementId: string, optionId: string, userId: string) => void;
  
  /**
   * Add voting option
   * إضافة خيار تصويت
   */
  addVotingOption: (elementId: string, option: Partial<VotingOption>) => string;
  
  /**
   * Update voting option
   * تحديث خيار تصويت
   */
  updateVotingOption: (
    elementId: string,
    optionId: string,
    updates: Partial<VotingOption>
  ) => void;
  
  /**
   * Delete voting option
   * حذف خيار تصويت
   */
  deleteVotingOption: (elementId: string, optionId: string) => void;
  
  /**
   * Start voting session
   * بدء جلسة التصويت
   */
  startVoting: (elementId: string) => void;
  
  /**
   * End voting session
   * إنهاء جلسة التصويت
   */
  endVoting: (elementId: string) => void;
  
  /**
   * Reset voting
   * إعادة تعيين التصويت
   */
  resetVoting: (elementId: string) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Brainstorming Actions - إجراءات العصف الذهني
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add an idea
   * إضافة فكرة
   */
  addBrainstormIdea: (
    elementId: string,
    idea: Partial<BrainstormIdea>
  ) => string;
  
  /**
   * Update an idea
   * تحديث فكرة
   */
  updateBrainstormIdea: (
    elementId: string,
    ideaId: string,
    updates: Partial<BrainstormIdea>
  ) => void;
  
  /**
   * Delete an idea
   * حذف فكرة
   */
  deleteBrainstormIdea: (elementId: string, ideaId: string) => void;
  
  /**
   * Vote for an idea
   * التصويت لفكرة
   */
  voteForIdea: (elementId: string, ideaId: string) => void;
  
  /**
   * Add idea group
   * إضافة مجموعة أفكار
   */
  addBrainstormGroup: (elementId: string, group: Partial<BrainstormGroup>) => string;
  
  /**
   * Move idea to group
   * نقل فكرة إلى مجموعة
   */
  moveIdeaToGroup: (elementId: string, ideaId: string, groupId: string | null) => void;
  
  /**
   * Select ideas for AI processing
   * تحديد الأفكار للمعالجة بالذكاء الاصطناعي
   */
  selectIdeasForAI: (elementId: string, ideaIds: string[]) => void;
  
  /**
   * Start brainstorming session
   * بدء جلسة العصف الذهني
   */
  startBrainstorming: (elementId: string) => void;
  
  /**
   * End brainstorming session
   * إنهاء جلسة العصف الذهني
   */
  endBrainstorming: (elementId: string) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Timeline Actions - إجراءات الخط الزمني
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add timeline item
   * إضافة عنصر للخط الزمني
   */
  addTimelineItem: (elementId: string, item: Partial<TimelineItem>) => string;
  
  /**
   * Update timeline item
   * تحديث عنصر الخط الزمني
   */
  updateTimelineItem: (
    elementId: string,
    itemId: string,
    updates: Partial<TimelineItem>
  ) => void;
  
  /**
   * Delete timeline item
   * حذف عنصر الخط الزمني
   */
  deleteTimelineItem: (elementId: string, itemId: string) => void;
  
  /**
   * Link canvas element to timeline
   * ربط عنصر كانفاس بالخط الزمني
   */
  linkElementToTimeline: (
    timelineId: string,
    targetElementId: string,
    date: string,
    title?: string // ✅ تغيير من label إلى title
  ) => string;
  
  /**
   * Unlink element from timeline
   * إلغاء ربط عنصر من الخط الزمني
   */
  unlinkElementFromTimeline: (timelineId: string, targetElementId: string) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Decisions Matrix Actions - إجراءات مصفوفة القرارات
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add matrix row (option/objective)
   * إضافة صف (خيار/هدف)
   */
  addMatrixRow: (elementId: string, row: Partial<MatrixRow>) => string;
  
  /**
   * Update matrix row
   * تحديث صف
   */
  updateMatrixRow: (elementId: string, rowId: string, updates: Partial<MatrixRow>) => void;
  
  /**
   * Delete matrix row
   * حذف صف
   */
  deleteMatrixRow: (elementId: string, rowId: string) => void;
  
  /**
   * Add matrix column (criterion)
   * إضافة عمود (معيار)
   */
  addMatrixColumn: (elementId: string, column: Partial<MatrixColumn>) => string;
  
  /**
   * Update matrix column
   * تحديث عمود
   */
  updateMatrixColumn: (
    elementId: string,
    columnId: string,
    updates: Partial<MatrixColumn>
  ) => void;
  
  /**
   * Delete matrix column
   * حذف عمود
   */
  deleteMatrixColumn: (elementId: string, columnId: string) => void;
  
  /**
   * Set cell value
   * تعيين قيمة الخلية
   */
  setMatrixCellValue: (
    elementId: string,
    rowId: string,
    columnId: string,
    value: MatrixCell
  ) => void;
  
  /**
   * Calculate matrix scores
   * حساب نتائج المصفوفة
   */
  calculateMatrixScores: (elementId: string) => Record<string, number>;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Gantt Chart Actions - إجراءات مخطط جانت
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add Gantt task
   * إضافة مهمة جانت
   */
  addGanttTask: (elementId: string, task: Partial<GanttTask>) => string;
  
  /**
   * Update Gantt task
   * تحديث مهمة جانت
   */
  updateGanttTask: (elementId: string, taskId: string, updates: Partial<GanttTask>) => void;
  
  /**
   * Delete Gantt task
   * حذف مهمة جانت
   */
  deleteGanttTask: (elementId: string, taskId: string) => void;
  
  /**
   * Add task dependency
   * إضافة اعتمادية مهمة
   */
  addGanttDependency: (
    elementId: string,
    taskId: string,
    dependsOnTaskId: string,
    type?: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish'
  ) => void;
  
  /**
   * Remove task dependency
   * إزالة اعتمادية مهمة
   */
  removeGanttDependency: (elementId: string, taskId: string, dependsOnTaskId: string) => void;
  
  /**
   * Update task progress
   * تحديث تقدم المهمة
   */
  updateGanttTaskProgress: (elementId: string, taskId: string, progress: number) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Mind Map Actions - إجراءات الخريطة الذهنية
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add mind map node
   * إضافة عقدة للخريطة الذهنية
   */
  addMindMapNode: (
    elementId: string,
    parentId: string | null,
    label: string
  ) => string;
  
  /**
   * Update mind map node
   * تحديث عقدة
   */
  updateMindMapNode: (
    elementId: string,
    nodeId: string,
    updates: Partial<MindMapNode>
  ) => void;
  
  /**
   * Delete mind map node
   * حذف عقدة
   */
  deleteMindMapNode: (elementId: string, nodeId: string) => void;
  
  /**
   * Move node to new parent
   * نقل عقدة إلى أب جديد
   */
  moveMindMapNode: (elementId: string, nodeId: string, newParentId: string | null) => void;
  
  /**
   * Toggle node collapse
   * طي/فتح العقدة
   */
  toggleMindMapNodeCollapse: (elementId: string, nodeId: string) => void;
  
  /**
   * Add cross-branch connection
   * إضافة اتصال بين الفروع
   */
  addMindMapConnection: (
    elementId: string,
    fromNodeId: string,
    toNodeId: string,
    label?: string
  ) => string;
  
  /**
   * Remove cross-branch connection
   * إزالة اتصال بين الفروع
   */
  removeMindMapConnection: (elementId: string, connectionId: string) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Interactive Sheet Actions - إجراءات ورقة البيانات
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Set cell value
   * تعيين قيمة خلية
   */
  setSheetCellValue: (
    elementId: string,
    cellRef: string,
    value: SheetCell['value'],
    formula?: string
  ) => void;
  
  /**
   * Set cell format
   * تعيين تنسيق خلية
   */
  setSheetCellFormat: (
    elementId: string,
    cellRef: string,
    format: SheetCell['format']
  ) => void;
  
  /**
   * Add rows
   * إضافة صفوف
   */
  addSheetRows: (elementId: string, count: number, afterRow?: number) => void;
  
  /**
   * Add columns
   * إضافة أعمدة
   */
  addSheetColumns: (elementId: string, count: number, afterColumn?: string) => void;
  
  /**
   * Delete rows
   * حذف صفوف
   */
  deleteSheetRows: (elementId: string, startRow: number, count: number) => void;
  
  /**
   * Delete columns
   * حذف أعمدة
   */
  deleteSheetColumns: (elementId: string, startColumn: string, count: number) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Smart Cards Actions - إجراءات البطاقات الذكية
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Link smart card to data source
   * ربط البطاقة الذكية بمصدر بيانات
   */
  linkSmartCardToSource: (
    elementId: string,
    sourceType: 'project' | 'client' | 'initiative' | 'department',
    sourceId: string
  ) => void;
  
  /**
   * Refresh smart card data
   * تحديث بيانات البطاقة الذكية
   */
  refreshSmartCard: (elementId: string) => Promise<void>;
  
  /**
   * Toggle smart card metric visibility
   * تبديل ظهور مقياس البطاقة
   */
  toggleSmartCardMetric: (elementId: string, metric: string) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Root Connector Actions - إجراءات الرابط الذكي
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Set AI suggestions for connector
   * تعيين اقتراحات الذكاء الاصطناعي للرابط
   */
  setConnectorAISuggestions: (elementId: string, suggestions: AISuggestion[]) => void;
  
  /**
   * Apply AI suggestion (convert connector to smart element)
   * تطبيق اقتراح الذكاء الاصطناعي
   */
  applyConnectorSuggestion: (elementId: string, suggestionId: string) => string | null;
  
  /**
   * Toggle AI panel visibility
   * تبديل ظهور لوحة الذكاء الاصطناعي
   */
  toggleConnectorAIPanel: (elementId: string) => void;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ThinkingBoard Actions - إجراءات لوحة التفكير
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add element to thinking board
   * إضافة عنصر إلى لوحة التفكير
   */
  addElementToThinkingBoard: (boardId: string, elementId: string) => void;
  
  /**
   * Remove element from thinking board
   * إزالة عنصر من لوحة التفكير
   */
  removeElementFromThinkingBoard: (boardId: string, elementId: string) => void;
  
  /**
   * Add tag to thinking board
   * إضافة وسم إلى لوحة التفكير
   */
  addThinkingBoardTag: (boardId: string, label: string, color: string) => string;
  
  /**
   * Remove tag from thinking board
   * إزالة وسم من لوحة التفكير
   */
  removeThinkingBoardTag: (boardId: string, tagId: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Sizes for Smart Elements
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SMART_ELEMENT_SIZES: Record<SmartElementType, { width: number; height: number }> = {
  thinking_board: { width: 400, height: 300 },
  kanban: { width: 600, height: 400 },
  voting: { width: 350, height: 300 },
  brainstorming: { width: 500, height: 400 },
  timeline: { width: 800, height: 200 },
  decisions_matrix: { width: 600, height: 400 },
  gantt: { width: 800, height: 400 },
  interactive_sheet: { width: 600, height: 400 },
  mind_map: { width: 600, height: 500 },
  project_card: { width: 320, height: 200 },
  finance_card: { width: 320, height: 200 },
  csr_card: { width: 320, height: 200 },
  crm_card: { width: 320, height: 200 },
  root_connector: { width: 0, height: 0 }, // Connectors don't have fixed size
};

// ─────────────────────────────────────────────────────────────────────────────
// Store Implementation
// ─────────────────────────────────────────────────────────────────────────────

export const useSmartElementsStore = create<SmartElementsState>((set, get) => ({
  smartElements: {},
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Core CRUD Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addSmartElement: (type, position, initialData, size) => {
    const elementId = nanoid();
    const now = new Date().toISOString();
    
    // Parse and validate data against schema
    const defaultData = getDefaultSmartElementData(type);
    const mergedData = initialData 
      ? parseSmartElementData(type, { ...defaultData, ...initialData })
      : defaultData;
    
    // Create smart element entry
    const entry: SmartElementEntry = {
      elementId,
      smartType: type,
      data: mergedData,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    
    // Add to smart elements store
    set(state => ({
      smartElements: {
        ...state.smartElements,
        [elementId]: entry,
      },
    }));
    
    // Add to canvas store
    const canvasStore = useCanvasStore.getState();
    const elementSize = size || DEFAULT_SMART_ELEMENT_SIZES[type];
    
    // ✅ إضافة smartType على المستوى العلوي + البيانات الفعلية في data
    canvasStore.addElement({
      type: 'smart',
      smartType: type, // ← إضافة على المستوى العلوي للكانفاس
      position,
      size: elementSize,
      style: {},
      data: {
        smartType: type,
        smartElementId: elementId,
        ...mergedData, // ← تضمين البيانات الفعلية
      },
    });
    
    return elementId;
  },
  
  getSmartElementData: (elementId) => {
    const entry = get().smartElements[elementId];
    if (!entry) return null;
    
    // ✅ ترحيل كانبان القديم إن وُجد في Zustand
    if (entry.smartType === 'kanban') {
      const migrated = migrateKanbanLegacyData(entry.data);
      if (migrated.migrated) {
        const validated = parseSmartElementData('kanban', migrated.data);
        // تحديث entry مرة واحدة
        set(state => ({
          smartElements: {
            ...state.smartElements,
            [elementId]: {
              ...state.smartElements[elementId],
              data: validated,
              version: state.smartElements[elementId].version + 1,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
        return validated as SmartElementDataType<typeof entry.smartType>;
      }
    }
    
    return entry.data as SmartElementDataType<typeof entry.smartType>;
  },
  
  updateSmartElementData: (elementId, dataUpdates) => {
    const entry = get().smartElements[elementId];
    if (!entry) return;
    
    // ✅ ترحيل كانبان القديم قبل الدمج إن لزم
    let baseData = entry.data;
    if (entry.smartType === 'kanban') {
      const migrated = migrateKanbanLegacyData(baseData);
      if (migrated.migrated) {
        baseData = parseSmartElementData('kanban', migrated.data);
      }
    }
    
    const updatedData = parseSmartElementData(entry.smartType, {
      ...baseData,
      ...dataUpdates,
    });
    
    set(state => ({
      smartElements: {
        ...state.smartElements,
        [elementId]: {
          ...state.smartElements[elementId],
          data: updatedData,
          version: state.smartElements[elementId].version + 1,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  },
  
  deleteSmartElement: (elementId) => {
    set(state => {
      const { [elementId]: _, ...rest } = state.smartElements;
      return { smartElements: rest };
    });
  },
  
  getSmartElementType: (elementId) => {
    const entry = get().smartElements[elementId];
    return entry?.smartType || null;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Kanban Board Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  moveKanbanCard: (elementId, cardId, fromColumnId, toColumnId, toIndex) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return;
    
    const data = entry.data as SmartElementDataType<'kanban'>;
    const columns = data.columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, cards: (col.cards || []).filter(c => c.id !== cardId) };
      }
      if (col.id === toColumnId) {
        const movedCard = data.columns.find(c => c.id === fromColumnId)?.cards?.find(c => c.id === cardId);
        if (!movedCard) return col;
        const newCards = [...(col.cards || [])];
        newCards.splice(toIndex, 0, movedCard);
        return { ...col, cards: newCards };
      }
      return col;
    });
    
    get().updateSmartElementData(elementId, { columns });
  },
  
  addKanbanCard: (elementId, columnId, card) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return '';
    
    const cardId = nanoid();
    const data = entry.data as SmartElementDataType<'kanban'>;
    
    const newCard: KanbanCard = {
      id: cardId,
      title: card.title || 'بطاقة جديدة',
      description: card.description,
      color: card.color,
      tags: card.tags || [],
      assignee: card.assignee,
      dueDate: card.dueDate,
      priority: card.priority,
      comments: 0,
      votes: 0,
      attachments: 0,
      createdAt: new Date().toISOString(),
      order: 0,
    };
    
    const columns = data.columns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...(col.cards || []), newCard] }
        : col
    );
    
    get().updateSmartElementData(elementId, { columns });
    
    return cardId;
  },
  
  updateKanbanCard: (elementId, cardId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return;
    
    const data = entry.data as SmartElementDataType<'kanban'>;
    const columns = data.columns.map(col => ({
      ...col,
      cards: (col.cards || []).map(card =>
        card.id === cardId ? { ...card, ...updates } : card
      ),
    }));
    
    get().updateSmartElementData(elementId, { columns });
  },
  
  deleteKanbanCard: (elementId, cardId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return;
    
    const data = entry.data as SmartElementDataType<'kanban'>;
    const columns = data.columns.map(col => ({
      ...col,
      cards: (col.cards || []).filter(card => card.id !== cardId),
    }));
    
    get().updateSmartElementData(elementId, { columns });
  },
  
  addKanbanColumn: (elementId, column) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return '';
    
    const columnId = nanoid();
    const data = entry.data as SmartElementDataType<'kanban'>;
    
    const newColumn: KanbanColumn = {
      id: columnId,
      title: column.title || 'عمود جديد',
      color: column.color,
      cards: [],
      limit: column.limit,
      collapsed: false,
    };
    
    get().updateSmartElementData(elementId, {
      columns: [...data.columns, newColumn],
    });
    
    return columnId;
  },
  
  updateKanbanColumn: (elementId, columnId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return;
    
    const data = entry.data as SmartElementDataType<'kanban'>;
    const columns = data.columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    
    get().updateSmartElementData(elementId, { columns });
  },
  
  deleteKanbanColumn: (elementId, columnId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return;
    
    const data = entry.data as SmartElementDataType<'kanban'>;
    const columns = data.columns.filter(col => col.id !== columnId);
    
    get().updateSmartElementData(elementId, { columns });
  },
  
  reorderKanbanColumns: (elementId, columnIds) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'kanban') return;
    
    const data = entry.data as SmartElementDataType<'kanban'>;
    const columnMap = new Map(data.columns.map(c => [c.id, c]));
    const reorderedColumns = columnIds
      .map(id => columnMap.get(id))
      .filter((c): c is KanbanColumn => c !== undefined);
    
    get().updateSmartElementData(elementId, { columns: reorderedColumns });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Voting Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  castVote: (elementId, optionId, userId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'voting') return false;
    
    const data = entry.data as SmartElementDataType<'voting'>;
    if (data.status !== 'active') return false;
    
    // Check vote limits
    const totalUserVotes = data.options.reduce(
      (sum, opt) => sum + (opt.voters.includes(userId) ? 1 : 0),
      0
    );
    
    if (totalUserVotes >= data.maxVotesPerUser) return false;
    
    // Check if already voted for this option (unless multiple selection allowed)
    const option = data.options.find(o => o.id === optionId);
    if (!option) return false;
    if (option.voters.includes(userId) && !data.allowChangeVote) return false;
    
    const options = data.options.map(opt => {
      if (opt.id === optionId && !opt.voters.includes(userId)) {
        return {
          ...opt,
          votes: opt.votes + 1,
          voters: [...opt.voters, userId],
        };
      }
      return opt;
    });
    
    get().updateSmartElementData(elementId, { options });
    return true;
  },
  
  removeVote: (elementId, optionId, userId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'voting') return;
    
    const data = entry.data as SmartElementDataType<'voting'>;
    if (!data.allowChangeVote) return;
    
    const options = data.options.map(opt => {
      if (opt.id === optionId && opt.voters.includes(userId)) {
        return {
          ...opt,
          votes: opt.votes - 1,
          voters: opt.voters.filter(v => v !== userId),
        };
      }
      return opt;
    });
    
    get().updateSmartElementData(elementId, { options });
  },
  
  addVotingOption: (elementId, option) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'voting') return '';
    
    const optionId = nanoid();
    const data = entry.data as SmartElementDataType<'voting'>;
    
    const newOption: VotingOption = {
      id: optionId,
      label: option.label || 'خيار جديد',
      description: option.description,
      votes: 0,
      voters: [],
      color: option.color,
    };
    
    get().updateSmartElementData(elementId, {
      options: [...data.options, newOption],
    });
    
    return optionId;
  },
  
  updateVotingOption: (elementId, optionId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'voting') return;
    
    const data = entry.data as SmartElementDataType<'voting'>;
    const options = data.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    
    get().updateSmartElementData(elementId, { options });
  },
  
  deleteVotingOption: (elementId, optionId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'voting') return;
    
    const data = entry.data as SmartElementDataType<'voting'>;
    const options = data.options.filter(opt => opt.id !== optionId);
    
    get().updateSmartElementData(elementId, { options });
  },
  
  startVoting: (elementId) => {
    get().updateSmartElementData(elementId, {
      status: 'active',
      startedAt: new Date().toISOString(),
    });
  },
  
  endVoting: (elementId) => {
    get().updateSmartElementData(elementId, {
      status: 'ended',
      endedAt: new Date().toISOString(),
    });
  },
  
  resetVoting: (elementId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'voting') return;
    
    const data = entry.data as SmartElementDataType<'voting'>;
    const options = data.options.map(opt => ({
      ...opt,
      votes: 0,
      voters: [],
    }));
    
    get().updateSmartElementData(elementId, {
      options,
      status: 'draft',
      startedAt: undefined,
      endedAt: undefined,
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Brainstorming Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addBrainstormIdea: (elementId, idea) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return '';
    
    const ideaId = nanoid();
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    
    const newIdea: BrainstormIdea = {
      id: ideaId,
      content: idea.content || '',
      authorId: idea.authorId,
      authorName: idea.authorName,
      createdAt: new Date().toISOString(),
      groupId: idea.groupId,
      votes: 0,
      isSelected: false,
      linkedElementId: idea.linkedElementId,
      color: idea.color,
    };
    
    get().updateSmartElementData(elementId, {
      ideas: [...data.ideas, newIdea],
    });
    
    return ideaId;
  },
  
  updateBrainstormIdea: (elementId, ideaId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return;
    
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    const ideas = data.ideas.map(idea =>
      idea.id === ideaId ? { ...idea, ...updates } : idea
    );
    
    get().updateSmartElementData(elementId, { ideas });
  },
  
  deleteBrainstormIdea: (elementId, ideaId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return;
    
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    const ideas = data.ideas.filter(idea => idea.id !== ideaId);
    
    get().updateSmartElementData(elementId, { ideas });
  },
  
  voteForIdea: (elementId, ideaId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return;
    
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    if (!data.allowVoting) return;
    
    const ideas = data.ideas.map(idea =>
      idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
    );
    
    get().updateSmartElementData(elementId, { ideas });
  },
  
  addBrainstormGroup: (elementId, group) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return '';
    
    const groupId = nanoid();
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    
    const newGroup: BrainstormGroup = {
      id: groupId,
      label: group.label || 'مجموعة جديدة',
      color: group.color || '#3DBE8B',
      ideaIds: [],
    };
    
    get().updateSmartElementData(elementId, {
      groups: [...data.groups, newGroup],
    });
    
    return groupId;
  },
  
  moveIdeaToGroup: (elementId, ideaId, groupId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return;
    
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    const ideas = data.ideas.map(idea =>
      idea.id === ideaId ? { ...idea, groupId: groupId || undefined } : idea
    );
    
    get().updateSmartElementData(elementId, { ideas });
  },
  
  selectIdeasForAI: (elementId, ideaIds) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'brainstorming') return;
    
    const data = entry.data as SmartElementDataType<'brainstorming'>;
    const ideas = data.ideas.map(idea => ({
      ...idea,
      isSelected: ideaIds.includes(idea.id),
    }));
    
    get().updateSmartElementData(elementId, { ideas });
  },
  
  startBrainstorming: (elementId) => {
    get().updateSmartElementData(elementId, {
      status: 'active',
      startedAt: new Date().toISOString(),
    });
  },
  
  endBrainstorming: (elementId) => {
    get().updateSmartElementData(elementId, {
      status: 'completed',
      endedAt: new Date().toISOString(),
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Timeline Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addTimelineItem: (elementId, item) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'timeline') return '';
    
    const itemId = nanoid();
    const data = entry.data as SmartElementDataType<'timeline'>;
    
    const newItem: TimelineItem = {
      id: itemId,
      elementId: item.elementId,
      title: item.title || 'حدث جديد', // ✅ تغيير من label إلى title
      description: item.description,
      date: item.date || new Date().toISOString().split('T')[0],
      endDate: item.endDate,
      color: item.color,
      icon: item.icon,
      layer: item.layer || 0,
      importance: item.importance || 'medium',
      completed: item.completed || false,
    };
    
    get().updateSmartElementData(elementId, {
      events: [...(data.events || []), newItem], // ✅ تغيير من items إلى events
    });
    
    return itemId;
  },
  
  updateTimelineItem: (elementId, itemId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'timeline') return;
    
    const data = entry.data as SmartElementDataType<'timeline'>;
    const events = (data.events || []).map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    get().updateSmartElementData(elementId, { events }); // ✅ تغيير من items إلى events
  },
  
  deleteTimelineItem: (elementId, itemId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'timeline') return;
    
    const data = entry.data as SmartElementDataType<'timeline'>;
    const events = (data.events || []).filter(item => item.id !== itemId);
    
    get().updateSmartElementData(elementId, { events }); // ✅ تغيير من items إلى events
  },
  
  linkElementToTimeline: (timelineId, targetElementId, date, title) => { // ✅ تغيير label إلى title
    const entry = get().smartElements[timelineId];
    if (!entry || entry.smartType !== 'timeline') return '';
    
    return get().addTimelineItem(timelineId, {
      elementId: targetElementId,
      title: title || 'عنصر مرتبط', // ✅ تغيير من label إلى title
      date,
    });
  },
  
  unlinkElementFromTimeline: (timelineId, targetElementId) => {
    const entry = get().smartElements[timelineId];
    if (!entry || entry.smartType !== 'timeline') return;
    
    const data = entry.data as SmartElementDataType<'timeline'>;
    const item = (data.events || []).find(i => i.elementId === targetElementId); // ✅ تغيير من items إلى events
    if (item) {
      get().deleteTimelineItem(timelineId, item.id);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Decisions Matrix Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addMatrixRow: (elementId, row) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return '';
    
    const rowId = nanoid();
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    
    const newRow: MatrixRow = {
      id: rowId,
      label: row.label || 'خيار جديد',
      description: row.description,
      color: row.color,
    };
    
    get().updateSmartElementData(elementId, {
      rows: [...data.rows, newRow],
    });
    
    return rowId;
  },
  
  updateMatrixRow: (elementId, rowId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return;
    
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    const rows = data.rows.map(row =>
      row.id === rowId ? { ...row, ...updates } : row
    );
    
    get().updateSmartElementData(elementId, { rows });
  },
  
  deleteMatrixRow: (elementId, rowId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return;
    
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    const rows = data.rows.filter(row => row.id !== rowId);
    
    // Also remove cells for this row
    const cells = { ...data.cells };
    Object.keys(cells).forEach(key => {
      if (key.startsWith(`${rowId}:`)) {
        delete cells[key];
      }
    });
    
    get().updateSmartElementData(elementId, { rows, cells });
  },
  
  addMatrixColumn: (elementId, column) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return '';
    
    const columnId = nanoid();
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    
    const newColumn: MatrixColumn = {
      id: columnId,
      label: column.label || 'معيار جديد',
      description: column.description,
      weight: column.weight ?? 1,
      type: column.type || 'numeric',
    };
    
    get().updateSmartElementData(elementId, {
      columns: [...data.columns, newColumn],
    });
    
    return columnId;
  },
  
  updateMatrixColumn: (elementId, columnId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return;
    
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    const columns = data.columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    
    get().updateSmartElementData(elementId, { columns });
  },
  
  deleteMatrixColumn: (elementId, columnId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return;
    
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    const columns = data.columns.filter(col => col.id !== columnId);
    
    // Also remove cells for this column
    const cells = { ...data.cells };
    Object.keys(cells).forEach(key => {
      if (key.endsWith(`:${columnId}`)) {
        delete cells[key];
      }
    });
    
    get().updateSmartElementData(elementId, { columns, cells });
  },
  
  setMatrixCellValue: (elementId, rowId, columnId, value) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return;
    
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    const cellKey = `${rowId}:${columnId}`;
    
    get().updateSmartElementData(elementId, {
      cells: { ...data.cells, [cellKey]: value },
    });
  },
  
  calculateMatrixScores: (elementId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'decisions_matrix') return {};
    
    const data = entry.data as SmartElementDataType<'decisions_matrix'>;
    const scores: Record<string, number> = {};
    
    data.rows.forEach(row => {
      let total = 0;
      data.columns.forEach(col => {
        const cellKey = `${row.id}:${col.id}`;
        const cell = data.cells[cellKey];
        const value = typeof cell?.value === 'number' ? cell.value : 0;
        total += value * col.weight;
      });
      scores[row.id] = total;
    });
    
    return scores;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Gantt Chart Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addGanttTask: (elementId, task) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'gantt') return '';
    
    const taskId = nanoid();
    const data = entry.data as SmartElementDataType<'gantt'>;
    const now = new Date().toISOString();
    
    const newTask: GanttTask = {
      id: taskId,
      name: task.name || 'مهمة جديدة',
      description: task.description,
      startDate: task.startDate || now,
      endDate: task.endDate || now,
      progress: task.progress || 0,
      color: task.color,
      assignee: task.assignee,
      assigneeName: task.assigneeName,
      parentId: task.parentId,
      dependencies: task.dependencies || [],
      milestone: task.milestone || false,
      critical: task.critical || false,
      linkedElementId: task.linkedElementId,
      priority: task.priority,
    };
    
    get().updateSmartElementData(elementId, {
      tasks: [...data.tasks, newTask],
    });
    
    return taskId;
  },
  
  updateGanttTask: (elementId, taskId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'gantt') return;
    
    const data = entry.data as SmartElementDataType<'gantt'>;
    const tasks = data.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    get().updateSmartElementData(elementId, { tasks });
  },
  
  deleteGanttTask: (elementId, taskId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'gantt') return;
    
    const data = entry.data as SmartElementDataType<'gantt'>;
    
    // Remove task and all subtasks
    const tasksToRemove = new Set<string>([taskId]);
    const findSubtasks = (parentId: string) => {
      data.tasks.forEach(task => {
        if (task.parentId === parentId) {
          tasksToRemove.add(task.id);
          findSubtasks(task.id);
        }
      });
    };
    findSubtasks(taskId);
    
    // Remove dependencies to deleted tasks
    const tasks = data.tasks
      .filter(task => !tasksToRemove.has(task.id))
      .map(task => ({
        ...task,
        dependencies: task.dependencies.filter(
          dep => !tasksToRemove.has(dep.taskId)
        ),
      }));
    
    get().updateSmartElementData(elementId, { tasks });
  },
  
  addGanttDependency: (elementId, taskId, dependsOnTaskId, type = 'finish-to-start') => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'gantt') return;
    
    const data = entry.data as SmartElementDataType<'gantt'>;
    const tasks = data.tasks.map(task => {
      if (task.id === taskId) {
        // Check if dependency already exists
        if (task.dependencies.some(d => d.taskId === dependsOnTaskId)) {
          return task;
        }
        return {
          ...task,
          dependencies: [
            ...task.dependencies,
            { taskId: dependsOnTaskId, type, lag: 0 },
          ],
        };
      }
      return task;
    });
    
    get().updateSmartElementData(elementId, { tasks });
  },
  
  removeGanttDependency: (elementId, taskId, dependsOnTaskId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'gantt') return;
    
    const data = entry.data as SmartElementDataType<'gantt'>;
    const tasks = data.tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          dependencies: task.dependencies.filter(
            d => d.taskId !== dependsOnTaskId
          ),
        };
      }
      return task;
    });
    
    get().updateSmartElementData(elementId, { tasks });
  },
  
  updateGanttTaskProgress: (elementId, taskId, progress) => {
    get().updateGanttTask(elementId, taskId, {
      progress: Math.max(0, Math.min(100, progress)),
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Mind Map Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addMindMapNode: (elementId, parentId, label) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return '';
    
    const nodeId = nanoid();
    const data = entry.data as SmartElementDataType<'mind_map'>;
    
    const newNode: MindMapNode = {
      id: nodeId,
      label,
      parentId,
      collapsed: false,
      childIds: [],
      order: 0,
    };
    
    // Update parent's childIds
    const nodes = { ...data.nodes, [nodeId]: newNode };
    if (parentId && nodes[parentId]) {
      nodes[parentId] = {
        ...nodes[parentId],
        childIds: [...nodes[parentId].childIds, nodeId],
      };
      newNode.order = nodes[parentId].childIds.length - 1;
    }
    
    get().updateSmartElementData(elementId, { nodes });
    
    return nodeId;
  },
  
  updateMindMapNode: (elementId, nodeId, updates) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return;
    
    const data = entry.data as SmartElementDataType<'mind_map'>;
    if (!data.nodes[nodeId]) return;
    
    get().updateSmartElementData(elementId, {
      nodes: {
        ...data.nodes,
        [nodeId]: { ...data.nodes[nodeId], ...updates },
      },
    });
  },
  
  deleteMindMapNode: (elementId, nodeId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return;
    
    const data = entry.data as SmartElementDataType<'mind_map'>;
    
    // Don't allow deleting root
    if (nodeId === data.rootId) return;
    
    // Find all descendants to delete
    const nodesToDelete = new Set<string>([nodeId]);
    const findDescendants = (id: string) => {
      const node = data.nodes[id];
      if (node?.childIds) {
        node.childIds.forEach(childId => {
          nodesToDelete.add(childId);
          findDescendants(childId);
        });
      }
    };
    findDescendants(nodeId);
    
    // Remove nodes
    const nodes = { ...data.nodes };
    nodesToDelete.forEach(id => delete nodes[id]);
    
    // Update parent
    const deletedNode = data.nodes[nodeId];
    if (deletedNode?.parentId && nodes[deletedNode.parentId]) {
      nodes[deletedNode.parentId] = {
        ...nodes[deletedNode.parentId],
        childIds: nodes[deletedNode.parentId].childIds.filter(
          id => id !== nodeId
        ),
      };
    }
    
    // Remove connections involving deleted nodes
    const connections = data.connections.filter(
      conn => !nodesToDelete.has(conn.fromNodeId) && !nodesToDelete.has(conn.toNodeId)
    );
    
    get().updateSmartElementData(elementId, { nodes, connections });
  },
  
  moveMindMapNode: (elementId, nodeId, newParentId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return;
    
    const data = entry.data as SmartElementDataType<'mind_map'>;
    const node = data.nodes[nodeId];
    if (!node || nodeId === data.rootId) return;
    
    // Prevent moving to own descendant
    const isDescendant = (ancestorId: string, descendantId: string): boolean => {
      const ancestor = data.nodes[ancestorId];
      if (!ancestor) return false;
      if (ancestor.childIds.includes(descendantId)) return true;
      return ancestor.childIds.some(childId => isDescendant(childId, descendantId));
    };
    if (newParentId && isDescendant(nodeId, newParentId)) return;
    
    const nodes = { ...data.nodes };
    
    // Remove from old parent
    if (node.parentId && nodes[node.parentId]) {
      nodes[node.parentId] = {
        ...nodes[node.parentId],
        childIds: nodes[node.parentId].childIds.filter(id => id !== nodeId),
      };
    }
    
    // Add to new parent
    if (newParentId && nodes[newParentId]) {
      nodes[newParentId] = {
        ...nodes[newParentId],
        childIds: [...nodes[newParentId].childIds, nodeId],
      };
    }
    
    // Update node's parent
    nodes[nodeId] = { ...nodes[nodeId], parentId: newParentId };
    
    get().updateSmartElementData(elementId, { nodes });
  },
  
  toggleMindMapNodeCollapse: (elementId, nodeId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return;
    
    const data = entry.data as SmartElementDataType<'mind_map'>;
    const node = data.nodes[nodeId];
    if (!node) return;
    
    get().updateSmartElementData(elementId, {
      nodes: {
        ...data.nodes,
        [nodeId]: { ...node, collapsed: !node.collapsed },
      },
    });
  },
  
  addMindMapConnection: (elementId, fromNodeId, toNodeId, label) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return '';
    
    const connectionId = nanoid();
    const data = entry.data as SmartElementDataType<'mind_map'>;
    
    // Don't allow duplicate connections
    if (data.connections.some(
      c => c.fromNodeId === fromNodeId && c.toNodeId === toNodeId
    )) {
      return '';
    }
    
    const newConnection: MindMapConnection = {
      id: connectionId,
      fromNodeId,
      toNodeId,
      label,
      style: 'dashed',
    };
    
    get().updateSmartElementData(elementId, {
      connections: [...data.connections, newConnection],
    });
    
    return connectionId;
  },
  
  removeMindMapConnection: (elementId, connectionId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'mind_map') return;
    
    const data = entry.data as SmartElementDataType<'mind_map'>;
    const connections = data.connections.filter(c => c.id !== connectionId);
    
    get().updateSmartElementData(elementId, { connections });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Interactive Sheet Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  setSheetCellValue: (elementId, cellRef, value, formula) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'interactive_sheet') return;
    
    const data = entry.data as SmartElementDataType<'interactive_sheet'>;
    const existingCell = data.cells[cellRef] || { value: null };
    
    get().updateSmartElementData(elementId, {
      cells: {
        ...data.cells,
        [cellRef]: {
          ...existingCell,
          value,
          formula,
        },
      },
    });
  },
  
  setSheetCellFormat: (elementId, cellRef, format) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'interactive_sheet') return;
    
    const data = entry.data as SmartElementDataType<'interactive_sheet'>;
    const existingCell = data.cells[cellRef] || { value: null };
    
    get().updateSmartElementData(elementId, {
      cells: {
        ...data.cells,
        [cellRef]: {
          ...existingCell,
          format: { ...existingCell.format, ...format },
        },
      },
    });
  },
  
  addSheetRows: (elementId, count, afterRow) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'interactive_sheet') return;
    
    const data = entry.data as SmartElementDataType<'interactive_sheet'>;
    get().updateSmartElementData(elementId, {
      rows: data.rows + count,
    });
  },
  
  addSheetColumns: (elementId, count, afterColumn) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'interactive_sheet') return;
    
    const data = entry.data as SmartElementDataType<'interactive_sheet'>;
    get().updateSmartElementData(elementId, {
      columns: data.columns + count,
    });
  },
  
  deleteSheetRows: (elementId, startRow, count) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'interactive_sheet') return;
    
    const data = entry.data as SmartElementDataType<'interactive_sheet'>;
    const newRowCount = Math.max(1, data.rows - count);
    
    // Remove cells in deleted rows
    const cells = { ...data.cells };
    Object.keys(cells).forEach(cellRef => {
      const row = parseInt(cellRef.replace(/[A-Z]/g, ''), 10);
      if (row >= startRow && row < startRow + count) {
        delete cells[cellRef];
      }
    });
    
    get().updateSmartElementData(elementId, { rows: newRowCount, cells });
  },
  
  deleteSheetColumns: (elementId, startColumn, count) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'interactive_sheet') return;
    
    const data = entry.data as SmartElementDataType<'interactive_sheet'>;
    const newColumnCount = Math.max(1, data.columns - count);
    
    get().updateSmartElementData(elementId, { columns: newColumnCount });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Smart Cards Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  linkSmartCardToSource: (elementId, sourceType, sourceId) => {
    const entry = get().smartElements[elementId];
    if (!entry) return;
    
    const typeMapping: Record<string, SmartElementType> = {
      project: 'project_card',
      client: 'crm_card',
      initiative: 'csr_card',
      department: 'finance_card',
    };
    
    const expectedType = typeMapping[sourceType];
    if (entry.smartType !== expectedType) return;
    
    const fieldMapping: Record<string, string> = {
      project: 'projectId',
      client: 'clientId',
      initiative: 'initiativeId',
      department: 'departmentId',
    };
    
    get().updateSmartElementData(elementId, {
      [fieldMapping[sourceType]]: sourceId,
    });
  },
  
  refreshSmartCard: async (elementId) => {
    // This will be implemented when data fetching is connected
    console.log('Refreshing smart card:', elementId);
  },
  
  toggleSmartCardMetric: (elementId, metric) => {
    const entry = get().smartElements[elementId];
    if (!entry) return;
    
    const cardTypes: SmartElementType[] = ['project_card', 'finance_card', 'csr_card', 'crm_card'];
    if (!cardTypes.includes(entry.smartType)) return;
    
    const data = entry.data as any;
    const currentMetrics = data.displayMetrics || [];
    
    const newMetrics = currentMetrics.includes(metric)
      ? currentMetrics.filter((m: string) => m !== metric)
      : [...currentMetrics, metric];
    
    get().updateSmartElementData(elementId, { displayMetrics: newMetrics });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Root Connector Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  setConnectorAISuggestions: (elementId, suggestions) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'root_connector') return;
    
    get().updateSmartElementData(elementId, { aiSuggestions: suggestions });
  },
  
  applyConnectorSuggestion: (elementId, suggestionId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'root_connector') return null;
    
    const data = entry.data as SmartElementDataType<'root_connector'>;
    const suggestion = data.aiSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return null;
    
    // Get connector position for new element placement
    const canvasStore = useCanvasStore.getState();
    const connectorElement = canvasStore.elements.find(
      el => el.data?.smartElementId === elementId
    );
    if (!connectorElement) return null;
    
    // Create new smart element from suggestion
    const newElementId = get().addSmartElement(
      suggestion.type as SmartElementType,
      connectorElement.position,
      suggestion.previewData as any
    );
    
    return newElementId;
  },
  
  toggleConnectorAIPanel: (elementId) => {
    const entry = get().smartElements[elementId];
    if (!entry || entry.smartType !== 'root_connector') return;
    
    const data = entry.data as SmartElementDataType<'root_connector'>;
    get().updateSmartElementData(elementId, {
      showAIPanel: !data.showAIPanel,
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ThinkingBoard Actions
  // ═══════════════════════════════════════════════════════════════════════════
  
  addElementToThinkingBoard: (boardId, elementId) => {
    const entry = get().smartElements[boardId];
    if (!entry || entry.smartType !== 'thinking_board') return;
    
    const data = entry.data as SmartElementDataType<'thinking_board'>;
    if (data.childElements.includes(elementId)) return;
    
    get().updateSmartElementData(boardId, {
      childElements: [...data.childElements, elementId],
    });
  },
  
  removeElementFromThinkingBoard: (boardId, elementId) => {
    const entry = get().smartElements[boardId];
    if (!entry || entry.smartType !== 'thinking_board') return;
    
    const data = entry.data as SmartElementDataType<'thinking_board'>;
    get().updateSmartElementData(boardId, {
      childElements: data.childElements.filter(id => id !== elementId),
    });
  },
  
  addThinkingBoardTag: (boardId, label, color) => {
    const entry = get().smartElements[boardId];
    if (!entry || entry.smartType !== 'thinking_board') return '';
    
    const tagId = nanoid();
    const data = entry.data as SmartElementDataType<'thinking_board'>;
    
    get().updateSmartElementData(boardId, {
      tags: [...data.tags, { id: tagId, label, color }],
    });
    
    return tagId;
  },
  
  removeThinkingBoardTag: (boardId, tagId) => {
    const entry = get().smartElements[boardId];
    if (!entry || entry.smartType !== 'thinking_board') return;
    
    const data = entry.data as SmartElementDataType<'thinking_board'>;
    get().updateSmartElementData(boardId, {
      tags: data.tags.filter(t => t.id !== tagId),
    });
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Export helper hooks
// ─────────────────────────────────────────────────────────────────────────────

export const useSmartElement = <T extends SmartElementType>(elementId: string) => {
  const store = useSmartElementsStore();
  const entry = store.smartElements[elementId];
  
  return {
    data: entry?.data as SmartElementDataType<T> | null,
    type: entry?.smartType as T | null,
    version: entry?.version || 0,
    update: (updates: Partial<SmartElementDataType<T>>) => 
      store.updateSmartElementData(elementId, updates),
  };
};
