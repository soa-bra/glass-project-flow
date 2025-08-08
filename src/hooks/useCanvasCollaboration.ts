import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCanvasCollaborationProps {
  projectId: string;
  userId: string;
  enable?: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
}

interface ElementLock {
  elementId: string;
  userId: string;
  timestamp: Date;
}

export function useCanvasCollaboration({
  projectId,
  userId,
  enable = true
}: UseCanvasCollaborationProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [locks, setLocks] = useState<Record<string, string>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  // اتصال Realtime عبر Supabase
  useEffect(() => {
    if (!enable) return;

    const ch = supabase.channel(`canvas:${projectId}`, { config: { presence: { key: userId } } });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState() as Record<string, Array<any>>;
      const others: Collaborator[] = [];
      Object.entries(state).forEach(([key, presences]) => {
        presences.forEach((p: any) => {
          if (key === userId) return;
          others.push({
            id: p.userId || key,
            name: p.name || (p.userId || key),
            color: p.color || '#3b82f6',
            isOnline: true,
            cursor: p.cursor
          });
        });
      });
      setCollaborators(others);
    });

    ch.on('broadcast', { event: 'cursor' }, ({ payload }) => {
      setCollaborators(prev => prev.map(c => c.id === payload.userId ? { ...c, cursor: { x: payload.x, y: payload.y }, isOnline: true } : c));
    });

    ch.on('broadcast', { event: 'lock' }, ({ payload }) => {
      setLocks(prev => {
        const next = { ...prev };
        if (payload.action === 'lock') next[payload.elementId] = payload.userId;
        else if (payload.action === 'unlock') delete next[payload.elementId];
        return next;
      });
    });

    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        await ch.track({ userId, name: userId, color: '#3b82f6' });
      }
    });

    setChannel(ch);

    return () => {
      supabase.removeChannel(ch);
      setIsConnected(false);
    };
  }, [projectId, userId, enable]);

  const lockElement = useCallback((elementId: string) => {
    if (!enable) return;
    setLocks(prev => ({ ...prev, [elementId]: userId }));
    channel?.send({ type: 'broadcast', event: 'lock', payload: { action: 'lock', elementId, userId } });
  }, [userId, enable, channel]);

  const unlockElement = useCallback((elementId: string) => {
    if (!enable) return;
    setLocks(prev => {
      const newLocks = { ...prev };
      delete newLocks[elementId];
      return newLocks;
    });
    channel?.send({ type: 'broadcast', event: 'lock', payload: { action: 'unlock', elementId, userId } });
  }, [userId, enable, channel]);

  const isElementLockedByOther = useCallback((elementId: string) => {
    return locks[elementId] && locks[elementId] !== userId;
  }, [locks, userId]);

  const isElementLockedByMe = useCallback((elementId: string) => {
    return locks[elementId] === userId;
  }, [locks, userId]);

  const broadcastCursor = useCallback((x: number, y: number) => {
    if (!enable) return;
    channel?.send({ type: 'broadcast', event: 'cursor', payload: { userId, x, y } });
  }, [userId, enable, channel]);

  const sendMessage = useCallback((message: string) => {
    if (!enable) return;
    
    // محاكاة إرسال رسالة
    return {
      id: Date.now().toString(),
      userId,
      message,
      timestamp: new Date()
    };
  }, [userId, enable]);

  return {
    collaborators,
    isConnected,
    lockElement,
    unlockElement,
    isElementLockedByOther,
    isElementLockedByMe,
    broadcastCursor,
    sendMessage,
    lockedElements: Object.keys(locks)
  };
}