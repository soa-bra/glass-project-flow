/**
 * runCanvasTransaction - wrapper موحد للعمليات متعددة الخطوات
 */

import { captureBoardSnapshot } from '../history/boardSnapshot';

const MAX_HISTORY_ENTRIES = 20;

type HistoryState = {
  history: {
    past: unknown[];
    future: unknown[];
  };
};

export function runCanvasTransaction<TState extends HistoryState>(
  set: (fn: (state: TState) => Partial<TState>) => void,
  mutate: (state: TState) => Partial<TState>,
): void {
  set((state: TState) => {
    const beforeSnapshot = captureBoardSnapshot(state as any);
    const updates = mutate(state);

    return {
      ...updates,
      history: {
        past: [...state.history.past.slice(-(MAX_HISTORY_ENTRIES - 1)), beforeSnapshot],
        future: [],
      },
    } as Partial<TState>;
  });
}
