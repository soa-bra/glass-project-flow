import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { CanvasBoard, CanvasTemplate } from '@/types/planning';

interface PlanningState {
  boards: CanvasBoard[];
  currentBoard: CanvasBoard | null;
  templates: CanvasTemplate[];
  
  // Actions
  createBoard: (type: 'blank' | 'template' | 'from_file', data?: any) => void;
  deleteBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  duplicateBoard: (id: string) => void;
  setCurrentBoard: (board: CanvasBoard | null) => void;
  loadBoards: () => void;
}

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoard: null,
      templates: [],
      
      createBoard: (type, data) => {
        const newBoard: CanvasBoard = {
          id: nanoid(),
          name: data?.name || `لوحة جديدة ${get().boards.length + 1}`,
          type,
          status: 'draft',
          lastModified: new Date(),
          createdAt: new Date(),
          owner: 'current-user',
        };
        set({ boards: [newBoard, ...get().boards], currentBoard: newBoard });
      },
      
      deleteBoard: (id) => {
        set({ 
          boards: get().boards.filter(b => b.id !== id),
          currentBoard: get().currentBoard?.id === id ? null : get().currentBoard
        });
      },
      
      renameBoard: (id, name) => {
        set({
          boards: get().boards.map(b => 
            b.id === id ? { ...b, name, lastModified: new Date() } : b
          )
        });
      },
      
      duplicateBoard: (id) => {
        const original = get().boards.find(b => b.id === id);
        if (original) {
          const duplicate: CanvasBoard = {
            ...original,
            id: nanoid(),
            name: `${original.name} (نسخة)`,
            createdAt: new Date(),
            lastModified: new Date(),
          };
          set({ boards: [duplicate, ...get().boards] });
        }
      },
      
      setCurrentBoard: (board) => set({ currentBoard: board }),
      
      loadBoards: () => {
        // سيتم ربطها لاحقًا بـ Supabase أو API
      },
    }),
    {
      name: 'planning-storage',
    }
  )
);
