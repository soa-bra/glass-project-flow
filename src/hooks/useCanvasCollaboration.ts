import { useState, useEffect, useCallback } from 'react';

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

  // محاكاة WebSocket connection
  useEffect(() => {
    if (!enable) return;

    // محاكاة الاتصال
    setIsConnected(true);
    
    // محاكاة المتعاونين
    const mockCollaborators: Collaborator[] = [
      { id: 'user1', name: 'أحمد محمد', color: '#3b82f6', isOnline: true },
      { id: 'user2', name: 'فاطمة علي', color: '#10b981', isOnline: true },
      { id: 'user3', name: 'سارة أحمد', color: '#f59e0b', isOnline: false }
    ];

    setCollaborators(mockCollaborators.filter(c => c.id !== userId));

    // محاकاة تحديثات الحالة
    const interval = setInterval(() => {
      // محاكاة تغيير حالة المستخدمين
      setCollaborators(prev => prev.map(collab => ({
        ...collab,
        isOnline: Math.random() > 0.2, // 80% chance to be online
        cursor: collab.isOnline ? {
          x: Math.random() * 800,
          y: Math.random() * 600
        } : undefined
      })));
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [projectId, userId, enable]);

  const lockElement = useCallback((elementId: string) => {
    if (!enable) return;
    
    setLocks(prev => ({ ...prev, [elementId]: userId }));
    
    // محاكاة إرسال إلى الخادم
  }, [userId, enable]);

  const unlockElement = useCallback((elementId: string) => {
    if (!enable) return;
    
    setLocks(prev => {
      const newLocks = { ...prev };
      delete newLocks[elementId];
      return newLocks;
    });
    
    // محاكاة إرسال إلى الخادم
  }, [userId, enable]);

  const isElementLockedByOther = useCallback((elementId: string) => {
    return locks[elementId] && locks[elementId] !== userId;
  }, [locks, userId]);

  const isElementLockedByMe = useCallback((elementId: string) => {
    return locks[elementId] === userId;
  }, [locks, userId]);

  const broadcastCursor = useCallback((x: number, y: number) => {
    if (!enable) return;
    
    // محاكاة بث موقع المؤشر
  }, [userId, enable]);

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