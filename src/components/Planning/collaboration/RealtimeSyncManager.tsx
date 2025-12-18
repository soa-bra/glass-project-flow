/**
 * RealtimeSyncManager - Sprint 17
 * مدير التزامن اللحظي للتعاون المباشر
 */

import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, Users, RefreshCw, Check, AlertCircle, 
  Zap, Clock, Cloud, CloudOff 
} from 'lucide-react';
import { useCollaboration } from '@/hooks/useCollaboration';
import { RemoteCursors } from './RemoteCursors';
import { CollaboratorsList } from './CollaboratorsList';
import { useCanvasStore } from '@/stores/canvasStore';
import { useCollaborationStore, Participant } from '@/stores/collaborationStore';
import { useCollaborationUser } from '@/hooks/useCollaborationUser';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RealtimeSyncManagerProps {
  boardId: string | null;
  userId: string | null;
  userName?: string;
  enabled?: boolean;
  viewport: {
    zoom: number;
    pan: { x: number; y: number };
  };
  onSyncStatusChange?: (status: SyncStatus) => void;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete' | 'move' | 'resize';
  elementId: string;
  userName: string;
  timestamp: number;
}

export const RealtimeSyncManager: React.FC<RealtimeSyncManagerProps> = ({
  boardId,
  userId,
  userName = 'مستخدم',
  enabled = true,
  viewport,
  onSyncStatusChange,
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [recentEvents, setRecentEvents] = useState<SyncEvent[]>([]);
  const [showActivity, setShowActivity] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  const {
    isConnected,
    connectionError,
    collaborators,
    remoteCursors,
    updateCursor,
    updateSelection,
    broadcastElementCreated,
    broadcastElementUpdated,
    broadcastElementDeleted,
    broadcastElementMoved,
    broadcastElementResized,
    acquireLock,
    releaseLock,
    isElementLocked,
  } = useCollaboration({
    boardId,
    odId: userId,
    userName,
    enabled,
  });

  const { elements, selectedElementIds } = useCanvasStore();
  const { setParticipants, setCurrentUser, setConnected, voiceState } = useCollaborationStore();
  const collaborationUser = useCollaborationUser();

  // ✅ تحديث حالة الاتصال في الـ store
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected, setConnected]);

  // ✅ تحديث collaborationStore بالمشاركين
  useEffect(() => {
    if (collaborators.length > 0 || isConnected) {
      const updatedParticipants: Participant[] = collaborators.map((c, index) => ({
        id: c.odId,
        name: c.name,
        color: c.color,
        role: index === 0 ? 'host' as const : 'editor' as const,
        online: true,
        inVoiceCall: voiceState.participants.includes(c.odId),
        isMuted: true,
        isSpeaking: false,
      }));
      setParticipants(updatedParticipants);
    }
  }, [collaborators, isConnected, voiceState.participants, setParticipants]);

  // ✅ تعيين المستخدم الحالي كمستضيف إذا كان أول من انضم
  useEffect(() => {
    const isFirstUser = collaborators.length === 0 || collaborators[0]?.odId === collaborationUser.id;
    setCurrentUser(collaborationUser.id, isFirstUser);
  }, [collaborationUser.id, collaborators, setCurrentUser]);

  // تحديث حالة التزامن
  useEffect(() => {
    const newStatus: SyncStatus = connectionError
      ? 'error'
      : !isConnected
      ? 'offline'
      : pendingChanges > 0
      ? 'syncing'
      : 'synced';
    
    setSyncStatus(newStatus);
    onSyncStatusChange?.(newStatus);
  }, [isConnected, connectionError, pendingChanges, onSyncStatusChange]);

  // تتبع حركة الماوس لمشاركة المؤشر
  useEffect(() => {
    if (!isConnected) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('[data-canvas-container="true"]');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewport.pan.x) / viewport.zoom;
      const y = (e.clientY - rect.top - viewport.pan.y) / viewport.zoom;
      
      updateCursor(x, y);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isConnected, viewport, updateCursor]);

  // تحديث التحديد
  useEffect(() => {
    if (!isConnected) return;
    updateSelection(selectedElementIds);
  }, [selectedElementIds, isConnected, updateSelection]);

  // إضافة حدث حديث
  const addRecentEvent = useCallback((event: Omit<SyncEvent, 'id' | 'timestamp'>) => {
    const newEvent: SyncEvent = {
      ...event,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setRecentEvents(prev => {
      const updated = [newEvent, ...prev].slice(0, 10);
      return updated;
    });

    setLastSyncTime(Date.now());
  }, []);

  // بث تغييرات العناصر
  const handleElementCreate = useCallback(async (element: typeof elements[0]) => {
    setPendingChanges(p => p + 1);
    try {
      await broadcastElementCreated(element);
      addRecentEvent({
        type: 'create',
        elementId: element.id,
        userName,
      });
    } finally {
      setPendingChanges(p => p - 1);
    }
  }, [broadcastElementCreated, addRecentEvent, userName]);

  const handleElementUpdate = useCallback(async (
    elementId: string,
    updates: Partial<typeof elements[0]>
  ) => {
    if (isElementLocked(elementId)) return;
    
    setPendingChanges(p => p + 1);
    try {
      await broadcastElementUpdated(elementId, updates);
      addRecentEvent({
        type: 'update',
        elementId,
        userName,
      });
    } finally {
      setPendingChanges(p => p - 1);
    }
  }, [broadcastElementUpdated, isElementLocked, addRecentEvent, userName]);

  const handleElementDelete = useCallback(async (elementId: string) => {
    setPendingChanges(p => p + 1);
    try {
      await broadcastElementDeleted(elementId);
      addRecentEvent({
        type: 'delete',
        elementId,
        userName,
      });
    } finally {
      setPendingChanges(p => p - 1);
    }
  }, [broadcastElementDeleted, addRecentEvent, userName]);

  const handleElementMove = useCallback(async (
    elementId: string,
    position: { x: number; y: number }
  ) => {
    if (isElementLocked(elementId)) return;
    
    await broadcastElementMoved(elementId, position);
  }, [broadcastElementMoved, isElementLocked]);

  const handleElementResize = useCallback(async (
    elementId: string,
    size: { width: number; height: number }
  ) => {
    if (isElementLocked(elementId)) return;
    
    await broadcastElementResized(elementId, size);
  }, [broadcastElementResized, isElementLocked]);

  // الحصول على أيقونة الحالة
  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin text-accent-blue" />;
      case 'synced':
        return <Check className="h-4 w-4 text-accent-green" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-accent-red" />;
      case 'offline':
        return <CloudOff className="h-4 w-4 text-ink-60" />;
      default:
        return <Cloud className="h-4 w-4 text-ink-60" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'جارٍ المزامنة...';
      case 'synced':
        return 'متزامن';
      case 'error':
        return 'خطأ في الاتصال';
      case 'offline':
        return 'غير متصل';
      default:
        return 'في انتظار التغييرات';
    }
  };

  // تنسيق الوقت
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
    return `منذ ${Math.floor(diff / 3600000)} ساعة`;
  };

  return (
    <>
      {/* مؤشرات المتعاونين البعيدة */}
      <RemoteCursors cursors={remoteCursors} viewport={viewport} />

      {/* نافذة النشاط */}
      <AnimatePresence>
        {showActivity && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-80
                       bg-white rounded-2xl border border-border shadow-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">نشاط التعاون</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowActivity(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا يوجد نشاط حديث
                </p>
              ) : (
                recentEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <div className={`
                      h-2 w-2 rounded-full
                      ${event.type === 'create' ? 'bg-accent-green' : ''}
                      ${event.type === 'update' ? 'bg-accent-blue' : ''}
                      ${event.type === 'delete' ? 'bg-accent-red' : ''}
                      ${event.type === 'move' ? 'bg-accent-yellow' : ''}
                      ${event.type === 'resize' ? 'bg-purple-500' : ''}
                    `} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-medium">{event.userName}</span>
                        {' '}
                        {event.type === 'create' && 'أنشأ عنصراً'}
                        {event.type === 'update' && 'عدّل عنصراً'}
                        {event.type === 'delete' && 'حذف عنصراً'}
                        {event.type === 'move' && 'نقل عنصراً'}
                        {event.type === 'resize' && 'غيّر حجم عنصر'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(event.timestamp)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* إشعار الخطأ */}
      <AnimatePresence>
        {connectionError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                       bg-accent-red text-white px-4 py-2 rounded-lg shadow-lg
                       flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{connectionError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RealtimeSyncManager;
