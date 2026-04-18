import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { usePlanningStore } from '@/stores/planningStore';
import type { CanvasBoard } from '@/types/planning';

export type BoardSaveStatus = 'clean' | 'dirty' | 'saving' | 'saved' | 'error';

interface PersistedBoardSavePayload {
  fingerprint: string;
  savedAt: string;
  snapshot: {
    elements: unknown[];
    layers: unknown[];
    viewport: { zoom: number; pan: { x: number; y: number } };
  };
}

interface UseBoardSaveStateReturn {
  status: BoardSaveStatus;
  lastSavedAt: Date | null;
  canSave: boolean;
  isDirty: boolean;
  saveBoardState: () => Promise<boolean>;
}

const CLEANUP_DELAY_MS = 1600;

function getBoardSaveStorageKey(boardId: string): string {
  return `planning-board-save:${boardId}`;
}

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
  viewport: { zoom: number; pan: { x: number; y: number } };
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
  const viewport = useCanvasStore((state) => state.viewport);
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
      viewport,
    });
  }, [board, elements, layers, viewport]);

  useEffect(() => {
    if (!board) {
      setStatus('clean');
      setLastSavedAt(null);
      lastSavedFingerprintRef.current = '';
      return;
    }

    const fallbackSavedAt = normalizeDate(board.lastModified);
    let nextFingerprint = fingerprint;
    let nextSavedAt = fallbackSavedAt;

    try {
      const raw = window.localStorage.getItem(getBoardSaveStorageKey(board.id));
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedBoardSavePayload;
        if (typeof parsed.fingerprint === 'string') {
          nextFingerprint = parsed.fingerprint;
        }
        if (parsed.savedAt) {
          nextSavedAt = normalizeDate(parsed.savedAt) || fallbackSavedAt;
        }
      }
    } catch {
      nextFingerprint = fingerprint;
      nextSavedAt = fallbackSavedAt;
    }

    lastSavedFingerprintRef.current = nextFingerprint;
    setLastSavedAt(nextSavedAt);
    setStatus(fingerprint === nextFingerprint ? 'clean' : 'dirty');
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
      const payload: PersistedBoardSavePayload = {
        fingerprint,
        savedAt: savedAt.toISOString(),
        snapshot: {
          elements,
          layers,
          viewport,
        },
      };

      window.localStorage.setItem(getBoardSaveStorageKey(board.id), JSON.stringify(payload));
      saveBoard(board.id, savedAt);

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
  }, [board, elements, fingerprint, layers, saveBoard, viewport]);

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
