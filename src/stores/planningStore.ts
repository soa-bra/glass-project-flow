import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { CanvasBoard, CanvasBoardStateSnapshot, CanvasTemplate } from '@/types/planning';

interface PlanningState {
  boards: CanvasBoard[];
  currentBoard: CanvasBoard | null;
  templates: CanvasTemplate[];
  createBoard: (type: 'blank' | 'template' | 'from_file', data?: any) => void;
  deleteBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  saveBoard: (id: string, savedAt?: Date, canvasState?: CanvasBoardStateSnapshot) => void;
  duplicateBoard: (id: string) => void;
  setCurrentBoard: (board: CanvasBoard | null) => void;
  loadBoards: () => void;
}

const updateBoards = (boards: CanvasBoard[], id: string, updater: (board: CanvasBoard) => CanvasBoard) =>
  boards.map((board) => (board.id === id ? updater(board) : board));

function cloneCanvasState(canvasState: CanvasBoardStateSnapshot | undefined): CanvasBoardStateSnapshot | undefined {
  return canvasState ? JSON.parse(JSON.stringify(canvasState)) : undefined;
}

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoard: null,
      templates: [],
      createBoard: (type, data) => {
        const now = new Date();
        const newBoard: CanvasBoard = {
          id: nanoid(),
          name: data?.name || `لوحة جديدة ${get().boards.length + 1}`,
          type,
          status: 'draft',
          lastModified: now,
          createdAt: now,
          owner: 'current-user',
          canvasState: cloneCanvasState(data?.canvasState),
        };
        set({ boards: [newBoard, ...get().boards], currentBoard: newBoard });
      },
      deleteBoard: (id) => {
        set({
          boards: get().boards.filter((board) => board.id !== id),
          currentBoard: get().currentBoard?.id === id ? null : get().currentBoard,
        });
      },
      renameBoard: (id, name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        const now = new Date();
        set((state) => ({
          boards: updateBoards(state.boards, id, (board) => ({ ...board, name: trimmedName, lastModified: now })),
          currentBoard:
            state.currentBoard?.id === id
              ? { ...state.currentBoard, name: trimmedName, lastModified: now }
              : state.currentBoard,
        }));
      },
      saveBoard: (id, savedAt = new Date(), canvasState) => {
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
            lastModified: savedAt,
            canvasState: savedState ?? board.canvasState,
          })),
          currentBoard:
            state.currentBoard?.id === id
              ? {
                  ...state.currentBoard,
                  status: state.currentBoard.status === 'archived' ? 'archived' : 'active',
                  lastModified: savedAt,
                  canvasState: savedState ?? state.currentBoard.canvasState,
                }
              : state.currentBoard,
        }));
      },
      duplicateBoard: (id) => {
        const original = get().boards.find((board) => board.id === id);
        if (!original) return;
        const now = new Date();
        const duplicate: CanvasBoard = {
          ...original,
          id: nanoid(),
          name: `${original.name} (نسخة)`,
          createdAt: now,
          lastModified: now,
          canvasState: cloneCanvasState(original.canvasState),
        };
        set({ boards: [duplicate, ...get().boards] });
      },
      setCurrentBoard: (board) => set({ currentBoard: board }),
      loadBoards: () => {
        // سيتم ربطها لاحقًا بـ Supabase أو API
      },
    }),
    { name: 'planning-storage' },
  ),
);
