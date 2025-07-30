import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCanvasCollaborationProps {
  projectId: string;
  userId: string;
  userName: string;
  enable?: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  lastActivity?: Date;
  isTyping?: boolean;
  currentElement?: string;
}

interface ElementLock {
  elementId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  expiresAt: Date;
}

interface CollaborationMessage {
  type: 'cursor' | 'lock' | 'unlock' | 'presence' | 'element_update' | 'chat' | 'typing' | 'disconnect';
  userId: string;
  userName: string;
  data: any;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'file';
}

export function useCanvasCollaboration({
  projectId,
  userId,
  userName,
  enable = true
}: UseCanvasCollaborationProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [locks, setLocks] = useState<Record<string, ElementLock>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const lockCleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate consistent user color
  const userColor = useCallback(() => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }, [userId]);

  // Send message through WebSocket
  const sendMessage = useCallback((message: Omit<CollaborationMessage, 'userId' | 'userName' | 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: CollaborationMessage = {
        ...message,
        userId,
        userName,
        timestamp: new Date()
      };
      wsRef.current.send(JSON.stringify(fullMessage));
    }
  }, [userId, userName]);

  // Handle incoming collaboration messages
  const handleCollaborationMessage = useCallback((message: CollaborationMessage) => {
    // Don't process messages from self
    if (message.userId === userId) return;

    switch (message.type) {
      case 'presence':
        setCollaborators(prev => {
          const existing = prev.find(c => c.id === message.userId);
          if (existing) {
            return prev.map(c => 
              c.id === message.userId 
                ? { ...c, isOnline: true, lastActivity: message.timestamp }
                : c
            );
          } else {
            return [...prev, {
              id: message.userId,
              name: message.userName,
              color: message.data.color || userColor(),
              isOnline: true,
              lastActivity: message.timestamp
            }];
          }
        });
        break;

      case 'cursor':
        setCollaborators(prev =>
          prev.map(c => 
            c.id === message.userId 
              ? { ...c, cursor: message.data.position, lastActivity: message.timestamp }
              : c
          )
        );
        break;

      case 'lock':
        setLocks(prev => ({
          ...prev,
          [message.data.elementId]: {
            elementId: message.data.elementId,
            userId: message.userId,
            userName: message.userName,
            timestamp: message.timestamp,
            expiresAt: new Date(Date.now() + 300000) // 5 minutes
          }
        }));
        break;

      case 'unlock':
        setLocks(prev => {
          const newLocks = { ...prev };
          delete newLocks[message.data.elementId];
          return newLocks;
        });
        break;

      case 'chat':
        setMessages(prev => [...prev, {
          id: `${message.userId}-${Date.now()}`,
          userId: message.userId,
          userName: message.userName,
          message: message.data.message,
          timestamp: message.timestamp,
          type: message.data.type || 'text'
        }]);
        break;

      case 'typing':
        setCollaborators(prev =>
          prev.map(c => 
            c.id === message.userId 
              ? { ...c, isTyping: message.data.isTyping, currentElement: message.data.elementId }
              : c
          )
        );
        break;

      case 'disconnect':
        setCollaborators(prev => prev.filter(c => c.id !== message.userId));
        setLocks(prev => {
          const newLocks = { ...prev };
          Object.keys(newLocks).forEach(elementId => {
            if (newLocks[elementId].userId === message.userId) {
              delete newLocks[elementId];
            }
          });
          return newLocks;
        });
        break;
    }
  }, [userId, userColor]);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (!enable) return;

    try {
      // For development, we'll simulate WebSocket behavior
      // In production, this would connect to a real collaboration server
      console.log(`Attempting to connect to collaboration server for project: ${projectId}`);
      
      // Mock WebSocket connection for development
      const mockConnect = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        
        // Add some mock collaborators for testing
        setTimeout(() => {
          setCollaborators([
            {
              id: 'mock-user-1',
              name: 'أحمد محمد',
              color: '#3b82f6',
              isOnline: true,
              lastActivity: new Date()
            },
            {
              id: 'mock-user-2', 
              name: 'فاطمة علي',
              color: '#10b981',
              isOnline: true,
              lastActivity: new Date()
            }
          ]);
        }, 1000);

        // Setup heartbeat simulation
        heartbeatIntervalRef.current = setInterval(() => {
          // Simulate cursor updates
          setCollaborators(prev => prev.map(c => ({
            ...c,
            cursor: c.isOnline ? {
              x: Math.random() * 800,
              y: Math.random() * 600
            } : undefined
          })));
        }, 3000);
      };

      mockConnect();

    } catch (error) {
      console.error('Failed to connect to collaboration server:', error);
      setIsConnected(false);
      setIsReconnecting(false);
      
      // Retry connection
      if (enable) {
        setIsReconnecting(true);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      }
    }
  }, [enable, projectId]);

  // Lock management
  const lockElement = useCallback((elementId: string) => {
    if (!enable || !isConnected) return false;
    
    // Check if already locked by someone else
    const existingLock = locks[elementId];
    if (existingLock && existingLock.userId !== userId) {
      return false;
    }

    sendMessage({
      type: 'lock',
      data: { elementId }
    });

    // Optimistically update local state
    setLocks(prev => ({
      ...prev,
      [elementId]: {
        elementId,
        userId,
        userName,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 300000)
      }
    }));

    return true;
  }, [enable, isConnected, locks, userId, userName, sendMessage]);

  const unlockElement = useCallback((elementId: string) => {
    if (!enable || !isConnected) return;
    
    sendMessage({
      type: 'unlock',
      data: { elementId }
    });

    // Optimistically update local state
    setLocks(prev => {
      const newLocks = { ...prev };
      delete newLocks[elementId];
      return newLocks;
    });
  }, [enable, isConnected, sendMessage]);

  const isElementLockedByOther = useCallback((elementId: string) => {
    const lock = locks[elementId];
    return lock && lock.userId !== userId && lock.expiresAt > new Date();
  }, [locks, userId]);

  const isElementLockedByMe = useCallback((elementId: string) => {
    const lock = locks[elementId];
    return lock && lock.userId === userId && lock.expiresAt > new Date();
  }, [locks, userId]);

  // Cursor broadcasting (throttled)
  const broadcastCursor = useCallback((x: number, y: number) => {
    if (!enable || !isConnected) return;
    
    // Throttle cursor updates to prevent spam
    if (cursorThrottleRef.current) {
      clearTimeout(cursorThrottleRef.current);
    }
    
    cursorThrottleRef.current = setTimeout(() => {
      sendMessage({
        type: 'cursor',
        data: { position: { x, y } }
      });
    }, 50); // 20 FPS max
  }, [enable, isConnected, sendMessage]);

  // Chat messaging
  const sendChatMessage = useCallback((message: string, type: 'text' | 'emoji' | 'file' = 'text') => {
    if (!enable || !isConnected || !message.trim()) return null;
    
    const chatMessage = {
      id: `${userId}-${Date.now()}`,
      userId,
      userName,
      message: message.trim(),
      timestamp: new Date(),
      type
    };

    sendMessage({
      type: 'chat',
      data: { message: message.trim(), type }
    });

    // Add to local state immediately
    setMessages(prev => [...prev, chatMessage]);
    
    return chatMessage;
  }, [enable, isConnected, userId, userName, sendMessage]);

  // Typing indicators
  const setTyping = useCallback((isTyping: boolean, elementId?: string) => {
    if (!enable || !isConnected) return;
    
    sendMessage({
      type: 'typing',
      data: { isTyping, elementId }
    });
  }, [enable, isConnected, sendMessage]);

  // Cleanup expired locks
  useEffect(() => {
    lockCleanupIntervalRef.current = setInterval(() => {
      const now = new Date();
      setLocks(prev => {
        const newLocks = { ...prev };
        let hasChanges = false;
        
        Object.keys(newLocks).forEach(elementId => {
          if (newLocks[elementId].expiresAt <= now) {
            delete newLocks[elementId];
            hasChanges = true;
          }
        });
        
        return hasChanges ? newLocks : prev;
      });
    }, 10000); // Check every 10 seconds

    return () => {
      if (lockCleanupIntervalRef.current) {
        clearInterval(lockCleanupIntervalRef.current);
      }
    };
  }, []);

  // Initialize connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (cursorThrottleRef.current) {
        clearTimeout(cursorThrottleRef.current);
      }
      if (lockCleanupIntervalRef.current) {
        clearInterval(lockCleanupIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  // Send disconnect message on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        sendMessage({ type: 'disconnect', data: {} });
      }
    };
  }, [isConnected, sendMessage]);

  return {
    // Connection state
    isConnected,
    isReconnecting,
    
    // Collaborators
    collaborators,
    
    // Element locking
    lockElement,
    unlockElement,
    isElementLockedByOther,
    isElementLockedByMe,
    lockedElements: Object.keys(locks),
    locks,
    
    // Cursor and presence
    broadcastCursor,
    setTyping,
    
    // Chat
    messages,
    sendMessage: sendChatMessage,
    clearMessages: () => setMessages([]),
    
    // Utilities
    reconnect: connectWebSocket,
    getUserColor: userColor
  };
}