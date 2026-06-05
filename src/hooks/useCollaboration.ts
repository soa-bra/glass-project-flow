/**
 * useCollaboration Hook - Sprint 8
 * Hook للتعاون الفوري مع Supabase Realtime
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collaborationEngine,
  CollaboratorPresence,
  CollaborationEvent,
  ConflictResolutionLog,
  CollaborationEventType
} from '@/engine/canvas/collaboration/collaborationEngine';
import { useCanvasStore } from '@/stores/canvasStore';

interface UseCollaborationOptions {
  boardId: string | null;
  odId: string | null;
  userName?: string;
  enabled?: boolean;
  legacyElementSyncEnabled?: boolean;
}

interface RemoteCursor {
  odId: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

type LegacyCanvasElement = ReturnType<typeof useCanvasStore.getState>['elements'][number];

export function useCollaboration(options: UseCollaborationOptions) {
  const {
    boardId,
    odId,
    userName,
    enabled = true,
    legacyElementSyncEnabled = false,
  } = options;
  
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [resolutionLogs, setResolutionLogs] = useState<ConflictResolutionLog[]>([]);
  
  const cursorThrottleRef = useRef<number>(0);
  const lastCursorRef = useRef<{ x: number; y: number } | null>(null);

  // معالجة تغييرات العناصر البعيدة
  const handleRemoteElementChange = useCallback((event: CollaborationEvent) => {
    // Planning Canvas persists and synchronizes elements through planning_elements.
    // The legacy board:* channel remains available for presence/cursors only unless
    // a legacy surface opts in explicitly.
    if (!legacyElementSyncEnabled) return;

    const { addElement, updateElement, deleteElement } = useCanvasStore.getState();
    const { type, payload } = event;

    switch (type) {
      case 'element_created':
        if (payload.element) {
          addElement(payload.element as Parameters<typeof addElement>[0]);
        }
        break;

      case 'element_updated':
      case 'element_moved':
      case 'element_resized':
        if (payload.elementId && payload.updates) {
          updateElement(
            payload.elementId as string,
            payload.updates as Parameters<typeof updateElement>[1]
          );
        }
        break;

      case 'element_deleted':
        if (payload.elementId) {
          deleteElement(payload.elementId as string);
        }
        break;
    }
  }, [legacyElementSyncEnabled]);

  // تهيئة المحرك
  useEffect(() => {
    if (!odId || !enabled) return;

    collaborationEngine.initialize({
      odId,
      userName,
      onCollaboratorsChange: (newCollaborators) => {
        setCollaborators(newCollaborators);
      },
      onRemoteCursorMove: (remoteOdId, cursor) => {
        setRemoteCursors((prev) => {
          const next = new Map(prev);
          const collaborator = collaborators.find((c) => c.odId === remoteOdId);
          next.set(remoteOdId, {
            odId: remoteOdId,
            x: cursor.x,
            y: cursor.y,
            color: collaborator?.color || '#3DBE8B',
            name: collaborator?.name || 'مستخدم',
          });
          return next;
        });
      },
      onRemoteElementChange: handleRemoteElementChange,
      onLockChange: (elementId, lockedBy) => {
        console.log(`Element ${elementId} lock changed to: ${lockedBy}`);
      },
      onConflict: (event, localVersion, resolution) => {
        console.warn('Conflict detected:', event, 'local version:', localVersion, 'resolution:', resolution);
        setResolutionLogs((prev) => [resolution, ...prev].slice(0, 100));
      },
    });
  }, [odId, userName, enabled, collaborators, handleRemoteElementChange]);

  // الانضمام/مغادرة اللوحة
  useEffect(() => {
    if (!boardId || !odId || !enabled) {
      setIsConnected(false);
      return;
    }

    const connect = async () => {
      try {
        setConnectionError(null);
        await collaborationEngine.joinBoard(boardId);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to join board:', error);
        setConnectionError('فشل الاتصال باللوحة');
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      collaborationEngine.leaveBoard();
      setIsConnected(false);
      setRemoteCursors(new Map());
    };
  }, [boardId, odId, enabled]);

  // تحديث موقع المؤشر (مع throttling)
  const updateCursor = useCallback((x: number, y: number) => {
    if (!isConnected) return;

    const now = Date.now();
    if (now - cursorThrottleRef.current < 50) return; // 20fps max
    
    // تجاهل إذا لم يتغير الموقع بشكل ملحوظ
    if (lastCursorRef.current) {
      const dx = Math.abs(x - lastCursorRef.current.x);
      const dy = Math.abs(y - lastCursorRef.current.y);
      if (dx < 5 && dy < 5) return;
    }

    cursorThrottleRef.current = now;
    lastCursorRef.current = { x, y };
    collaborationEngine.updateCursor(x, y);
  }, [isConnected]);

  // تحديث التحديد
  const updateSelection = useCallback((elementIds: string[]) => {
    if (!isConnected) return;
    collaborationEngine.updateSelection(elementIds);
  }, [isConnected]);

  // بث تغيير عنصر
  const broadcastElementChange = useCallback(async (
    type: CollaborationEventType,
    payload: Record<string, unknown>
  ) => {
    if (!isConnected || !legacyElementSyncEnabled) return;
    await collaborationEngine.broadcastElementChange(type, payload);
  }, [isConnected, legacyElementSyncEnabled]);

  // طلب قفل عنصر
  const acquireLock = useCallback(async (elementId: string): Promise<boolean> => {
    if (!isConnected) return true; // السماح إذا غير متصل
    return collaborationEngine.acquireLock(elementId);
  }, [isConnected]);

  // تحرير قفل عنصر
  const releaseLock = useCallback(async (elementId: string) => {
    if (!isConnected) return;
    await collaborationEngine.releaseLock(elementId);
  }, [isConnected]);

  // التحقق من حالة القفل
  const isElementLocked = useCallback((elementId: string): boolean => {
    return collaborationEngine.isElementLocked(elementId);
  }, []);

  // الحصول على مالك القفل
  const getLockOwner = useCallback((elementId: string): string | null => {
    return collaborationEngine.getLockOwner(elementId);
  }, []);

  // بث إنشاء عنصر
  const broadcastElementCreated = useCallback(async (element: LegacyCanvasElement) => {
    await broadcastElementChange('element_created', {
      entityType: 'element',
      entityId: element.id,
      element,
    });
  }, [broadcastElementChange]);

  // بث تحديث عنصر
  const broadcastElementUpdated = useCallback(async (
    elementId: string, 
    updates: Partial<LegacyCanvasElement>
  ) => {
    await broadcastElementChange('element_updated', {
      entityType: 'element',
      entityId: elementId,
      elementId,
      updates,
    });
  }, [broadcastElementChange]);

  // بث حذف عنصر
  const broadcastElementDeleted = useCallback(async (elementId: string) => {
    await broadcastElementChange('element_deleted', {
      entityType: 'element',
      entityId: elementId,
      elementId,
    });
  }, [broadcastElementChange]);

  // بث تحريك عنصر
  const broadcastElementMoved = useCallback(async (
    elementId: string, 
    position: { x: number; y: number }
  ) => {
    await broadcastElementChange('element_moved', { 
      entityType: 'element',
      entityId: elementId,
      elementId, 
      updates: { position } 
    });
  }, [broadcastElementChange]);

  // بث تغيير حجم عنصر
  const broadcastElementResized = useCallback(async (
    elementId: string, 
    size: { width: number; height: number }
  ) => {
    await broadcastElementChange('element_resized', { 
      entityType: 'element',
      entityId: elementId,
      elementId, 
      updates: { size } 
    });
  }, [broadcastElementChange]);

  return {
    // الحالة
    isConnected,
    connectionError,
    collaborators,
    remoteCursors: Array.from(remoteCursors.values()),
    resolutionLogs,
    
    // المؤشر
    updateCursor,
    
    // التحديد
    updateSelection,
    
    // الأقفال
    acquireLock,
    releaseLock,
    isElementLocked,
    getLockOwner,
    
    // البث
    broadcastElementCreated,
    broadcastElementUpdated,
    broadcastElementDeleted,
    broadcastElementMoved,
    broadcastElementResized,
  };
}