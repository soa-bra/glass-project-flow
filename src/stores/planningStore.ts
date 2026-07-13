import { create } from 'zustand';
import type { CanvasBoard, CanvasBoardStateSnapshot, CanvasTemplate } from '@/types/planning';
import { PlanningBoardsService } from '@/services/central';
import type {
  PlanningBoard as CentralPlanningBoard,
  PlanningElement,
} from '@/services/central/planningBoards.service';

interface PlanningState {
  boards: CanvasBoard[];
  currentBoard: CanvasBoard | null;
  templates: CanvasTemplate[];
  createBoard: (type: 'blank' | 'template' | 'from_file', data?: any) => Promise<CanvasBoard | null>;
  deleteBoard: (id: string) => Promise<void>;
  archiveBoard: (id: string) => Promise<void>;
  renameBoard: (id: string, name: string) => Promise<void>;
  saveBoard: (id: string, savedAt?: Date, canvasState?: CanvasBoardStateSnapshot) => Promise<void>;
  duplicateBoard: (id: string) => Promise<CanvasBoard | null>;
  setCurrentBoard: (board: CanvasBoard | null) => void;
  loadBoards: () => Promise<void>;
}

const updateBoards = (
  boards: CanvasBoard[],
  id: string,
  updater: (board: CanvasBoard) => CanvasBoard,
) => boards.map((board) => (board.id === id ? updater(board) : board));

function cloneCanvasState(
  canvasState: CanvasBoardStateSnapshot | undefined,
): CanvasBoardStateSnapshot | undefined {
  return canvasState ? JSON.parse(JSON.stringify(canvasState)) : undefined;
}

function mapCentralStateToBoardStatus(
  state: string | null | undefined,
): CanvasBoard['status'] {
  if (state === 'archived') return 'archived';
  if (state === 'draft') return 'draft';
  return 'active';
}

function mapBoardType(value: unknown): CanvasBoard['type'] {
  if (value === 'template' || value === 'from_file') return value;
  return 'blank';
}

function buildBoardMetadata(type: CanvasBoard['type'], data?: any): Record<string, unknown> {
  const metadata: Record<string, unknown> = { source_type: type };

  if (type === 'template' && data?.templateId) {
    metadata.template_id = data.templateId;
    metadata.template_name = data.name;
  }

  if (type === 'from_file' && data?.sourceFile) {
    metadata.source_file = {
      name: data.sourceFile.name,
      type: data.sourceFile.type,
      size: data.sourceFile.size,
      lastModified: data.sourceFile.lastModified ?? null,
    };
  }

  return metadata;
}

function mapBoardRowToCanvasBoard(
  row: CentralPlanningBoard,
  existing?: CanvasBoard,
): CanvasBoard {
  const metadata =
    row.metadata && typeof row.metadata === 'object'
      ? (row.metadata as Record<string, unknown>)
      : {};

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    type: mapBoardType(metadata.source_type),
    status: mapCentralStateToBoardStatus(row.state),
    lastModified: new Date(row.updated_at),
    createdAt: new Date(row.created_at),
    owner: row.owner_id,
    canvasState: existing?.canvasState,
  };
}

function clonePlanningElementForBoard(
  element: PlanningElement,
  boardId: string,
) {
  return {
    board_id: boardId,
    element_type: element.element_type,
    position:
      element.position && typeof element.position === 'object'
        ? (element.position as { x: number; y: number })
        : undefined,
    size:
      element.size && typeof element.size === 'object'
        ? (element.size as { width: number; height: number })
        : undefined,
    rotation: element.rotation ?? undefined,
    z_index: element.z_index ?? undefined,
    content:
      element.content && typeof element.content === 'object'
        ? (element.content as Record<string, unknown>)
        : undefined,
    style:
      element.style && typeof element.style === 'object'
        ? (element.style as Record<string, unknown>)
        : undefined,
    metadata:
      element.metadata && typeof element.metadata === 'object'
        ? (element.metadata as Record<string, unknown>)
        : undefined,
    schema_version: element.schema_version ?? undefined,
  };
}

export const usePlanningStore = create<PlanningState>()((set, get) => ({
  boards: [],
  currentBoard: null,
  templates: [],
  createBoard: async (type, data) => {
    const now = new Date();
    const created = await PlanningBoardsService.createPlanningBoard({
      name: data?.name || `لوحة جديدة ${get().boards.length + 1}`,
      description: data?.description,
      state: 'draft',
      metadata: buildBoardMetadata(type, data),
    });

    const newBoard: CanvasBoard = {
      ...mapBoardRowToCanvasBoard(created),
      createdAt: now,
      lastModified: now,
      canvasState: cloneCanvasState(data?.canvasState),
    };

    set((state) => ({
      boards: [newBoard, ...state.boards],
      currentBoard: newBoard,
    }));

    return newBoard;
  },
  deleteBoard: async (id) => {
    await PlanningBoardsService.deletePlanningBoard(id);
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
      currentBoard: state.currentBoard?.id === id ? null : state.currentBoard,
    }));
  },
  archiveBoard: async (id) => {
    const updated = await PlanningBoardsService.updatePlanningBoard(id, {
      state: 'archived',
    });
    set((state) => ({
      boards: updateBoards(state.boards, id, (board) => ({
        ...board,
        status: 'archived',
        lastModified: new Date(updated.updated_at),
      })),
    }));
  },
  renameBoard: async (id, name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const updated = await PlanningBoardsService.updatePlanningBoard(id, {
      name: trimmedName,
    });

    set((state) => ({
      boards: updateBoards(state.boards, id, (board) => ({
        ...board,
        name: updated.name,
        lastModified: new Date(updated.updated_at),
      })),
      currentBoard:
        state.currentBoard?.id === id
          ? {
              ...state.currentBoard,
              name: updated.name,
              lastModified: new Date(updated.updated_at),
            }
          : state.currentBoard,
    }));
  },
  saveBoard: async (id, savedAt = new Date(), canvasState) => {
    const updated = await PlanningBoardsService.updatePlanningBoard(id, {
      state: 'active',
    });

    const savedState = canvasState
      ? {
          ...cloneCanvasState(canvasState)!,
          savedAt: savedAt.toISOString(),
        }
      : undefined;

    set((state) => ({
      boards: updateBoards(state.boards, id, (board) => ({
        ...board,
        status: board.status === 'archived' ? 'archived' : 'active',
        lastModified: new Date(updated.updated_at),
        canvasState: savedState ?? board.canvasState,
      })),
      currentBoard:
        state.currentBoard?.id === id
          ? {
              ...state.currentBoard,
              status:
                state.currentBoard.status === 'archived' ? 'archived' : 'active',
              lastModified: new Date(updated.updated_at),
              canvasState: savedState ?? state.currentBoard.canvasState,
            }
          : state.currentBoard,
    }));
  },
  duplicateBoard: async (id) => {
    const original = get().boards.find((board) => board.id === id);
    if (!original) return null;

    const created = await PlanningBoardsService.createPlanningBoard({
      name: `${original.name} (نسخة)`,
      description: original.description,
      state: 'draft',
      metadata: { source_type: original.type, duplicated_from: original.id },
    });

    const duplicate = {
      ...mapBoardRowToCanvasBoard(created),
      canvasState: cloneCanvasState(original.canvasState),
    };

    const elements = await PlanningBoardsService.listPlanningElements(id);
    await Promise.all(
      elements.map((element) =>
        PlanningBoardsService.createPlanningElement(
          clonePlanningElementForBoard(element, created.id),
        ),
      ),
    );

    set((state) => ({ boards: [duplicate, ...state.boards] }));
    return duplicate;
  },
  setCurrentBoard: (board) => set({ currentBoard: board }),
  loadBoards: async () => {
    const rows = await PlanningBoardsService.listPlanningBoards();
    const existingBoards = get().boards;
    const mapped = rows.map((row) =>
      mapBoardRowToCanvasBoard(
        row,
        existingBoards.find((board) => board.id === row.id),
      ),
    );
    const currentBoardId = get().currentBoard?.id ?? null;

    set({
      boards: mapped,
      currentBoard: currentBoardId
        ? mapped.find((board) => board.id === currentBoardId) ?? null
        : null,
    });
  },
}));
