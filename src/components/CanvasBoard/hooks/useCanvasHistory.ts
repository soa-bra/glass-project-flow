import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';
import { toast } from 'sonner';

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback((elements: CanvasElement[], setElements: (elements: CanvasElement[]) => void) => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      toast.success('تم التراجع');
    }
  }, [historyIndex, history]);

  const redo = useCallback((elements: CanvasElement[], setElements: (elements: CanvasElement[]) => void) => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      toast.success('تم الإعادة');
    }
  }, [historyIndex, history]);

  return {
    history,
    historyIndex,
    saveToHistory,
    undo,
    redo
  };
};