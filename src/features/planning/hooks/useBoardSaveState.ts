import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { usePlanningStore } from '@/stores/planningStore';
import type { CanvasBoard, CanvasBoardStateSnapshot } from '@/types/planning';

export type BoardSaveStatus = 'clean' | 'dirty' | 'saving' | 'saved' | 'error';

interface UseBoardSaveStateReturn {
  status: BoardSaveStatus;
  lastSavedAt: Date | null;
  canSave: boolean;
  isDirty: boolean;
  saveBoardState: () => Promise<boolean>;
}

const CLEANUP_DELAY_MS = 1600;

function normalizeDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildBoardFingerprint(input: {
  boardId: string;
  boardName: string;
  elements: unknown[];
  layers: unknown[];
  selectedElementIds: string[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  activeLayerId: string | null;
}): string {
  return JSON.stringify(input);
}

export function formatBoardSaveStatusLabel(status: BoardSaveStatus, lastSavedAt: Date | null): string {
  switch (status) {
    case 'dirty':
      return 'غير محفوظ';
    case 'saving':
      return 'جارٍ الحفظ';
    case 'saved':
      return 'تم الحفظ';
    case 'error':
      return 'فشل الحفظ';
    case 'clean':
    default: {
      if (!lastSavedAt) return 'لم يُحفظ بعد';

      const elapsedMs = Date.now() - lastSavedAt.getTime();
      const elapsedMinutes = Math.floor(elapsedMs / 60000);
      const elapsedHours = Math.floor(elapsedMinutes / 60);

      if (elapsedMinutes < 1) return 'محفوظ الآن';
      if (elapsedMinutes < 60) return `محفوظ منذ ${elapsedMinutes} د`;
      if (elapsedHours < 24) return `محفوظ منذ ${elapsedHours} س`;
      return `آخر حفظ ${lastSavedAt.toLocaleDateString('ar-SA')}`;
    }
  }
}

export function useBoardSaveState(board: CanvasBoard | null): UseBoardSaveStateReturn {
  const elements = useCanvasStore((state) => state.elements);
  const layers = useCanvasStore((state) => state.layers);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const viewport = useCanvasStore((state) => state.viewport);
  const activeLayerId = useCanvasStore((state) => state.activeLayerId);
  const saveBoard = usePlanningStore((state) => state.saveBoard);

  const [status, setStatus] = useState<BoardSaveStatus>('clean');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(normalizeDate(board?.lastModified));
  const lastSavedFingerprintRef = useRef<string>('');
  const cleanupTimerRef = useRef<number | null>(null);

  const fingerprint = useMemo(() => {
    if (!board) return '';

    return buildBoardFingerprint({
      boardId: board.id,
      boardName: board.name,
      elements,
      layers,
      selectedElementIds,
      viewport,
      activeLayerId,
    });
  }, [activeLayerId, board, elements, layers, selectedElementIds, viewport]);

  useEffect(() => {
    if (!board) {
      setStatus('clean');
      setLastSavedAt(null);
      lastSavedFingerprintRef.current = '';
      return;
    }

    const savedSnapshot = board.canvasState;
    const savedAt = normalizeDate(savedSnapshot?.savedAt || board.lastModified);
    const savedFingerprint = buildBoardFingerprint({
      boardId: board.id,
      boardName: board.name,
      elements: savedSnapshot?.elements ?? [],
      layers: savedSnapshot?.layers ?? [],
      selectedElementIds: savedSnapshot?.selectedElementIds ?? [],
      viewport: savedSnapshot?.viewport ?? { zoom: 1, pan: { x: 0, y: 0 } },
      activeLayerId: savedSnapshot?.activeLayerId ?? null,
    });

    lastSavedFingerprintRef.current = savedSnapshot ? savedFingerprint : fingerprint;
    setLastSavedAt(savedAt);
    setStatus(fingerprint === lastSavedFingerprintRef.current ? 'clean' : 'dirty');
  }, [board?.id]);

  useEffect(() => {
    if (!board || !lastSavedFingerprintRef.current) return;
    if (status === 'saving') return;

    setStatus(fingerprint === lastSavedFingerprintRef.current ? 'clean' : 'dirty');
  }, [board, fingerprint, status]);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  const saveBoardState = useCallback(async () => {
    if (!board) return false;

    setStatus('saving');

    try {
      const savedAt = new Date();
      const canvasState: CanvasBoardStateSnapshot = {
        elements,
        layers,
        selectedElementIds,
        viewport,
        activeLayerId,
        savedAt: savedAt.toISOString(),
      };

      saveBoard(board.id, savedAt, canvasState);

      lastSavedFingerprintRef.current = fingerprint;
      setLastSavedAt(savedAt);
      setStatus('saved');

      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = window.setTimeout(() => {
        setStatus('clean');
        cleanupTimerRef.current = null;
      }, CLEANUP_DELAY_MS);

      return true;
    } catch (error) {
      console.error('[useBoardSaveState] Failed to save board state:', error);
      setStatus('error');
      return false;
    }
  }, [activeLayerId, board, elements, fingerprint, layers, saveBoard, selectedElementIds, viewport]);

  const isDirty = !!board && fingerprint !== lastSavedFingerprintRef.current;

  return {
    status,
    lastSavedAt,
    canSave: !!board && status !== 'saving',
    isDirty,
    saveBoardState,
  };
}

export default useBoardSaveState;
